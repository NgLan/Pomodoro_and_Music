# Cappucino không đá không đường

## 1. Tổng quan sản phẩm

**Cappucino không đá không đường** là một website hỗ trợ người dùng tập trung học tập hoặc làm việc bằng phương pháp Pomodoro, đồng thời tích hợp trình phát nhạc và hệ thống quản lý playlist cá nhân dựa trên nội dung từ YouTube.

Mục tiêu của sản phẩm là gom các thao tác thường phải thực hiện ở nhiều nơi — đặt timer, mở YouTube, chọn playlist, đổi bài, quản lý danh sách nhạc — vào cùng một giao diện tập trung để giảm gián đoạn trong quá trình học và làm việc.

Website hướng đến trải nghiệm đơn giản:

1. Chọn hoặc tạo cấu hình Pomodoro.
2. Chọn playlist muốn nghe.
3. Bắt đầu phiên tập trung.
4. Timer và nhạc chạy đồng thời.
5. Có thể đổi playlist, đổi bài, sắp xếp danh sách nhạc mà không cần dừng Pomodoro.

---

## 2. Mục tiêu chính

Sản phẩm cần hỗ trợ các mục tiêu sau:

- Quản lý nhiều cấu hình Pomodoro khác nhau cho từng mục đích học tập/làm việc.
- Theo dõi lịch sử các phiên Pomodoro đã thực hiện.
- Cho phép một người dùng tạo và quản lý nhiều playlist cá nhân.
- Cho phép tìm kiếm video YouTube hoặc thêm bài bằng URL.
- Cho phép import playlist có sẵn từ YouTube.
- Cho phép xem trước và chọn một phần nội dung trước khi import.
- Cho phép đồng bộ lại playlist đã import từ YouTube.
- Cho phép phát nhạc trực tiếp trong lúc Pomodoro đang chạy.
- Cho phép sử dụng playlist khác nhau cho trạng thái Focus và Break.
- Cho phép thao tác với player và playlist mà không làm ảnh hưởng đến timer Pomodoro.

---

## 3. Đối tượng người dùng

Website phù hợp với:

- Sinh viên học bài.
- Lập trình viên cần tập trung khi code.
- Người tự học ngoại ngữ.
- Người đọc sách hoặc nghiên cứu tài liệu.
- Người làm việc theo phiên tập trung.
- Người thường nghe nhạc YouTube trong lúc học/làm việc nhưng muốn quản lý playlist riêng thuận tiện hơn.

---

## 4. Các module chính

Hệ thống gồm 4 nhóm chức năng chính:

1. Quản lý Pomodoro.
2. Quản lý danh sách phát nhạc.
3. Import playlist từ YouTube.
4. Phát nhạc trong Pomodoro.

---

# 5. Quản lý Pomodoro

## 5.1. Tạo cấu hình Pomodoro

Người dùng có thể tạo nhiều cấu hình Pomodoro khác nhau.

Một cấu hình tối thiểu gồm:

- Tên cấu hình.
- Thời gian Focus.
- Thời gian Short Break.
- Thời gian Long Break.
- Số phiên Focus trước khi chuyển sang Long Break.

Ví dụ:

```text
Tên: Học bài
Focus: 25 phút
Short Break: 5 phút
Long Break: 15 phút
Long Break sau: 4 phiên Focus
```

Một người dùng có thể có nhiều cấu hình như:

- Học bài.
- Code.
- Đọc sách.
- Luyện tiếng Nhật.
- Deep Work.

---

## 5.2. Xem danh sách cấu hình Pomodoro

Hệ thống hiển thị toàn bộ cấu hình Pomodoro mà người dùng đã tạo.

Mỗi cấu hình nên hiển thị tối thiểu:

- Tên.
- Thời gian Focus.
- Thời gian Short Break.
- Thời gian Long Break.
- Số phiên trước Long Break.

Người dùng có thể chọn một cấu hình để bắt đầu phiên mới.

---

## 5.3. Cập nhật cấu hình Pomodoro

Người dùng có thể chỉnh sửa:

