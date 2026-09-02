# PLAN — IMPLEMENT BACKEND DOMAIN LAYER

## Dự án

**Cappucino không đá không đường**

## Mục tiêu

Implement **tầng Domain bên trong Backend** dựa trên `DATABASE_SCHEMA.md`, đồng thời mọi thay đổi phải tuân thủ tuyệt đối `AGENT_CODING_GUIDELINES.md`.

Plan này chỉ tập trung vào:

```text
backend/src/domain/
```

hoặc cấu trúc tương đương đang thực sự tồn tại trong codebase.

Không implement Application, Infrastructure, Presentation, ORM model, migration, controller, DTO HTTP hoặc YouTube adapter trong task này, trừ khi cần sửa rất nhỏ để code Domain hiện tại compile và việc đó không làm thay đổi boundary.

---

# 1. SOURCE OF TRUTH VÀ THỨ TỰ ƯU TIÊN

Codex phải sử dụng thứ tự sau:

```text
1. Code backend hiện tại
2. AGENT_CODING_GUIDELINES.md
3. DATABASE_SCHEMA.md
4. Các tài liệu sản phẩm khác nếu cần hiểu business intent
```

Các nguyên tắc bắt buộc:

- Code hiện tại là source of truth về:
  - ngôn ngữ;
  - naming;
  - module layout;
  - base entity;
  - error convention;
  - repository convention;
  - test convention;
  - UUID/date representation.
- Không tự thay architecture chỉ để khớp ví dụ trong guideline.
- Không tạo abstraction mới nếu codebase đã có abstraction tương đương.
- Không tạo Domain object chỉ vì có một bảng database tương ứng.
- Không đưa persistence concern vào Domain.
- Không sửa generated code.
- Không thêm dependency mới nếu không thực sự cần.

---

# 2. AUDIT CODEBASE TRƯỚC KHI IMPLEMENT

Trước khi viết code, đọc toàn bộ phần liên quan trong Backend.

Tối thiểu kiểm tra:

```text
backend/
backend/src/
backend/src/domain/
backend/src/application/
backend/src/infrastructure/
backend/src/presentation/
backend/src/common/
backend/test/
backend/tests/
package.json
tsconfig.json
eslint config
test config
```

Nếu Backend dùng cấu trúc khác thì map tương đương.

Đặc biệt phải trả lời được các câu hỏi sau trước khi tạo file:

## 2.1. Domain convention hiện tại

- Domain đang tổ chức theo feature/module hay technical type?
- Entity đang dùng:
  - class;
  - interface;
  - plain object;
  - aggregate root base class?
- ID đang biểu diễn bằng:
  - `string`;
  - UUID value object;
  - branded type;
  - base identifier class?
- Timestamp dùng `Date` trực tiếp hay Value Object?
- Domain exception đang nằm ở đâu?
- Enum dùng TypeScript `enum`, string union hay constant object?
- Có factory method như:
  - `create`;
  - `restore`;
  - `reconstitute`;
  - constructor public/private?
- Có pattern cho repository interface không?
- Có shared Domain primitive/value object nào có thể reuse không?

## 2.2. Module hiện có

Tìm các module tương ứng:

```text
user
authentication / auth
settings
pomodoro
playlist
media
```

Không tạo duplicate module.

Ví dụ:

Nếu đã có:

```text
domain/authentication/
```

thì không tạo thêm:

```text
domain/auth/
```

chỉ vì plan này dùng từ `auth`.

## 2.3. Existing implementation

Tìm xem đã tồn tại chưa:

```text
User
RefreshToken
UserSettings
Pomodoro
PomodoroHistory
Playlist
PlaylistItem
MediaItem
```

và các enum/rule tương ứng.

Nếu đã có:
- audit;
- sửa tối thiểu để phù hợp schema/business invariant;
- không tạo class thứ hai cùng trách nhiệm.

---

# 3. DOMAIN BOUNDARY BẮT BUỘC

Domain là nơi chứa business meaning và invariant.

Domain được phép chứa:

```text
Entity
Aggregate Root
Value Object
Business Enum
Domain Invariant
Pure Domain Rule
Domain Service thuần khi thật sự cần
Repository Interface nếu convention hiện tại đặt contract ở Domain
```

Domain tuyệt đối không được import:

```text
@nestjs/*
TypeORM
Prisma
Drizzle
Sequelize
database driver
PostgreSQL type
HTTP Request/Response
class-validator
Swagger/OpenAPI DTO
YouTube SDK
Google SDK
Redis
Axios
fetch wrapper
Infrastructure implementation
Presentation DTO
```

