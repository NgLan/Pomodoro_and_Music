# FRONTEND COMMON FOUNDATION IMPLEMENTATION PLAN

> Stack mục tiêu: **Next.js**.
>
> Mục tiêu: tạo toàn bộ foundation dùng chung trước khi implement màn hình nghiệp vụ, để mọi feature dùng cùng design token, component library, i18n, API client, error handling, notification, form và testing convention.
>
> Không implement Pomodoro/Playlist business screen trong phase common này.

## 1. Cấu trúc tham chiếu

```text
src/
├── app/
│   ├── layout.tsx
│   ├── providers.tsx
│   └── globals.css
├── features/
│   └── <feature>/
├── shared/
│   ├── config/
│   ├── constants/
│   ├── hooks/
│   ├── i18n/
│   ├── lib/
│   ├── providers/
│   ├── schemas/
│   ├── styles/
│   ├── types/
│   ├── ui/
│   └── utils/
└── api/
    ├── client/
    └── generated/
```

Không tạo folder trống chỉ để giống sơ đồ.

---

## 2. Phase 0 — Audit

Search trước:

```text
global styles
component library
Tailwind/theme config
cn()
i18n
toast
form library
query/data-fetch library
API client
OpenAPI generated code
error mapper
route constants
env config
test setup
```

Lập bảng:

```text
Concern
→ Existing?
→ Maintained?
→ Deprecated?
→ Reuse / Replace / Create?
```

Không cài package mới nếu project đã có equivalent.

---

## 3. Phase 1 — Design tokens

Folder:

```text
src/shared/styles/
├── tokens.css
├── typography.css
├── utilities.css
└── index.css
```

Nếu dùng Tailwind, map token vào theme.

Token bắt buộc:

```text
color
spacing
radius
border-width
shadow
font-family
font-size
font-weight
z-index
motion-duration
```

Palette nền:

```text
background       #FFF7E6
surface          #FFFDF7
surface-blue     #E7EFFD
primary          #F4BD7A
primary-hover    #ECAE65
secondary        #AEECC6
accent-pink      #EC5E7A
accent-yellow    #FFE28A
accent-purple    #D7C8F5
text             #171B27
text-muted       #6C675F
border           #171B27
danger           #D94B4B
success          #3B9B68
warning          #D79A2B
info             #4F74C8
disabled         #D7D4CC
```

Visual style: **Warm Soft Neo-Brutalism**.

---

## 4. Phase 2 — Global CSS / reset

`app/globals.css` chỉ chứa:
- reset/base;
- CSS variables;
- body defaults;
- focus-visible baseline;
- selection;
- reduced-motion baseline.

Không viết feature CSS global.

Nếu dùng Tailwind:
- ưu tiên utility class;
- `cn()` cho conditional merge;
- chỉ viết custom CSS khi thật sự cần.

---

## 5. Phase 3 — Component library / registry

Rule lớn nhất:

**Không tự viết lại component chung nếu official registry/library hiện tại đã có.**

Trước khi code Button/Dialog/Popover/Tooltip/Select/Sheet/Dropdown/Checkbox/Switch/Tabs/Accordion/Slider:

```text
1. Search src/shared/ui.
2. Check installed UI library.
3. Check official registry.
4. Check existing headless primitives.
5. Add/download từ official source.
6. Chỉ custom nếu thực sự thiếu.
```

Nếu dùng shadcn/ui:

```text
npx shadcn@latest add button
npx shadcn@latest add dialog
...
```

Không copy component từ random blog/GitHub snippet.

Không dùng API/component deprecated.

---

## 6. Phase 4 — Shared UI primitives

Sau khi add từ registry/library:

```text
src/shared/ui/
├── button/
├── input/
├── textarea/
├── dialog/
├── sheet/
├── dropdown-menu/
├── tooltip/
├── tabs/
├── checkbox/
├── switch/
├── slider/
├── progress/
├── skeleton/
├── badge/
├── card/
├── alert/
└── toast/
```

Custom project-level component có thể gồm:

```text
NeoCard
NeoButton variant
DoodleAccent
PageHeader
SectionHeader
EmptyState
ErrorState
LoadingBlock
```

Nhưng không duplicate primitive library.

Wrapper chỉ tạo khi thêm giá trị:
- design token;
- default accessibility;
- common behavior;
- analytics;
- project-level variants.

Không wrap 1:1 chỉ để đổi tên.

---

## 7. Phase 5 — `cn()` / class composition

```text
src/shared/lib/
└── cn.ts
```

Chỉ một helper class merge.

Không tạo đồng thời `cx`, `mergeClasses`, `classNames` ở nhiều nơi.

---

## 8. Phase 6 — Frontend config

```text
src/shared/config/
├── env.ts
├── app.ts
├── routes.ts
├── feature-flags.ts
└── index.ts
```

### Env

Ví dụ:

```text
NEXT_PUBLIC_API_BASE_URL
NEXT_PUBLIC_APP_ENV
```

Rule:
- Validate env.
- Không expose database URL/JWT secret/YouTube secret/private key.
- Không đọc env rải rác trong component.