- Tên cấu hình.
- Thời gian Focus.
- Short Break.
- Long Break.
- Số vòng trước Long Break.
- Các cài đặt liên quan khác nếu được bổ sung sau này.

---

## 5.4. Xóa cấu hình Pomodoro

Người dùng có thể xóa cấu hình không còn sử dụng.

Nếu cấu hình đã có lịch sử Pomodoro, việc xóa cấu hình không nên làm mất các bản ghi lịch sử cũ. Lịch sử cần giữ thông tin cấu hình tại thời điểm phiên được thực hiện hoặc snapshot cần thiết để vẫn đọc được dữ liệu cũ.

---

## 5.5. Bắt đầu phiên Pomodoro

Khi người dùng chọn cấu hình và nhấn bắt đầu, hệ thống khởi tạo một phiên Pomodoro.

Luồng trạng thái mẫu:

```text
FOCUS
→ SHORT_BREAK
→ FOCUS
→ SHORT_BREAK
→ ...
→ LONG_BREAK
→ FOCUS
```

Ví dụ với 4 phiên Focus trước Long Break:

```text
Focus 1
→ Short Break
→ Focus 2
→ Short Break
→ Focus 3
→ Short Break
→ Focus 4
→ Long Break
```

---

## 5.6. Tạm dừng và tiếp tục

Người dùng có thể pause timer.

Khi pause:

- Thời gian còn lại được giữ nguyên.
- Không tự chuyển phase.

Khi tiếp tục:

- Timer chạy tiếp từ thời gian còn lại.
- Không tạo một phiên mới.

---

## 5.7. Kết thúc phiên Pomodoro

Một phase hoặc phiên Pomodoro có thể kết thúc theo hai cách:

- Timer chạy về 0.
- Người dùng chủ động kết thúc trước thời gian.

Hệ thống cần phân biệt được phiên:

- Hoàn thành.
- Bị kết thúc sớm.

Việc phân biệt này giúp lịch sử và thống kê sau này chính xác hơn.

---

## 5.8. Lịch sử Pomodoro

Hệ thống lưu lịch sử để người dùng xem lại quá trình học/làm việc.

Một bản ghi có thể gồm:

- Ngày.
- Thời gian bắt đầu.
- Thời gian kết thúc.
- Cấu hình được sử dụng.
- Phase hoặc loại phiên.
- Thời lượng dự kiến.
- Thời lượng thực tế.
- Trạng thái hoàn thành.

Từ dữ liệu này, sau này có thể mở rộng thống kê theo:

- Ngày.
- Tuần.
- Tháng.
- Tổng số phiên Focus.
- Tổng thời gian tập trung.

---

# 6. Quản lý danh sách phát nhạc

## 6.1. Tạo playlist

Người dùng có thể tạo playlist cá nhân.

Thông tin playlist gồm:

- Tên.
- Mô tả.
- Thumbnail hoặc ảnh đại diện nếu có.

Ví dụ:

- Study.
- Coding.
- Japanese.
- Lofi.

Một user có thể tạo không giới hạn hoặc nhiều playlist tùy giới hạn hệ thống.

---

## 6.2. Xem danh sách playlist

Trang playlist hiển thị toàn bộ playlist của người dùng, bao gồm playlist:

- Tự tạo.
- Import từ YouTube.

Mỗi playlist nên hiển thị:

- Thumbnail.
- Tên.
- Mô tả ngắn.
- Số lượng bài.
- Tổng thời lượng nếu lấy được metadata.
- Nguồn playlist nếu được import.

---

## 6.3. Xem chi tiết playlist

Khi mở một playlist, hệ thống hiển thị danh sách bài theo đúng thứ tự phát hiện tại.

Mỗi bài có thể hiển thị:

- Tên video/bài nhạc.
- Thumbnail.
- Nguồn.
- Thời lượng.
- URL gốc.
- Trạng thái khả dụng.

---

## 6.4. Cập nhật playlist

Người dùng có thể thay đổi:

