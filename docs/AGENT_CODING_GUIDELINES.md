# AGENT CODING GUIDELINES

## Quy định bắt buộc về kích thước và trách nhiệm

- Mỗi file mã nguồn không quá **120 dòng**, không tính file generated hoặc migration do công cụ sinh.
- Mỗi hàm hoặc method không quá **25 dòng**.
- Mỗi file chỉ giữ **một trách nhiệm duy nhất**; khi có nhiều vai trò phải tách thành các file có tên phản ánh đúng vai trò.
- Không lặp lại cùng một đoạn code ở nhiều nơi; phải tái sử dụng abstraction, component, hook, mapper, rule hoặc utility phù hợp đã có.
- Agent phải kiểm tra lại giới hạn dòng và mã trùng lặp trước khi kết thúc task.

> Dành cho AI Coding Agent và developer trong toàn bộ vòng đời đọc code, lập kế hoạch, implement, refactor, test và review.
> Tài liệu này **không phụ thuộc framework, ngôn ngữ hay nghiệp vụ**. Tên folder là cấu trúc tham chiếu; nếu codebase hiện tại dùng tên khác thì giữ convention hiện có.

## 1. Thứ tự ưu tiên

```text
Requirement hiện tại
→ Code đang chạy
→ Test / API contract / migration
→ Guideline này
→ Tài liệu cũ
```

- Không suy đoán architecture khi chưa đọc code.
- Không phá behavior đang hoạt động nếu task không yêu cầu.
- Không refactor lan rộng ngoài scope.
- Không duplicate source of truth.
- Không bỏ validation, authorization, transaction, logging hoặc test để “làm cho chạy”.
- Không over-engineering.

## 2. Cấu trúc Clean Architecture tham chiếu

```text
src/
├── domain/
│   └── <module>/
│       ├── entities/
│       ├── value_objects/
│       ├── enums/
│       ├── repositories/
│       └── rules/
├── application/
│   └── <module>/
│       ├── input/
│       ├── output/
│       ├── ports/
│       ├── interfaces/
│       └── services/
├── infrastructure/
│   ├── persistence/
│   ├── external/
│   ├── storage/
│   ├── cache/
│   ├── queue/
│   ├── security/
│   └── observability/
├── presentation/
│   ├── api/
│   ├── controllers/
│   ├── dto/
│   ├── dependencies/
│   └── middleware/
├── common/
│   ├── config/
│   ├── constants/
│   ├── exceptions/
│   ├── logging/
│   ├── types/
│   └── utils/
└── composition_root/
    └── dependency_wiring/

tests/
├── unit/
├── integration/
├── contract/
└── e2e/
```

Chỉ tạo folder khi có responsibility thực tế.

## 3. Responsibility từng layer

### `domain/`
Chứa business truth: Entity, Value Object, enum nghiệp vụ, invariant, domain rule, repository interface khi cần.

**Không import** HTTP/UI framework, ORM, DB driver, SDK, cache, queue, presentation DTO hay infrastructure implementation.

### `application/`
Chứa use case/orchestration, application input/output, port/interface, transaction boundary, authorization policy ở mức use case.

**Không** query ORM trực tiếp, không khởi tạo DB client, không gọi concrete provider nếu đã có abstraction.

### `infrastructure/`
Chứa database/ORM, repository implementation, external API, storage, cache, queue, security provider, AI provider, observability adapter.

Phải translate model/exception của third party trước khi trả vào inner layer.

### `presentation/`
Chỉ:
```text
Receive input
→ validate shape
→ map input
→ call application
→ map output
→ response
```

Không chứa business rule hoặc persistence logic.

### `composition_root/`
Chỉ dependency wiring. Không business logic.

## 4. Common-first nhưng không common-everything

Trước feature đầu tiên, cần audit và chuẩn hóa các cross-cutting concern:

```text
common/
├── config/
├── constants/
├── exceptions/
├── logging/
├── types/
└── utils/
```

Chỉ đưa code vào `common/` khi:
- dùng ở ít nhất 2 module độc lập; hoặc
- là concern toàn hệ thống; hoặc
- cần một source of truth thống nhất.