### Routes

Centralize route:

```text
HOME
POMODORO
PLAYLISTS
PLAYLIST_DETAIL(id)
HISTORY
SETTINGS
```

Không hardcode path ở nhiều nơi.

---

## 9. Phase 7 — i18n

Folder:

```text
src/shared/i18n/
├── config.ts
├── types.ts
├── locales/
│   ├── vi/
│   │   ├── common.json
│   │   ├── notifications.json
│   │   └── errors.json
│   └── en/
│       ├── common.json
│       ├── notifications.json
│       └── errors.json
└── index.ts
```

Feature namespace tạo khi feature bắt đầu:

```text
pomodoro.json
playlist.json
youtube-import.json
history.json
```

Rules:
- Không hardcode user-facing text.
- Dynamic value dùng interpolation.
- Backend `error_code` map sang `errors.json`.
- Namespace đăng ký tập trung.
- Fallback locale rõ.
- Type-safe key nếu library hỗ trợ.

Key convention:

```text
BTN_SAVE
BTN_CANCEL
TXT_EMPTY
MSG_SUCCESS
EMAIL_LABEL
SEARCH_PLACEHOLDER
```

---

## 10. Phase 8 — API contract generation

Backend NestJS export OpenAPI.

Frontend flow:

```text
OpenAPI
→ generated API client
→ generated TypeScript types
→ generated Zod schemas
```

Folder:

```text
src/api/
├── generated/
├── client/
│   ├── config.ts
│   ├── interceptors.ts
│   └── index.ts
└── index.ts
```

Rules:
- `generated/` không sửa tay.
- Không duplicate Request/Response interface.
- Regenerate bằng script.
- API base URL central.
- X-Request-ID central.
- Auth/401 handling central khi auth implement.

Scripts:

```text
api:generate
api:check
```

---

## 11. Phase 9 — API error normalization

```text
src/shared/lib/
├── api-error.ts
└── error-message.ts
```

App-facing error:

```text
status
errorCode
message
details
requestId
```

Không để raw fetch/Axios/generated-client error object leak vào feature.

Không dùng raw backend English message làm UI truth nếu đã có stable `error_code`.

---

## 12. Phase 10 — Notification

```text
src/shared/hooks/
└── use-app-notification.ts

src/shared/providers/
└── notification-provider.tsx
```

API semantic:

```text
success(key, params?)
error(errorCode | key, params?)
warning(key, params?)
info(key, params?)
```

Rules:
- Không gọi toast library trực tiếp ở mọi feature nếu wrapper đã có.
- Notification phải dùng i18n.
- Không dùng toast làm field validation.

---

## 13. Phase 11 — Form foundation

Chọn form library đang được maintain và phù hợp project.

Nếu project đã có library thì reuse.

Shared form:

```text
src/shared/ui/form/
├── FormField
├── FormLabel
├── FormControl
├── FormDescription
└── FormMessage
```

Rules:
- Generated Zod schema được reuse khi phù hợp.
- UI-specific rule có thể compose/extend schema.
- Không duplicate backend request schema bằng tay nếu generator đã tạo.
- Không tạo `BaseForm` khổng lồ.
- Accessible relation label/input/error.

---

## 14. Phase 12 — Server-state/data-fetch foundation

Nếu dùng query library:
- setup provider một lần;
- retry policy hợp lý;
- stale-time defaults;
- error normalization;
- devtools chỉ development.

```text
src/shared/providers/
└── query-provider.tsx
```

Không đưa:
- timer tick;
- player currentTime;
- modal open state;

vào server-state library.

---

## 15. Phase 13 — Global providers

```text
src/app/providers.tsx
```

Compose:

```text
I18nProvider
QueryProvider
NotificationProvider
ThemeProvider nếu có
AuthProvider khi auth implement
```

Giữ tree nhỏ.

Không đưa feature provider global nếu chỉ một page dùng.

---

## 16. Phase 14 — Layout primitives

```text
src/shared/ui/layout/
├── AppShell.tsx
├── PageContainer.tsx
├── PageHeader.tsx
├── Section.tsx
├── Stack.tsx
├── Inline.tsx
└── ResponsiveGrid.tsx
```

`AppShell` có thể quản lý:
- header;
- main;
- slot mini-player.

Không chứa business logic của Pomodoro/Playlist.

Không over-engineer layout abstraction.

---

## 17. Phase 15 — Standard UI states

```text
src/shared/ui/states/
├── LoadingState.tsx
├── EmptyState.tsx
├── ErrorState.tsx
└── NotFoundState.tsx
```

Rules:
- Initial loading → skeleton.
- Empty → explanation + next action.
- Error → friendly message + retry.
- Không full-screen spinner cho data fetch bình thường.

---

## 18. Phase 16 — Icon system

Chọn một icon library maintained.

Không mix nhiều icon library.

Wrapper chỉ khi cần:
- default size;
- stroke;
- accessibility.

Brand/doodle riêng có thể dùng SVG custom.

---

## 19. Phase 17 — Accessibility foundation

