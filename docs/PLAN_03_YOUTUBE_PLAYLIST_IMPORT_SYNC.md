# PLAN 03 — IMPORT & SYNC PLAYLIST TỪ YOUTUBE

> Phạm vi: nhập URL playlist YouTube, fetch preview, chọn một phần video, import atomic vào playlist nội bộ, xử lý unavailable video và sync bổ sung video mới.
>
> Plan tập trung vào logic nghiệp vụ BE → FE. Implementation chi tiết phải theo `AGENT_CODING_GUIDELINES.md`, abstraction/provider hiện có và contract thực tế của codebase.

---

## 1. Mục tiêu

User phải có thể:

1. Paste URL playlist YouTube.
2. Backend parse playlist ID và đọc toàn bộ dữ liệu cần thiết qua pagination.
3. Xem preview trước khi import.
4. Biết playlist có bao nhiêu video và video nào unavailable nếu xác định được.
5. Select All / Deselect All / bỏ chọn từng video.
6. Import chỉ những video đã chọn.
7. Sau import có một playlist nội bộ hoàn chỉnh, chỉnh sửa độc lập với YouTube.
8. Playlist import giữ source metadata để biết nguồn và hỗ trợ Sync.
9. User có thể Sync lại để bổ sung video mới từ playlist YouTube.
10. Sync mặc định không phá các chỉnh sửa nội bộ như delete/reorder/add thủ công.

---

## 2. Nguyên tắc dữ liệu

### 2.1. Preview là temporary data

Flow chuẩn:

```text
Paste URL
→ Fetch Preview
→ FE giữ preview state
→ User chọn item
→ Confirm Import
→ lúc đó BE mới ghi DB
```

Không tạo playlist DB ngay khi user paste URL.

Không cần bảng import job/history nếu operation hiện tại vẫn xử lý trực tiếp và requirement chưa có retry/resume background.

### 2.2. Playlist sau import là internal playlist

Sau khi import:

- user có thể đổi tên;
- xóa video;
- reorder;
- add video khác;
- play bình thường.

Những thao tác này **không mutate playlist YouTube nguồn**.

### 2.3. Source metadata

Playlist import phải giữ tối thiểu:

- source platform = YouTube;
- source playlist ID;
- source URL;
- last synced time nếu feature Sync đã implement.

### 2.4. Unavailable video

Một vài video private/deleted/blocked không được làm hỏng toàn bộ import.

Rule ưu tiên:

- nếu provider trả đủ identity/metadata để biểu diễn item → có thể đưa vào preview với trạng thái unavailable;
- nếu không thể tạo một media item có nghĩa → bỏ qua nhưng trả count/warning cho user;
- không fail toàn bộ playlist chỉ vì vài item lỗi.

Plan không ép một trong hai schema strategy nếu code hiện tại đã chọn cách khác; bắt buộc là user được thông báo và phần còn lại vẫn import được.

---

## 3. Backend — YouTube integration responsibilities

Adapter/provider phải chịu trách nhiệm:

- parse/request mapping;
- gọi API với secret server-side;
- pagination;
- timeout;
- bounded retry cho lỗi recoverable nếu convention cho phép;
- normalize metadata;
- translate provider errors;
- không leak SDK model ra application/domain.

Các failure class nên phân biệt ở mức public error phù hợp:

- invalid playlist URL;
- playlist not found;
- playlist private/not accessible;
- provider quota/rate limit;
- provider unavailable/network;
- malformed provider response.

---

## 4. Preview use case

### 4.1. Input

- YouTube playlist URL.

### 4.2. Process

1. Validate URL shape.
2. Extract `playlist_id`.
3. Fetch playlist metadata.
4. Fetch playlist items page by page.
5. Normalize video data.
6. Xác định availability trong khả năng API hỗ trợ.
7. Build preview response.
8. **Không ghi DB.**

### 4.3. Preview response

Tối thiểu:

```text
playlist:
- sourceExternalId
- sourceUrl
- title
- thumbnail
- description nếu có
- total count nếu xác định được

items[]:
- source video id
- title nếu có
- thumbnail nếu có
- channel nếu có
- duration nếu có
- source URL nếu có
- availability
- selectable

summary:
- fetchedCount
- availableCount
- unavailableCount
```

Nếu provider pagination cần nhiều request, response chỉ trả khi đủ dữ liệu cần cho import theo requirement hiện tại.

Không invent background progress endpoint nếu codebase chưa cần.

---

## 5. Import use case

