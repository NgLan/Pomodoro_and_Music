# FRONTEND UI/UX & IMPLEMENTATION GUIDELINES

> Áp dụng cho Frontend của **Cappucino không đá không đường**.
>
> Stack: **Next.js**.
>
> Phong cách giao diện: **Warm Soft Neo-Brutalism / Hand-drawn Neo-Brutalism** — neo-brutalism mềm, nền kem ấm, viền đen đậm, hard shadow lệch, màu pastel, bo góc vừa và doodle nhẹ.

## 1. Mục tiêu trải nghiệm

Giao diện phải:
- Ấm, dễ tập trung.
- Playful nhưng không trẻ con.
- Timer là trung tâm.
- Music player luôn dễ truy cập nhưng không lấn át.
- Thao tác ít bước.
- Không làm gián đoạn timer khi user đổi bài/playlist.
- Không biến thành dashboard enterprise lạnh hoặc UI game quá nặng.

## 2. Design language

Công thức visual chính:

```text
Warm cream background
+ thick dark border
+ offset hard shadow
+ pastel surfaces
+ medium rounded corners
+ simple doodle accents
+ large readable typography
```

Không dùng:
- neon gradient làm style chính;
- glassmorphism diện rộng;
- shadow blur mềm kiểu Material làm primary shadow;
- 3D realistic UI;
- quá nhiều decorative animation.

## 3. Color system

Không hardcode màu trong component. Dùng design token.

| Token | Hex | Vai trò |
|---|---:|---|
| `--color-bg` | `#FFF7E6` | nền app |
| `--color-surface` | `#FFFDF7` | card/panel |
| `--color-surface-blue` | `#E7EFFD` | input/info surface |
| `--color-primary` | `#F4BD7A` | CTA chính |
| `--color-primary-hover` | `#ECAE65` | hover CTA |
| `--color-secondary` | `#AEECC6` | accent xanh dịu |
| `--color-accent-pink` | `#EC5E7A` | progress/accent |
| `--color-accent-yellow` | `#FFE28A` | highlight |
| `--color-accent-purple` | `#D7C8F5` | accent phụ |
| `--color-text` | `#171B27` | text chính |
| `--color-text-muted` | `#6C675F` | text phụ |
| `--color-border` | `#171B27` | border/shadow |
| `--color-danger` | `#D94B4B` | destructive/error |
| `--color-success` | `#3B9B68` | success |
| `--color-warning` | `#D79A2B` | warning |
| `--color-info` | `#4F74C8` | info |
| `--color-disabled` | `#D7D4CC` | disabled |

Rules:
- Một screen không dùng quá nhiều accent mạnh.
- Primary CTA phải cùng hệ màu.
- Red chỉ cho destructive/error.
- Không truyền trạng thái chỉ bằng màu.
- Dark mode chỉ thêm khi hoàn thiện đầy đủ, không đảo màu máy móc.

## 4. Typography

Ưu tiên:
- Nunito Sans
- Manrope
- Inter

Scale tham chiếu:

```text
Timer/Display: 48–88px
Page title:    32–40px
Section title: 24–28px
Card title:    18–22px
Body:          15–17px
Caption:       12–14px
```

- Timer nên dùng tabular numerals.
- Body line-height >= 1.5.
- Không dùng quá nhiều font-weight.
- Không dùng all-caps cho đoạn dài.

## 5. Spacing

Scale:

```text
4 / 8 / 12 / 16 / 24 / 32 / 40 / 48 / 64
```

Desktop:
```text
max content width: 1280–1440px
page padding: 24–40px
main gap: 24px
```

Mobile:
```text
page padding: 16px
section gap: 24px
```

Không rải spacing ngẫu nhiên nếu không cần.

## 6. Border / Radius / Shadow

Border:
```text
2px–3px solid var(--color-border)
```

Radius:
```text
8 / 12 / 16 / 24px
```

Hard shadow:
```text
4px 5px 0 var(--color-border)
```

Large card:
```text
6px 8px 0 var(--color-border)
```

