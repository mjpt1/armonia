# آرمونیا پلتفرم (`erp/platform`)

Next.js App Router + TypeScript + Tailwind + **Prisma/SQLite** — وب عمومی بیماران و ERP نقش‌محور با CRUD پایدار.

## اجرا (Windows)

```powershell
cd erp\platform
npm install
copy .env.example .env
npm run db:push
npm run seed
npm run build
npm run dev
```

- وب عمومی: http://localhost:3000
- ERP: http://localhost:3000/erp
- ورود: http://localhost:3000/erp/login

## اسکریپت‌ها

| دستور | توضیح |
|--------|--------|
| `npm run dev` | سرور توسعه |
| `npm run db:push` | اعمال schema روی SQLite (`prisma/dev.db`) |
| `npm run seed` | دادهٔ دمو فارسی + کاربران نقش‌ها |
| `npm run db:reset` | ریست DB + seed |
| `npm run build` | prisma generate + بیلد |

## حساب‌های دمو

رمز پیش‌فرض: `demo1234` (و برای برخی حساب‌ها `armonia123`)

| ایمیل | نقش |
|--------|------|
| `ceo@armonia.ir` / `ceo@armonia.local` | مدیرعامل |
| `ops@armonia.ir` | عملیات |
| `sales@armonia.ir` / `sm@armonia.local` | مدیر فروش |
| `advisor@armonia.ir` / `sa@armonia.local` | مشاور فروش |
| `cfo@armonia.ir` | مالی |
| `reception@armonia.ir` / `rec@armonia.local` | پذیرش |
| `doctor@armonia.ir` / `doc@armonia.local` | پزشک |
| `patient@armonia.ir` | بیمار |

در `/erp/login` می‌توانید با ایمیل/رمز یا انتخاب نقش وارد شوید. در هدر ERP سوییچر نقش منو را بر اساس RBAC فیلتر می‌کند.

## مسیرهای عمومی

| مسیر | صفحه | عملیات واقعی |
|------|------|----------------|
| `/` | خانه | خواندن پزشکان از DB |
| `/services` | خدمات | خواندن |
| `/doctors` | پزشکان | خواندن |
| `/portfolio` | نمونه‌کارها | خواندن |
| `/blog` | بلاگ | خواندن |
| `/booking` | رزرو آنلاین | ایجاد نوبت + لید |
| `/consultation` | مشاوره | ایجاد لید |
| `/contact` | تماس | ایجاد تیکت |
| `/faq` | سوالات متداول | خواندن |
| `/patient` | پنل بیمار | جستجوی پرونده + نوبت |

## مسیرهای ERP

| مسیر | ماژول | عملیات |
|------|--------|--------|
| `/erp` | داشبورد KPI | از DB |
| `/erp/crm` | لید / قیف | ایجاد + تغییر وضعیت |
| `/erp/patients` | بیماران + مدارک | ایجاد + مدرک + تاریخچه |
| `/erp/appointments` | نوبت + waitlist | رزرو / لغو / انتظار |
| `/erp/doctors` | پزشکان | ایجاد + پورسانت |
| `/erp/clinics` | کلینیک‌ها | ایجاد |
| `/erp/branches` | شعب | ایجاد |
| `/erp/marketing` | کمپین / محتوا / سوشال | ایجاد |
| `/erp/finance` | اقساط / پرداخت / تسویه | ایجاد + پرداخت |
| `/erp/contracts` | قرارداد | ایجاد + امضای دیجیتال |
| `/erp/hr` | پرسنل / حضور / مرخصی / حقوق | ایجاد + تأیید |
| `/erp/tickets` | تیکت | ایجاد + بستن |
| `/erp/notifications` | صف اعلان | SMS/WA/email/in-app |
| `/erp/users` | کاربران + لاگ | ایجاد |
| `/erp/settings` | خدمات / تعرفه / جغرافیا / زبان | ایجاد |
| `/erp/login` | ورود | session cookie |

## API

`/api/auth/session` · `/api/dashboard` · `/api/leads` · `/api/appointments` · `/api/waitlist` · `/api/patients` · `/api/doctors` · `/api/clinics` · `/api/branches` · `/api/services` · `/api/marketing` · `/api/finance` · `/api/contracts` · `/api/hr` · `/api/tickets` · `/api/notifications` · `/api/users` · `/api/settings` · `/api/public/content` · `/api/health`

هوک اعلان‌ها: `src/lib/notifications/service.ts` (stub آماده‌ی اتصال provider).

طراحی: Concept A (olive / champagne / mist). مرجع HTML در `../web/` و `../preview/` فقط برای طراحی است.