Không đưa business logic, feature-specific validation, repository cụ thể hoặc external-provider workflow vào common.

Trước khi tạo common mới, **search toàn repository** để tránh duplicate.

Phân loại `common/` theo khả năng tái sử dụng và ownership, không áp dụng máy móc theo dependency:

- ưu tiên code thuần, không chứa business logic hay provider-specific logic;
- NestJS DTO, decorator, global filter, middleware, interceptor, pipe, validation mapping và logging/config cross-cutting có thể đặt ở `common/` khi thực sự dùng chung toàn ứng dụng; dependency NestJS/Swagger/class-validator tự nó không phải lý do bắt buộc chuyển file ra ngoài;
- code feature-specific chỉ phục vụ một API/module đặt ở Presentation hoặc module sở hữu nó;
- code phụ thuộc ORM, database driver, external provider hoặc SDK tích hợp phải đặt ở Infrastructure;
- không chuyển nguyên cả thư mục ra khỏi `common/` chỉ vì một vài file phụ thuộc framework; đánh giá từng file theo phạm vi tái sử dụng.

## 5. Naming convention

Nếu repository chưa có convention rõ, dùng nguyên tắc:

### Biến
Tên phải nói rõ dữ liệu.

```text
currentUser
remainingSeconds
playlistItems
isCompleted
hasPermission
canRetry
```

Tránh:
```text
data
obj
tmp
value1
flag
```

Boolean nên bắt đầu bằng `is`, `has`, `can`, `should`, `was`.

### Function/method
Dùng `Verb + Object/Intent`.

```text
createProject
calculateDuration
validatePermission
findActiveSession
mapToResponse
```

Tránh tên mơ hồ: `process`, `doWork`, `manage`, `handleStuff`.

### Class/type/interface
Tên theo role: `User`, `CreateUserInput`, `UserRepository`, `TokenProvider`.

Không dùng hậu tố `Helper`, `Manager`, `Utils` nếu không thật sự thể hiện responsibility.

### File
Tên phản ánh primary responsibility. Không tạo `misc`, `helpers`, `common-service`, `temp`, `service2`.

### Constant
Giá trị quan trọng phải có tên rõ:

```text
MAX_RETRY_COUNT
DEFAULT_PAGE_SIZE
TOKEN_TTL
MAX_UPLOAD_SIZE
```

## 6. Clean Code

- Một file/class/function có một trách nhiệm chính.
- Function có input/output rõ, hạn chế side effect và nesting.
- DRY business rule, validation rule, permission rule, config, error code, serialization rule.
- Không abstract chỉ vì hai đoạn code giống hình thức nhưng semantics khác.
- Ưu tiên explicit hơn magic/hidden behavior.
- Không dùng mutable global state khi có thể tránh.
- Không hardcode magic value lặp lại.

## 7. Comment và documentation

Comment giải thích **vì sao**, contract, invariant, trade-off, side effect, compatibility constraint hoặc workaround.

Không comment lại điều code đã nói rõ.

Public API/use case/interface/utility không hiển nhiên nên có documentation. Nếu hệ sinh thái hỗ trợ annotation/tag:

```text
@param / @arg
@returns
@throws / @raises
@request
@response
@remarks
@example
@deprecated
```

Chỉ dùng tag phù hợp; không thêm hình thức.

TODO phải có context rõ. Không dùng TODO để bỏ requirement đang bắt buộc.

## 8. Deprecated code và dependency lifecycle

- Không dùng API/component/package đã deprecated khi có replacement ổn định.
- Không copy code từ tutorial cũ mà không kiểm tra docs version hiện tại.
- Không suppress deprecation warning chỉ để build pass.
- Khi task chạm trực tiếp legacy deprecated code, ưu tiên migrate trong phạm vi hợp lý.
- Dependency mới phải được kiểm tra maintenance, license, security và cost.
- Không thêm package lớn cho helper nhỏ.
- Không dùng alpha/beta nếu không có lý do rõ.

## 9. DTO và model boundary

```text
Presentation Request DTO
→ Application Input
→ Domain Model
→ Persistence Model
```