Nếu validation cần database hoặc external context thì không nhét vào Entity.

Ví dụ:

```text
"playlist được gắn vào Pomodoro phải thuộc đúng user"
```

là business rule thật, nhưng việc kiểm tra ownership thường cần load Playlist.

Do đó:

```text
Pomodoro Entity
```

không được tự gọi repository.

Rule này phải được enforce ở Application/use case sau này, hoặc bằng pure rule nếu Application đã cung cấp đủ object cần thiết.

---

# 4. KHÔNG MAP DATABASE TABLE → DOMAIN ENTITY MÁY MÓC

`DATABASE_SCHEMA.md` hiện có 8 bảng:

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

Nhưng Codex phải quyết định representation dựa trên business behavior.

Hướng ưu tiên:

| Database concept | Domain representation dự kiến |
|---|---|
| users | `User` Entity/Aggregate |
| refresh_tokens | `RefreshToken` hoặc `RefreshSession` Entity nếu auth flow cần lifecycle trong Domain |
| user_settings | `UserSettings` Entity hoặc Value Object tùy convention |
| pomodoro | `Pomodoro` / `PomodoroConfig` Aggregate |
| pomodoro_history | `PomodoroHistory` Entity/record domain |
| playlists | `Playlist` Aggregate |
| media_items | `MediaItem` Entity |
| playlist_items | `PlaylistItem` Entity thuộc Playlist boundary hoặc independent entity tùy code hiện tại |

Đây là hướng phân tích, **không phải lệnh bắt buộc tạo đúng 8 class**.

Nếu codebase có aggregate design hợp lý hơn thì giữ design hiện tại.

---

# 5. DOMAIN MODULE ĐỀ XUẤT

Chỉ áp dụng nếu backend hiện tại chưa có convention khác.

```text
backend/src/domain/
├── user/
│   ├── entities/
│   ├── enums/
│   ├── value-objects/
│   └── repositories/
│
├── authentication/
│   ├── entities/
│   └── repositories/
│
├── pomodoro/
│   ├── entities/
│   ├── enums/
│   ├── value-objects/
│   ├── rules/
│   └── repositories/
│
└── playlist/
    ├── entities/
    ├── enums/
    ├── value-objects/
    ├── rules/
    └── repositories/
```

Không bắt buộc tạo tất cả folder.

Chỉ tạo folder khi có code thực tế cần đặt vào đó.

Có thể đặt `MediaItem` trong:

```text
domain/playlist/
```

nếu media hiện chỉ phục vụ playlist và codebase ưu tiên module boundary gọn.

Không tạo `domain/media/` chỉ vì database có bảng `media_items` nếu chưa có lý do nghiệp vụ đủ mạnh.

---

# 6. BUSINESS ENUMS

Dựa trên schema hiện tại, kiểm tra và bổ sung các enum Domain cần thiết.

## 6.1. UserStatus

Giá trị:

```text
ACTIVE
DISABLED
```

Không tự thêm:

```text
DELETED
SUSPENDED
PENDING
```

nếu code/schema hiện tại không có.

## 6.2. AuthProvider

Giá trị:

```text
LOCAL
GOOGLE
```

`provider_subject` chỉ có ý nghĩa với external OAuth provider.

Không đặt Google SDK hoặc OAuth implementation vào Domain.

## 6.3. PomodoroPhaseType

Giá trị:

```text
FOCUS
SHORT_BREAK
LONG_BREAK
```

## 6.4. PomodoroHistoryStatus

Giá trị:

```text
COMPLETED
ENDED_EARLY
CANCELLED
```

Không thêm `RUNNING` hoặc `PAUSED` vào history status nếu schema hiện tại không yêu cầu.

Timer runtime state không persist trong schema hiện tại.

## 6.5. PlaylistSourceType

Giá trị:

```text
MANUAL
YOUTUBE
```

## 6.6. MediaPlatform

Hiện tại:

```text
YOUTUBE
```

Không tạo abstraction multi-provider quá mức.

## 6.7. MediaAvailability

Giá trị:

```text
AVAILABLE
UNAVAILABLE
PRIVATE
DELETED
REGION_BLOCKED
UNKNOWN
```

---

# 7. USER DOMAIN

## 7.1. User Entity

Domain `User` phải phản ánh tối thiểu các thuộc tính nghiệp vụ tương ứng:

```text
id
email
displayName
passwordHash
authProvider
providerSubject
status
createdAt
updatedAt
```

Không đưa DB index hoặc column length vào Entity nếu đó chỉ là persistence concern.

Ví dụ:

```text
varchar(320)
varchar(255)
```

