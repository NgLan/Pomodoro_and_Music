# BACKEND COMMON FOUNDATION IMPLEMENTATION PLAN

> Stack mục tiêu: **NestJS + PostgreSQL**.
>
> Mục tiêu: tạo nền tảng `common/` và cross-cutting concerns trước khi bắt đầu các module nghiệp vụ như Auth, Pomodoro, Playlist, YouTube Integration.
>
> Không nhét business logic vào common.

## 1. Cấu trúc tham chiếu

```text
src/
├── common/
│   ├── config/
│   ├── constants/
│   ├── decorators/
│   ├── dto/
│   ├── exceptions/
│   ├── filters/
│   ├── interceptors/
│   ├── logging/
│   ├── middleware/
│   ├── pipes/
│   ├── security/
│   ├── serialization/
│   ├── types/
│   ├── utils/
│   └── validation/
├── infrastructure/
│   └── database/
│       ├── migrations/
│       ├── transaction/
│       └── database.module.ts
├── presentation/
│   ├── health/
│   └── openapi/
├── modules/
│   └── <business-module>/
├── app.module.ts
└── main.ts

test/
├── unit/
├── integration/
├── contract/
└── e2e/
```

Chỉ tạo folder khi có code thực tế.

---

## 2. Phase 0 — Audit trước khi tạo common

Search toàn repository:

```text
ConfigModule / config service
logger
exception/filter
validation pipe
response interceptor
request ID
pagination DTO
base repository
transaction manager
OpenAPI
auth/security utilities
health endpoint
```

Lập bảng:

```text
Concern
→ Đã tồn tại?
→ Có đúng responsibility?
→ Có deprecated?
→ Reuse / Refactor / Create?
```

Không duplicate implementation đã tốt.

---

## 3. Phase 1 — Configuration

Folder:

```text
src/common/config/
├── app.config.ts
├── database.config.ts
├── auth.config.ts
├── youtube.config.ts
├── env.schema.ts
├── config.types.ts
└── index.ts
```

Rule:
- Dùng `@nestjs/config` API hiện hành.
- Validate env khi startup.
- Không đọc `process.env` rải ở module nghiệp vụ.
- Config bắt buộc thiếu → fail fast.
- Không có default secret.
- Config public/server-only phải phân biệt rõ.

Biến dự kiến:

```text
NODE_ENV
PORT
DATABASE_URL
JWT_ACCESS_SECRET
JWT_ACCESS_TTL
REFRESH_TOKEN_TTL
YOUTUBE_API_KEY
FRONTEND_ORIGIN
LOG_LEVEL
```

Test:
- thiếu required env;
- sai type;
- sai range;
- valid config boot được.

---

## 4. Phase 2 — Constants và Types

```text
src/common/constants/
├── app.constants.ts
├── headers.constants.ts
├── pagination.constants.ts
└── time.constants.ts

src/common/types/
├── nullable.type.ts
├── pagination.type.ts
├── request-context.type.ts
└── index.ts
```

Không đặt business enum như `PomodoroPhase` hoặc `PlaylistSource` vào common.

---

## 5. Phase 3 — Error system

```text
src/common/exceptions/
├── app.exception.ts
├── business.exception.ts
├── infrastructure.exception.ts
├── error-code.enum.ts
├── error-status.map.ts
├── error-detail.ts
└── index.ts

src/common/filters/
└── global-exception.filter.ts
```

Error response chuẩn:

```json
{
  "code": 400,
  "message": "Invalid request",
  "error_code": "INVALID_INPUT",
  "details": [
    {
      "field": "name",
      "message": "Name is required"
    }
  ],
  "request_id": "..."
}
```

Rules:
- Không tạo subclass riêng cho từng error code.
- Business error dùng stable error code.
- Infrastructure translate ORM/provider error.
- Unknown error → generic internal error.
- Không trả stack trace production.
- Preserve exception cause.
- Error message public không chứa secret/query.

Tests:
- mapping `ErrorCode → HTTP status` exhaustive;
- business exception;
- validation exception;
- infrastructure exception;
- unknown exception.

---

## 6. Phase 4 — Request context

```text
src/common/middleware/
└── request-context.middleware.ts

src/common/types/
└── request-context.type.ts

src/common/utils/
└── request-id.util.ts
```

Context tối thiểu:
```text
requestId
correlationId
```

Sau auth có thể thêm:
```text
userId
```