Chiều trả về:

```text
Domain/Application Result
→ Application Output
→ Presentation Response DTO
```

Không dùng một model xuyên mọi layer nếu làm leak dependency.

Public contract phải type-safe, schema rõ, tránh `Any`/object tự do khi có thể mô hình hóa.

## 10. Validation

### Boundary/Presentation
Kiểm tra shape, required, type, format, range, syntax.

### Domain/Application
Kiểm tra invariant, state transition, permission, consistency, duplicate nghiệp vụ và rule cần context/DB.

Client validation không thay thế server validation.

## 11. Error handling

Nên có:

```text
common/exceptions/
├── app-error
├── business-error
├── infrastructure-error
├── error-code
└── error-mapping
```

Quy tắc:
1. Không swallow exception.
2. Không catch chỉ để throw lại y nguyên.
3. Catch ở layer có đủ context.
4. Infrastructure translate provider exception.
5. Không đổi lỗi kỹ thuật thành business error vô căn cứ.
6. Không trả default/null để che failure.
7. Không expose stack trace/query/credential ra client.
8. Public error code phải ổn định.
9. Preserve exception cause nếu runtime hỗ trợ.
10. `InfrastructureException` phải có error code kỹ thuật cụ thể theo failure, không gom mọi lỗi thành một mã `INFRASTRUCTURE_ERROR`.
11. Message/cause kỹ thuật chi tiết được giữ để developer quan sát trong log; Global Exception Filter phải thay public message của mọi `InfrastructureException` bằng cùng một thông báo chung, không expose query/provider/credential.
12. Ở code module/use case, ưu tiên throw để Global Exception Filter xử lý. Chỉ dùng `try/catch` khi cần translate lỗi provider ở Infrastructure boundary, bổ sung context có ý nghĩa, recovery có chủ đích hoặc cleanup tài nguyên; không catch chỉ để wrap/rethrow máy móc.

## 12. Configuration

Centralize configuration:

```text
common/config/
```

- Không đọc environment variable rải rác.
- Config bắt buộc thiếu → fail fast.
- Không có default secret.
- Validate type/format/range.
- Phân biệt public/client-visible config và server-only secret.
- Không hardcode environment-specific URL/credential.

## 13. Security

- Không hardcode hoặc commit secret.
- Không log password/token/API key/private key/Authorization header.
- Không lưu raw secret nếu chỉ cần hash.
- Validate authorization ở trusted boundary.
- Client/LLM/provider output đều là untrusted input.
- Dùng secure random cho token/security identifier.
- Không tự viết crypto nếu có thư viện chuẩn uy tín.
- Principle of Least Privilege.
- Sensitive value phải redact khỏi log/error.

## 14. Logging/tracing

Chuẩn hóa logger tại `common/logging/` hoặc concern tương đương.

Structured context nên có:

```text
request_id
correlation_id
operation
user_id nếu phù hợp
duration_ms
error_code
```

Không dùng `print`/console tùy tiện làm production logging.

## 15. Repository, DB và transaction

- Repository interface ở inner layer.
- Implementation ở infrastructure.
- Application không viết ORM query trực tiếp.
- Dynamic query phải whitelist field/operator.
- Không concatenate untrusted input vào query.
- Multi-write use case cần transaction boundary rõ.
- Không để mỗi repository tự commit nếu operation cần atomicity.

## 16. External provider / adapter

External dependency có ảnh hưởng application phải nằm sau port/interface khi phù hợp.

Adapter chịu trách nhiệm:
- request mapping;
- response mapping;
- timeout;
- bounded retry;
- exception translation;
- provider config.

Không leak SDK model vào Domain/Application.

## 17. API/public contract

- Request/response có schema rõ.
- Error format thống nhất.
- Không breaking change âm thầm.
- Nếu có generated client, source contract là source of truth.
- Không sửa generated code thủ công.
- Contract thay đổi → regenerate + contract test.

## 18. Generated code

Không sửa trực tiếp:

```text
generated/
dist/
build/
coverage/
```

Flow đúng:

```text
source contract/config
→ generator
→ generated artifact
```