### 5.1. Input

User gửi:

- source playlist metadata cần xác minh lại hoặc source URL/ID;
- danh sách video IDs đã chọn;
- optional internal playlist name/description nếu UI cho phép sửa trước import.

Không tin toàn bộ metadata do client gửi là source of truth.

Backend nên re-resolve hoặc validate những thông tin quan trọng đủ để tránh client invent source/video ngoài preview, tùy contract và quota strategy của codebase.

### 5.2. Import transaction

Business transaction:

```text
BEGIN
→ create internal playlist
→ attach source metadata
→ create/reuse selected media items
→ create playlist items in selected/source order
→ COMMIT
```

Nếu lỗi database/business:

```text
ROLLBACK
```

Không để playlist import dở dang.

### 5.3. Partial import

Nếu source có 100 item, user chọn 40:

- playlist internal có đúng 40 selected items;
- order theo preview/source order của 40 item đã chọn;
- unselected items không được lưu.

### 5.4. Import result

Response nên có:

- created playlist id;
- imported count;
- skipped/unavailable count nếu có;
- warnings nếu có;
- đủ để FE navigate đến playlist detail.

---

## 6. Sync use case

### 6.1. Preconditions

Sync chỉ được phép nếu playlist:

- thuộc user;
- có source type YouTube;
- có source external ID/URL hợp lệ.

Manual playlist không có Sync.

### 6.2. Mục tiêu mặc định

Sync hiện tại là **append-safe sync**, không phải mirror tuyệt đối.

Flow:

```text
User Sync
→ BE fetch current source playlist
→ compare with internal playlist
→ identify source videos chưa có trong internal playlist
→ create/reuse media items
→ append new playlist items
→ update last synced time
```

### 6.3. Rule bảo vệ tùy chỉnh user

Mặc định Sync:

- không reorder các item hiện có;
- không xóa item user tự thêm;
- không tự thêm lại item mà user đã chủ động xóa nếu hệ thống không có dữ liệu đủ để phân biệt deletion intent;
- không reset tên/mô tả local;
- không đổi Pomodoro đang gắn playlist;
- unavailable source item không làm fail toàn sync.

**Lưu ý quan trọng:** product docs muốn ưu tiên không phá tùy chỉnh nhưng schema đơn giản có thể không đủ để biết “video này từng import rồi nhưng user đã xóa”. Vì vậy Agent phải audit schema/code hiện tại trước khi implement. Nếu không có tombstone/source-history để phân biệt, không được giả vờ xử lý hoàn hảo case này. Cần chọn behavior rõ ràng và ghi vào API/UI hoặc giới hạn MVP.

### 6.4. Append order

Video mới được append sau cuối playlist nội bộ hiện tại, thay vì chèn lại theo source order, để không phá user reorder.

### 6.5. Sync result

Response:

- added count;
- already present count nếu hữu ích;
- unavailable/skipped count;
- syncedAt;
- warnings.

---

## 7. API contract ở mức nghiệp vụ

Cần bao phủ:

```text
YouTube Playlist
- Preview by URL
- Confirm Import Selected Items

Imported Playlist
- Sync from source
```

Không cần endpoint riêng cho mỗi pagination page nếu Backend tự thu thập hết dữ liệu cho preview.

Nếu playlist rất dài khiến request sync/preview không còn phù hợp, đó là requirement mới để chuyển background job — không tự over-engineer trong MVP.

---

## 8. Frontend — Import screen

### 8.1. Visual direction

Dùng board/card lớn nền cream theo Warm Soft Neo-Brutalism.

Flow trên cùng một màn hình:

```text
Paste URL
→ Validate / Fetch
→ Preview
→ Select
→ Confirm
→ Importing
→ Result
```

Không import ngay khi paste.

### 8.2. Step 1 — URL Input

Hiển thị:

- heading ngắn;
- URL input lớn;
- CTA `Xem trước`;
- helper text về public/accessibility nếu cần.

States:

- invalid format → inline error;
- fetching → button loading + skeleton preview area;
- provider error → message thân thiện + retry;
- preserve URL khi recoverable fail.

### 8.3. Step 2 — Preview Metadata

Header preview:

- thumbnail;
- title;
- source YouTube badge;
- total/fetched count;
- unavailable count.

Không overload với provider metadata không cần cho quyết định import.

### 8.4. Step 3 — Select Items

Toolbar:

- selected count / total;
- Select All;
- Deselect All;
- search/filter trong preview chỉ thêm nếu thật sự cần cho playlist dài; không bắt buộc.

