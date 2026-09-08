# Audit nội dung i18n VI / EN

## Phạm vi và quy ước

Đọc toàn bộ 16 locale JSON trong 8 namespace; đối chiếu product docs, hai coding/UI guidelines, component, schema, error mapper và timer/import/player implementation. Tiếng Việt là nguồn nghĩa; tiếng Anh được biên tập theo cùng hành vi và ngữ cảnh. Giữ nguyên key, namespace, biến ICU và logic ứng dụng.

Inventory tại `I18N_CONTENT_INVENTORY.json` lưu từng key, hai bản cũ, file, feature, surface, nơi tham chiếu và kết quả review. References là vị trí chứa key trong source, có thể gồm key trùng tên ở namespace khác; các key truyền động qua mapper/schema được kiểm tra thêm theo feature. Không xóa key chưa có consumer.

## Glossary đã chốt trước khi rewrite

| Concept                      | VI                                             | EN                                           |
| ---------------------------- | ---------------------------------------------- | -------------------------------------------- |
| Configuration                | Cấu hình Pomodoro; cấu hình khi đã rõ ngữ cảnh | Pomodoro configuration; configuration        |
| Focus                        | Tập trung; phiên tập trung                     | Focus; focus session                         |
| Short / long break           | Nghỉ ngắn / Nghỉ dài                           | Short break / Long break                     |
| Phase                        | Phiên (tập trung hoặc nghỉ)                    | Session (focus or break)                     |
| Cycle / round                | Chu kỳ / vòng                                  | Cycle / round                                |
| Playlist / library           | Playlist / thư viện nhạc                       | Playlist / music library                     |
| Saved playlist item          | Bài                                            | Track                                        |
| YouTube search / import item | Video                                          | Video                                        |
| Player / queue               | Trình phát / danh sách bài                     | Player / track list                          |
| Preview / import / sync      | Xem trước / Nhập / Đồng bộ                     | Preview / Import / Sync                      |
| Remove / delete              | Gỡ bài khỏi playlist / Xóa playlist            | Remove track / Delete playlist               |
| Pause / resume / stop        | Tạm dừng / Tiếp tục / Kết thúc sớm             | Pause / Resume / End early                   |
| Shuffle / repeat             | Phát ngẫu nhiên / Lặp playlist / Lặp một bài   | Shuffle / Repeat playlist / Repeat one track |

Sentence case cho cả hai locale. Nhãn/nút không có dấu chấm cuối; mô tả và thông báo dùng câu đầy đủ; loading dùng dấu “…”. Giữ tên sản phẩm và thuật ngữ YouTube/Pomodoro. Không thêm lời hứa bảo mật, suy đoán nguyên nhân lỗi hoặc coffee joke vào thao tác quan trọng.

## Các vấn đề xác định trước khi sửa

- Cấu hình bị gọi lẫn “nhịp”, “rhythm”, “configuration”; tiếng Việt còn Focus, Break, phase, import.
- Lỗi thư viện/search đoán kết nối chậm hoặc rate limit dù component dùng cùng message cho mọi lỗi.
- Lịch sử nói lưu trên thiết bị dù consumer lấy dữ liệu tài khoản qua API.
- `TimerSessionStore.stop()` và `tickTimer()` chạy ngay phiên kế tiếp; implementation doc cũ nói chờ Start. Ưu tiên code đang chạy.
- `reset()` bỏ runtime hiện tại, về Focus vòng 1 ở trạng thái chờ, không gọi record. Thông báo `MSG_PHASE_ENDED_EARLY` được dùng cả stop và reset nên không được khẳng định đã lưu.
- `TrackActions` dùng `ARIA_PAUSE` cho pause playback thật, không phải stop preview. Badge bài hiện tại vẫn hiện khi pause nên không khẳng định đang phát.
- History empty state cũng dùng khi bộ lọc không có kết quả. Cần hướng dẫn cả đổi bộ lọc và tạo lịch sử.
- Import chỉ tạo bản playlist nội bộ; sync chỉ thêm video mới đủ điều kiện, không khôi phục bài đã gỡ/bỏ chọn và không reset thứ tự.
- Một số key foundation/coming-soon/local-note không có consumer hiện tại. Giữ contract và chỉnh nội dung phù hợp, không quảng bá feature tương lai như trạng thái sản phẩm hiện tại.

## Ngoài phạm vi content

- `TXT_SESSION_SHORT` được nối với số trong component, không nhận biến count. Chưa thể pluralize tiếng Anh đúng mọi số nếu giữ contract; cần truyền count và dùng ICU ở task riêng.
- Header dùng `TXT_EYEBROW` cho cả branding và aria navigation; nên có key aria riêng ở task cấu trúc UI.
- Form display name dùng lỗi Zod mặc định; thay locale JSON không localize được message này.
- Callback kết thúc phiên báo trước khi API lưu lịch sử trả kết quả. Copy tránh khẳng định lưu thành công; nên tách notification reset/stop/save thành các sự kiện riêng nếu mở rộng task.

