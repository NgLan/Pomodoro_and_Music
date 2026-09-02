# PLAN 02 — QUẢN LÝ PLAYLIST & VIDEO

> Phạm vi: CRUD playlist cá nhân, playlist detail, tìm video YouTube, thêm bằng URL, xóa bài, reorder, duplicate, search playlist và các playback action cơ bản ở phạm vi Playlist.
>
> Tài liệu tập trung vào **business workflow BE → FE**, không mô tả chi tiết cách tổ chức class/file ngoài những boundary cần thiết. Coding phải tuân theo `AGENT_CODING_GUIDELINES.md` và codebase hiện tại.

---

## 1. Mục tiêu

User phải có thể:

1. Tạo nhiều playlist cá nhân.
2. Xem toàn bộ playlist của mình.
3. Tìm playlist theo tên/mô tả.
4. Xem chi tiết playlist và danh sách video theo đúng thứ tự hiện tại.
5. Sửa tên/mô tả/thumbnail playlist.
6. Xóa playlist nội bộ.
7. Tìm video YouTube từ khóa và thêm vào playlist.
8. Paste URL video YouTube và thêm vào playlist.
9. Xóa video khỏi playlist.
10. Reorder playlist bằng drag-and-drop hoặc fallback phù hợp.
11. Duplicate playlist thành bản độc lập.
12. Play playlist, shuffle, repeat mà không làm thay đổi thứ tự lưu trong DB.

Import nguyên playlist YouTube và Sync thuộc Plan 03.

---

## 2. Business model

### 2.1. Playlist

Playlist là tài nguyên thuộc user.

Thông tin chính:

- name;
- description;
- thumbnail;
- source (`MANUAL` hoặc `YOUTUBE` nếu đã import);
- item count;
- source metadata nếu là playlist import.

Rule:

- chỉ owner được xem/sửa/xóa playlist;
- xóa playlist chỉ xóa bản trong app;
- nếu playlist có nguồn YouTube, không được tác động playlist YouTube gốc.

### 2.2. Media Item

Một video YouTube được biểu diễn bằng metadata, không lưu video/audio binary.

Thông tin UI cần có nếu lấy được:

- title;
- thumbnail;
- channel;
- duration;
- source URL;
- availability.

Cùng một video có thể xuất hiện trong nhiều playlist mà không cần duplicate metadata logic nếu schema/code hiện tại đã dùng media item dùng chung.

### 2.3. Playlist Item

Playlist Item biểu diễn:

```text
Playlist + Media Item + current position
```

Thứ tự `position` là thứ tự mặc định của playlist nội bộ.

Shuffle chỉ là runtime playback order, **không rewrite position**.

---

## 3. Backend plan

### 3.1. Audit trước khi implement

Kiểm tra:

- playlist/media module hiện tại;
- ownership policy;
- YouTube provider adapter đã có chưa;
- OpenAPI/generated client flow;
- transaction abstraction;
- pagination/list convention;
- error code cho duplicate/not-found/provider errors;
- playlist reorder hiện có hay chưa.

### 3.2. CRUD Playlist use cases

Cần hỗ trợ:

- Create Playlist
- List My Playlists
- Get Playlist Detail
- Update Playlist Metadata
- Delete Playlist
- Duplicate Playlist

List response nên đủ để render card:

- id;
- thumbnail;
- name;
- short description;
- item count;
- source type;
- tổng duration chỉ trả nếu backend hiện có dữ liệu dễ tính; không biến đây thành yêu cầu bắt buộc nếu metadata duration thiếu.

### 3.3. Search playlist nội bộ

MVP search theo:

- name;
- description.

Không cần full-text/trigram nếu dataset chưa lớn.

Search phải scoped theo user hiện tại.

### 3.4. YouTube video search

Flow:

```text
FE sends query
→ BE validates query
→ BE calls YouTube integration
→ normalize provider response
→ return search result DTO
```

Search result là dữ liệu tạm:

- không tự lưu DB;
- chỉ khi user chọn Add thì mới create/reuse media item + playlist item.

Kết quả nên có:

- external video id;
- title;
- thumbnail;
- channel nếu có;
- duration nếu có;
- source URL;
- availability nếu xác định được.

Backend chịu trách nhiệm giữ YouTube API key/secret; FE không giữ secret.

### 3.5. Add video by URL

Flow:

```text
User paste video URL
→ BE parse URL / extract video id
→ fetch metadata
→ validate availability
→ return metadata or directly add depending contract
```

UX tốt hơn cho MVP có thể là:

```text
Paste URL
→ resolve metadata
→ show small preview
→ user confirms Add
```

Nếu codebase muốn ít request hơn, contract add trực tiếp cũng chấp nhận được, miễn lỗi rõ ràng.

Invalid cases:

- URL không phải YouTube video URL hợp lệ;
- video không tồn tại;
- private/deleted/region blocked;
- provider unavailable/rate-limited.