- Tên playlist.
- Mô tả.
- Thumbnail.
- Các metadata khác nếu có.

---

## 6.5. Xóa playlist

Người dùng có thể xóa playlist khỏi tài khoản.

Nếu playlist được import từ YouTube:

- Chỉ xóa bản playlist trong hệ thống.
- Không tác động đến playlist gốc trên YouTube.

---

## 6.6. Tìm kiếm video YouTube

Người dùng có thể nhập từ khóa vào thanh tìm kiếm để tìm video trực tiếp từ YouTube.

Ví dụ:

```text
lofi study
japanese listening n3
coding music
piano focus
```

Hệ thống hiển thị danh sách kết quả phù hợp để người dùng chọn.

Kết quả tìm kiếm nên có:

- Thumbnail.
- Tên video.
- Tên kênh nếu lấy được.
- Thời lượng nếu lấy được.
- Link video.

Người dùng chọn video và thêm vào một hoặc nhiều playlist cá nhân.

---

## 6.7. Thêm video bằng URL

Ngoài tìm kiếm, người dùng có thể paste URL của một video YouTube.

Hệ thống lấy metadata của video và cho phép thêm video vào playlist được chọn.

Nếu URL không hợp lệ hoặc video không khả dụng, hệ thống phải thông báo lỗi rõ ràng.

---

## 6.8. Xóa bài khỏi playlist

Người dùng có thể gỡ một video khỏi playlist cá nhân.

Việc này:

- Không xóa video trên YouTube.
- Không ảnh hưởng playlist nguồn trên YouTube.

---

## 6.9. Thay đổi thứ tự bài

Người dùng có thể sắp xếp lại thứ tự các bài bằng:

- Drag-and-drop.
- Hoặc nút di chuyển lên/xuống.

Thứ tự mới được lưu và trở thành thứ tự phát mặc định của playlist.

---

## 6.10. Sao chép playlist

Người dùng có thể tạo một bản sao của playlist hiện tại.

Ví dụ:

```text
Study Lofi
→ Sao chép
→ Study Lofi - Copy
```

Bản sao là playlist độc lập và có thể chỉnh sửa mà không ảnh hưởng playlist gốc.

---

## 6.11. Tìm kiếm playlist

Người dùng có thể tìm playlist theo:

- Tên.
- Mô tả.

---

## 6.12. Phát playlist

Người dùng có thể phát toàn bộ playlist theo thứ tự đã lưu.

Player cần giữ được trạng thái bài hiện tại trong quá trình người dùng thao tác trong cùng phiên sử dụng nếu kiến trúc cho phép.

---

## 6.13. Shuffle

Khi bật Shuffle, hệ thống phát bài theo thứ tự ngẫu nhiên thay vì thứ tự playlist gốc.

Shuffle không nên làm thay đổi thứ tự được lưu của playlist.

---

## 6.14. Repeat

Hệ thống hỗ trợ lặp playlist.

Khi phát hết bài cuối cùng:

```text
Bài cuối
→ Bài đầu
```

Có thể mở rộng thêm Repeat One ở player.

---

# 7. Import playlist từ YouTube

## 7.1. Import playlist bằng URL

Người dùng nhập URL playlist YouTube.

Ví dụ:

```text
https://www.youtube.com/playlist?list=PLAYLIST_ID
```

Backend cần:

1. Phân tích URL.
2. Lấy `playlist_id`.
3. Gọi YouTube API hoặc integration tương ứng.
4. Lấy metadata playlist.
5. Lấy danh sách video.
6. Tiếp tục lấy các page cho tới khi thu thập đủ dữ liệu cần import.

---

## 7.2. Xử lý video không khả dụng

Một playlist YouTube có thể chứa video:

- Private.
- Deleted.
- Bị chặn khu vực.
- Không còn khả dụng.

Các video này không được làm hỏng toàn bộ quá trình import.

Hệ thống cần áp dụng một trong các rule rõ ràng:

- Lưu với trạng thái `UNAVAILABLE`.
- Hoặc bỏ qua nhưng phải thông báo cho người dùng.