## Kết quả

- Review 384 key có mặt ở cả hai locale (768 chuỗi trong 16 file).
- Chỉnh 211 key phân biệt theo namespace: 195 giá trị tiếng Việt và 196 giá trị tiếng Anh, tổng 391 giá trị.
- Các nhóm cải thiện chính: thuật ngữ Pomodoro/playlist/player; lỗi có bước xử lý; empty state có hướng đi tiếp; xác nhận xóa/reset đúng hậu quả; preview/import/sync rõ ràng; auth đúng giới hạn mật khẩu; aria pause đúng hành vi.
- Các key cùng ý nghĩa được giữ riêng nhưng thống nhất wording: Hủy/Cancel; Thử lại/Try again; Phát ngẫu nhiên/Shuffle; tên playlist bắt buộc; video chưa có tiêu đề; tạm dừng nhạc; fallback lỗi ngoài dự kiến. Không merge key khác namespace.
- Settings được review trong cấu hình Pomodoro, lựa chọn playlist, âm lượng và bộ đổi ngôn ngữ; repository không có namespace settings riêng.
- Lưu locale bằng UTF-8 không BOM; thêm `locales/.editorconfig` với `charset = utf-8`. Khi ghi bằng PowerShell, đặt `$OutputEncoding = [System.Text.UTF8Encoding]::new($false)` trước khi pipe sang Node. `Get-Content` dùng `-Encoding utf8`.

## Locale đã sửa

Các đường dẫn bên dưới tính từ `frontend/src/shared/i18n/locales/`.

| Namespace     | Vietnamese               | English                  | Key được review |
| ------------- | ------------------------ | ------------------------ | --------------: |
| auth          | `vi/auth.json`           | `en/auth.json`           |              22 |
| common        | `vi/common.json`         | `en/common.json`         |              28 |
| errors        | `vi/errors.json`         | `en/errors.json`         |              26 |
| musicPlayer   | `vi/music-player.json`   | `en/music-player.json`   |              41 |
| notifications | `vi/notifications.json`  | `en/notifications.json`  |              19 |
| playlist      | `vi/playlist.json`       | `en/playlist.json`       |             101 |
| pomodoro      | `vi/pomodoro.json`       | `en/pomodoro.json`       |             103 |
| youtubeImport | `vi/youtube-import.json` | `en/youtube-import.json` |              44 |

Ngoài locale: báo cáo này, inventory, `.editorconfig` và hai literal nhãn trong `ConfigurationDialog.music.test.tsx`. Không sửa component, API, generated type hoặc business logic.

## Kiểm chứng

| Kiểm tra            | Kết quả                                                                                                                                                                                   |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| UTF-8 / JSON        | 16 file decode UTF-8 strict và parse JSON thành công; không BOM, replacement character hoặc chữ Việt bị thay bằng dấu hỏi                                                                 |
| Key parity          | 384 key/locale; không thiếu/thừa key so với inventory trước khi sửa                                                                                                                       |
| Interpolation       | Parse ICU bằng dependency đang cài; tập biến mỗi key giữ nguyên so với bản cũ và khớp VI/EN                                                                                               |
| ICU rendering       | 3.072 lượt format (768 chuỗi × số lượng 0, 1, 2, 1000), không lỗi; English import/sync/warnings dùng plural ICU                                                                           |
| Lint                | `npm run lint` pass                                                                                                                                                                       |
| Type-check          | `npm run type-check` pass                                                                                                                                                                 |
| Tests               | 26 file, 65 test pass; cập nhật hai nhãn test theo copy mới, không thay assertion hành vi                                                                                                 |
| Build               | `npm run build` pass                                                                                                                                                                      |
| Kích thước file/hàm | Locale lớn nhất 105 dòng; test sửa nhãn 40 dòng, callback test 24 dòng; không thêm logic hoặc abstraction trùng lặp                                                                       |
| UI context          | Đọc consumer và kiểm tra surface: nút timer/library có flex-wrap; description dialog có xuống dòng; queue là sheet; import có cột xác nhận 320 px ở desktop, một cột mobile; CTA giữ ngắn |
| Trình duyệt thật    | Chưa xác nhận bằng ảnh/render thực tế: Chromium trong môi trường chạy bị lỗi GPU/network subprocess khi khởi động. Không coi review source là chứng nhận không tràn chữ ở mọi viewport    |

Rà theo luồng: đăng nhập/đăng ký → dashboard → cấu hình → timer Start/Pause/Resume/Stop/Reset → thư viện/tạo playlist → tìm YouTube/thêm đường dẫn → preview/import/sync → player/queue → lịch sử/bộ lọc → lỗi. Những hạn chế cần thay contract/structure được ghi riêng ở trên.
