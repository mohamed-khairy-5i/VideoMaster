import { Link } from 'react-router-dom';
import { SUPPORTED_PLATFORMS } from '../utils/api';

/*
 * A dead end is where users leave. This page always offers a route forward: the
 * downloader itself, or a specific platform page. The old site had no 404 route
 * at all, so a typo rendered a header and footer wrapped around nothing.
 */
export default function NotFoundPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
      <p className="font-mono text-sm text-content-subtle">404</p>
      <h1 className="mt-3 text-3xl font-bold text-content sm:text-4xl">
        الصفحة غير موجودة
      </h1>
      <p className="mt-4 max-w-prose leading-relaxed text-content-muted">
        الرابط الذي فتحته لا يقابل أي صفحة. إن كنت تريد تحميل فيديو، فالأداة على
        الصفحة الرئيسية.
      </p>

      <div className="mt-8">
        <Link to="/" className="btn-primary">
          العودة إلى الأداة
        </Link>
      </div>

      <div className="mt-12 border-t border-line pt-8">
        <h2 className="text-sm font-semibold text-content">أو ابدأ من منصة</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {SUPPORTED_PLATFORMS.map(({ key, label }) => (
            <li key={key}>
              <Link
                to={`/platform/${key}`}
                className="block rounded-control border border-line bg-surface-raised px-3 py-1.5
                           text-sm text-content-muted transition hover:border-accent hover:text-accent"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
