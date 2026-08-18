import { Link } from 'react-router-dom';
import { ArrowDownIcon } from '@phosphor-icons/react';
import { SUPPORTED_PLATFORMS } from '../utils/api';

/*
 * The previous footer was a four-column link farm with twelve links, nine of
 * which pointed at routes that do not exist: /how-to-use, /platforms, /api,
 * /faq, /contact, /blog, /careers, /disclaimer, /dmca. Every one rendered a
 * blank page. It also listed GitHub and Twitter icons with href="#" and claimed
 * support for "أكثر من 50 منصة" while the engine handled a handful. The list
 * below is rendered from SUPPORTED_PLATFORMS so it can never drift again.
 *
 * What is left: the platform pages that really exist, the two legal pages that
 * really exist, and the disclaimer. No invented "Careers" column for a project
 * with one contributor.
 */
export default function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-surface-sunken">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-control bg-accent text-accent-fg">
                <ArrowDownIcon size={18} weight="bold" />
              </span>
              <span className="text-[15px] font-semibold tracking-tight text-content">
                محمّل الفيديو
              </span>
            </div>
            <p className="mt-4 max-w-prose text-sm leading-relaxed text-content-muted">
              أداة مجانية ومفتوحة المصدر لتحميل الفيديوهات. لا نستضيف أي ملف، ولا
              نحتفظ بسجلّ لما تحمّله.
            </p>
          </div>

          <nav aria-labelledby="footer-platforms">
            <h2 id="footer-platforms" className="text-sm font-semibold text-content">
              المنصات
            </h2>
            {/*
              space-y-1 rather than 2.5 because each link now reserves its own
              28px min-height: a bare 14px link measured 21px tall, under the
              24x24 CSS px floor in WCAG 2.2 SC 2.5.8. The inline exception in
              that criterion covers links inside a sentence, which these are
              not. Trading list gap for link height keeps the row pitch the
              same while making the tap target legal.
            */}
            <ul className="mt-4 space-y-1">
              {SUPPORTED_PLATFORMS.map(({ key, label }) => (
                <li key={key}>
                  <Link
                    to={`/platform/${key}`}
                    className="inline-flex min-h-[28px] items-center text-sm text-content-muted
                               transition hover:text-accent"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-legal">
            <h2 id="footer-legal" className="text-sm font-semibold text-content">
              الموقع
            </h2>
            <ul className="mt-4 space-y-1">
              {[
                { label: 'من نحن', to: '/about' },
                { label: 'سياسة الخصوصية', to: '/privacy' },
                { label: 'شروط الاستخدام', to: '/terms' },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="inline-flex min-h-[28px] items-center text-sm text-content-muted
                               transition hover:text-accent"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 border-t border-line pt-6">
          <p className="max-w-prose text-xs leading-relaxed text-content-subtle">
            حمّل ما تملك حقوقه، أو ما هو متاح بترخيص يسمح بذلك، أو للاستخدام الشخصي
            حيث يسمح القانون المحلي. لا نستضيف أي محتوى على خوادمنا.
          </p>
          <p className="mt-4 text-xs text-content-subtle">
            © {new Date().getFullYear()} محمّل الفيديو
          </p>
        </div>
      </div>
    </footer>
  );
}
