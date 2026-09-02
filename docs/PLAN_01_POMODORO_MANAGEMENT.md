# PLAN 01 — QUẢN LÝ POMODORO

> Phạm vi: CRUD cấu hình Pomodoro, chạy timer, pause/resume/stop, tự chuyển phase và lịch sử cơ bản.
>
> Tài liệu này mô tả **logic nghiệp vụ và flow triển khai từ Backend đến Frontend**. Cách tổ chức code, layer, naming, validation, error handling, transaction, test... phải tuân theo `AGENT_CODING_GUIDELINES.md` và convention thực tế của codebase.

---

## 1. Mục tiêu

Sau khi hoàn thành feature, user phải có thể:

1. Tạo nhiều cấu hình Pomodoro cho các mục đích khác nhau.
2. Xem, sửa và xóa cấu hình.
3. Chọn một cấu hình và bắt đầu một phiên Pomodoro.
4. Pause và tiếp tục đúng phase đang chạy.
5. Kết thúc sớm phase hiện tại.
6. Khi timer về 0, tự chuyển đúng `FOCUS / SHORT_BREAK / LONG_BREAK`.
7. Xem lại lịch sử các phase đã thực hiện.
8. Xóa cấu hình mà không làm mất khả năng đọc lịch sử cũ.
9. Chạy Pomodoro bình thường ngay cả khi không chọn nhạc hoặc player gặp lỗi.

---

## 2. Business model cần hỗ trợ

### 2.1. Pomodoro Configuration

Một cấu hình tối thiểu gồm:

- `name`
- `focusDuration`
- `shortBreakDuration`
- `longBreakDuration`
- `focusSessionsBeforeLongBreak`
- playlist mặc định cho Focus nếu có
- playlist mặc định cho Break nếu có

Business validation tối thiểu:

- mọi duration phải > 0;
- `focusSessionsBeforeLongBreak >= 1`;
- playlist được gắn phải thuộc đúng user;
- không bắt buộc cấu hình phải có playlist.

### 2.2. Pomodoro Runtime

Runtime của timer là trạng thái đang chạy trên client, không phải bản ghi được update mỗi giây ở Backend.

Frontend cần giữ tối thiểu:

- config đang dùng;
- phase hiện tại;
- số Focus đã hoàn thành trong chu kỳ hiện tại;
- trạng thái `IDLE / RUNNING / PAUSED`;
- thời điểm phase bắt đầu;
- thời điểm phase dự kiến kết thúc;
- remaining time khi pause;
- thông tin cần thiết để tạo history khi phase kết thúc.

Nguồn sự thật cho timer đang chạy nên là **timestamp/end time**, không phải số lần interval đã tick. Interval chỉ phục vụ render UI.

### 2.3. Pomodoro History

Mỗi phase kết thúc tạo một history record độc lập, tối thiểu lưu:

- user;
- cấu hình tham chiếu nếu còn tồn tại;
- phase type;
- planned duration tại thời điểm chạy;
- actual duration;
- started at;
- ended at;
- status.

Status tối thiểu:

- `COMPLETED`: timer chạy hết;
- `ENDED_EARLY`: user chủ động kết thúc trước khi hết giờ;
- `CANCELLED`: chỉ dùng nếu codebase hiện tại có semantics riêng cho việc hủy trước khi thực sự chạy; không invent thêm nếu chưa cần.

History phải giữ snapshot duration để cấu hình bị sửa/xóa sau này không làm thay đổi dữ liệu quá khứ.

---

## 3. State machine của Pomodoro

### 3.1. Luồng phase

Với `focusSessionsBeforeLongBreak = N`:

```text
FOCUS #1
→ SHORT_BREAK
→ FOCUS #2
→ SHORT_BREAK
→ ...
→ FOCUS #N
→ LONG_BREAK
→ FOCUS #1 của chu kỳ mới
```

### 3.2. Rule chuyển phase

Khi một `FOCUS` hoàn thành:

- tăng số Focus hoàn thành;
- nếu số Focus vừa hoàn thành chia hết cho `focusSessionsBeforeLongBreak` → phase kế là `LONG_BREAK`;
- ngược lại → `SHORT_BREAK`.

Khi `SHORT_BREAK` hoặc `LONG_BREAK` hoàn thành:

- phase kế tiếp luôn là `FOCUS`.

### 3.3. Pause

Khi pause:

- không tạo history;
- không chuyển phase;
- giữ remaining time chính xác;
- resume tiếp tục chính phase hiện tại;
- không reset số vòng.

### 3.4. Stop / End Early

Khi user chủ động stop phase đang chạy:

1. tính actual duration;
2. ghi history với `ENDED_EARLY`;
3. dừng timer;
4. không tự coi phase đó là một Focus hoàn thành;
5. không tự tăng vòng;
6. đưa UI về trạng thái phù hợp để user quyết định bắt đầu lại hoặc chuyển config.

Không tự chuyển sang break sau một Focus bị kết thúc sớm, trừ khi requirement sau này quy định khác.

### 3.5. Timer về 0

Khi timer tự về 0:

1. ghi history `COMPLETED`;
2. cập nhật vòng Focus nếu phase vừa xong là `FOCUS`;
3. tính phase kế tiếp;
4. khởi tạo duration của phase mới;
5. FE hiển thị feedback transition nhẹ;
6. việc tự động chạy ngay phase kế tiếp hay chờ user Start cần theo behavior hiện có của codebase. Nếu chưa có requirement, ưu tiên **chuyển phase nhưng không invent auto-start**.

---

## 4. Backend plan

### 4.1. Audit trước khi implement

Agent cần đọc code hiện tại để xác định:

- auth/user ownership đang xử lý ở đâu;
- đã có module Pomodoro chưa;
- generated OpenAPI/client flow hiện tại;
- convention pagination/filter;
- cách project biểu diễn time/timestamp;
- error code format;
- transaction / repository abstraction hiện có.

Không tạo architecture mới nếu module tương đương đã tồn tại.

### 4.2. Use cases cho cấu hình

Backend cần hỗ trợ các nghiệp vụ:

- Create Pomodoro Configuration
- List My Pomodoro Configurations
- Get Pomodoro Configuration
- Update Pomodoro Configuration
- Delete Pomodoro Configuration
- Set Default Configuration nếu product hiện tại cần dùng `default`; nếu chưa có UI/requirement thì không bắt buộc thêm vào MVP.

Rule:

- chỉ owner truy cập/sửa/xóa config của mình;
- tên có thể trùng hay không phải theo schema/code hiện tại, không invent unique nếu docs không yêu cầu;
- khi gắn playlist, kiểm tra playlist thuộc user;
- xóa config không cascade xóa history.

### 4.3. Use case ghi lịch sử

Backend cần một contract để FE gửi kết quả của một phase đã kết thúc.

Input logic tối thiểu:

- `pomodoroId` nếu còn tham chiếu được;
- `phaseType`;
- `plannedDurationSeconds`;
- `startedAt`;
- `endedAt`;
- `status`.

Backend phải:

1. authenticate user;
2. nếu có `pomodoroId`, xác minh config thuộc user;
3. kiểm tra `endedAt >= startedAt`;
4. tính hoặc verify `actualDurationSeconds` theo contract đã chọn;
5. không tin hoàn toàn duration do client tự khai nếu backend có thể suy ra từ timestamps;
6. lưu history.

Không tạo request ghi timer tick mỗi giây.

### 4.4. List history

MVP cần đọc history theo:

- khoảng ngày;
- config nếu cần;
- status nếu cần;
- thứ tự gần nhất trước.

Response cần đủ dữ liệu để UI hiển thị:

- ngày/giờ;
- config name nếu còn có thể resolve;
- phase;
- planned vs actual duration;
- status.

Nếu config đã bị xóa, UI vẫn phải render record bằng dữ liệu snapshot còn lại; không để lỗi vì relation null.