Rule:
- Nhận `X-Request-ID` hợp lệ hoặc generate.
- Echo lại response header.
- Async-safe.
- Không dùng mutable global.
- Logger đọc được context.

---

## 7. Phase 5 — Logging

```text
src/common/logging/
├── logger.module.ts
├── app-logger.service.ts
├── logging.types.ts
├── sensitive-data-redactor.ts
└── index.ts
```

Structured fields:

```text
event
request_id
correlation_id
user_id
operation
duration_ms
error_code
```

Cấm log:

```text
password
password_hash
access_token
refresh_token
authorization
api_key
secret
client_secret
```

Rules:
- Không `console.log` làm production logging.
- Wrapper/facade không business logic.
- Production output structured.
- HTTP access log không duplicate application log quá mức.
- `ERROR` phải giữ exception context.

---

## 8. Phase 6 — Validation

```text
src/common/pipes/
└── validation.pipe.ts

src/common/validation/
├── validation-error.mapper.ts
└── index.ts
```

Dùng NestJS ValidationPipe / validation library version hiện hành.

Rule:
- whitelist fields;
- strict unknown field theo contract;
- transform có kiểm soát;
- normalize error thành `details[]`;
- presentation validation không thay business validation.

Không tạo custom validator chung nếu chỉ một feature dùng.

---

## 9. Phase 7 — API Response & Pagination

```text
src/common/dto/
├── api-response.dto.ts
├── pagination-meta.dto.ts
├── paginated-response.dto.ts
├── sort-order.enum.ts
└── index.ts

src/common/interceptors/
└── response-envelope.interceptor.ts
```

Success envelope:

```json
{
  "status": "success",
  "code": 200,
  "message": "Success",
  "data": {}
}
```

Rule:
- Chỉ một nơi bọc envelope.
- Không double-wrap.
- Controller trả payload.
- Pagination không chứa DB logic.
- `sortBy` phải whitelist ở query/use case layer.

Constants:

```text
DEFAULT_PAGE = 1
DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100
```

---

## 10. Phase 8 — Serialization

```text
src/common/serialization/
├── serialization.interceptor.ts
├── serialization.types.ts
└── index.ts
```

Mục tiêu:
- Không leak persistence entity.
- Date/UUID serialize nhất quán.
- Không leak sensitive/internal field.
- Response contract explicit.

Không tạo magic serializer làm mất type safety.

---

## 11. Phase 9 — Common decorators

Chỉ tạo decorator thật sự cross-cutting:

```text
src/common/decorators/
├── public.decorator.ts
├── current-user.decorator.ts
├── request-id.decorator.ts
└── index.ts
```

Không tạo decorator chỉ để “trông đẹp”.

Không dùng NestJS metadata/decorator API đã deprecated.

---

## 12. Phase 10 — Security primitives

Có thể để generic primitive ở:

```text
src/common/security/
├── random-token.ts
├── token-hash.ts
└── security.constants.ts
```

Concrete auth implementation nên ở:

```text
src/modules/auth/
hoặc
src/infrastructure/security/
```

Rules:
- Không tự viết crypto.
- Dùng CSPRNG.
- Refresh token raw không lưu DB.
- Password hashing/JWT concrete không nhét bừa vào utils.
- Auth workflow không đặt trong common.

---

## 13. Phase 11 — Database foundation

```text
src/infrastructure/database/
├── database.module.ts
├── migrations/
├── transaction/
│   ├── unit-of-work.interface.ts
│   ├── unit-of-work.ts
│   └── transaction.types.ts
└── health/
```

Rules:
- Một pool/connection lifecycle.
- Migration là source of truth.
- Repository không tự tạo connection.
- Query parameterized.
- UTC/timezone-aware.
- Không auto-sync production nếu project dùng migration.
- ORM/query API phải là version hiện hành, không deprecated.

---

## 14. Phase 12 — Unit of Work / Transaction

Contract tối thiểu:

```text
execute(callback)
```

Implementation chịu:
- begin;
- commit;
- rollback.

Không expose third-party transaction object xuyên Application nếu Clean Architecture không cho phép.

Tests:
- commit khi success;
- rollback khi throw;
- preserve original exception.

---

## 15. Phase 13 — OpenAPI

NestJS OpenAPI là source contract cho frontend.