không tự động trở thành Domain rule.

Chỉ enforce giới hạn length trong Domain nếu code/product thật sự coi đó là business invariant.

## 7.2. Invariant của User

Cần xử lý đúng semantics giữa LOCAL và GOOGLE.

### LOCAL

Nếu hệ thống local login đang tồn tại:

```text
authProvider = LOCAL
```

thì `passwordHash` có thể được yêu cầu theo auth design hiện tại.

`providerSubject` thường phải null/undefined.

### GOOGLE

```text
authProvider = GOOGLE
providerSubject = Google sub
```

Không lưu hoặc xử lý Google credential trong Domain.

Không invent rule về password cho Google nếu auth implementation hiện tại chưa xác định.

## 7.3. User status behavior

Nếu codebase đã có behavior:

```text
disable()
activate()
```

thì giữ business transition ở Entity.

Nếu chưa có use case tương ứng, không cần tạo method chỉ để đẹp kiến trúc.

## 7.4. Email

Kiểm tra codebase có `Email` Value Object hay chưa.

Nếu đã có:
- reuse.

Nếu chưa có:
- chỉ tạo nếu project convention ưu tiên Value Object và có business value rõ;
- không thêm package email validation chỉ cho việc này.

Format validation thuần request có thể thuộc Presentation/Application tùy convention.

---

# 8. REFRESH TOKEN DOMAIN

Schema chỉ lưu:

```text
id
user_id
token_hash
expires_at
revoked_at
created_at
```

## 8.1. Security invariant

Domain/persistence model tuyệt đối không có field:

```text
rawToken
refreshTokenPlaintext
```

Database chỉ lưu hash.

## 8.2. Entity behavior

Nếu auth flow hiện tại đã coi refresh token lifecycle là Domain behavior, Entity có thể có các behavior thuần:

```text
isExpired(now)
isRevoked()
isActive(now)
revoke(at)
```

Phải inject/pass `now` vào method khi cần deterministic test.

Không gọi `new Date()` rải trong logic nếu project có clock abstraction hoặc test convention khác.

## 8.3. Rotation

Schema yêu cầu transaction:

```text
revoke/replace token cũ
+ create token mới
```

Nhưng transaction orchestration thuộc Application + Infrastructure UnitOfWork, không thuộc Domain Entity.

Domain chỉ giữ invariant của token.

Không implement:
- hashing algorithm;
- secure random;
- JWT generation;
- cookie;
- HTTP;
- crypto library

trong Domain.

---

# 9. USER SETTINGS DOMAIN

Thuộc tính:

```text
userId
locale
timezone
defaultPomodoroId
browserNotificationEnabled
soundNotificationEnabled
createdAt
updatedAt
```

Default schema:

```text
locale = vi
timezone = Asia/Ho_Chi_Minh
browserNotificationEnabled = false
soundNotificationEnabled = true
```

Phân biệt:

- Database default là persistence concern.
- Domain creation default chỉ nên duplicate nếu đó thực sự là default business behavior khi tạo mới.

Không để Domain phụ thuộc PostgreSQL default.

`defaultPomodoroId` có thể null.

Ownership của `defaultPomodoroId` với user cần được kiểm tra ở Application vì cần load Pomodoro.

---

# 10. POMODORO DOMAIN

Đây là một domain quan trọng và phải có invariant deterministic.

## 10.1. Pomodoro Entity/Aggregate

Thuộc tính:

```text
id
userId
name
focusDurationSeconds
shortBreakDurationSeconds
longBreakDurationSeconds
focusSessionsBeforeLongBreak
focusPlaylistId
breakPlaylistId
isDefault
createdAt
updatedAt
```

Nếu code/product dùng tên `PomodoroConfig`, giữ naming hiện có thay vì rename thành `Pomodoro`.

## 10.2. Duration invariant

Bắt buộc enforce:

```text
focusDurationSeconds > 0
shortBreakDurationSeconds > 0
longBreakDurationSeconds > 0
focusSessionsBeforeLongBreak >= 1
```

Không cho Entity tồn tại ở trạng thái invalid.

Các rule trên phải được enforce tại:
- factory/create;
- update method;
- hoặc constructor validation;

theo convention hiện tại.

Không chỉ dựa vào API validation.

## 10.3. Playlist optional

Cho phép:

```text
focusPlaylistId = null
breakPlaylistId = null
```

Pomodoro vẫn hợp lệ và hoạt động không cần music.

## 10.4. Playlist ownership

Rule:

```text
Playlist gắn vào Pomodoro phải thuộc đúng user.
```

Không để Pomodoro Entity tự truy DB.