Hover:
- dịch nhẹ 1px;
- giảm shadow tương ứng.

Pressed:
- dịch sâu hơn;
- shadow gần 0.

## 7. App shell

```text
┌─────────────────────────────────────────────┐
│ Header / Brand / Navigation / User          │
├─────────────────────────────────────────────┤
│                                             │
│                Page Content                 │
│                                             │
├─────────────────────────────────────────────┤
│ Persistent Mini Player nếu đang phát        │
└─────────────────────────────────────────────┘
```

Mini-player không che content.

Header tối thiểu:
- Brand.
- Pomodoro.
- Playlists.
- History.
- User/menu nếu có auth.

## 8. Responsive

- Desktop: multi-column.
- Tablet: giảm cột.
- Mobile: một cột.
- Side panel → sheet/drawer trên mobile.
- Table quá rộng → list/card.
- Không chỉ shrink UI desktop.

## 9. Pomodoro Screen

Timer là hierarchy #1.

Desktop đề xuất:

```text
┌──────────────────────┬──────────────────────┐
│     Timer Card       │      Music Panel     │
│ FOCUS                │ playlist             │
│ 25:00                │ current track        │
│ round 2/4            │ controls / queue     │
│ Start Pause Stop     │                      │
└──────────────────────┴──────────────────────┘
│ Config/session summary                      │
└─────────────────────────────────────────────┘
```

Rules:
- Luôn nhìn thấy phase.
- Luôn thấy remaining time.
- Pause/Resume khác trạng thái rõ.
- Stop là destructive secondary action.
- Player lỗi không reset timer.
- Phase transition dùng feedback nhẹ.

## 10. Playlist Library

- Search + Create + Import ở header.
- Grid 3–4 card desktop.
- Thumbnail ratio thống nhất.
- Badge nguồn YouTube nhỏ.
- Card có title, item count, source, quick play, overflow menu.
- Không nhồi quá nhiều button trực tiếp trên card.

## 11. Playlist Detail

```text
Playlist Hero
├── Thumbnail
├── Title / description / source
└── Play / Shuffle / Sync / More

Toolbar
├── Search video
├── Add by URL
└── Sort/filter nếu cần

Track List
├── Drag handle
├── Thumbnail
├── Title
├── Channel/duration
└── Actions
```

Track đang phát phải rõ.

Drag-and-drop:
- có drag handle;
- có fallback keyboard nếu library hỗ trợ;
- không biến toàn row thành drag target nếu dễ click nhầm.

## 12. YouTube Import

Phong cách gần ảnh tham chiếu:
- board/card lớn nền cream;
- input URL lớn;
- CTA nổi bật;
- option thành hàng bên dưới;
- preview trong cùng flow.

Flow:

```text
Paste URL
→ Validate
→ Fetch Preview
→ Show Metadata + Items
→ Select/Deselect
→ Confirm Import
→ Progress
→ Result
```

Không import ngay khi paste URL.

Playlist dài phải hiển thị:
- progress;
- processed/total;
- unavailable count;
- retry cho lỗi recoverable.

## 13. Component library: tuyệt đối ưu tiên tải/reuse

Trước khi tự viết Button/Dialog/Dropdown/Tooltip/Select/Sheet/Accordion/Popover/Checkbox/Switch/Tabs/Slider:

```text
1. Search src/shared/ui.
2. Kiểm tra library đã cài.
3. Kiểm tra official registry.
4. Kiểm tra headless primitives đã có.
5. Add/download từ official source.
6. Chỉ tự viết nếu thực sự không có.
```

Nếu project dùng shadcn/ui:
```text
npx shadcn@latest add <component>
```

Không copy component từ blog/random repository khi official source có sẵn.

Không tự viết lại primitive đã có chỉ để đổi style; ưu tiên variant/theme/wrapper nhỏ.

## 14. Deprecated UI/API

Trước khi dùng component hoặc API:
- kiểm tra docs version hiện tại;
- không dùng API marked deprecated;
- không dựa vào tutorial cũ hơn docs chính thức;
- nếu task chạm trực tiếp legacy deprecated component thì migrate trong scope hợp lý.