Mỗi item:

- checkbox;
- thumbnail;
- title;
- channel/duration nếu có;
- availability status.

Unavailable item:

- nếu không import được thì checkbox disabled;
- có text lý do;
- không chỉ dùng màu.

### 8.5. Confirm Import

CTA phải nói rõ số lượng:

```text
Import 40 videos
```

Nếu selected count = 0:

- CTA disabled;
- giải thích ngắn.

Có thể cho sửa internal playlist name trước confirm nếu product flow thấy hợp lý.

### 8.6. Import progress

Product guideline yêu cầu playlist dài có progress rõ ràng.

Nếu Backend chỉ có một synchronous request và không stream granular progress, FE tối thiểu hiển thị:

- importing state rõ;
- selected count;
- không giả progress % nếu không có dữ liệu thật.

Nếu Backend có progress contract thật, hiển thị processed/total.

Không tự tạo fake progress 20%→80% như dữ liệu thật.

### 8.7. Result

Success:

- imported count;
- skipped/unavailable count;
- CTA `Mở playlist`.

Partial warnings:

- import thành công vẫn có thể có unavailable/skipped;
- warning không biến thành full error nếu core transaction thành công.

---

## 9. Frontend — Sync UX

Sync chỉ xuất hiện ở Playlist Detail khi playlist có source YouTube.

Hero action:

- `Sync` hoặc nằm trong overflow nếu không muốn quá nhiều CTA.

Khi click:

```text
Syncing...
→ success summary
→ track list updates
→ last synced label updates
```

Nếu addedCount = 0:

- message `Playlist đã cập nhật` / `Không có video mới` theo i18n;
- không báo lỗi.

Nếu provider fail:

- playlist nội bộ hiện tại vẫn nguyên;
- user vẫn play/edit bình thường;
- show retry.

---

## 10. Edge cases bắt buộc

1. URL playlist sai format.
2. URL video thay vì playlist.
3. Playlist private/not accessible.
4. Playlist rỗng.
5. Playlist rất dài cần pagination.
6. Một phần video private/deleted/region blocked.
7. User bỏ chọn tất cả.
8. User import hai lần cùng một source playlist → product không cấm; có thể tạo hai internal playlist độc lập.
9. Provider quota/rate limit.
10. Import DB fail giữa transaction → rollback toàn bộ.
11. Sync khi source playlist đã bị xóa/private.
12. Sync sau khi user reorder internal playlist.
13. Sync sau khi user add video thủ công.
14. Sync case user từng xóa một video nguồn: phải tuân behavior/schema thực tế, không invent khả năng nhớ deletion nếu hệ thống không lưu.
15. Source metadata thiếu thumbnail/title.

---

## 11. Test scenarios

### Backend preview

- parse valid playlist URL;
- reject invalid URL;
- pagination nhiều page;
- private playlist;
- mixed available/unavailable items;
- provider error translation;
- preview không ghi database.

### Backend import

- import all;
- partial import;
- zero selected rejected;
- transaction rollback;
- correct item order;
- source metadata persisted;
- ownership/auth.

### Backend sync

- append only new items;
- preserve existing order;
- preserve manual-added items;
- unavailable item không fail toàn sync;
- update last synced time chỉ khi operation thành công theo semantics đã chọn.

### Frontend

- URL field validation;
- preview loading/error/retry;
- select all/deselect all;
- unavailable checkbox state;
- selected count;
- import success/warning;
- sync no-new-items state;
- mobile preview list usable;
- keyboard/focus accessible.

---

## 12. Ngoài scope

- background import job;
- resume import sau refresh;
- audit từng sync run;
- two-way YouTube sync;
- write/delete/reorder playlist trên YouTube;
- OAuth YouTube account mutation;
- import nguồn khác;
- sophisticated conflict resolution nếu chưa có schema hỗ trợ.

---

## 13. Definition of Done

- Preview playlist từ URL hoạt động, có pagination.
- Preview không ghi DB.
- User chọn một phần item trước import.
- Import atomic, không để dữ liệu dở dang.
- Unavailable video không phá toàn flow.
- Playlist nội bộ lưu source metadata.
- Sync chỉ bổ sung theo rule an toàn và không reset custom order.
- FE có loading/empty/error/retry/progress phù hợp, không fake progress.
- Imported playlist chỉnh sửa độc lập với YouTube.
- API/client/i18n/test cập nhật đầy đủ.
