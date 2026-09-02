# DATABASE SCHEMA — CAPPUCINO KHÔNG ĐÁ KHÔNG ĐƯỜNG

> Database mục tiêu: **PostgreSQL**.
>
> Schema này được tối giản theo đúng phạm vi hiện tại của sản phẩm: không lưu state tạm thời nếu Frontend/localStorage có thể quản lý, không tạo bảng background job khi thao tác hiện tại xử lý trực tiếp trong request, và không tách bảng chỉ để phục vụ khả năng mở rộng chưa có requirement.

---

# 1. Quy ước chung

- Primary key sử dụng `UUID`.
- Timestamp khi implement PostgreSQL phải dùng `timestamptz`.
- Không lưu binary video/audio YouTube.
- Không lưu API key hoặc secret trong database.
- Không lưu raw refresh token, chỉ lưu hash.
- Timer tick từng giây không được ghi xuống database.
- Player runtime state không lưu DB nếu không có yêu cầu đồng bộ nhiều thiết bị.
- Playlist nội bộ sau khi import độc lập với playlist YouTube nguồn.
- Database migration là source of truth cho schema thực tế.
- Enum trong DBML có thể map thành PostgreSQL enum hoặc string + constraint theo convention dự án.

---

# 2. Các bảng chính

```text
users
refresh_tokens
user_settings
pomodoro
pomodoro_history
playlists
media_items
playlist_items
```

Tổng cộng: **8 bảng**.

---

# 3. DBML