Không suppress deprecation warning để “cho qua”.

## 15. Shared folder

```text
src/
├── app/
├── features/
│   └── <feature>/
│       ├── components/
│       ├── hooks/
│       ├── schemas/
│       ├── services/
│       ├── state/
│       └── types/
├── shared/
│   ├── ui/
│   ├── hooks/
│   ├── utils/
│   ├── constants/
│   ├── config/
│   ├── i18n/
│   ├── types/
│   └── providers/
└── api/
    └── generated/
```

- Chỉ một feature dùng → ở feature.
- Hai feature độc lập trở lên dùng → cân nhắc shared.
- Không chuyển code vào shared chỉ vì “có thể dùng sau”.

## 16. i18n bắt buộc

Không hardcode user-facing text:
- heading;
- button;
- placeholder;
- tooltip;
- aria-label;
- toast;
- modal;
- validation;
- empty/error state.

Cấu trúc:

```text
src/shared/i18n/
├── config
├── locales/
│   ├── vi/
│   │   ├── common.json
│   │   ├── pomodoro.json
│   │   ├── playlist.json
│   │   ├── youtube-import.json
│   │   ├── notifications.json
│   │   └── errors.json
│   └── en/
└── types
```

Key: Quy tắc đặt tên key:
- `BTN_[ACTION]`: Cho các nút bấm/actions (ví dụ: `BTN_SAVE`, `BTN_CANCEL`, `BTN_SUBMIT`).
- `TXT_[NAME]`: Cho các tiêu đề, đoạn văn, văn bản chung (ví dụ: `TXT_WELCOME`, `TXT_DESCRIPTION`).
- `MSG_[TYPE]`: Cho các câu thông báo trạng thái/hệ thống (ví dụ: `MSG_SUCCESS`, `MSG_ERROR_NETWORK`).
- `[FIELD]_LABEL`: Cho nhãn của các trường input/form (ví dụ: `USERNAME_LABEL`, `PROJECT_NAME_LABEL`).
- `[FIELD]_PLACEHOLDER`: Cho văn bản placeholder gợi ý nhập (ví dụ: `EMAIL_PLACEHOLDER`, `SEARCH_PLACEHOLDER`).

VD:
```text
BTN_START
BTN_PAUSE
TXT_POMODORO_TITLE
PLAYLIST_NAME_LABEL
SEARCH_PLACEHOLDER
MSG_IMPORT_SUCCESS
```

Dynamic text dùng interpolation, không nối string.

Backend `error_code` map sang `errors.json`.

## 17. Form

Form phải có:
- schema validation;
- label;
- inline field error;
- submit loading;
- prevent duplicate submit;
- preserve input khi request recoverable fail;
- accessible relation giữa input và error.

Không dùng toast làm field validation duy nhất.

## 18. Loading / Empty / Error / Success

Initial loading:
- dùng skeleton;
- không dùng full-screen spinner cho fetch thông thường.

Empty:
- mô tả ngắn;
- action tiếp theo;
- doodle/illustration nhẹ nếu phù hợp.

Error:
- message thân thiện;
- retry nếu recoverable;
- không expose raw technical error.

Mutation:
- loading tại button/section;
- optimistic update chỉ khi rollback an toàn.

## 19. Accessibility

Tối thiểu:
- Semantic HTML.
- Keyboard navigation.
- Focus visible rõ.
- Input có label.
- Icon button có accessible name.
- Modal focus trap.
- Contrast đủ.
- Status không chỉ bằng màu.
- Reduced motion.
- Click target mobile đủ lớn.

## 20. Icon / illustration

- Chỉ một icon library chính.
- Không trộn nhiều style icon.
- Doodle chỉ decorative, không mang thông tin bắt buộc.
- SVG tối ưu.
- Stroke gần với độ đậm border UI.

## 21. Image / thumbnail

- Aspect ratio thống nhất.
- `object-fit` phù hợp.
- Có fallback.
- Lazy load list dài.
- Không tải ảnh quá lớn cho card nhỏ.

