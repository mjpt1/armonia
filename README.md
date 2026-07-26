# آرمونیا (Armonia)

پلتفرم یکپارچه مدیریت شبکه کلینیک‌های زیبایی — وب‌سایت عمومی بیماران + ERP سازمانی (چندشعبه، RBAC، API).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmjpt1%2Farmonia&root-directory=platform&env=DATABASE_URL,AUTH_SECRET&envDescription=DATABASE_URL%20(PostgreSQL%20on%20Vercel%2FNeon)%20and%20AUTH_SECRET%20required&project-name=armonia)

## ساختار پروژه

```
armonia/
├── platform/          ← اپ Next.js (کد اصلی — همین را deploy کنید)
│   ├── src/app/       ← مسیرهای وب عمومی + ERP + API
│   ├── prisma/        ← schema و seed
│   └── vercel.json
├── docs/              ← برند، معماری، RBAC
├── assets/            ← لوگو، design tokens
├── web/               ← پروتوتایپ HTML وب‌سایت
├── preview/           ← Concept A/B (طراحی ERP)
└── *.html             ← پروتوتایپ HTML ماژول‌های ERP
```

## Tech Stack

| لایه | فناوری |
|------|--------|
| Frontend | Next.js 15 · React 19 · TypeScript · Tailwind |
| Backend | Route Handlers · Prisma |
| DB (محلی) | SQLite (`prisma/dev.db`) |
| DB (Production) | PostgreSQL (Neon / Vercel Postgres) |
| Auth | Session cookie + RBAC |
| i18n | فارسی RTL (پیش‌فرض) · EN/AR آماده |

## اجرای محلی

### پیش‌نیاز

- Node.js 20+ (توصیه: 20 LTS — Node 24 ممکن است کند باشد)
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

| آدرس | URL |
|------|-----|
| وب عمومی | http://localhost:3000 |
| ERP | http://localhost:3000/erp |
| ورود | http://localhost:3000/erp/login |

### حساب‌های دمو

رمز: **`demo1234`**

| ایمیل | نقش |
|--------|------|
| `ceo@armonia.local` | مدیرعامل |
| `ops@armonia.local` | عملیات |
| `sm@armonia.local` | مدیر فروش |
| `rec@armonia.local` | پذیرش |
| `doc@armonia.local` | پزشک |
| `patient@armonia.local` | بیمار |

## ماژول‌ها

### وب‌سایت عمومی

خانه · خدمات · پزشکان · نمونه‌کار · بلاگ · رزرو · مشاوره · تماس · FAQ · پنل بیمار

### ERP

داشبورد · CRM · بیماران · نوبت‌دهی · پزشکان · کلینیک‌ها · شعب · بازاریابی · مالی · قراردادها · HR · تیکت · اعلان · کاربران · تنظیمات

جزئیات API و مسیرها: [`platform/README.md`](platform/README.md)

## Deploy روی Vercel

> **مهم:** SQLite فقط برای توسعه محلی است. روی Vercel باید **PostgreSQL** (Neon یا Vercel Postgres) استفاده کنید.

### ۱. اتصال GitHub

1. [Import پروژه در Vercel](https://vercel.com/new) → repo `mjpt1/armonia`
2. **Root Directory:** `platform`
3. Framework: Next.js (خودکار)

### ۲. Environment Variables

| Variable | مقدار |
|----------|--------|
| `DATABASE_URL` | `postgresql://...` (Neon / Vercel Postgres) |
| `AUTH_SECRET` | رشته تصادفی امن (مثلاً `openssl rand -base64 32`) |

### ۳. PostgreSQL برای Production

در `platform/prisma/schema.prisma` provider را به `postgresql` تغییر دهید:

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

```bash
cd platform
npx vercel --prod
```

یا push به `main` → Vercel auto-deploy.

## مستندات

- [راهنمای برند](docs/brand-guidelines.md)
- [معماری](docs/architecture-overview.md)
- [ماتریس RBAC](docs/rbac-matrix.md)

## License

See [LICENSE](LICENSE).

---

**Armonia** — Beauty, in harmony with standards. · زیبایی، هماهنگ با استاندارد.