```dbml
Enum user_status {
  ACTIVE
  DISABLED
}

Enum auth_provider {
  LOCAL
  GOOGLE
}

Enum pomodoro_phase_type {
  FOCUS
  SHORT_BREAK
  LONG_BREAK
}

Enum pomodoro_history_status {
  COMPLETED
  ENDED_EARLY
  CANCELLED
}

Enum playlist_source_type {
  MANUAL
  YOUTUBE
}

Enum media_platform {
  YOUTUBE
}

Enum media_availability {
  AVAILABLE
  UNAVAILABLE
  PRIVATE
  DELETED
  REGION_BLOCKED
  UNKNOWN
}

Table users {
  id uuid [pk]
  email varchar(320) [not null, unique]
  display_name varchar(120)
  password_hash varchar(255)
  auth_provider auth_provider [not null, default: 'LOCAL']

  // ID ổn định do OAuth Provider cấp, ví dụ Google "sub".
  // Chỉ cần nếu có đăng nhập qua provider ngoài.
  provider_subject varchar(255)

  status user_status [not null, default: 'ACTIVE']
  created_at timestamp [not null]
  updated_at timestamp [not null]

  indexes {
    (auth_provider, provider_subject) [unique]
    status
  }
}

Table refresh_tokens {
  id uuid [pk]
  user_id uuid [not null]

  // Chỉ lưu hash của refresh token.
  token_hash varchar(128) [not null, unique]

  expires_at timestamp [not null]
  revoked_at timestamp
  created_at timestamp [not null]

  indexes {
    user_id
    expires_at
  }
}

Table user_settings {
  user_id uuid [pk]
  locale varchar(16) [not null, default: 'vi']
  timezone varchar(64) [not null, default: 'Asia/Ho_Chi_Minh']
  default_pomodoro_id uuid
  browser_notification_enabled boolean [not null, default: false]
  sound_notification_enabled boolean [not null, default: true]
  created_at timestamp [not null]
  updated_at timestamp [not null]
}

Table playlists {
  id uuid [pk]
  user_id uuid [not null]
  name varchar(255) [not null]
  description text
  thumbnail_url text

  source_type playlist_source_type [not null, default: 'MANUAL']

  // Chỉ có giá trị khi playlist được import từ YouTube.
  // Ví dụ YouTube Playlist ID.
  source_external_id varchar(255)

  // URL playlist YouTube gốc.
  source_url text

  // Lần gần nhất user thực hiện Sync.
  last_synced_at timestamp

  created_at timestamp [not null]
  updated_at timestamp [not null]

  indexes {
    user_id
    (user_id, name)
    (source_type, source_external_id)
  }
}

Table media_items {
  id uuid [pk]
  platform media_platform [not null]

  // Ví dụ YouTube Video ID.
  external_media_id varchar(128) [not null]

  title varchar(500)

  // Dùng để hiển thị tên kênh ở Search / Playlist Detail.
  channel_name varchar(255)

  duration_seconds int
  thumbnail_url text
  source_url text [not null]
  availability media_availability [not null, default: 'UNKNOWN']

  // Metadata phụ nếu YouTube trả thêm dữ liệu cần lưu.
  // Không dùng JSON này làm nơi chứa business data chính.
  metadata json

  created_at timestamp [not null]
  updated_at timestamp [not null]

  indexes {
    (platform, external_media_id) [unique]
    availability
  }
}

Table playlist_items {
  id uuid [pk]
  playlist_id uuid [not null]
  media_item_id uuid [not null]

  // Thứ tự hiện tại của bài trong playlist nội bộ.
  position int [not null]

  created_at timestamp [not null]
  updated_at timestamp [not null]

  indexes {
    (playlist_id, position) [unique]
    (playlist_id, media_item_id)
    playlist_id
  }
}

Table pomodoro {
  id uuid [pk]
  user_id uuid [not null]
  name varchar(120) [not null]
  focus_duration_seconds int [not null]
  short_break_duration_seconds int [not null]
  long_break_duration_seconds int [not null]
  focus_sessions_before_long_break int [not null]

  // Nếu null thì phase Focus chạy không có playlist mặc định.
  focus_playlist_id uuid

  // Nếu null thì Break chạy không có playlist mặc định.
  break_playlist_id uuid

  is_default boolean [not null, default: false]
  created_at timestamp [not null]
  updated_at timestamp [not null]

  indexes {
    user_id
    (user_id, name)
  }
}

Table pomodoro_history {
  id uuid [pk]
  user_id uuid [not null]

  // Có thể null nếu cấu hình Pomodoro gốc đã bị xóa.
  pomodoro_id uuid

  phase_type pomodoro_phase_type [not null]

  // Duration tại thời điểm phase được chạy.
  // Đây là snapshot tối thiểu cần thiết cho lịch sử.
  planned_duration_seconds int [not null]

  // Thời gian user thực sự chạy phase.
  actual_duration_seconds int [not null]

  status pomodoro_history_status [not null]
  started_at timestamp [not null]
  ended_at timestamp [not null]

  indexes {
    user_id
    (user_id, started_at)
    pomodoro_id
    phase_type
    status
  }
}

Ref: refresh_tokens.user_id > users.id

Ref: user_settings.user_id > users.id
Ref: user_settings.default_pomodoro_id > pomodoro.id

Ref: playlists.user_id > users.id

Ref: playlist_items.playlist_id > playlists.id
Ref: playlist_items.media_item_id > media_items.id

Ref: pomodoro.user_id > users.id
Ref: pomodoro.focus_playlist_id > playlists.id
Ref: pomodoro.break_playlist_id > playlists.id

Ref: pomodoro_history.user_id > users.id
Ref: pomodoro_history.pomodoro_id > pomodoro.id
```

---

# 4. Quy tắc Pomodoro

```text
focus_duration_seconds > 0
short_break_duration_seconds > 0
long_break_duration_seconds > 0
focus_sessions_before_long_break >= 1
```

Playlist gắn vào Pomodoro phải thuộc đúng user.

Nếu không chọn playlist:

```text
focus_playlist_id = null
break_playlist_id = null
```

Pomodoro vẫn phải hoạt động bình thường.

Player lỗi không được làm timer dừng hoặc reset.

---

# 7. Quy tắc Playlist

```text
position >= 0
duration_seconds >= 0 nếu có
```

Reorder phải được xử lý atomic trong transaction để không tạo duplicate `position`.

Ví dụ:

```text
A position = 1
B position = 2
C position = 3
```

User đổi thành:

```text
C
A
B
```

DB:

```text
C position = 1
A position = 2
B position = 3
```

---

# 8. Import Playlist từ YouTube

Preview là dữ liệu tạm thời.

Flow:

```text
User paste YouTube playlist URL
→ Frontend gọi Preview API
→ Backend lấy metadata + video list từ YouTube
→ Backend trả preview
→ Frontend giữ preview trong state
→ User chọn/bỏ chọn video
→ User nhấn Import
→ Backend mới ghi database
```

Transaction khi import:

```text
BEGIN
→ Create playlist
→ Create/Reuse media_items
→ Create playlist_items
→ COMMIT
```

Nếu lỗi:

```text
ROLLBACK
```

Không có dữ liệu import dở dang trong DB.

---

# 9. Sync Playlist YouTube

Không có:

```text
playlist_sync_runs
```

Flow:

```text
User nhấn Sync
→ Backend đọc source_external_id
→ lấy playlist hiện tại từ YouTube
→ tìm video chưa có trong playlist nội bộ
→ create/reuse media_items
→ append playlist_items mới
→ update playlists.last_synced_at
```

Sync mặc định:
- Không reset thứ tự playlist nội bộ.
- Không xóa bài user tự thêm.
- Không thay đổi Pomodoro.
- Video unavailable không làm fail toàn playlist.
- Không lưu lịch sử từng lần Sync.

---

# 10. Player state

Player state là runtime/client state và có thể quản lý bằng:

```text
React state
+
Zustand hoặc state manager tương đương
+
localStorage nếu cần giữ sau refresh
```

Ví dụ:

```json
{
  "playlistId": "...",
  "mediaItemId": "...",
  "playbackPositionSeconds": 102,
  "isShuffleEnabled": false,
  "repeatMode": "PLAYLIST",
  "volumePercent": 80
}
```

Chỉ đưa playback state vào DB nếu sau này có requirement cross-device resume.

---

# 11. Authentication

## `provider_subject`

`provider_subject` chỉ dùng cho OAuth Provider.

Ví dụ Google:

```text
auth_provider = GOOGLE
provider_subject = Google sub
```

Nếu hệ thống không triển khai Google Login thì có thể bỏ cả:

```text
auth_provider
provider_subject
```

Nếu có Google Login thì giữ.

## Refresh Token

Database chỉ lưu:

```text
token_hash
```

Không lưu raw refresh token.

---

# 12. Index đề xuất

```text
users(email)
refresh_tokens(user_id)
refresh_tokens(expires_at)
playlists(user_id)
playlists(user_id, name)
media_items(platform, external_media_id)
playlist_items(playlist_id, position)
pomodoro(user_id)
pomodoro_history(user_id, started_at DESC)
```

Nếu playlist search lớn, mới cân nhắc PostgreSQL trigram/full-text search.

Không thêm index “để dành”.

---

# 13. Transaction bắt buộc

## Import playlist

```text
Create playlist
+ Create/Reuse media_items
+ Create playlist_items
```

## Reorder playlist

```text
Update nhiều playlist_items.position
```

## Delete playlist item

```text
Delete playlist item
+ normalize position nếu cần
```

## Refresh token

```text
Revoke/replace token cũ
+ Create token mới
```

---

# 14. Dữ liệu không lưu vào Database

```text
YouTube search result tạm thời
YouTube playlist preview trước khi Import
Timer tick từng giây
Current player progress từng giây
Shuffle queue runtime
Raw access token
Raw refresh token
YouTube API key
Video/audio binary YouTube
```

---

# 15. Quan hệ tổng thể

```text
users
 ├── refresh_tokens
 ├── user_settings
 ├── pomodoro
 │    └── pomodoro_history
 │
 └── playlists
      └── playlist_items
            └── media_items
```

Pomodoro tham chiếu playlist:

```text
pomodoro.focus_playlist_id
        ↓
playlists.id

pomodoro.break_playlist_id
        ↓
playlists.id
```

Playlist import YouTube lưu source ngay trên `playlists`:

```text
playlists
├── source_type
├── source_external_id
├── source_url
└── last_synced_at
```

---

# 16. Các bảng cố ý chưa tạo

```text
external_playlist_sources
playlist_import_jobs
playlist_import_items
playlist_sync_runs
playback_states
playlist_playback_cursors
pomodoro_sessions
pomodoro_phases
```

Chỉ bổ sung khi xuất hiện requirement thật sự như:
- Background import.
- Retry/resume import.
- Audit lịch sử sync.
- Cross-device player resume.
- Pomodoro session analytics phức tạp.
- Multi-provider media platform.
- Sync strategy phức tạp giữa nhiều nguồn.

Nguyên tắc cuối:

```text
Requirement hiện tại cần gì
→ thiết kế đúng phần đó
→ không tạo schema cho requirement chưa tồn tại.
```