Không được thất bại toàn bộ playlist chỉ vì một số video lỗi.

---

## 7.3. Lưu nguồn playlist

Playlist được import phải giữ metadata nguồn, tối thiểu:

- URL playlist gốc.
- Source platform: YouTube.
- ID playlist nguồn nếu cần.

Mục đích là để:

- Người dùng biết playlist đến từ đâu.
- Hệ thống có thể thực hiện đồng bộ sau này.

---

## 7.4. Xem trước playlist trước khi import

Sau khi người dùng nhập URL nhưng trước khi lưu, hệ thống hiển thị preview gồm:

- Tên playlist.
- Thumbnail.
- Số lượng video.
- Danh sách video.
- Video không khả dụng nếu có.

Người dùng chỉ xác nhận import sau khi xem preview.

---

## 7.5. Import một phần playlist

Trong màn hình preview, người dùng có thể bỏ chọn một số video.

Ví dụ playlist nguồn có 100 bài nhưng user chỉ muốn 40 bài.

Hệ thống chỉ lưu các bài đã được chọn.

---

## 7.6. Tạo playlist nội bộ sau khi import

Khi user xác nhận:

- Hệ thống tạo một playlist mới trong tài khoản.
- Sao chép metadata cần thiết từ playlist nguồn.
- Tạo các playlist item tương ứng với video được chọn.

Playlist nội bộ sau đó có thể chỉnh sửa độc lập.

---

## 7.7. Đồng bộ lại playlist từ YouTube

Với playlist từng được import từ YouTube, user có thể yêu cầu đồng bộ lại.

Mục tiêu chính:

- Phát hiện bài mới trên playlist nguồn.
- Bổ sung các bài mới vào playlist nội bộ.

Cần có rule rõ ràng cho các tình huống:

- Bài đã bị user xóa thủ công ở playlist nội bộ.
- Thứ tự playlist nội bộ đã được user chỉnh sửa.
- Video nguồn bị xóa/private.

Mặc định an toàn nên ưu tiên không ghi đè tùy chỉnh cá nhân của user nếu không được yêu cầu rõ ràng.

---

# 8. Phát nhạc trong Pomodoro

## 8.1. Gắn playlist vào cấu hình Pomodoro

Pomodoro có thể được cấu hình theo hai chế độ.

### Chế độ A — Playlist riêng cho Focus và Break

Người dùng chọn:

```text
Focus Playlist: Playlist 1
Break Playlist: Playlist 2
```

Luồng mẫu:

```text
FOCUS
→ phát Playlist 1

BREAK
→ chuyển sang Playlist 2

FOCUS
→ quay lại Playlist 1 và tiếp tục
```

Khi quay lại một playlist, hệ thống nên tiếp tục từ trạng thái trước đó thay vì mặc định luôn phát lại bài đầu, trừ khi người dùng chọn hành vi khác.

### Chế độ B — Một playlist dùng chung

Người dùng chọn một playlist duy nhất cho cả Focus và Break.

Khi phase thay đổi:

- Nhạc tiếp tục bình thường.
- Không reset playlist.
- Không đổi bài chỉ vì timer đổi phase.

---

## 8.2. Phát nhạc khi bắt đầu Pomodoro

Nếu cấu hình Pomodoro đã có playlist được chọn, khi người dùng nhấn Start:

1. Timer bắt đầu.
2. Playlist tương ứng với phase hiện tại bắt đầu phát.

Nếu không có playlist, Pomodoro vẫn phải hoạt động bình thường mà không phụ thuộc player.

---

## 8.3. Chuyển playlist khi Pomodoro đang chạy

Người dùng có thể đổi playlist bất kỳ lúc nào.

Việc đổi playlist:

- Không pause timer.
- Không reset Pomodoro.
- Không thay đổi phase hiện tại.

---

## 8.4. Hiển thị playlist và bài đang phát

Trong màn hình Pomodoro, luôn hiển thị tối thiểu:

- Playlist hiện tại.
- Tên bài đang phát.
- Thumbnail.
- Player controls.
- Danh sách bài nếu user mở panel.