Quy định bắt buộc khi project đã có generated contract/client/type/schema:

- Phải search và reuse request type, response type, enum, client function và validation schema đã generate trước khi khai báo type tương đương.
- Frontend không được tự viết lại model API đã tồn tại trong OpenAPI/generated output, kể cả khi cấu trúc tự viết chỉ là một subset của response.
- Type chỉ phục vụ UI/runtime cục bộ được phép khai báo riêng, nhưng phải compose từ generated type (`Pick`, `Omit`, intersection hoặc field reference) khi nó chứa dữ liệu thuộc API contract.
- Nếu generated artifact chưa có field/type cần dùng, phải cập nhật source contract ở Backend rồi chạy generator; không “vá tạm” bằng một contract song song ở Frontend.
- Feature service/mapper có thể đổi generated response thành view model, nhưng view model không được trở thành nguồn contract thứ hai cho request/response API.
- Review diff phải kiểm tra không có enum/DTO/interface API bị duplicate ngoài thư mục generated.

## 19. Concurrency/background job

- External I/O có timeout.
- Retry hữu hạn.
- Retryable job nên idempotent.
- Không retry blind operation có side effect.
- Shared mutable state phải được kiểm soát.
- Dùng transaction/version/constraint/idempotency/lock đúng bài toán.
- Không block execution model bằng I/O không phù hợp.

## 20. Database migration

Schema change phải qua migration mechanism.

Phải xem xét:
- existing data;
- nullable/default;
- FK/unique/index;
- backward compatibility;
- deployment order;
- rollback/forward-fix;
- migration trên bảng lớn.

## 21. Testing

```text
tests/
├── unit/
├── integration/
├── contract/
└── e2e/
```

- Unit: domain/application/pure logic.
- Integration: DB/provider/adapter.
- Contract: API/schema.
- E2E: business flow quan trọng.

Rule:
- Test behavior.
- Bug fix nên có regression test.
- Test deterministic.
- Không phụ thuộc real clock/random/network nếu inject/fake được.
- Không xóa test để pipeline pass.

## 22. Frontend module boundary chung

```text
src/
├── app/
├── features/
│   └── <feature>/
├── shared/
│   ├── ui/
│   ├── hooks/
│   ├── utils/
│   └── config/
└── api/
    └── generated/
```

- Một feature dùng → giữ trong feature.
- 2+ feature độc lập dùng → cân nhắc shared.
- UI component không chứa business workflow lớn.
- Loading/empty/error/retry state phải có.
- Generated API client không sửa tay.

Chi tiết i18n/design-system/component-library nằm ở Frontend guideline riêng.

## 23. Quy trình bắt buộc của Agent

```text
1. Đọc requirement.
2. Đọc code liên quan.
3. Xác định architecture/module boundary.
4. Search abstraction/common hiện có.
5. Xác định root cause/requirement gap.
6. Lập phạm vi thay đổi tối thiểu.
7. Implement đúng layer.
8. Update migration nếu cần.
9. Add/update tests.
10. Chạy formatter/linter/type-check/test/build liên quan.
11. Regenerate artifact nếu contract/schema đổi.
12. Review diff.
13. Kiểm tra accidental change.
14. Báo phần chưa verify được.
```

Trước khi tạo file mới, Agent phải tự hỏi:

```text
File tương đương đã có chưa?
Thuộc layer nào?
Thuộc module nào?
Có thực sự cần file mới không?
Tên file có nói rõ responsibility không?
```

## 24. Tuyệt đối không được làm

- Không tự thay architecture toàn project.
- Không chuyển business logic vào common/utils.
- Không để Domain import Infrastructure/Presentation.
- Không để Application phụ thuộc concrete provider khi đã có abstraction.
- Không để controller/UI query DB trực tiếp.
- Không duplicate DTO/contract/config/error code.
- Không sửa generated code thủ công.
- Không hardcode/log secret.
- Không swallow exception.
- Không catch-all rồi trả success/default.
- Không dùng deprecated API/component/package khi có replacement phù hợp.
- Không thêm dependency tùy tiện.
- Không xóa validation/test để pipeline xanh.
- Không sửa ngoài scope nếu không cần.
- Không invent requirement.
- Không tạo common mới trước khi search codebase.
- Không tạo abstraction “để dành cho tương lai”.