### 4.5. API contract ở mức nghiệp vụ

Tên endpoint cụ thể phải theo convention project, nhưng contract cần bao phủ:

```text
Pomodoro Config
- create
- list
- detail
- update
- delete

Pomodoro History
- create history entry when a phase ends
- list/filter history
```

Không cần endpoint `tick`, `pause` hay `resume` nếu runtime chỉ chạy trên client và không có requirement cross-device resume.

---

## 5. Frontend plan

### 5.1. Feature boundaries

Tối thiểu cần các vùng chức năng:

```text
features/pomodoro/
- configuration UI
- timer runtime
- history UI
- mapping/service quanh generated API khi thực sự cần
```

Không đưa toàn bộ timer state vào server-state cache.

Phân biệt rõ:

- config/history = server state;
- timer runtime = client/runtime state;
- form = form state;
- active drawer/modal = local UI state.

### 5.2. Pomodoro Configurations screen

Desktop:

- page title;
- CTA `Tạo cấu hình`;
- list/card các config;
- mỗi card hiển thị:
  - name;
  - Focus;
  - Short Break;
  - Long Break;
  - số Focus trước Long Break;
  - playlist gắn nếu có;
- action chính: `Bắt đầu`;
- overflow menu: edit/delete.

Không nhồi mọi action lên card.

Mobile:

- một cột;
- action menu bằng dropdown/sheet;
- create/edit form dùng sheet hoặc full-width dialog phù hợp.

Delete:

- có confirmation vì là destructive;
- dialog nói rõ tên config;
- thông báo rằng history cũ vẫn được giữ nếu UX cần giải thích.

### 5.3. Create/Edit Configuration form

Fields:

- tên;
- Focus duration;
- Short Break duration;
- Long Break duration;
- số Focus trước Long Break;
- Focus playlist optional;
- Break playlist optional.

Form phải có:

- label;
- inline validation;
- loading khi submit;
- chống double submit;
- giữ dữ liệu form nếu request fail recoverable.

Nếu chọn playlist, dropdown chỉ hiển thị playlist của user.

### 5.4. Pomodoro Screen

Timer là hierarchy #1.

Desktop:

```text
┌─────────────────────────┬───────────────────────┐
│       TIMER CARD        │      MUSIC PANEL      │
│ FOCUS                   │ (feature 4 tích hợp)  │
│ 25:00                   │                       │
│ Round 2 / 4             │                       │
│ Start Pause Stop        │                       │
└─────────────────────────┴───────────────────────┘
│ Current config / summary                        │
└─────────────────────────────────────────────────┘
```

Timer card cần luôn thấy:

- phase;
- remaining time;
- vòng hiện tại;
- config name;
- primary action tùy state;
- stop là destructive secondary.

State button:

```text
IDLE    → Start
RUNNING → Pause
PAUSED  → Continue
```

Không hiển thị cả Start/Pause/Continue cùng lúc nếu không cần.

### 5.5. Timer rendering

- timer display dùng tabular numerals;
- không làm toàn page re-render mỗi giây;
- không animation layout theo từng tick;
- khi browser tab bị background, khi quay lại phải tính remaining từ timestamp, không tin số tick đã bỏ lỡ;
- page refresh trong lúc chạy: behavior restore chỉ làm nếu codebase/product đã quyết định dùng localStorage. Nếu chưa có requirement, không tự biến thành cross-session persistence phức tạp.

### 5.6. Phase transition UI

Khi phase hoàn thành:

- đổi label Focus/Break rõ ràng;
- có feedback nhẹ;
- có thể dùng browser/sound notification nếu setting hiện tại hỗ trợ;
- không dùng animation nặng;
- reduced-motion phải được tôn trọng.

### 5.7. History screen

MVP:

- list các phase theo ngày;
- filter ngày / config / status;
- hiển thị status bằng text/icon + màu, không chỉ màu;
- planned vs actual duration;
- empty state có CTA bắt đầu Pomodoro.

