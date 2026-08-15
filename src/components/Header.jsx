import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowDownIcon, ListIcon, XIcon } from '@phosphor-icons/react';

/*
 * The old nav linked to /api, a route deleted along with the fake API docs page.
 * Clicking it rendered a blank screen. Every entry here is checked against the
 * <Route> list in App.jsx.
 *
 * Also removed: a language toggle button that ran no handler. A control that
 * does nothing is worse than no control, because the user concludes the whole
 * site is broken. Arabic is the only locale that exists, so it is not offered
 * as a choice.
 */
const NAV = [
  { label: 'الرئيسية', to: '/' },
  { label: 'من نحن', to: '/about' },
  { label: 'الخصوصية', to: '/privacy' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    // 64px tall at desktop, inside the 80px cap.
    <header className="sticky top-0 z-40 border-b border-line bg-surface/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-2.5 rounded-control transition hover:opacity-80"
        >
          {/* Flat accent mark. The previous logo was a blue-to-purple gradient
              tile with a green "zap" badge pinned to the corner. */}
          <span className="grid h-9 w-9 place-items-center rounded-control bg-accent text-accent-fg">
            <ArrowDownIcon size={18} weight="bold" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-content">
            محمّل الفيديو
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="التنقّل الرئيسي">
          {NAV.map(({ label, to }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                // aria-current is what a screen reader uses to announce the
                // current page. Colour alone does not carry that.
                aria-current={active ? 'page' : undefined}
                className={`rounded-control px-3 py-2 text-sm font-medium transition ${
                  active
                    ? 'bg-accent-soft text-accent-soft-fg'
                    : 'text-content-muted hover:bg-surface-sunken hover:text-content'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'إغلاق القائمة' : 'فتح القائمة'}
          className="grid h-10 w-10 place-items-center rounded-control text-content-muted transition
                     hover:bg-surface-sunken hover:text-content active:translate-y-px md:hidden"
        >
          {open ? <XIcon size={20} /> : <ListIcon size={20} />}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="التنقّل الرئيسي"
          className="border-t border-line bg-surface px-4 pb-3 pt-2 md:hidden"
        >
          {NAV.map(({ label, to }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                aria-current={active ? 'page' : undefined}
                className={`block rounded-control px-3 py-2.5 text-sm font-medium transition ${
                  active ? 'bg-accent-soft text-accent-soft-fg' : 'text-content-muted'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