Application sau này phải load/validate ownership trước khi gán.

Nếu codebase có pure domain policy nhận:

```text
Pomodoro
Playlist
```

thì có thể đặt pure rule ở Domain.

## 10.5. Default Pomodoro

Schema có:

```text
is_default
```

Nhưng invariant kiểu:

```text
mỗi user chỉ có 1 default Pomodoro
```

không được tự invent nếu schema/document không quy định unique constraint tương ứng.

Nếu Application hiện tại đã có rule này thì giữ.

Nếu chưa có thì không thêm chỉ vì field tên `is_default`.

## 10.6. Timer runtime state

Không tạo fields như:

```text
remainingSeconds
isPaused
currentPhaseStartedAt
tick
currentPlayerTime
```

trong persisted `Pomodoro` aggregate chỉ vì UI cần timer.

Schema cố ý không lưu timer tick/runtime session state.

---

# 11. POMODORO HISTORY DOMAIN

## 11.1. Mục đích

History phải phản ánh phase đã kết thúc và giữ snapshot tối thiểu để config bị sửa/xóa không làm thay đổi lịch sử.

Thuộc tính:

```text
id
userId
pomodoroId?
phaseType
plannedDurationSeconds
actualDurationSeconds
status
startedAt
endedAt
```

`pomodoroId` phải cho phép null nếu cấu hình gốc đã bị xóa.

## 11.2. Duration invariant

Bắt buộc:

```text
plannedDurationSeconds > 0
actualDurationSeconds >= 0
```

Schema ghi rõ `actual_duration_seconds` là thời gian thực tế.

Không tự ép:

```text
actualDurationSeconds <= plannedDurationSeconds
```

vì không có requirement nói timer không thể vượt planned duration.

## 11.3. Time invariant

Nên enforce nếu phù hợp code hiện tại:

```text
endedAt >= startedAt
```

Đây là consistency invariant tự nhiên của history record.

Nếu project cho phép zero-length cancelled phase thì:

```text
endedAt == startedAt
```

vẫn hợp lệ.

## 11.4. Status

Chỉ dùng:

```text
COMPLETED
ENDED_EARLY
CANCELLED
```

Không trộn runtime status vào history.

---

# 12. PLAYLIST DOMAIN

Playlist là aggregate nghiệp vụ chính của subsystem music.

## 12.1. Playlist Entity/Aggregate

Thuộc tính:

```text
id
userId
name
description?
thumbnailUrl?
sourceType
sourceExternalId?
sourceUrl?
lastSyncedAt?
createdAt
updatedAt
```

## 12.2. Source invariant

### MANUAL

Thông thường:

```text
sourceType = MANUAL
sourceExternalId = null
sourceUrl = null
```

### YOUTUBE

Playlist import từ YouTube cần source metadata để sync:

```text
sourceType = YOUTUBE
sourceExternalId
sourceUrl
```

Không hardcode YouTube URL parser vào Entity.

URL parsing/API fetch là external concern.

Chỉ enforce field presence nếu code hiện tại và use case đã xác định rõ lifecycle tạo playlist YouTube.

## 12.3. Playlist independence

Business invariant quan trọng:

```text
Playlist nội bộ độc lập với playlist YouTube nguồn.
```

Do đó Domain không có method nào ngụ ý mutation ngược lên YouTube.

Ví dụ không tạo:

```text
playlist.deleteFromYouTube()
playlist.renameYoutubePlaylist()
```

## 12.4. Sync semantics

Sync mặc định:

```text
không reset order nội bộ
không xóa bài user tự thêm
không thay đổi Pomodoro
video unavailable không làm fail toàn playlist
```

Tuy nhiên orchestration Sync cần external API + repository + transaction, nên sẽ thuộc Application/Infrastructure.

Domain chỉ expose behavior cần thiết để:
- append item mới;
- preserve item cũ;
- update source sync timestamp nếu phù hợp.

Không implement YouTube call trong Domain.

---

# 13. MEDIA ITEM DOMAIN

## 13.1. MediaItem Entity

Thuộc tính:

```text
id
platform
externalMediaId
title?
channelName?
durationSeconds?
thumbnailUrl?
sourceUrl
availability
metadata?
createdAt
updatedAt
```

## 13.2. Duration invariant

Nếu có duration:

```text
durationSeconds >= 0
```

Cho phép null/undefined nếu YouTube không trả được metadata.

## 13.3. Availability

Không coi:

```text
PRIVATE
DELETED
REGION_BLOCKED
UNAVAILABLE
```

là exception phá toàn playlist.