Không trả raw provider error cho client.

### 3.6. Add video vào playlist

Khi user chọn một video từ search/URL:

1. verify playlist ownership;
2. create/reuse media metadata;
3. tạo Playlist Item;
4. append vào cuối playlist hiện tại;
5. trả item mới + position.

Product docs không bắt buộc cấm cùng một video xuất hiện nhiều lần trong một playlist. Vì vậy **không invent rule unique video per playlist** nếu schema/code hiện tại không cấm.

### 3.7. Delete playlist item

Khi xóa một item:

- chỉ gỡ relation khỏi playlist;
- không xóa video trên YouTube;
- không tác động playlist khác cùng dùng media item;
- normalize position nếu data model hiện tại yêu cầu contiguous order;
- multi-write phải atomic.

Nếu item đang phát, behavior player thuộc Plan 04; API chỉ trả playlist state mới cần thiết.

### 3.8. Reorder playlist

Frontend gửi **desired order** hoặc danh sách item ids theo thứ tự cuối cùng.

Backend:

1. verify tất cả item thuộc playlist;
2. reject duplicate/missing item ids nếu contract yêu cầu full-order reorder;
3. update positions atomic;
4. không để duplicate position;
5. trả canonical order sau update.

Không nên thực hiện từng request `move up` nếu drag-and-drop đã biết final order; ưu tiên một use case atomic.

### 3.9. Duplicate playlist

Flow:

```text
Original Playlist
→ create new Playlist metadata
→ copy current ordered playlist items
→ new playlist independent from original
```

Tên mặc định theo product:

```text
<Original Name> - Copy
```

Nếu UI cho phép nhập tên mới trước khi duplicate thì dùng tên user chọn.

Duplicate phải giữ order hiện tại nhưng sau đó hai playlist chỉnh sửa độc lập.

### 3.10. API contract cần bao phủ

Tên URL cụ thể theo codebase, nhưng nghiệp vụ cần:

```text
Playlist
- create
- list/search
- detail
- update
- delete
- duplicate

Playlist items
- add existing/resolved YouTube media
- delete
- reorder

YouTube media
- search videos
- resolve video by URL / metadata
```

---

## 4. Frontend plan

### 4.1. Playlist Library screen

Header:

- Page title;
- Search;
- `Create Playlist`;
- `Import YouTube Playlist` — dẫn sang flow Plan 03.

Desktop:

- grid 3–4 cards;
- card có thumbnail ratio thống nhất;
- title;
- item count;
- source badge nhỏ;
- quick play;
- overflow menu.

Không đặt Edit/Delete/Duplicate/Sync thành 4 button lớn trên mỗi card.

Mobile:

- 1 column hoặc compact 2-column tùy width;
- overflow menu dễ bấm;
- search full width.

### 4.2. Create/Edit Playlist

Form tối thiểu:

- name;
- description;
- thumbnail nếu feature thực sự cho user set thủ công.

Nếu thumbnail hiện chỉ dùng metadata/source và chưa có upload mechanism, không invent upload feature.

### 4.3. Playlist Detail screen

Bố cục:

```text
Playlist Hero
├── Thumbnail
├── Title
├── Description
├── Source badge/link metadata nếu có
└── Play / Shuffle / More

Toolbar
├── Search YouTube
├── Add by URL
└── các action phù hợp

Track List
├── Drag handle
├── Thumbnail
├── Title
├── Channel / duration
└── Item actions
```

Nếu là imported YouTube playlist, `Sync` được hiển thị theo Plan 03.

### 4.4. Search YouTube UI

Không biến playlist detail thành YouTube clone.

Đề xuất:

- search input trong toolbar;
- kết quả mở trong side panel/dialog/sheet;
- mỗi result có thumbnail, title, channel, duration;
- action `Add`;
- có loading skeleton;
- empty result;
- provider error + retry.

Search result không cần lưu vào global store lâu dài.

### 4.5. Add by URL UI

- input URL;
- validate format cơ bản ở FE;
- submit loading;
- backend resolve metadata;
- preview nhỏ nếu có;
- confirm Add;
- lỗi cụ thể, dễ hiểu.

Không chỉ dùng toast cho lỗi field URL; cần inline field error cho format không hợp lệ.

### 4.6. Track List

Mỗi row:

- drag handle rõ;
- thumbnail;
- title;
- channel;
- duration;
- availability state;
- overflow actions.

Track unavailable:

- vẫn render nếu dữ liệu đã lưu;
- có badge/text `Unavailable/Private/...`;
- không để action Play active nếu không thể phát;
- không chỉ dùng màu đỏ để truyền trạng thái.

### 4.7. Reorder UX

- drag chỉ bắt đầu từ drag handle;
- không biến toàn row thành drag target;
- có keyboard fallback nếu library hỗ trợ;
- sau drop, gửi final order;
- optimistic update chỉ khi rollback an toàn;
- nếu API fail, rollback về canonical order và thông báo lỗi.

