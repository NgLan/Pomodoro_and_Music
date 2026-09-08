# CI/CD Clean Code Guidelines

> Quy chuẩn này độc lập với ngôn ngữ, framework, cloud và công cụ build. Tên
> stage chỉ mô tả trách nhiệm; repository có thể ánh xạ sang công cụ hiện có.

## 1. Nguyên tắc

- Pipeline là production code: phải review, test, version control và có owner.
- Một nguồn sự thật cho version, dependency lock, build command và artifact.
- Cùng một commit phải tạo ra cùng một artifact; không build khi deploy.
- Fail fast, không swallow lỗi, không dùng `continue-on-error` cho quality gate.
- Mỗi job có một trách nhiệm và tên mô tả outcome, không mô tả công cụ.
- Reuse template/component khi ít nhất hai pipeline có cùng semantics.
- Không tạo abstraction chỉ để che vài dòng lệnh dễ hiểu.
- Production chỉ nhận artifact đã qua toàn bộ quality gate.

## 2. Luồng chuẩn

```text
Change
-> validate configuration
-> deterministic dependencies
-> format/lint/static analysis
-> tests
-> build once
-> security checks
-> publish immutable artifact
-> migrate/release
-> deploy
-> verify health
```

Các stage độc lập được phép chạy song song. Stage sau chỉ chạy khi mọi dependency
bắt buộc thành công.

## 3. Pull request CI

- Chạy trên mọi thay đổi có thể ảnh hưởng artifact hoặc pipeline.
- Path filter phải bao gồm source, lock/config, shared contract và chính workflow.
- Không sử dụng production secret hoặc production data.
- Test phải deterministic; clock, random, network và external provider cần fake
  hoặc sandbox được kiểm soát.
- Commit mới hủy CI cũ của cùng pull request để tiết kiệm tài nguyên.
- Required checks phải bảo vệ branch phát hành.

## 4. Build và artifact

- Pin runtime/toolchain bằng source of truth được version control.
- Cài dependency từ lockfile bằng chế độ frozen/deterministic.
- Build một lần, promote cùng artifact qua các environment.
- Artifact có immutable identifier gắn với commit; alias như `latest` không được
  là định danh duy nhất.
- Artifact không chứa source thừa, test fixture, credential hoặc file local.
- Cache chỉ tối ưu tốc độ; cache miss không được làm thay đổi kết quả.
- Cache key phải phụ thuộc lock/config liên quan và không chứa secret.

## 5. Deployment

- Chỉ branch/tag phát hành được kích hoạt production deployment.
- Dùng environment protection cho secret, approval và deployment history.
- Không cancel deployment đang mutation production nếu không có cơ chế recovery.
- Data migration chạy đúng một lần trong release job, có lock/idempotency khi cần.
- Migration fail phải dừng deploy; thay đổi breaking phải chia phase tương thích.
- Sau deploy phải kiểm tra readiness hoặc smoke test có ý nghĩa.
- Timeout và retry phải hữu hạn; không blind retry operation có side effect.
- Rollback dùng immutable artifact trước đó; schema/data ưu tiên forward-fix.

## 6. Security

- Least privilege cho token, runner, registry và deployment identity.
- Pin action/plugin đáng tin cậy; ưu tiên immutable digest/commit khi phù hợp.
- Secret chỉ đến từ secret store, không nằm trong source, artifact, cache hay log.
- Không echo toàn bộ environment; redact URL/credential nhạy cảm trong lỗi.
- Không chạy code pull request không tin cậy trong privileged workflow context.
- Tách build validation không đặc quyền khỏi publish/deploy có đặc quyền.
- Kiểm tra dependency, artifact provenance và vulnerability theo mức rủi ro.

## 7. Clean configuration

- Tên workflow/job/step dùng `Verb + outcome` hoặc danh từ trách nhiệm rõ ràng.
- Biến môi trường có scope nhỏ nhất: step trước job, job trước workflow.
- Constant lặp lại phải centralize; expression phức tạp cần tên hoặc step riêng.
- Script nhiều nhánh/logic nên chuyển thành script có test thay vì YAML khó đọc.
- Comment giải thích lý do, constraint hoặc threat model; không diễn giải cú pháp.
- Không duplicate cùng lệnh build/test ở CI và CD; CD consume kết quả CI hoặc gọi
  reusable workflow chung.
- Giữ diff pipeline nhỏ, không trộn refactor hạ tầng ngoài scope.

## 8. Observability và vận hành

- Mỗi deployment ghi nhận commit, artifact, environment, actor và kết quả.
- Log stage/command rõ nhưng không lộ secret.
- Có timeout cho job và external I/O để tránh runner treo vô hạn.
- Health verification thất bại phải làm deployment thất bại rõ ràng.
- Alert phải actionable: nêu stage, artifact và run URL cần điều tra.
- Runbook phải ghi cách deploy thủ công an toàn, rollback và xử lý migration fail.

## 9. Definition of Done

- [ ] Trigger và path filter đúng phạm vi.
- [ ] Dependency install deterministic.
- [ ] Format/lint/static analysis/test/build đều là blocking gate.
- [ ] Artifact immutable và truy vết được về commit.
- [ ] Không build lại artifact giữa publish và deploy.
- [ ] Permission và secret dùng phạm vi nhỏ nhất.
- [ ] Migration/release failure dừng deployment.
- [ ] Có readiness/smoke verification và timeout.
- [ ] Có rollback/runbook rõ ràng.
- [ ] Pipeline syntax được validate và dry-run phần có thể chạy local.
- [ ] Diff cuối không chứa secret, debug code hoặc thay đổi ngoài scope.
