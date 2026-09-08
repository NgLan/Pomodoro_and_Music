# Import playlist YouTube

## Sử dụng

- Trong thư viện nhạc, chọn **Import YouTube** để mở `/playlists/import`.
- Dán URL `/playlist?list=…` hoặc `/watch?v=…&list=…`, chọn **Xem trước**.
- Chọn/bỏ chọn video, sửa tên bản sao rồi xác nhận số video cần import.
- Mở playlist vừa tạo. Với playlist có nguồn YouTube, dùng **Đồng bộ** để bổ sung bài mới.

## Quy tắc dữ liệu

- Preview không ghi database. Backend đọc hết pagination, lấy metadata video theo nhóm tối đa 50 ID, timeout mỗi request 8 giây và retry tối đa một lần cho lỗi mạng/5xx.
- Import kiểm tra lại nguồn trước khi lưu. Chỉ ID thuộc nguồn hiện tại được chấp nhận, metadata từ client không được dùng làm nguồn tin cậy. Video được lưu theo thứ tự nguồn.
- Video thiếu metadata hoặc không cho phép phát nhúng được hiển thị không khả dụng và không thể chọn. Các ID trùng trong nguồn chỉ xuất hiện một lần; số mục bỏ qua được báo trong preview/kết quả.
- Import tạo playlist, media, playlist items và lịch sử nguồn trong cùng transaction. Lỗi ghi dữ liệu được chuyển ra transaction để rollback.
- Bảng `playlist_source_history` ghi nhận các ID đã thấy khi import, kể cả bài bỏ chọn. Sync chỉ thêm ID khả dụng chưa có trong playlist hoặc lịch sử, giữ tên, mô tả và thứ tự nội bộ.
- Xóa bài trong playlist import cũng ghi nhận ID vào lịch sử. Vì vậy cả bài từng thêm thủ công cũng không bị Sync đưa trở lại nếu sau này xuất hiện trong nguồn.
- Video mới không khả dụng trong lần Sync chưa được đánh dấu đã xử lý; lần Sync sau có thể thêm nếu video khả dụng trở lại.
- Khóa hàng playlist trong transaction tuần tự hóa Sync với thêm/xóa/reorder/sửa metadata. Lấy dữ liệu YouTube diễn ra trước transaction để không giữ khóa trong lúc gọi mạng.
- Import cùng nguồn nhiều lần tạo các playlist độc lập. Duplicate playlist hiện có vẫn theo hành vi tạo bản sao manual của tính năng quản lý playlist.

## API

| Method | Path | Chức năng |
| --- | --- | --- |
| POST | `/youtube/playlists/preview` | Xem trước toàn bộ nguồn bằng URL |
| POST | `/youtube/playlists/import` | Import `selectedVideoIds`, tùy chọn `name` |
| POST | `/playlists/:id/sync` | Thêm bài mới vào playlist của người đang đăng nhập |

Các endpoint yêu cầu access token và dùng response/error envelope chung. Chi tiết playlist có thêm `sourceExternalId`, `lastSyncedAt`.

## Cấu trúc và chạy

- Backend giữ các use case trong module `playlist`, tách provider/client/parser/mapper, repository lịch sử, DTO và controller.
- Frontend dùng `features/youtube-import/{components,hooks,schemas,services,types,utils}`; tái sử dụng UI, thumbnail, authentication và generated API hiện có.
- Cần `YOUTUBE_API_KEY` server-side có quyền gọi YouTube Data API v3. Không hỗ trợ playlist riêng tư cần OAuth.
- Migration mới: `1788360300000-playlist-source-history.ts`. Backend hiện tự chạy migration khi khởi động; cũng có thể chạy `npm run migration:run` trong `backend`.
- Migration giữ dữ liệu hiện có và backfill các bài đang nằm trong playlist YouTube. Không thể suy ra bài đã xóa từ trước khi có lịch sử; bảo vệ deletion intent đầy đủ áp dụng từ khi migration/tính năng này được triển khai.
- Region restriction phụ thuộc vị trí/ngữ cảnh phát của người nghe; API key không xác nhận được khả năng phát ở mọi quốc gia. Playback vẫn cần xử lý lỗi thực tế.

Tạo lại client từ contract backend, không sửa thư mục generated bằng tay:

```powershell
cd backend
npm run build
node scripts/export-openapi.mjs
cd ../frontend
npm run api:generate
```

Script export dựng application với database provider giả lập, không kết nối hoặc thay đổi database. Reference integration: [YouTube playlistItems.list](https://developers.google.com/youtube/v3/docs/playlistItems/list).
