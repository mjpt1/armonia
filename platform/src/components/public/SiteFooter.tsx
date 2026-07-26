import Link from "next/link";

export function SiteFooter({ compact }: { compact?: boolean }) {
  if (compact) {
    return (
      <footer className="border-t border-stone-100 py-6 text-center text-sm text-ink-muted">
        <div className="mx-auto w-[min(1120px,calc(100%-2.5rem))]">
          © ۱۴۰۵ آرمونیا
        </div>
      </footer>
    );
  }

  return (
    <footer className="mt-auto border-t border-stone-100 bg-porcelain py-10 text-sm text-ink-700">
      <div className="mx-auto grid w-[min(1120px,calc(100%-2.5rem))] gap-8 sm:grid-cols-3">
        <div>
          <h3 className="mb-2 font-semibold text-olive-800">آرمونیا</h3>
          <p className="text-ink-muted">
            پلتفرم یکپارچه مدیریت شبکه کلینیک‌های زیبایی.
          </p>
        </div>
        <div>
          <h3 className="mb-2 font-semibold text-olive-800">دسترسی سریع</h3>
          <ul className="space-y-1 text-ink-muted">
            <li>
              <Link href="/services" className="hover:text-olive-800">
                خدمات
              </Link>
            </li>
            <li>
              <Link href="/doctors" className="hover:text-olive-800">
                پزشکان
              </Link>
            </li>
            <li>
              <Link href="/booking" className="hover:text-olive-800">
                رزرو
              </Link>
            </li>
            <li>
              <Link href="/patient" className="hover:text-olive-800">
                پنل بیمار
              </Link>
            </li>
            <li>
              <Link href="/erp" className="hover:text-olive-800">
                ورود به ERP
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-2 font-semibold text-olive-800">تماس</h3>
          <p className="text-ink-muted">
            تهران · ونک
            <br />
            ۰۲۱-۹۱۰۰۰۰۰۰
            <br />
            info@armonia.example
          </p>
        </div>
      </div>
      <div className="mx-auto mt-8 w-[min(1120px,calc(100%-2.5rem))] text-ink-muted">
        © ۱۴۰۵ آرمونیا · همهٔ حقوق محفوظ است
      </div>
    </footer>
  );
}
