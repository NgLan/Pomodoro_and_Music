# PLAN 04 — PHÁT NHẠC TRONG POMODORO

> Phạm vi: tích hợp Pomodoro runtime với Music Player, playlist riêng cho Focus/Break hoặc một playlist dùng chung, auto switch theo phase, đổi playlist/bài trong lúc timer chạy, next/previous, shuffle/repeat, delete/reorder item mà không ảnh hưởng timer.
>
> Đây là plan tích hợp giữa hai subsystem. **Rule quan trọng nhất: Timer và Player độc lập, chỉ giao tiếp qua explicit event/action cần thiết.** Coding detail phải tuân theo `AGENT_CODING_GUIDELINES.md` và codebase hiện có.

---

## 1. Mục tiêu

Sau khi hoàn thành:

1. User có thể gắn playlist Focus và Break vào Pomodoro config.
2. Hoặc dùng một playlist chung cho cả hai phase nếu UI/product chọn chế độ đó.
3. Start Pomodoro có thể start nhạc tương ứng.
4. Khi phase đổi, player chuyển playlist đúng rule.
5. Khi quay lại playlist trước, player nên tiếp tục trạng thái trước đó trong cùng runtime session thay vì luôn reset về bài đầu.
6. User đổi playlist, đổi bài, next/previous, shuffle/repeat trong lúc timer vẫn chạy.
7. User xóa/reorder track khi Pomodoro chạy mà timer không reset.
8. Nếu video/player lỗi hoặc playlist hết bài, Pomodoro vẫn hoạt động.
9. Persistent mini-player giữ player dễ truy cập khi user đi sang màn hình khác nếu app shell hiện tại hỗ trợ.

---

## 2. Kiến trúc nghiệp vụ: hai subsystem độc lập

### 2.1. Pomodoro Runtime chịu trách nhiệm

- current phase;
- remaining time;
- round/cycle;
- start/pause/resume/stop;
- transition phase;
- history.

Pomodoro **không** chịu trách nhiệm:

- video buffering;
- current playback seconds;
- shuffle queue;
- next/previous algorithm;
- YouTube player errors.

### 2.2. Player Runtime chịu trách nhiệm

- active playlist;
- current media item;
- playback position;
- play/pause audio/video;
- sequential/shuffle queue;
- repeat mode;
- volume nếu feature hiện có;
- trạng thái cursor của từng playlist trong runtime session.

Player **không** được điều khiển timer state.

### 2.3. Integration layer chỉ truyền intent

Ví dụ events/actions:

```text
POMODORO_STARTED(phase, config)
POMODORO_PHASE_CHANGED(previousPhase, nextPhase)
USER_SELECTED_PLAYLIST(playlistId)
PLAYLIST_CONTENT_CHANGED(playlistId)
CURRENT_ITEM_REMOVED(itemId)
```

Không cần event bus framework phức tạp nếu state/actions trực tiếp đủ dùng. “Explicit event/action” là nguyên tắc separation, không phải yêu cầu thêm infrastructure.

---

## 3. Music modes

Product mô tả hai chế độ. Vì conceptual model/database có thể chỉ lưu Focus/Break playlist IDs mà không có `music_mode` riêng, Agent phải audit code/schema trước khi thêm field.

### 3.1. Mode A — Focus / Break playlists riêng

```text
FOCUS → Focus Playlist
SHORT_BREAK → Break Playlist
LONG_BREAK → Break Playlist
```

Khi chuyển:

- lưu runtime cursor của playlist cũ;
- activate playlist của phase mới;
- restore cursor của playlist đó nếu đã từng phát trong session;
- không reset timer.

### 3.2. Mode B — One playlist for all phases

Có thể biểu diễn bằng cùng một playlist được chọn cho Focus và Break hoặc bằng mode riêng tùy schema hiện tại.

Rule:

- phase đổi không đổi playlist;
- không reset track;
- nhạc tiếp tục bình thường.

### 3.3. No playlist

Nếu phase không có playlist:

- timer vẫn chạy;
- player có thể giữ im lặng/dừng theo rule UX;
- không được throw business error làm Start Pomodoro fail.

---

## 4. Backend responsibilities

Phần lớn playback runtime không cần Backend mutation riêng. Backend chỉ cung cấp data/config và persistence của playlist.