## 22. Motion

- Hover/press: 120–220ms.
- Modal/panel: 180–300ms.
- Ưu tiên transform/opacity.
- Timer không animate layout mỗi giây.
- Không animation quá nảy/gây mất tập trung.

## 23. Z-index

Centralize scale:

```text
base
sticky
dropdown
overlay
modal
toast
```

Không dùng `z-index: 999999`.

## 24. API contract / generated client

Flow:

```text
Backend OpenAPI
→ generated client
→ generated TypeScript types
→ generated Zod schemas nếu generator hỗ trợ
```

Không tự viết lại Request/Response type đã generate.

Không sửa `generated/` thủ công.

Feature service chỉ wrap generated client khi cần semantic abstraction/cache/mapping.

## 25. Frontend config

```text
src/shared/config/
├── env
├── routes
├── feature-flags
└── app
```

- Validate env.
- Chỉ public config mới được đưa client-side.
- Không expose secret.
- Không gọi env rải ở component.
- Không hardcode route ở nhiều nơi.

## 26. Naming convention

### Component/type/class
`PascalCase`

```text
PomodoroTimer
PlaylistCard
ImportPlaylistDialog
```

### Function/variable
`camelCase`

```text
handleStartPomodoro
createPlaylist
currentTrack
```

### Boolean
```text
isLoading
hasError
canEdit
shouldAutoPlay
```

### Event
Internal:
```text
handlePlay
handleDeletePlaylist
```

Callback prop:
```text
onPlay
onDeletePlaylist
```

### Hook
```text
usePomodoroTimer
usePlaylist
useYouTubeSearch
```

### File/folder
- Component: `PascalCase.tsx`
- Hook/service/schema/util/config: `kebab-case.ts`
- Folder: `kebab-case`
- Test: source name + `.test`

Không dùng `data.ts`, `helper.tsx`, `utils2.ts`.

## 27. Comment / TSDoc / annotation

Public hook/util/component API không hiển nhiên nên có doc.

Ví dụ:

```text
@param
@returns
@throws
@remarks
@example
@request
@response
```

Ví dụ:

```ts
/**
 * Tính thời gian còn lại từ end timestamp.
 *
 * @param endAt Thời điểm phase kết thúc.
 * @returns Số giây còn lại.
 * @remarks Timestamp là source of truth, không phải số lần interval tick.
 */
```

Không comment JSX hiển nhiên.

## 28. Performance

- Lazy load phần nặng.
- Virtualize playlist rất dài nếu cần.
- Timer không làm toàn page re-render mỗi giây.
- Không fetch metadata vô lý.
- Memoization chỉ khi có ích.
- Tối ưu image.
- Cân nhắc bundle cost khi thêm package.
- Player state và timer state phải tách subsystem.

## 29. State management

Phân biệt:
- server state;
- URL state;
- form state;
- local UI state;
- cross-feature state.

Không đưa mọi state vào global store.

Pomodoro runtime và Player runtime phải độc lập, giao tiếp qua explicit action/event khi cần.

## 30. Destructive action

Xóa playlist/config:
- confirm khi khó undo;
- dialog nói đúng object;
- destructive button dùng danger;
- Cancel dễ thấy.

Không confirm mọi action nhẹ.

## 31. Definition of Done FE

- [ ] Đúng Warm Soft Neo-Brutalism.
- [ ] Dùng design tokens.
- [ ] Responsive desktop/tablet/mobile.
- [ ] Search/reuse/download official component trước khi tự viết.
- [ ] Không dùng deprecated API/component.
- [ ] i18n đầy đủ, không hardcode UI text.
- [ ] Loading/empty/error/retry state đầy đủ.
- [ ] Accessibility cơ bản.
- [ ] Generated API code không duplicate/sửa tay.
- [ ] Naming đúng.
- [ ] Public shared API có documentation khi cần.
- [ ] Không expose secret.
- [ ] Timer không bị lỗi theo player.
- [ ] Lint/type-check/test/build pass.