---

## 8.5. Chọn bài khác khi đang học

Người dùng có thể mở danh sách bài của playlist và chọn trực tiếp một bài khác.

Timer Pomodoro tiếp tục chạy bình thường.

---

## 8.6. Next / Previous

Player hỗ trợ:

- Next: chuyển bài tiếp theo.
- Previous: quay lại bài trước.

Hành vi phải tuân theo Shuffle/Repeat hiện tại.

---

## 8.7. Xóa bài khi đang phát

Người dùng có thể xóa bài khỏi playlist ngay trong màn hình Pomodoro.

Nếu xóa bài đang phát:

1. Gỡ bài khỏi playlist.
2. Player chuyển sang bài hợp lệ tiếp theo.
3. Timer không bị ảnh hưởng.

Nếu playlist không còn bài:

- Player dừng.
- Pomodoro tiếp tục chạy.

---

## 8.8. Sắp xếp playlist trong lúc Pomodoro chạy

Người dùng có thể thay đổi thứ tự bài mà không dừng timer.

Thứ tự mới được cập nhật cho playlist.

Player cần xử lý sao cho bài đang phát không bị reset không cần thiết.

---

## 8.9. Bật/tắt Shuffle

Người dùng có thể chuyển giữa:

```text
Sequential
↔ Shuffle
```

Việc đổi chế độ không ảnh hưởng timer.

---

## 8.10. Bật/tắt Repeat

Player có thể hỗ trợ:

- Repeat Off.
- Repeat Playlist.
- Repeat One.

Yêu cầu tối thiểu từ phạm vi hiện tại là lặp toàn playlist; Repeat One có thể được triển khai cùng player nếu phù hợp.

---

# 9. Luồng sử dụng chính

## 9.1. Luồng lần đầu sử dụng

```text
User mở website
    ↓
Tạo cấu hình Pomodoro
    ↓
Tạo playlist hoặc import từ YouTube
    ↓
Gắn playlist vào Pomodoro
    ↓
Nhấn Start
    ↓
Timer + Music Player cùng hoạt động
```

---

## 9.2. Luồng import playlist

```text
Playlist
    ↓
Import từ YouTube
    ↓
Paste URL
    ↓
Backend lấy metadata
    ↓
Hiển thị Preview
    ↓
User chọn/bỏ chọn video
    ↓
Xác nhận Import
    ↓
Tạo playlist cá nhân
```

---

## 9.3. Luồng Pomodoro có playlist riêng cho từng phase

```text
START
    ↓
FOCUS + Focus Playlist
    ↓
Hết giờ
    ↓
BREAK + Break Playlist
    ↓
Hết giờ
    ↓
FOCUS + tiếp tục Focus Playlist
```

---

# 10. Các màn hình chính đề xuất

## 10.1. Dashboard

Hiển thị nhanh:

- Pomodoro hôm nay.
- Tổng thời gian Focus hôm nay.
- Nút Start nhanh.
- Playlist gần đây.
- Lịch sử gần nhất.

---

## 10.2. Pomodoro Screen

Đây là màn hình sử dụng chính.

Có thể gồm:

- Timer lớn ở trung tâm.
- Phase hiện tại.
- Số vòng.
- Start / Pause / Continue / Stop.
- Cấu hình Pomodoro hiện tại.
- Player.
- Playlist đang phát.
- Danh sách bài dạng side panel hoặc drawer.

---

## 10.3. Pomodoro Configurations

Cho phép:

- Xem danh sách cấu hình.
- Tạo.
- Sửa.
- Xóa.
- Chọn cấu hình mặc định nếu cần.
- Gắn playlist Focus/Break.

---

## 10.4. Playlist Library

Hiển thị toàn bộ playlist dạng card/list.

Có:

- Search.
- Create Playlist.
- Import YouTube Playlist.
- Sort nếu cần.

---

## 10.5. Playlist Detail

Hiển thị:

- Thumbnail.
- Tên.
- Mô tả.
- Source.
- Danh sách bài.
- Search/Add video.
- Add by URL.
- Drag-and-drop.
- Play.
- Shuffle.
- Repeat.
- Duplicate.
- Sync nếu là YouTube import.

---

## 10.6. YouTube Import Preview

Hiển thị:

- Playlist metadata.
- Danh sách video có checkbox.
- Trạng thái unavailable.
- Select All / Deselect All.
- Import selected items.

---

## 10.7. Pomodoro History

Hiển thị lịch sử theo list/calendar.

Có thể filter theo:

- Ngày.
- Cấu hình.
- Trạng thái hoàn thành.

---

# 11. Các thực thể nghiệp vụ chính

Đây là mô hình khái niệm để định hướng phát triển, không phải database schema bắt buộc.

## User

Đại diện cho tài khoản người dùng.

## PomodoroConfig

Đại diện một cấu hình Pomodoro.

Thuộc tính khái niệm:

- id
- user_id
- name
- focus_duration
- short_break_duration
- long_break_duration
- focus_sessions_before_long_break
- focus_playlist_id
- break_playlist_id
- music_mode

## PomodoroSession

Đại diện cho một lần sử dụng Pomodoro.

## PomodoroPhase

Đại diện cho từng phase như:

- FOCUS
- SHORT_BREAK
- LONG_BREAK

## Playlist

Đại diện playlist cá nhân.

Có thể có source:

- MANUAL
- YOUTUBE

## PlaylistItem

Đại diện một video trong playlist và vị trí của nó.

## MediaItem / Video

Đại diện metadata của một video nguồn.

## ExternalPlaylistSource

Đại diện metadata dùng để liên kết playlist nội bộ với playlist YouTube nguồn phục vụ đồng bộ.

---

# 12. Quy tắc nghiệp vụ quan trọng

## 12.1. Timer độc lập với player

Pomodoro và music player là hai subsystem liên quan nhưng không được phụ thuộc cứng vào nhau.

Các lỗi như:

- Không tải được video.
- Video bị private.
- Player lỗi.

không được làm dừng hoặc reset Pomodoro.

---

## 12.2. Playlist nội bộ độc lập với playlist YouTube

Sau khi import, playlist trong hệ thống là dữ liệu của user.

Các thao tác như:

- Xóa bài.
- Đổi thứ tự.
- Đổi tên.

không làm thay đổi playlist nguồn trên YouTube.

---

## 12.3. Sync không được phá tùy chỉnh của user

Nếu user đã chỉnh playlist sau import, thao tác Sync không nên tự động ghi đè toàn bộ nội dung.

Sync mặc định nên ưu tiên:

- Bổ sung video mới.
- Cập nhật trạng thái video nếu cần.
- Không reset order/tùy chỉnh thủ công nếu không có rule rõ ràng.

---

## 12.4. Video unavailable không làm playlist lỗi toàn bộ

Player và import process phải bỏ qua hoặc đánh dấu item lỗi để playlist còn lại vẫn sử dụng được.

---

## 12.5. Pomodoro history phải phản ánh trạng thái thực tế

Không được coi mọi phiên bắt đầu đều là hoàn thành.

Cần phân biệt ít nhất:

- COMPLETED.
- ENDED_EARLY / CANCELLED.

---

# 13. Tích hợp YouTube

Các chức năng phụ thuộc YouTube gồm:

- Tìm kiếm video.
- Lấy metadata video từ URL.
- Đọc playlist.
- Import playlist.
- Đồng bộ playlist.

Backend nên đóng vai trò trung gian gọi YouTube API/integration thay vì để Frontend giữ secret hoặc API key nhạy cảm.

Hệ thống cần tính đến:

- API quota.
- Pagination.
- Video private/deleted.
- Playlist không public hoặc không truy cập được.
- Metadata thiếu.
- Rate limit.

Việc phát video cần tuân thủ cơ chế phát/nhúng được YouTube hỗ trợ thay vì tải hoặc lưu bản sao nội dung video trái phép.

---

# 14. Phạm vi MVP đề xuất