### 4.1. Pomodoro config contract

Config cần trả đủ:

- focus playlist reference nếu có;
- break playlist reference nếu có;
- playlist display metadata tối thiểu hoặc ID để FE load detail.

Khi update config:

- verify playlist ownership;
- playlist null hợp lệ.

### 4.2. Playlist detail contract

Player cần playlist detail theo order canonical:

- playlist id/name;
- ordered items;
- media metadata;
- availability.

### 4.3. Playlist mutations khi player đang chạy

Các mutation vẫn dùng API từ Plan 02:

- delete item;
- reorder;
- update playlist.

Backend không cần biết “timer đang chạy”.

Timer runtime không được gửi vào playlist mutation.

### 4.4. Không persist player progress mặc định

Không tạo DB writes mỗi giây cho:

- playback position;
- current media item;
- shuffle queue;
- volume.

Có thể dùng client state + localStorage nếu requirement hiện tại cần giữ sau refresh.

### 4.5. YouTube playback

Playback phải dùng cơ chế embed/player được YouTube hỗ trợ.

Backend không tải hoặc proxy video/audio binary chỉ để phát nhạc.

---

## 5. Frontend player state

Tối thiểu:

```text
activePlaylistId
currentItemId
playbackPositionSeconds
isPlaying
isShuffleEnabled
repeatMode
queue/order runtime
playlistCursors
```

`playlistCursors` phục vụ use case:

```text
Focus Playlist đang ở Track 5 @ 01:30
→ chuyển Break Playlist
→ quay lại Focus
→ tiếp tục Track 5 theo runtime state trước đó
```

Không bắt buộc persist cross-device.

---

## 6. Start Pomodoro + Player flow

### 6.1. Config có playlist phase hiện tại

```text
User presses Start
→ Pomodoro runtime starts immediately
→ integration resolves playlist for current phase
→ Player loads/plays playlist
```

Nếu player load chậm/fail:

- timer vẫn chạy;
- Music Panel hiển thị loading/error;
- retry chỉ áp dụng player.

### 6.2. Config không có playlist

```text
Start
→ Timer runs
→ Music panel shows no playlist / choose playlist CTA
```

Không chặn Start.

---

## 7. Phase transition flow

### 7.1. Separate Focus/Break playlist

```text
FOCUS completes
→ Timer records completed phase
→ Timer transitions BREAK
→ integration sees playlist target changed
→ save cursor of Focus playlist
→ activate/restore Break playlist
→ timer unaffected by player transition latency
```

Khi Break xong:

```text
BREAK → FOCUS
→ restore Focus playlist cursor
```

### 7.2. Same playlist

Nếu target playlist ID phase mới = active playlist ID:

- không reload player;
- không restart current item;
- phase UI đổi độc lập.

Đây là cách đơn giản để đạt behavior “một playlist dùng chung”.

---

## 8. User đổi playlist khi timer đang chạy

Flow:

```text
Timer RUNNING
→ user opens playlist selector
→ chooses another playlist
→ player switches
→ Pomodoro state unchanged
```

Cần quyết định rõ semantics:

- đổi playlist chỉ là override runtime cho phase hiện tại;
- **không tự update Pomodoro config mặc định** trừ khi user chọn action `Set as default` riêng.

Điều này tránh việc một thao tác nghe nhạc tức thời âm thầm sửa cấu hình lâu dài.

Khi phase tiếp theo tới:

- integration lại áp dụng playlist được config định nghĩa cho phase đó, trừ khi product sau này có “session override” rõ ràng.

---

## 9. User chọn track khác

- click track → Player chuyển track;
- Timer không pause/reset;
- current track highlight cập nhật;
- nếu shuffle đang bật, queue runtime phải cập nhật nhất quán theo player semantics đã chọn.

Không ghi thay đổi này vào playlist saved order.

---

## 10. Next / Previous

### Sequential

- Next → item kế theo canonical/runtime queue;
- Previous → item trước.

### Shuffle

- Next/Previous theo shuffle queue runtime;
- không dựa trực tiếp vào DB position sau khi queue đã tạo, ngoại trừ khi cần rebuild queue.

### Repeat Playlist

- cuối queue → đầu queue.

### Repeat Off

- hết queue → player stop;
- Pomodoro tiếp tục.