Đây là trạng thái hợp lệ của MediaItem.

Domain phải cho phép item tồn tại với các availability này.

## 13.4. Metadata

`metadata` chỉ là metadata phụ.

Không đặt business truth chính vào map/json tự do.

Nếu Domain hiện không cần metadata để xử lý business behavior:
- cân nhắc giữ metadata ở persistence/external mapping thay vì expose sâu vào Domain;
- nhưng không làm mất dữ liệu nếu kiến trúc hiện tại yêu cầu round-trip.

Không dùng `any`.

Nếu cần representation mở:
- dùng type an toàn phù hợp convention;
- không để object SDK YouTube leak vào Domain.

---

# 14. PLAYLIST ITEM DOMAIN

## 14.1. PlaylistItem

Thuộc tính:

```text
id
playlistId
mediaItemId
position
createdAt
updatedAt
```

## 14.2. Position invariant

Bắt buộc:

```text
position >= 0
```

Schema có unique:

```text
(playlist_id, position)
```

nhưng unique constraint là persistence protection.

Domain/Application vẫn phải đảm bảo reorder không tạo trạng thái logic sai.

## 14.3. Duplicate media item

Schema chỉ có index:

```text
(playlist_id, media_item_id)
```

không phải unique.

Vì vậy **không được tự invent rule**:

```text
một media item chỉ được xuất hiện một lần trong playlist
```

Nếu product muốn duplicate bài thì schema hiện cho phép.

Không cấm duplicate trong Domain nếu requirement/code không nói.

---

# 15. REORDER PLAYLIST — PHÂN CHIA TRÁCH NHIỆM

Business requirement:

```text
Reorder playlist phải không tạo duplicate position.
```

Domain có thể cung cấp pure function/rule nếu thật sự hữu ích:

```text
reorderItems(items, orderedItemIds)
```

với invariant:

- input item IDs phải thuộc playlist đang reorder;
- không missing item;
- không duplicate ID;
- output position deterministic;
- position liên tục theo convention hiện tại.

Nhưng:

```text
transaction
locking
database update order
unique constraint workaround
commit/rollback
```

không thuộc Domain.

Application/Infrastructure sẽ xử lý atomicity sau.

Không thêm Domain Service nếu Aggregate method đã đủ.

---

# 16. REPOSITORY CONTRACTS

Chỉ tạo repository interface trong Domain nếu codebase hiện tại dùng convention này.

Nếu project đặt repository port ở Application thì:
- không chuyển vào Domain;
- plan Domain task không được tự đổi convention.

Nếu Domain repository contract là convention hiện tại, xem xét các contract tối thiểu theo consumer thực tế:

```text
UserRepository
RefreshTokenRepository
UserSettingsRepository
PomodoroRepository
PomodoroHistoryRepository
PlaylistRepository
MediaItemRepository
```

`PlaylistItemRepository` chỉ tách riêng nếu architecture hiện tại cần.

Nếu Playlist là Aggregate Root quản lý item:
- repository có thể persist cả Playlist + Items;
- không cần repository cho mỗi entity.

## 16.1. Repository contract không được chứa ORM

Sai:

```ts
findOne(options: TypeOrmFindOptions)
save(entity: Prisma.Playlist)
```

Đúng về boundary:

```ts
findById(id)
save(domainEntity)
```

Tên method cụ thể phải theo convention hiện tại.

## 16.2. Không design repository API “cho tương lai”

Chỉ khai báo method có consumer rõ hoặc cần cho immediate next layer.

Không tạo 30 method CRUD chỉ vì database có bảng.

---

# 17. DOMAIN ERROR / INVARIANT ERROR

Reuse exception/error system hiện có.

Không tạo hệ exception song song nếu project đã có:

```text
DomainError
BusinessError
ValidationError
```

Các invariant cần lỗi rõ ràng, ví dụ về semantics:

```text
InvalidPomodoroDuration
InvalidFocusSessionsBeforeLongBreak
InvalidPlaylistPosition
InvalidMediaDuration
InvalidPomodoroHistoryRange
```

Tên chính xác phải theo convention project.

Không expose:
- SQL;
- PostgreSQL;
- ORM;
- HTTP status

từ Domain error.

Nếu codebase đang dùng một generic `DomainValidationError` với error code thì giữ convention đó, không bắt buộc tạo class cho mỗi invariant.

---

# 18. VALUE OBJECTS — CHỈ TẠO KHI CÓ GIÁ TRỊ

Codex phải tránh over-engineering.

Có thể cân nhắc Value Object cho:

```text
Email
DurationSeconds
PlaylistPosition
ExternalMediaId
```

