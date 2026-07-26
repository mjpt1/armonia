# Brand Guidelines — آرمونیا (Armonia) v1.0

> Last updated: 1405/05/03 (2026-07-25)  
> Status: Active  
> Surfaces: وب‌سایت عمومی بیماران · ERP سازمانی · اپ آینده

## Quick Reference

| Element | Value |
|---------|-------|
| Primary | Deep Olive `#2F4A3C` |
| Accent | Soft Champagne Gold `#C4A574` |
| Background | Mist Ivory `#F7F4EF` |
| Primary Font (FA UI) | Vazirmatn |
| Display Font (FA) | Estedad |
| Latin Companion | Fraunces (display) · Source Sans 3 (UI) |
| Voice | آرام، مطمئن، دقیق، بدون اغراق تبلیغاتی |

---

## 1. Brand Essence

**آرمونیا** شبکهٔ یکپارچهٔ کلینیک‌های زیبایی است: هماهنگی بین بیمار، پزشک، شعبه و عملیات شرکت.

- **Positioning:** زیبایی با استاندارد پزشکی، شفافیت فرآیند، آرامش تجربه
- **Promise:** از اولین مشاوره تا پیگیری پس از درمان، همه چیز در یک اکوسیستم هماهنگ
- **Personality:** بالغ، گرم، حرفه‌ای، نه لوکسِ سرد و نه کلینیکِ بیمارستانی خشک

### Messaging pillars

1. **هماهنگی** — یک پلتفرم برای بیمار، کلینیک و شرکت
2. **اعتماد** — پرونده، قرارداد و پیگیری شفاف
3. **دسترسی** — رزرو آنلاین، چندشعبه، چندکلینیک

### Tagline (FA)

> زیبایی، هماهنگ با استاندارد.

### Tagline (EN)

> Beauty, in harmony with standards.

---

## 2. Color Palette

جهت بصری: کلینیک زیبایی لوکس و آرامش‌بخش — پایهٔ روشن گرم خنثی + اکسنت زیتونی عمیق و طلایی ملایم.  
**اجتناب:** بنفش/ایندیگو گرادیان رایج · cream+terracotta کلیشه‌ای · نئون · glow بنفش.

### Primary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Olive Deep | `#2F4A3C` | 47, 74, 60 | برند اصلی، CTA اولیه، ناوبری ERP |
| Olive Mid | `#3D5C4A` | 61, 92, 74 | Hover، اکتیو سایدبار |
| Olive Soft | `#E8EFEA` | 232, 239, 234 | پس‌زمینهٔ ملایم badge و chip |

### Accent Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Champagne | `#C4A574` | 196, 165, 116 | اکسنت لوکس، هایلایت، لینک ثانویه |
| Champagne Deep | `#A6854F` | 166, 133, 79 | Hover اکسنت |
| Champagne Mist | `#F3EBDD` | 243, 235, 221 | پس‌زمینهٔ هایلایت ملایم |

### Neutral Palette

| Name | Hex | Usage |
|------|-----|-------|
| Mist Ivory | `#F7F4EF` | پس‌زمینهٔ صفحات عمومی |
| Porcelain | `#FFFcf8` | Surface / کارت‌های تعاملی |
| Stone 100 | `#EDE8E1` | Divider، border نرم |
| Stone 300 | `#C9C0B4` | Border پیش‌فرض |
| Ink 700 | `#3A3530` | متن بدنه |
| Ink 900 | `#1C1916` | تیترها |
| Ink Muted | `#7A7268` | کپشن، متادیتا |

### Semantic Colors

| State | Hex | Usage |
|-------|-----|-------|
| Success | `#2F7D5B` | تأیید، پرداخت موفق |
| Warning | `#C4892A` | هشدار، در انتظار |
| Error | `#B4453A` | خطا، کنسلی |
| Info | `#3D6B7A` | اطلاع‌رسانی |

### Accessibility

- Ink 900 روی Mist Ivory: کنتراست بالا (AAA برای متن)
- Olive Deep روی سفید/Mist: حداقل AA برای دکمه و لینک
- متن روی Olive Deep: سفید `#FFFcf8`

---

## 3. Typography

### Font Stack

```css
--font-display-fa: "Estedad", "Vazirmatn", Tahoma, sans-serif;
--font-body-fa: "Vazirmatn", Tahoma, sans-serif;
--font-display-en: "Fraunces", Georgia, serif;
--font-body-en: "Source Sans 3", "Vazirmatn", system-ui, sans-serif;
--font-mono: "JetBrains Mono", ui-monospace, monospace;
```