Global baseline:
- semantic landmarks;
- focus-visible;
- reduced motion;
- click target đủ lớn;
- icon button aria-label;
- modal/dialog giữ keyboard/focus behavior của underlying library.

Không phá accessibility primitive khi style lại component.

---

## 20. Phase 18 — Z-index tokens

Centralize:

```text
--z-base
--z-sticky
--z-dropdown
--z-overlay
--z-modal
--z-toast
```

Không dùng `99999`.

---

## 21. Phase 19 — Motion tokens

```text
--motion-fast: 120ms
--motion-normal: 180ms
--motion-slow: 280ms
```

Neo-brutal interaction:
- transform nhẹ;
- hard shadow offset.

Không animation excessive.

---

## 22. Phase 20 — Generic date/time utilities

```text
src/shared/utils/
├── date-time.ts
└── duration.ts
```

Chỉ generic:
- format datetime theo locale;
- format duration;
- parse ISO contract.

Không đặt Pomodoro state machine trong common util.

---

## 23. Phase 21 — Storage wrapper

Nếu cần persistence browser:

```text
src/shared/lib/storage/
├── storage.ts
└── storage-keys.ts
```

Rules:
- key central.
- parse/serialize safe.
- browser-only boundary rõ.
- không lưu secret/token nếu auth architecture không cho phép.
- persisted schema phức tạp cần version.

---

## 24. Phase 22 — Naming convention

### Component/type/class
`PascalCase`

```text
PlaylistCard
PomodoroTimer
ApiError
```

### Variable/function
`camelCase`

```text
currentPlaylist
handleSubmit
createPlaylist
```

### Boolean
```text
isLoading
hasError
canDelete
shouldPersist
```

### Internal handler
```text
handleStart
handleDeletePlaylist
```

### Callback prop
```text
onStart
onDeletePlaylist
```

### Hook
```text
useAppNotification
useMediaQuery
useDisclosure
```

### File
Component:
```text
PascalCase.tsx
```

Other:
```text
kebab-case.ts
```

Folder:
```text
kebab-case
```

Test:
```text
ComponentName.test.tsx
use-hook-name.test.ts
```

---

## 25. Phase 23 — Comment / TSDoc

Shared exported API không hiển nhiên phải có TSDoc.

Tag khi phù hợp:

```text
@param
@returns
@throws
@remarks
@example
@request
@response
```

Không comment JSX/className hiển nhiên.

Không tạo API mới đã deprecated ngay từ đầu.

---

## 26. Phase 24 — Deprecated check

Trước khi kết thúc common foundation:

```text
- Check Next.js docs theo version package.json.
- Check React docs theo version hiện tại.
- Check UI registry/library docs.
- Check query/form/i18n library docs.
- Search deprecation warning.
```

Không disable warning thay cho migration.

---

## 27. Phase 25 — Test foundation

Có thể colocate test hoặc dùng test folder theo convention project.

Cần setup:
- component render helper;
- provider wrapper;
- i18n wrapper;
- query wrapper;
- API mocks;
- deterministic timer mock;
- accessibility assertions khi phù hợp.

Tham chiếu:

```text
src/test/
├── render.tsx
├── providers.tsx
├── factories/
└── mocks/
```

Không tạo test helper chứa business logic.

---

## 28. Phase 26 — Tooling / CI

Scripts capability:

```text
format
lint
type-check
test
build
api:generate
api:check
```

CI:

```text
install
→ API contract check
→ lint
→ type-check
→ test
→ build
```

---

## 29. Thứ tự implement khuyến nghị

```text
1. Audit
2. Design tokens
3. Global CSS
4. Component library / registry
5. cn()
6. Config / routes
7. i18n
8. Generated API client + Type + Zod
9. API error normalization
10. Notification
11. Form foundation
12. Query/server-state provider
13. Global providers
14. Layout primitives
15. Standard UI states
16. Icon / accessibility / motion / z-index
17. Generic datetime/storage utilities
18. Test foundation
19. CI/tooling
```

Sau foundation mới bắt đầu:

```text
App Shell
→ Auth UI
→ Dashboard
→ Pomodoro
→ Playlist Library
→ Playlist Detail
→ YouTube Import
→ History
```

---

## 30. Definition of Done

- [ ] Warm Soft Neo-Brutalism token đã centralize.
- [ ] Không hardcode palette/spacing phổ biến.
- [ ] Component library setup từ official source.
- [ ] Agent search/download component có sẵn trước khi tự viết.
- [ ] Không dùng deprecated component/API.
- [ ] i18n hoạt động, không hardcode UI text.
- [ ] Env/config/routes centralize.
- [ ] OpenAPI → client/types/Zod generate được.
- [ ] Generated code không sửa tay.
- [ ] API error normalized.
- [ ] Notification wrapper dùng i18n.
- [ ] Form foundation hỗ trợ schema/error/accessibility.
- [ ] Loading/empty/error state có shared implementation.
- [ ] Global provider không chứa feature business logic.
- [ ] Naming thống nhất.
- [ ] Shared public API có docs khi cần.
- [ ] Accessibility baseline.
- [ ] Lint/type-check/test/build pass.