nhưng chỉ tạo khi:

- codebase đã dùng Value Object pattern;
- object có invariant/behavior thật;
- giúp loại duplicate validation;
- không làm mapping phức tạp vô ích.

Không tạo Value Object chỉ để bọc:

```text
string
number
```

mà không có behavior hoặc invariant đáng kể.

Ưu tiên consistency với code hiện tại.

---

# 19. DOMAIN FACTORY / REHYDRATION

Nếu Entity cần phân biệt:

```text
tạo mới
vs
restore từ persistence
```

thì dùng convention hiện tại, ví dụ:

```text
Entity.create(...)
Entity.restore(...)
```

hoặc constructor/factory tương đương.

Quan trọng:

## New entity

- enforce invariant;
- set default business value khi cần;
- tạo timestamp/ID theo project convention.

## Rehydrated entity

- không được bypass invariant một cách tùy tiện;
- nhưng không phát sinh side effect;
- không reset timestamps;
- không tự đổi source/status.

Nếu UUID generation hiện ở Infrastructure/Application thì Domain không tự tạo UUID.

Không thêm UUID library mới chỉ để Entity tự sinh ID.

---

# 20. TIME HANDLING

Schema yêu cầu PostgreSQL `timestamptz`, nhưng Domain không được biết PostgreSQL.

Trong Domain:

- dùng time representation hiện tại của codebase;
- giữ timezone-safe semantics;
- không convert sang local timezone bên trong Entity nếu không có business requirement.

Các logic phụ thuộc “hiện tại” nên test deterministic.

Nếu codebase có:

```text
Clock
TimeProvider
```

thì reuse.

Nếu chưa có và chỉ có 1–2 rule:

```text
isExpired(now)
```

thì truyền `now` vào method thay vì tạo Clock abstraction mới.

---

# 21. NHỮNG THỨ CỐ Ý KHÔNG IMPLEMENT TRONG DOMAIN PHASE NÀY

Theo schema hiện tại, tuyệt đối không tự tạo các persistence/domain module sau nếu code/product chưa có requirement:

```text
ExternalPlaylistSource
PlaylistImportJob
PlaylistImportItem
PlaylistSyncRun
PlaybackState persisted entity
PlaylistPlaybackCursor
PomodoroSession persisted entity
PomodoroPhase persisted entity
```

Database hiện cố ý chưa có các bảng:

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

Không “chuẩn bị sẵn cho tương lai”.

---

# 22. DỮ LIỆU KHÔNG ĐƯỢC BIẾN THÀNH PERSISTED DOMAIN ENTITY

Không tạo persisted Domain Entity cho:

```text
YouTube search result tạm thời
YouTube playlist preview trước import
timer tick từng giây
current playback progress
shuffle queue runtime
raw access token
raw refresh token
YouTube API key
video/audio binary
```

YouTube preview/search có thể có Application output model sau này, nhưng không phải persistent aggregate trong task Domain này.

---

# 23. TRANSACTION — KHÔNG IMPLEMENT TRONG DOMAIN

`DATABASE_SCHEMA.md` yêu cầu transaction cho:

```text
Import playlist:
Create playlist
+ Create/Reuse media_items
+ Create playlist_items

Reorder playlist:
Update nhiều playlist_items.position

Delete playlist item:
Delete item
+ normalize position nếu cần

Refresh token:
Revoke/replace token cũ
+ Create token mới
```

Đây là transaction boundary của Application/Infrastructure.

Domain phase chỉ cần:
- invariant;
- pure state transition;
- repository contracts nếu đúng convention.

Không import UnitOfWork concrete hoặc ORM transaction vào Domain.

---

# 24. TEST PLAN — DOMAIN UNIT TESTS

Tạo/update unit tests theo convention hiện tại.

Không cần DB, Nest application hoặc network.

Tests phải deterministic.

## 24.1. Pomodoro

Bắt buộc cover:

```text
focusDurationSeconds > 0
shortBreakDurationSeconds > 0
longBreakDurationSeconds > 0
focusSessionsBeforeLongBreak >= 1
```

Negative cases:

```text
0
negative number
```

Playlist IDs null vẫn tạo Pomodoro hợp lệ.

Update duration invalid phải bị reject.

Nếu có update method:
- entity không được rơi vào trạng thái invalid sau exception.

## 24.2. PomodoroHistory

Cover:

```text
plannedDurationSeconds > 0
actualDurationSeconds >= 0
endedAt >= startedAt
pomodoroId nullable
```

Status cover:

```text
COMPLETED
ENDED_EARLY
CANCELLED
```

