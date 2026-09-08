# Triển khai 04 — Phát nhạc trong Pomodoro

## Cấu trúc

- `frontend/src/features/music-player/`: component, hook, provider, adapter YouTube, queue và player store.
- `frontend/src/features/pomodoro/state/timer-session-store.ts`: runtime timer tồn tại qua điều hướng trong cùng phiên ứng dụng.
- `frontend/src/features/pomodoro/hooks/use-timer-session-events.ts`: điểm tích hợp duy nhất, truyền playlist theo phase vào player khi bắt đầu/chuyển phase.
- `frontend/src/shared/providers/focus-session-provider.tsx`: quản lý vòng đời runtime theo tài khoản; đăng xuất/đổi tài khoản tạo runtime mới.
- `frontend/src/features/playlist/hooks/use-playlist-playback.ts`: trang playlist sử dụng cùng player với Pomodoro.

Các file TypeScript được tạo/sửa tuân thủ giới hạn 120 dòng/file và 25 dòng/hàm. Không thêm dependency hay sửa generated API.

## Hành vi

- Cấu hình lưu `focusPlaylistId` và `breakPlaylistId` qua contract hiện có. Chọn cùng một playlist cho cả hai trường để nghe xuyên suốt.
- Start khởi động timer trước, sau đó gửi intent chọn playlist. Pause/Resume/Stop của timer không tự pause nhạc.
- Giữ hành vi timer hiện có: sau khi hết phase, phase tiếp theo chờ người dùng nhấn Start. Nhạc chuyển theo phase mới ngay khi chuyển phase.
- Phase không có playlist sẽ dừng nhạc. Người dùng vẫn có thể chọn nhạc thủ công.
- Đổi playlist thủ công chỉ áp dụng tới lần Start/chuyển phase tiếp theo; không tự sửa cấu hình đã lưu.
- Playlist dùng chung không nạp lại video khi đổi phase. Khi quay lại playlist khác, khôi phục bài và vị trí đã lấy mẫu mỗi 500 ms trong phiên hiện tại.
- Next/Previous dùng queue runtime. Repeat lặp toàn playlist; Repeat Off dừng ở cuối. Shuffle giữ bài hiện tại, không ghi đè thứ tự đã lưu.
- Reorder cập nhật queue tuần tự; queue shuffle giữ các bài còn tồn tại và thêm bài mới. Xóa chỉ cập nhật playback sau API thành công; xóa bài hiện tại chuyển sang bài kế tiếp còn hợp lệ.
- Lỗi phát được thử bỏ qua hữu hạn trong playlist. Hết bài phát được sẽ dừng nhạc, không thay đổi timer.
- Trạng thái và vị trí nghe nằm trong bộ nhớ, không ghi DB mỗi giây và không khôi phục sau refresh.

## Giao diện và YouTube

- Music Panel dùng design token hiện có, nhãn Việt/Anh, controls có accessible name và trạng thái `aria-pressed`.
- Queue là side sheet trên desktop và bottom sheet trên mobile; bài hiện tại có badge và `aria-current`.
- Một YouTube player duy nhất được giữ ở cấp ứng dụng. Controls trong panel và dock dùng chung store. Dock nằm trong luồng trang trên mobile để tránh che timer.
- Embed có chiều cao 200 px, controls gốc và `origin`; không tải/proxy audio. Adapter sử dụng [YouTube IFrame Player API](https://developers.google.com/youtube/iframe_api_reference).
- Khi trình duyệt chặn autoplay, giao diện yêu cầu người dùng nhấn Phát. Lỗi tải SDK/khởi tạo player có timeout và thao tác thử lại.

## Kiểm chứng

- Test runtime: chuyển Focus/Break, playlist dùng chung, khôi phục cursor, stale fetch, thao tác nhạc độc lập timer, reorder/delete, shuffle/repeat và bỏ qua bài lỗi.
- Test adapter: không reload do cập nhật vị trí/reorder, khôi phục vị trí qua API, bỏ qua sự kiện video cũ, autoplay, timeout và cleanup khi ready đến muộn.
- Test backend bổ sung: từ chối playlist của người khác, chấp nhận null, kiểm tra quyền một lần với playlist dùng chung.
- Kiểm tra trình duyệt với API/player giả lập: Start, chuyển trang và quay lại không reset timer/player; chọn bài trong queue; viewport mobile 390 px không tràn ngang.
- Môi trường kiểm thử không kết nối được `www.youtube.com:443`, nên chưa xác nhận phát video/âm thanh YouTube thật. Luồng báo lỗi tải player vẫn hoạt động.