### 4.8. Duplicate UX

Overflow → Duplicate.

Sau thành công:

- hiển thị success feedback;
- refresh library;
- có thể navigate vào copy mới nếu pattern hiện tại phù hợp.

### 4.9. Delete Playlist

Confirmation dialog:

- nói đúng tên playlist;
- nếu source YouTube: nói rõ chỉ xóa bản trong app, không xóa playlist YouTube gốc;
- danger CTA;
- cancel rõ.

---

## 5. Playback logic trong phạm vi Playlist

Plan này chỉ định nghĩa semantics, còn runtime tích hợp Pomodoro ở Plan 04.

### Sequential

- phát theo `position` đã lưu.

### Shuffle

- tạo playback queue runtime ngẫu nhiên;
- không update DB position;
- khi user reorder playlist, canonical order đổi nhưng shuffle queue hiện tại chỉ update theo rule runtime của Player.

### Repeat Playlist

- hết item cuối → quay item đầu.

### Repeat One

Product coi là optional extension. Chỉ implement nếu player hiện tại hỗ trợ hợp lý, không bắt buộc để hoàn thành MVP.

---

## 6. Main flows

### 6.1. Create playlist

```text
Library
→ Create Playlist
→ fill metadata
→ create API
→ append/update library
→ open detail hoặc remain library
```

### 6.2. Search & Add

```text
Playlist Detail
→ enter YouTube keyword
→ FE calls BE search
→ results shown
→ user clicks Add
→ BE create/reuse media + append item
→ track list updates
```

### 6.3. Add by URL

```text
Paste URL
→ resolve metadata
→ show metadata/error
→ confirm Add
→ append playlist item
```

### 6.4. Reorder

```text
Drag C above A
→ local list becomes C,A,B
→ send final order
→ BE atomic reorder
→ success: keep order
→ fail: rollback + error
```

### 6.5. Duplicate

```text
Original playlist
→ Duplicate
→ BE copy metadata + ordered items
→ new independent playlist
```

---

## 7. Edge cases bắt buộc

1. YouTube search trả item thiếu duration/channel/thumbnail.
2. Video private/deleted/region blocked.
3. Invalid URL.
4. Provider rate limit/network failure.
5. Playlist bị xóa ở tab khác trước khi Add/Reorder.
6. Reorder request có duplicate/missing item ids.
7. Duplicate playlist rất dài.
8. Xóa item đang phát — FE Player phải xử lý nhưng timer không liên quan.
9. Thumbnail lỗi → fallback image.
10. Playlist empty → Play disabled + empty state có Add/Search action.
11. Search query rỗng/whitespace.
12. User cố truy cập playlist của user khác.

---

## 8. UI/UX requirements

Bám Warm Soft Neo-Brutalism:

- cream background;
- thick dark border;
- hard offset shadow;
- pastel accent vừa phải;
- thumbnail thống nhất ratio;
- player/current track nổi bật nhưng không lấn át nội dung;
- hover/press ngắn, không animation nặng.

Dùng component official/reuse trước khi tự viết:

- Dialog;
- Dropdown Menu;
- Sheet;
- Tooltip;
- Checkbox nếu cần;
- drag-and-drop library đã được project chọn và không deprecated.

Toàn bộ text qua i18n.

---

## 9. Test scenarios

### Backend

- CRUD playlist đúng ownership;
- search scoped đúng user;
- add video từ valid YouTube metadata;
- invalid URL/provider error được translate;
- delete item không xóa media của playlist khác;
- reorder atomic và không duplicate position;
- duplicate giữ đúng order;
- delete imported playlist không gọi mutation YouTube.

### Frontend

- library loading/empty/error;
- search internal playlist;
- YouTube search result render thiếu metadata;
- add URL field validation;
- drag reorder success + rollback fail;
- unavailable item state;
- delete confirmation đúng object;
- responsive track list;
- keyboard/focus cho action menu/dialog.

---

## 10. Ngoài scope

- import cả playlist YouTube → Plan 03;
- sync source playlist → Plan 03;
- auto switch playlist theo Pomodoro → Plan 04;
- download/cache video/audio;
- queue persistence cross-device;
- folder/tag/favorite/recent played;
- advanced search indexing khi chưa cần.

---

## 11. Definition of Done

- CRUD + detail playlist hoàn chỉnh.
- Search playlist theo name/description.
- Search YouTube + Add result.
- Add video bằng URL.
- Delete item.
- Atomic reorder.
- Duplicate playlist độc lập.
- Sequential/Shuffle/Repeat semantics không phá saved order.
- Imported playlist vẫn chỉ là bản nội bộ, không mutate nguồn.
- UI đúng guideline, responsive, accessible, i18n đầy đủ.
- Generated client được regenerate khi API contract đổi.
- Test business flow chính pass.