Yêu cầu:
- operationId ổn định;
- request DTO;
- response DTO;
- error schema;
- auth scheme;
- tags theo module;
- export deterministic artifact.

Flow:

```text
NestJS OpenAPI
→ frontend generated client
→ generated TS types
→ generated Zod schemas
```

Scripts gợi ý:

```text
api:openapi
api:check
```

Không sửa generated frontend code thủ công.

---

## 16. Phase 14 — Health

```text
src/presentation/health/
├── health.controller.ts
├── health.service.ts
└── health.module.ts
```

Endpoints:
```text
GET /health/live
GET /health/ready
```

- Liveness không gọi external YouTube.
- Readiness có thể check DB.
- Không leak config/secrets qua health response.

---

## 17. Phase 15 — Interceptors

Chỉ concern cross-cutting:

```text
src/common/interceptors/
├── response-envelope.interceptor.ts
├── timing.interceptor.ts
└── logging.interceptor.ts
```

Rule:
- Preserve return value.
- Re-throw exception.
- Không gọi DB/YouTube/business service.
- Không log sensitive body.
- Không duplicate middleware responsibility.

---

## 18. Phase 16 — Common utilities

```text
src/common/utils/
├── datetime.util.ts
├── identifier.util.ts
├── string.util.ts
└── array.util.ts
```

Chỉ generic, pure, stateless.

Không tạo:

```text
youtube.util.ts
playlist.util.ts
pomodoro.util.ts
user-helper.ts
```

Feature logic thuộc module tương ứng.

---

## 19. Phase 17 — Test foundation

```text
test/
├── unit/
│   └── common/
├── integration/
│   └── database/
├── contract/
└── e2e/
```

Cần helper cho:
- app bootstrap test;
- DB test lifecycle;
- auth test context sau này;
- request factory;
- deterministic clock nếu cần.

Không tạo test helper khổng lồ chứa business logic.

---

## 20. Phase 18 — Tooling / CI

Scripts capability:

```text
format
lint
type-check
test
test:unit
test:integration
test:e2e
build
api:openapi
api:check
```

CI:

```text
install
→ lint
→ type-check
→ test
→ build
→ OpenAPI contract check
```

---

## 21. Naming convention NestJS

### File/folder
`kebab-case`

```text
playlist.service.ts
playlist.controller.ts
create-playlist.dto.ts
```

### Class/type
`PascalCase`

```text
PlaylistService
CreatePlaylistDto
```

### Variable/function
`camelCase`

```text
createPlaylist
playlistId
```

### Boolean

```text
isActive
hasPermission
canRetry
```

### Constants
`UPPER_SNAKE_CASE`

NestJS suffix phải đúng role:

```text
*.controller.ts
*.service.ts
*.module.ts
*.guard.ts
*.filter.ts
*.interceptor.ts
*.pipe.ts
*.middleware.ts
*.decorator.ts
```

Không tạo `common.service.ts` mơ hồ.

---

## 22. Documentation / annotation

Public service/interface/utility phức tạp dùng TSDoc khi cần:

```text
@param
@returns
@throws
@remarks
@example
@request
@response
```

API controller dùng OpenAPI decorators hiện hành nếu project áp dụng.

Không dùng API/decorator deprecated.

---

## 23. Thứ tự implement khuyến nghị

```text
1. Config
2. Constants / Types
3. Error system
4. Request context
5. Logging
6. Validation
7. API Response / Pagination
8. Serialization
9. Database module
10. Transaction / UoW
11. Security primitives
12. OpenAPI
13. Health
14. Test foundation
15. CI / Tooling
```

Sau đó mới implement:

```text
Auth
→ Pomodoro
→ Playlist
→ YouTube Integration
→ History
```

---

## 24. Definition of Done

- [ ] Không duplicate common implementation.
- [ ] Không business logic trong common.
- [ ] Config validate startup.
- [ ] Không secret fallback.
- [ ] Global error format thống nhất.
- [ ] Request ID xuyên log/response.
- [ ] Sensitive log redaction.
- [ ] Validation error normalized.
- [ ] Success envelope thống nhất.
- [ ] Pagination/sorting type-safe.
- [ ] DB/migration foundation hoạt động.
- [ ] Transaction test pass.
- [ ] OpenAPI export deterministic.
- [ ] Frontend generate được client/types/Zod.
- [ ] Không dùng deprecated NestJS/library API.
- [ ] Lint/type-check/test/build pass.