### Type Scale (Public Web)

| Element | Desktop | Mobile | Weight | Line Height |
|---------|---------|--------|--------|-------------|
| Display / Brand | 64px | 40px | 600 | 1.15 |
| H1 | 40px | 28px | 600 | 1.25 |
| H2 | 28px | 22px | 600 | 1.3 |
| H3 | 22px | 18px | 500 | 1.35 |
| Body | 16px | 16px | 400 | 1.7 |
| Small | 14px | 13px | 400 | 1.5 |
| Caption | 12px | 12px | 500 | 1.4 |

### Type Scale (ERP)

| Element | Size | Weight |
|---------|------|--------|
| Page title | 22px | 600 |
| Section | 16px | 600 |
| Body / table | 14px | 400 |
| Meta | 12px | 500 |

### Rules

- UI فارسی: ارقام فارسی در متن کاربر · تاریخ جلالی
- نام برند لاتین `Armonia` با `dir="ltr"` در صورت نیاز
- نیم‌فاصله در کلمات مرکب: می‌شود، کلینیک‌ها، پیگیری‌ها

---

## 4. Logo Usage

### Concept

علامت: حرف A به‌صورت منحنی هماهنگ (هارمونی) با برگ/قوس ملایم زیتونی؛ wordmark فارسی «آرمونیا» و لاتین Armonia.

### Variants

| Variant | File | Use Case |
|---------|------|----------|
| Full FA | `assets/logo/armonia-logo-full-fa.svg` | هدر وب فارسی |
| Full EN | `assets/logo/armonia-logo-full-en.svg` | اسناد بین‌المللی |
| Icon | `assets/logo/armonia-mark.svg` | Favicon، اپ |
| Mono | `assets/logo/armonia-mono.svg` | چاپ تک‌رنگ |

### Clear Space

حداقل فضای خالی = ارتفاع mark

### Minimum Size

| Context | Min Width |
|---------|-----------|
| Full digital | 128px |
| Icon digital | 24px |
| Print full | 35mm |

### Don'ts

- چرخش، کشیدگی، سایه بنفش/glow
- تغییر رنگ خارج از پالت
- قرار دادن روی عکس شلوغ بدون اسکراپ/اورلی

---

## 5. Voice & Tone

| Context | Tone | Example |
|---------|------|---------|
| وب‌سایت | گرم، مطمئن | «نوبت خود را در چند دقیقه رزرو کنید.» |
| پنل بیمار | شفاف، راهنما | «مدارک ویزیت شما آمادهٔ مشاهده است.» |
| ERP | کوتاه، عملیاتی | «لید به مرحلهٔ قرارداد منتقل شد.» |
| خطا | دقیق، بدون عذرخواهی کلی | «ساعت انتخاب‌شده پر است. زمان دیگری را انتخاب کنید.» |

**اجتناب:** اغراق («بهترین دنیا»)، ایموجی در ERP، اصطلاحات انگلیسی غیرضروری در UI فارسی.

---

## 6. Spacing, Radius, Motion

| Token | Value |
|-------|-------|
| Space scale | 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 |
| Radius public | 2px–8px (تیزِ نرم، نه pill کامل) |
| Radius ERP | 4px–6px |
| Motion | fade+translate 280–420ms، ease-out |
| Signature motion | hero brand reveal · sidebar active slide · calendar slot pulse |

---

## 7. Surface Rules

### Public website

- یک ترکیب‌بندی hero: برند بزرگ + یک تیتر + یک جمله + CTA + تصویر تمام‌عرض
- بدون کارت در hero · بدون badge شناور روی تصویر
- تصویر واقعی فضا/درمان به‌عنوان لنگر بصری

### ERP

- سایدبار نقش‌محور · Branch/Clinic switcher در هدر
- جداول فشرده · فیلترهای افقی · empty state با اقدام مشخص
- KPI با عدد بزرگ و برچسب کوچک — بدون داشبورد شلوغ کارت‌محور افراطی

---

## 8. Localization

| Locale | Dir | Notes |
|--------|-----|-------|
| fa | rtl | پیش‌فرض · جلالی · تومان/ریال |
| ar | rtl | آینه‌سازی layout |
| en | ltr | Fraunces + Source Sans 3 |

---

## 9. Approval Checklist

- [ ] رنگ‌ها فقط از پالت
- [ ] فونت فارسی Vazirmatn/Estedad
- [ ] RTL با logical properties
- [ ] لوگو با clear space
- [ ] کپی بدون عربی ی/ک
- [ ] تاریخ جلالی در UI فارسی
