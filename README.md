# آرمونیا (Armonia)

پلتفرم یکپارچهٔ شبکهٔ کلینیک‌های زیبایی — **وب‌سایت عمومی بیماران** + **ERP سازمانی** با چندشعبه، RBAC نقش‌محور، و API پایدار.

**ریپو:** [github.com/mjpt1/armonia](https://github.com/mjpt1/armonia)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmjpt1%2Farmonia&root-directory=platform&env=DATABASE_URL,AUTH_SECRET&envDescription=DATABASE_URL%20(PostgreSQL%20on%20Vercel%2FNeon)%20and%20AUTH_SECRET%20required&project-name=armonia)

---

## فهرست مطالب

- [ساختار پروژه](#ساختار-پروژه)
- [Tech Stack](#tech-stack)
- [اجرای محلی](#اجرای-محلی)
- [حساب‌های دمو](#حساب‌های-دمو)
- [RBAC و داشبورد نقش‌محور](#rbac-و-داشبورد-نقش‌محور)
- [ماژول‌ها](#ماژول‌ها)
- [Deploy روی Vercel](#deploy-روی-vercel-اپ-واقعی--نه-html)
- [مستندات](#مستندات)

---

## ساختار پروژه

```
armonia/
├── platform/          ← اپ Next.js (کد اصلی — همین را deploy کنید)
│   ├── src/app/       ← وب عمومی + ERP + API
│   ├── prisma/        ← schema و seed
│   └── vercel.json
├── docs/              ← برند، معماری، ماتریس RBAC
├── assets/            ← لوگو، design tokens
├── web/               ← پروتوتایپ HTML وب‌سایت
├── preview/           ← Concept A/B (طراحی ERP)
└── *.html             ← پروتوتایپ HTML ماژول‌های ERP (فقط طراحی)
```

> **مهم:** فایل‌های `.html` در ریشه فقط **پروتوتایپ طراحی** هستند. اپ واقعی داخل پوشهٔ `platform/` است.

---

## Tech Stack

| لایه | فناوری |
|------|--------|
| Frontend | Next.js 15 · React 19 · TypeScript · Tailwind |
| Backend | Route Handlers · Prisma |
| DB (محلی) | SQLite (`platform/prisma/dev.db`) |
| DB (Production) | PostgreSQL (Neon / Vercel Postgres) |
| Auth | Session cookie + ماتریس RBAC |
| i18n / UI | فارسی RTL (پیش‌فرض) · Concept A (آرام، باز) |

---

## اجرای محلی

### پیش‌نیاز

- Node.js **20 LTS** (توصیه؛ Node 24 ممکن است کند باشد)
- npm

### دستورات

```powershell
cd platform
copy .env.example .env
npm install
npm run db:push
npm run seed
npm run dev
```

یا:

```powershell
cd platform
.\start-dev.ps1
```

| بخش | آدرس |
|------|------|
| وب عمومی | http://localhost:3000 |
| ERP | http://localhost:3000/erp |
| ورود | http://localhost:3000/erp/login |

جزئیات اسکریپت‌ها و API: [`platform/README.md`](platform/README.md)

---

## حساب‌های دمو

رمز پیش‌فرض: **`demo1234`** (برخی حساب‌ها: `armonia123`)

| ایمیل | نقش |
|--------|------|
| `ceo@armonia.local` | مدیرعامل (CEO) |
| `ops@armonia.local` | مدیر عملیات (OPS) |
| `sm@armonia.local` | مدیر فروش (SM) |
| `rec@armonia.local` | پذیرش (REC) |
| `doc@armonia.local` | پزشک (DOC) |
| `patient@armonia.local` | بیمار (PAT) |

در `/erp/login` می‌توانید با ایمیل/رمز یا انتخاب نقش وارد شوید. در هدر ERP، **سوییچر نقش دمو** منو و داشبورد را بر اساس RBAC عوض می‌کند.

---

## RBAC و داشبورد نقش‌محور

ماتریس کامل: [`docs/rbac-matrix.md`](docs/rbac-matrix.md)

| گروه نقش | داشبورد | نمونه منو |
|----------|---------|-----------|
| CEO / OPS | KPI سازمانی | همهٔ ماژول‌ها |
| فروش (SM/SA) | قیف لید و CRM | CRM · قرارداد · تیکت |
| بازاریابی (MM/ME/SOC/DES/VID) | کمپین‌ها | بازاریابی · تیکت |
| مالی (CFO/ACC) | دریافت / سود | مالی · قرارداد · بیماران |
| HR | پرسنل و پزشکان | HR · کاربران (خواندن) |
| مدیر شعبه/کلینیک (BM/CM) | عملکرد شعبه | عملیات محلی |
| پزشک / دستیار (DOC/AST) | برنامه نوبت امروز | نوبت · بیمار |
| پذیرش (REC) | صف نوبت + لید | نوبت · CRM محدود |
| بیمار (PAT) | نوبت‌های خود | تیکت · نوبت شخصی |

- منوی سایدبار بر اساس `canAccess(role, module)` فیلتر می‌شود.
- نقش‌های فقط‌خواندنی دکمهٔ ایجاد/ویرایش ندارند.
- تغییر نقش، کاربر دموی همان نقش را از DB بارگذاری و به صفحهٔ اصلی همان نقش هدایت می‌کند.

---

## ماژول‌ها

### وب‌سایت عمومی

خانه · خدمات · پزشکان · نمونه‌کار · بلاگ · رزرو · مشاوره · تماس · FAQ · پنل بیمار

### ERP

| مسیر | ماژول |
|------|--------|
| `/erp` | داشبورد نقش‌محور |
| `/erp/crm` | لید و قیف فروش |
| `/erp/contracts` | قراردادها |
| `/erp/appointments` | نوبت‌دهی + لیست انتظار |
| `/erp/patients` | بیماران |
| `/erp/doctors` | پزشکان |
| `/erp/clinics` | کلینیک‌ها |
| `/erp/branches` | شعب |
| `/erp/marketing` | کمپین و محتوا |
| `/erp/finance` | اقساط و تسویه |
| `/erp/hr` | پرسنل و حقوق |
| `/erp/tickets` | تیکت‌ها |
| `/erp/notifications` | اعلان‌ها |
| `/erp/users` | کاربران و RBAC |
| `/erp/settings` | تنظیمات / خدمات |

---

## Deploy روی Vercel (اپ واقعی — نه HTML)

> **هشدار:** اگر Root Directory را خالی بگذارید یا روی ریشه deploy کنید، فقط HTML دمو می‌بینید و API/دیتابیس کار نمی‌کند.  
> **حتماً Root Directory = `platform`**.

> **مهم:** SQLite فقط برای توسعهٔ محلی است. روی Vercel باید **PostgreSQL** استفاده کنید.

### ۱. اتصال GitHub

1. [Import در Vercel](https://vercel.com/new) → repo `mjpt1/armonia`
2. **Root Directory:** `platform`
3. Framework: Next.js (خودکار)

### ۲. Environment Variables

| Variable | مقدار |
|----------|--------|
| `DATABASE_URL` | `postgresql://...` (Neon / Vercel Postgres) |
| `AUTH_SECRET` | رشتهٔ تصادفی امن (`openssl rand -base64 32`) |

### ۳. PostgreSQL برای Production

در `platform/prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

سپس:

```bash
cd platform
npx prisma db push
npm run seed
```

### ۴. Deploy

```powershell
cd platform
.\deploy-vercel.ps1
# یا:
npx vercel --prod
```

یا push به `main` → Vercel auto-deploy (اگر پروژه به GitHub وصل باشد).

---

## مستندات

| سند | محتوا |
|-----|--------|
| [راهنمای برند](docs/brand-guidelines.md) | هویت بصری، تایپوگرافی، Concept A |
| [معماری](docs/architecture-overview.md) | لایه‌ها، scope شعبه/کلینیک |
| [ماتریس RBAC](docs/rbac-matrix.md) | دسترسی ماژول × نقش |
| [platform/README.md](platform/README.md) | اسکریپت‌ها، مسیرها، API |

---

## License

See [LICENSE](LICENSE).

---

**Armonia** — Beauty, in harmony with standards. · زیبایی، هماهنگ با استاندارد.