## 24.3. PlaylistItem

Cover:

```text
position = 0 -> valid
position > 0 -> valid
position < 0 -> invalid
```

Nếu có reorder pure rule:
- deterministic;
- no duplicate position;
- reject duplicate item IDs;
- reject missing/foreign item IDs theo chosen contract.

## 24.4. MediaItem

Cover:

```text
duration undefined/null -> valid
duration = 0 -> valid
duration > 0 -> valid
duration < 0 -> invalid
```

Availability như:

```text
UNAVAILABLE
PRIVATE
DELETED
REGION_BLOCKED
UNKNOWN
```

vẫn là valid Domain state.

## 24.5. RefreshToken

Nếu Entity có lifecycle:

```text
active before expiry
expired at/after expiry theo convention rõ ràng
revoked token inactive
revoke sets revokedAt
```

Không test crypto/hash implementation ở Domain.

## 24.6. User

Test chỉ các invariant thật sự được implement.

Không viết test cho rule chưa có requirement.

---

# 25. FILE/CLASS RESPONSIBILITY

Mỗi file có một trách nhiệm rõ.

Ví dụ hợp lý nếu project dùng one-class-per-file:

```text
pomodoro.entity.ts
pomodoro-history.entity.ts
pomodoro-phase-type.enum.ts
pomodoro-history-status.enum.ts
playlist.entity.ts
playlist-item.entity.ts
media-item.entity.ts
media-availability.enum.ts
```

Nhưng không ép đổi convention nếu project đang tổ chức khác.

Không tạo:

```text
domain.utils.ts
helpers.ts
manager.ts
common.service.ts
```

để chứa business logic.

---

# 26. IMPLEMENTATION ORDER

Codex thực hiện theo thứ tự sau.

## Phase 1 — Audit

1. Đọc `AGENT_CODING_GUIDELINES.md`.
2. Đọc `DATABASE_SCHEMA.md`.
3. Đọc code Backend.
4. Lập bảng:

```text
Domain concept
→ existing implementation
→ missing
→ conflict with schema?
→ action
```

5. Chỉ sau đó mới sửa code.

## Phase 2 — Business enums

Tạo/reuse enum cần thiết.

Không duplicate enum ở nhiều module.

## Phase 3 — Core entities

Ưu tiên:

```text
User
Pomodoro
PomodoroHistory
Playlist
PlaylistItem
MediaItem
```

RefreshToken/UserSettings theo architecture auth/settings hiện tại.

## Phase 4 — Invariants

Enforce:

```text
Pomodoro durations
focus session count
history duration/time
playlist position
media duration
refresh-token lifecycle nếu thuộc Domain
```

## Phase 5 — Repository contracts

Chỉ thêm nếu Domain là nơi project hiện đặt repository abstraction.

## Phase 6 — Tests

Thêm unit tests cho toàn bộ invariant mới.

## Phase 7 — Quality gate

Chạy command thực tế của project:

```text
format
lint
type-check
unit test
build
```

Không invent command; đọc `package.json`.

## Phase 8 — Review diff

Kiểm tra:

- không có Infrastructure import trong Domain;
- không có NestJS decorator trong Domain;
- không có ORM decorator/entity trong Domain;
- không sửa migration;
- không sửa API;
- không thêm dependency vô lý;
- không tạo class cho requirement chưa tồn tại;
- không duplicate existing concept;
- tests deterministic.

---

# 27. ACCEPTANCE CRITERIA

Task Domain Layer hoàn thành khi:

## Architecture

- [ ] Domain không import NestJS.
- [ ] Domain không import ORM/database driver.
- [ ] Domain không import HTTP/Presentation DTO.
- [ ] Domain không import YouTube/Google SDK.
- [ ] Không có Infrastructure implementation trong Domain.
- [ ] Module boundary bám codebase hiện tại.
- [ ] Không duplicate abstraction/source of truth.

## User/Auth

- [ ] `UserStatus` đúng phạm vi hiện tại.
- [ ] `AuthProvider` đúng phạm vi hiện tại.
- [ ] `providerSubject` không bị hiểu thành password/token.
- [ ] Raw refresh token không tồn tại trong persisted Domain representation.
- [ ] Refresh-token business lifecycle, nếu implement ở Domain, test deterministic.

## Pomodoro

- [ ] Duration Focus > 0.
- [ ] Duration Short Break > 0.
- [ ] Duration Long Break > 0.
- [ ] Focus sessions before long break >= 1.
- [ ] Focus/Break playlist có thể null.
- [ ] Không thêm persisted timer tick/runtime player state.
- [ ] Không để player dependency ảnh hưởng Pomodoro Entity.