## 25. Definition of Done

### Architecture
- [ ] Code đúng layer/module.
- [ ] Dependency direction đúng.
- [ ] Không duplicate source of truth.
- [ ] Không leak framework/provider vào inner layer.

### Common/Foundation
- [ ] Reuse common hiện có.
- [ ] Không tạo helper/config/error/logger trùng.
- [ ] Common mới thực sự cross-cutting.

### Implementation
- [ ] Requirement đủ.
- [ ] Edge case chính được xử lý.
- [ ] Validation đúng boundary.
- [ ] Error handling đúng responsibility.
- [ ] Transaction đúng khi cần.
- [ ] Không dùng deprecated API/component.

### Security
- [ ] Authorization không bị bypass.
- [ ] Không hardcode/log secret.
- [ ] Input không đi thẳng vào query/command nguy hiểm.

### Quality
- [ ] Naming rõ.
- [ ] Documentation đúng chỗ.
- [ ] Không còn temp/debug code.
- [ ] Không thêm dependency/abstraction không cần.

### Tests & Tooling
- [ ] Test liên quan cập nhật.
- [ ] Regression test khi phù hợp.
- [ ] Test deterministic.
- [ ] Formatter/linter/type-check/test/build pass.
- [ ] Generated artifacts được regenerate nếu cần.

### Review
- [ ] Review diff cuối.
- [ ] Không accidental change.
- [ ] Không commit secret/debug/generated artifact sai.
- [ ] Ghi rõ phần chưa verify được.

## 26. Quy tắc đặt tên file Backend (NestJS + TypeORM)

Phần này dành riêng cho backend dùng NestJS và TypeORM:

- Tất cả tên file và thư mục dùng **kebab-case**; tên file phải thể hiện đúng vai trò, không dùng tên mơ hồ như helper, manager, data hoặc common service.
- Mỗi module đặt domain tại **modules/[module]/domain/**; không tạo lại domain nghiệp vụ ở **src/domain/**.
- Application dùng hậu tố **.service.ts**, **.service.interface.ts**, **.repository.interface.ts**, **.input.ts** và **.output.ts**. Service interface và repository interface không được đặt chung file; mỗi input/output có contract riêng.
- Presentation dùng **.controller.ts**, **.guard.ts**, **.decorator.ts**, **.request.dto.ts**, **.query.dto.ts** và **.response.dto.ts**. Request, query và response DTO không đặt chung file.
- Infrastructure database đặt entity trong **infrastructure/database/entities/**, mỗi file đúng một entity và có hậu tố **.orm-entity.ts**.
- TypeORM repository đặt trong **infrastructure/database/repositories/** với hậu tố **.repository.ts**; mapper đặt trong **infrastructure/database/mappers/** với hậu tố **.mapper.ts**.
- Security/external adapter dùng hậu tố mô tả provider, ví dụ **.provider.ts** hoặc **.adapter.ts**; dependency wiring giữ trong **.module.ts**.
- Tên file phải khớp primary export: pomodoro-history.controller.ts chứa PomodoroHistoryController; không gom nhiều primary class khác vai trò vào một file.
- Migration dùng timestamp ở đầu tên; test bám tên source và dùng hậu tố **.spec.ts**.
- File generated phải giữ nguyên tên/cấu trúc do generator tạo và không sửa thủ công.

## 27. Quy tắc cuối

```text
BUSINESS RULE?
→ domain/

USE CASE / ORCHESTRATION?
→ application/

DATABASE / NETWORK / PROVIDER IMPLEMENTATION?
→ infrastructure/

HTTP / UI / CLI / INPUT-OUTPUT BOUNDARY?
→ presentation/

GENERIC CROSS-CUTTING CONCERN?
→ common/

DEPENDENCY WIRING?
→ composition root
```

Nếu vẫn chưa rõ: **ưu tiên consistency với codebase hiện tại, không tự invent architecture mới.**