### Repeat One

Optional nếu player hỗ trợ; không bắt buộc MVP.

---

## 11. Delete track khi đang chạy

### 11.1. Xóa item không phải current item

```text
Delete API success
→ remove item from playlist state
→ reconcile queue
→ current media unchanged
→ timer unchanged
```

### 11.2. Xóa current item

Sau API success:

1. remove current item;
2. chọn item hợp lệ tiếp theo theo current playback mode;
3. nếu có next item → play tiếp;
4. nếu playlist empty → stop player;
5. Pomodoro vẫn chạy.

Nếu delete API fail:

- không xóa local canonical state vĩnh viễn;
- current playback có thể tiếp tục;
- show recoverable error.

---

## 12. Reorder trong lúc đang phát

Khi reorder playlist:

- bài hiện tại không được restart chỉ vì `position` đổi;
- sau API success, canonical order cập nhật;
- queue sequential cho các bước Next sau đó cần reconcile;
- nếu shuffle đang bật, saved order đổi nhưng shuffle queue hiện tại có thể giữ nguyên cho tới khi rebuild theo semantics của Player; phải có một rule nhất quán, không ngẫu nhiên thay đổi giữa các action.

MVP rule đề xuất:

- Sequential → Next dùng order mới ngay sau reorder.
- Shuffle → giữ queue hiện tại cho các item còn tồn tại; item mới có thể được chèn/rebuild theo implementation đơn giản nhất nhưng không restart current item.

---

## 13. Player error handling

Các lỗi:

- unavailable/private/deleted;
- embed/playback error;
- network;
- autoplay bị browser chặn;
- metadata lỗi.

Rule:

1. Không propagate lỗi để reset Pomodoro.
2. Nếu current item không phát được, mark/skip theo player policy.
3. Nếu có next playable item, thử chuyển tiếp trong bounded manner.
4. Không loop vô hạn qua toàn bộ unavailable tracks.
5. Nếu không còn playable item → stop player + error/empty state.
6. Timer vẫn chạy.

Autoplay browser policy phải được xử lý bằng UX hợp lệ: có thể cần user gesture ban đầu; không invent workaround trái browser policy.

---

## 14. Pomodoro Screen UI

Desktop:

```text
┌────────────────────────────┬────────────────────────────┐
│        TIMER CARD          │        MUSIC PANEL         │
│ FOCUS                      │ Playlist selector          │
│ 24:18                      │ Current track              │
│ Round 2 / 4                │ Thumbnail                  │
│ Pause       Stop           │ Prev Play/Pause Next       │
│                            │ Shuffle / Repeat           │
│                            │ Open Queue                  │
└────────────────────────────┴────────────────────────────┘
```

Hierarchy:

1. Timer.
2. Phase + control.
3. Current track/player.
4. Playlist queue/details.

Music không được visually lấn Timer.

### Mobile

- timer card trên cùng;
- compact player bên dưới;
- queue mở bằng bottom sheet/drawer;
- controls target đủ lớn;
- timer luôn còn thấy khi queue đóng.

---

## 15. Persistent Mini Player

Theo app shell guideline, khi đang phát nhạc có thể có Mini Player persistent ở đáy app.

Mini Player tối thiểu:

- thumbnail nhỏ;
- track title;
- play/pause;
- next;
- mở full player/Pomodoro screen.

Rules:

- không che content;
- không duplicate hai audio players thực sự;
- Pomodoro Music Panel và Mini Player phải cùng đọc một Player runtime source of truth;
- điều khiển ở Mini Player không ảnh hưởng timer.

Nếu app chưa có persistent shell phù hợp, đây có thể triển khai sau màn Pomodoro chính nhưng không tạo player state thứ hai.

---

## 16. Queue/Playlist panel

Trong Pomodoro Screen:

- current playlist header;
- track list;
- current item highlight;
- click track;
- drag handle nếu cho reorder;
- delete action;
- unavailable badge;
- đổi playlist.

Không cần mở modal toàn màn hình trên desktop; dùng side panel.
Mobile → sheet/drawer.

---

## 17. Loading / Error / Empty states

### Player Loading

- skeleton/current track placeholder;
- timer vẫn interactive.

### Playlist Empty