## History

- [ ] Có snapshot `plannedDurationSeconds`.
- [ ] Có `actualDurationSeconds`.
- [ ] `pomodoroId` có thể null.
- [ ] Status chỉ dùng các giá trị schema hiện tại.
- [ ] Time/duration invariant được test.

## Playlist

- [ ] Playlist có MANUAL/YOUTUBE source semantics.
- [ ] Playlist YouTube vẫn là playlist nội bộ độc lập.
- [ ] Không có YouTube SDK/API call trong Domain.
- [ ] `PlaylistItem.position >= 0`.
- [ ] Không tự cấm duplicate `mediaItemId` nếu requirement không cấm.
- [ ] Media unavailable là trạng thái hợp lệ.

## Quality

- [ ] Không thêm over-engineered abstraction.
- [ ] Không có business logic trong `utils`.
- [ ] Naming rõ trách nhiệm.
- [ ] Unit tests deterministic.
- [ ] Lint pass.
- [ ] Type-check pass.
- [ ] Relevant tests pass.
- [ ] Build pass nếu applicable.
- [ ] Final diff không chứa accidental changes.

---

# 28. OUTPUT CODEx PHẢI TRẢ SAU KHI IMPLEMENT

Sau khi code xong, Codex phải báo cáo theo format:

```text
1. Architecture audited
   - Domain structure hiện tại
   - Convention đã reuse

2. Files created
   - path
   - responsibility

3. Files modified
   - path
   - reason

4. Domain model implemented
   - Entity
   - Value Object
   - Enum
   - Repository contract

5. Business invariants enforced
   - rule
   - location
   - test

6. Explicitly not implemented
   - application use case
   - ORM
   - migration
   - controller/API
   - YouTube adapter
   - player runtime persistence
   - excluded future entities

7. Verification
   - formatter
   - lint
   - type-check
   - unit test
   - build

8. Remaining issues
   - chỉ ghi issue thật sự chưa verify/resolve được
```

Không nói “done” nếu test hoặc type-check chưa chạy được.

Nếu command không chạy được do môi trường:
- ghi command đã thử;
- ghi lỗi thực tế;
- không che failure.

---

# 29. CÁC LỖI CODEX TUYỆT ĐỐI KHÔNG ĐƯỢC PHẠM

Không được:

```text
- Tạo TypeORM/Prisma model trong Domain.
- Dùng @Entity(), @Column(), @Injectable() trong Domain.
- Import ConfigService vào Domain.
- Import Repository implementation vào Domain.
- Gọi YouTube API trong Domain.
- Hash password/refresh token bằng provider SDK trong Entity nếu infrastructure/security đã chịu trách nhiệm.
- Đưa transaction vào Entity.
- Tạo persisted PomodoroSession/PomodoroPhase khi schema hiện tại cố ý không có.
- Tạo ExternalPlaylistSource entity khi source metadata hiện nằm trên Playlist.
- Tạo PlaybackState entity khi state hiện là client/runtime state.
- Tạo ImportJob/SyncRun chỉ để "sau này dùng".
- Cấm duplicate media trong playlist nếu requirement không nói.
- Ép `actualDurationSeconds <= plannedDurationSeconds` nếu requirement không nói.
- Tạo một repository cho mọi bảng một cách máy móc.
- Tạo Value Object cho mọi primitive chỉ để tăng abstraction.
- Sửa ngoài backend/domain nếu không cần.
- Sửa generated code.
- Thêm dependency không cần thiết.
- Xóa test để pipeline pass.
```

---

# 30. NGUYÊN TẮC CUỐI CÙNG

Mỗi quyết định phải tự hỏi:

```text
Đây có phải BUSINESS INVARIANT không?
→ Domain.

Đây có cần database/external context để kiểm tra không?
→ Application orchestration hoặc Domain rule nhận object/context từ ngoài.

Đây có phải transaction/query/ORM không?
→ Không thuộc Domain.

Đây có phải YouTube/Google/network/SDK không?
→ Không thuộc Domain.

Đây có phải timer/player runtime state không persist?
→ Không tạo persisted Domain Entity.

Schema có bảng này nhưng object không có behavior nghiệp vụ?
→ Không bắt buộc biến thành rich Entity.

Requirement hiện tại chưa cần?
→ Không implement "để dành".
```

Mục tiêu của phase này không phải tạo càng nhiều class càng tốt.

Mục tiêu là tạo một **Domain Layer nhỏ, đúng business rule, độc lập framework, deterministic, dễ test và đủ làm nền cho Application Layer tiếp theo**.