Để tránh sản phẩm quá lớn ở phiên bản đầu, MVP nên ưu tiên:

### Pomodoro

- CRUD cấu hình.
- Start/Pause/Resume/Stop.
- Tự chuyển phase.
- Lịch sử cơ bản.

### Playlist

- CRUD playlist.
- Thêm video bằng URL.
- Tìm kiếm video YouTube.
- Xóa bài.
- Sắp xếp bài.
- Play/Next/Previous.
- Shuffle/Repeat playlist.

### YouTube Import

- Import bằng URL.
- Preview.
- Chọn một phần video.
- Lưu playlist.

### Pomodoro + Music

- Chọn playlist khi chạy Pomodoro.
- Focus Playlist / Break Playlist.
- Đổi playlist trong khi timer đang chạy.
- Chọn bài trực tiếp.

---

# 15. Chức năng có thể phát triển sau MVP

Các hướng mở rộng phù hợp:

- Thống kê thời gian tập trung theo ngày/tuần/tháng.
- Streak học tập.
- Daily goal.
- Pomodoro notification.
- Browser notification khi đổi phase.
- Âm thanh báo hết giờ riêng.
- Favorites.
- Playlist folder/tag.
- Recent played.
- Queue tạm thời.
- Global volume.
- Lưu vị trí phát gần nhất.
- Dark mode.
- Theme Coffee/Cappuccino.
- Đồng bộ playlist YouTube nâng cao.
- Import từ nguồn khác ngoài YouTube nếu pháp lý/API cho phép.
- Flashcard/Quizlet/Anki integration như một module học tập riêng nếu mở rộng phạm vi sản phẩm sau này.

---

# 16. Định hướng UI/UX

Tên **“Cappucino không đá không đường”** phù hợp với một phong cách nhẹ nhàng, tập trung và hơi cá nhân thay vì giao diện productivity quá nghiêm túc.

Có thể định hướng visual theo:

- Coffee shop.
- Warm minimal.
- Lofi study room.
- Neutral brown/cream palette.
- Timer là điểm nhấn chính.
- Player luôn dễ truy cập nhưng không lấn át nội dung học tập.

Nguyên tắc UX quan trọng:

- Bắt đầu Pomodoro càng ít bước càng tốt.
- Không mở modal hoặc chuyển trang không cần thiết khi timer đang chạy.
- Các thao tác player không làm gián đoạn timer.
- Luôn nhìn thấy phase và thời gian còn lại.
- Các action phá dữ liệu như xóa playlist cần confirmation phù hợp.
- Import playlist dài phải có loading/progress rõ ràng.

---

# 17. Tóm tắt phạm vi chức năng

| Module | Chức năng chính |
|---|---|
| Pomodoro | CRUD cấu hình, timer, pause/resume, stop, tự chuyển phase, history |
| Playlist | CRUD playlist, tìm kiếm, thêm/xóa video, reorder, copy, play, shuffle, repeat |
| YouTube | Search video, add URL, import playlist, preview, partial import, sync |
| Pomodoro Music | Focus/Break playlist, auto switch, đổi playlist khi chạy, next/previous, reorder, delete, shuffle/repeat |

---

# 18. Kết luận

**Cappucino không đá không đường** là một ứng dụng tập trung kết hợp **Pomodoro + YouTube Playlist Manager + Music Player**.

Điểm khác biệt chính của sản phẩm không chỉ là có timer hoặc nghe nhạc, mà là cho phép người dùng xây dựng một môi trường học/làm việc liền mạch:

```text
Pomodoro Configuration
+
Personal Playlists
+
YouTube Search / Import
+
Integrated Music Player
=
Focused Study / Work Environment
```

Tài liệu này đóng vai trò mô tả phạm vi sản phẩm và hành vi nghiệp vụ ở mức tổng thể. Khi bước sang thiết kế kỹ thuật, từng module cần tiếp tục được chuyển thành use case, API contract, domain model, database schema và UI flow cụ thể mà không làm thay đổi các business rule đã xác định ở đây.