Desktop có thể dùng table/list hybrid.
Mobile chuyển sang card list thay vì ép table quá rộng.

---

## 6. API ↔ FE flow chính

### 6.1. Tạo config

```text
User mở Create Config
→ nhập form
→ FE validate shape
→ gọi create API
→ BE validate business rules + ownership playlist
→ save
→ FE refresh/invalidate config list
→ success feedback
```

### 6.2. Start phase

```text
User chọn config
→ FE load config snapshot
→ initialize runtime state
→ set startedAt / endAt
→ timer chạy client-side
```

Không gọi Backend mỗi giây.

### 6.3. Phase completed

```text
Timer reaches 0
→ FE freeze result của phase vừa xong
→ call history API status=COMPLETED
→ update current cycle counters
→ calculate next phase
→ render next phase
```

Nếu save history tạm fail:

- không được làm timer/player crash;
- UI phải có retry/recoverable handling phù hợp;
- không silently coi là đã lưu nếu request chưa thành công.

### 6.4. End early

```text
User Stop
→ confirm nếu UX hiện tại thấy cần
→ calculate endedAt
→ call history API status=ENDED_EARLY
→ clear active runtime phase
→ timer về idle
```

---

## 7. Edge cases bắt buộc

1. Config bị xóa sau khi từng có history.
2. Playlist đã gắn vào config sau đó bị xóa.
3. User pause rất lâu rồi resume.
4. Browser throttle interval/background tab.
5. Double click Start/Pause/Stop.
6. Network fail đúng lúc lưu history.
7. User mở config không thuộc tài khoản mình.
8. Config duration bị sửa trong khi một phase đã chạy: phase đang chạy giữ snapshot ban đầu, không đổi duration giữa chừng.
9. Player lỗi hoặc không có nhạc: timer vẫn hoạt động.
10. Refresh page trong lúc timer chạy phải có behavior rõ ràng, không khôi phục nửa vời.

---

## 8. UI states bắt buộc

Cho config/history:

- initial loading → skeleton;
- empty → mô tả + CTA;
- recoverable error → message + retry;
- mutation loading tại button/section;
- success feedback vừa đủ.

Cho timer:

- idle;
- running;
- paused;
- transitioning phase;
- history-save error không được che mất timer state.

Toàn bộ user-facing text phải đi qua i18n.

---

## 9. Test scenarios nghiệp vụ

### Backend

- create/update config hợp lệ;
- reject duration <= 0;
- reject playlist của user khác;
- delete config không xóa history;
- create completed history;
- create ended-early history;
- reject invalid timestamps;
- list/filter history đúng user.

### Frontend

- timer chuyển Focus → Short Break đúng;
- đến Focus thứ N → Long Break;
- pause giữ đúng remaining;
- resume không tạo session mới;
- stop tạo ended-early flow;
- background tab không làm drift timer đáng kể;
- player fail không ảnh hưởng timer;
- loading/error/empty states render đúng;
- mobile layout không che Timer controls.

---

## 10. Ngoài scope của plan này

Không tự mở rộng sang:

- analytics nâng cao;
- streak/daily goal;
- cross-device timer sync;
- background job cho timer;
- lưu tick từng giây;
- Pomodoro session/phases schema phức tạp nếu requirement hiện tại chưa cần;
- player behavior chi tiết — nằm ở Plan 04.

---

## 11. Definition of Done cho feature

- CRUD config đầy đủ.
- State machine Focus/Short Break/Long Break đúng.
- Pause/resume/stop đúng semantics.
- History phân biệt completed và ended early.
- Xóa config không phá history.
- Không ghi timer tick xuống Backend.
- Timer không phụ thuộc player.
- UI đúng hierarchy: Timer là trung tâm.
- Responsive + i18n + loading/error/empty/accessibility đầy đủ.
- API contract được cập nhật và generated FE client được regenerate theo flow project.
- Test các business flow chính pass.