- message;
- CTA choose another playlist/open playlist detail;
- player stopped;
- timer continues.

### Current track unavailable

- show status;
- skip/retry policy;
- timer unchanged.

### Playlist fetch error

- retry player panel;
- không full-screen error nếu Timer vẫn usable.

---

## 18. i18n / accessibility / motion

- mọi label/action/status qua i18n;
- icon buttons có accessible name;
- current playback state không chỉ thể hiện bằng màu;
- keyboard navigation queue và controls;
- focus visible;
- reduced motion;
- timer dùng tabular numerals;
- không animate timer layout mỗi giây.

---

## 19. Main integration scenarios

### Scenario A — Focus/Break riêng

```text
Config:
Focus = Study Lofi
Break = Jazz Coffee

Start Focus
→ Study Lofi plays

Focus ends
→ Break timer begins
→ save Study Lofi cursor
→ Jazz Coffee plays

Break ends
→ Focus begins
→ restore Study Lofi cursor
```

### Scenario B — Same playlist

```text
Focus playlist = Study Lofi
Break playlist = Study Lofi

Phase changes
→ current track keeps playing
→ no playlist reload
```

### Scenario C — User override

```text
Focus running with Study Lofi
→ user selects Piano
→ Piano plays
→ timer remains 18:42
→ config is not silently modified
```

### Scenario D — Player failure

```text
Current YouTube video becomes unavailable
→ player skips/stops according to policy
→ error visible in Music Panel
→ Pomodoro remains RUNNING
```

---

## 20. Edge cases bắt buộc

1. Focus playlist bị xóa trước khi start.
2. Break playlist null.
3. Focus/Break cùng một playlist.
4. Playlist empty.
5. Current track deleted while playing.
6. Reorder current playlist while playing.
7. Current track unavailable.
8. Tất cả tracks unavailable.
9. User đổi playlist đúng lúc phase transition.
10. Double interaction giữa phase switch và manual select — cần deterministic precedence trong reducer/action flow.
11. Browser autoplay blocked.
12. Player provider load fail.
13. User navigate sang Playlist page khi timer/music đang chạy.
14. Page component unmount không được vô tình tạo/destroy runtime state nếu app mong persistent player/timer trong cùng session.

Precedence đề xuất khi manual select xảy ra đồng thời phase transition:

- event nào được committed sau theo runtime action order sẽ thắng;
- không dùng race từ nhiều effects độc lập. Gom integration decision vào một nơi rõ ràng.

---

## 21. Test scenarios

### Integration FE

- Start Pomodoro auto loads correct Focus playlist.
- Phase Focus → Break switches playlist.
- Same playlist does not restart track.
- Returning Focus restores cursor within session.
- Manual playlist change does not change timer.
- Manual playlist change does not silently persist config.
- Delete current track moves to valid next item.
- Delete last item stops player only.
- Reorder does not restart current item.
- Shuffle does not mutate saved order.
- Player error does not change timer state.
- Mini Player and full panel share same player state.

### Backend/API

- update Pomodoro rejects playlist of another user;
- null playlist accepted;
- playlist detail returns availability/order needed by player;
- delete/reorder APIs maintain canonical list while timer remains irrelevant to backend.

---

## 22. Ngoài scope

- Spotify/Apple Music;
- downloading YouTube media;
- cross-device playback resume;
- server-side player state;
- collaborative listening;
- audio normalization;
- smart recommendations;
- background music queue persisted DB;
- timer ↔ player hard coupling.

---

## 23. Definition of Done

- Pomodoro start không phụ thuộc player success.
- Focus/Break playlist switch đúng rule.
- Same playlist không reset khi phase đổi.
- Runtime cursor có thể restore khi quay lại playlist trong cùng session.
- User đổi playlist/track mà timer không đổi.
- Next/Previous/Shuffle/Repeat hoạt động theo queue semantics rõ ràng.
- Delete/reorder trong lúc phát không restart timer và tránh reset current item không cần thiết.
- Player failure/empty playlist không phá Pomodoro.
- UI Timer vẫn hierarchy #1, Music Panel dễ truy cập nhưng secondary.
- Mini Player nếu triển khai dùng chung source of truth.
- Responsive/i18n/accessibility/loading-error state đầy đủ.
- Integration tests bao phủ các race/edge case chính.
