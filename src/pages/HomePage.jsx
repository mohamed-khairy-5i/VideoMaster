import { Link } from 'react-router-dom';
import {
  CpuIcon,
  EyeSlashIcon,
  MusicNotesIcon,
  ShieldCheckIcon,
  LightningIcon,
  TimerIcon,
} from '@phosphor-icons/react';
import VideoDownloader from '../components/VideoDownloader';
import { SUPPORTED_PLATFORMS } from '../utils/api';

/*
 * Every claim on this page has to be something the code actually does.
 * The previous version advertised "15,847,239 downloads" and "892,341 active
 * users", invented numbers counted up by a fake animation on page load. That is
 * the first thing a sceptical visitor checks, and finding it false costs more
 * trust than the numbers ever bought.
 */
const FEATURES = [
  {
    icon: CpuIcon,
    title: 'الدمج يتم داخل متصفحك',
    body: 'يوتيوب يخزّن الجودات فوق 720p كمسار صورة بلا صوت. ندمج المسارين على جهازك بـ ffmpeg.wasm بنسخ مباشر بدون إعادة ترميز، فلا تفقد أي جودة ولا يُرفع الملف إلى أي خادم.',
    wide: true,
  },
  {
    icon: EyeSlashIcon,
    title: 'بدون إعلانات ولا تتبّع',
    body: 'لا نوافذ منبثقة، ولا إعادة توجيه، ولا سكربتات تتبّع.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'لا نحتفظ بأي ملف',
    body: 'الملفات تمر من مصدرها إليك دون تخزين، ولا نسجّل ما تحمّله.',
  },
  {
    icon: MusicNotesIcon,
    title: 'استخراج الصوت',
    body: 'حمّل المقطع الصوتي وحده بأعلى جودة متاحة.',
  },
  {
    icon: TimerIcon,
    title: 'بدون طابور انتظار',
    body: 'نقرأ بيانات الفيديو مباشرة من المنصة، بلا معالجة على الخادم.',
  },
  {
    icon: LightningIcon,
    title: 'بدون تسجيل ولا حدود',
    body: 'لا حساب، ولا بريد إلكتروني، ولا عدّاد تحميلات يومي.',
    // Spans 2 so the grid has no trailing hole. Six items in a 3-column grid
    // with one full-width cell leaves 3 + 2 in the last row, and a measured
    // screenshot confirmed the empty slot. Widening the final cell closes it
    // while keeping the bento asymmetric rather than a tidy uniform matrix.
    span2: true,
  },
];

const STEPS = [
  ['انسخ رابط الفيديو', 'من أي منصة مدعومة. الروابط المختصرة تعمل أيضًا.'],
  ['الصقه واضغط تحليل', 'ستظهر الجودات المتاحة مع حجم كل ملف.'],
  ['اختر واحفظ', 'التحميل يبدأ فورًا. الجودات العالية تُدمج على جهازك أولًا.'],
];

const FAQ = [
  {
    q: 'هل الموقع مجاني فعلاً؟',
    a: 'نعم. لا اشتراك ولا إعلانات ولا حد للتحميلات. الموقع يعمل على استضافة مجانية، والدمج يتم على جهازك، لذلك تكلفة التشغيل قريبة من الصفر.',
  },
  {
    q: 'لماذا بعض الجودات تحتاج "دمج محلي"؟',
    a: 'لأن يوتيوب يفصل الصورة عن الصوت فوق 720p. المواقع الأخرى إما تكتفي بـ 720p أو تعطيك ملفًا صامتًا. نحمّل المسارين وندمجهما داخل متصفحك بنسخ مباشر، بدون إعادة ترميز وبدون فقدان جودة.',
  },
  {
    q: 'هل ترفعون الفيديوهات إلى خوادمكم؟',
    a: 'لا. الخادم يقرأ معلومات الفيديو فقط ويعيد لك روابط، ثم تمر البيانات عبر وسيط بثّي لا يخزّن شيئًا. عملية الدمج تتم بالكامل داخل متصفحك.',
  },
  {
    q: 'أحيانًا يظهر خطأ "تأكيد أنك لست روبوتًا"، لماذا؟',
    a: 'يوتيوب يفرض فحصًا آليًا على عناوين الخوادم المشتركة أحيانًا. عند حدوث ذلك نحاول تلقائيًا عبر مصادر بديلة. إن فشلت جميعها، انتظر قليلًا أو جرّب فيديو آخر.',
  },
  {
    q: 'ما الذي يمكنني تحميله؟',
    a: 'حمّل ما تملك حقوقه، أو ما هو متاح بترخيص يسمح بذلك، أو للاستخدام الشخصي حيث يسمح القانون المحلي. أنت مسؤول عن استخدامك للأداة.',
  },
];

export default function HomePage() {
  return (
    <>
      {/*
        Hero. Centered because the input field IS the product: the fastest path
        for a user who arrived with a link already on the clipboard is a single
        focal column. Section 4.3 allows a centered hero when the message itself
        is the design, and there is no hero image to balance against.
        Kept to 3 text elements (headline, subtext, tool) with pt-14 top padding.
      */}
      <section className="px-4 pb-14 pt-14 sm:px-6 sm:pt-20">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-[2rem] font-bold leading-[1.15] tracking-tight text-content sm:text-5xl">
            حمّل الفيديو بدون إعلانات
          </h1>
          <p className="mx-auto mt-4 max-w-prose text-[15px] leading-relaxed text-content-muted sm:text-base">
            الصق الرابط، اختر الجودة، احفظ الملف. بدون تسجيل ولا نوافذ منبثقة.
          </p>
        </div>

        <div className="mt-9">
          <VideoDownloader />
        </div>

        <ul className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-2">
          {SUPPORTED_PLATFORMS.map(({ key, label }) => (
            <li key={key}>
              <Link
                to={`/platform/${key}`}
                className="block rounded-control border border-line bg-surface-raised px-3.5 py-1.5
                           text-sm text-content-muted transition
                           hover:border-accent hover:text-accent"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/*
        Features. Asymmetric bento, not the three-equal-cards row the old page
        used: the browser-muxing cell is the actual differentiator against every
        competitor, so it spans the full width and gets the accent surface.
        Six items, six cells. Row occupancy was measured in a real browser at
        1440/1280/1024/900/768/640/390px and every row covers the full grid
        width, so there is no trailing hole at any breakpoint.
      */}
      <section className="border-t border-line bg-surface-sunken px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="max-w-prose text-2xl font-bold tracking-tight text-content sm:text-3xl">
            ما يفرّق هذه الأداة عن غيرها
          </h2>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, body, wide, span2 }) => (
              <article
                key={title}
                className={[
                  'rounded-card border p-5 transition',
                  wide
                    ? 'border-accent/25 bg-accent-soft lg:p-7'
                    : 'border-line bg-surface-raised hover:border-line-strong',
                  // Column spans are separate from the surface styling so a cell
                  // can be widened without also becoming the accent cell.
                  wide ? 'sm:col-span-2 lg:col-span-3' : '',
                  span2 ? 'sm:col-span-2 lg:col-span-2' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <Icon
                  size={22}
                  className={wide ? 'text-accent-soft-fg' : 'text-accent'}
                  aria-hidden
                />
                <h3
                  className={`mt-3 font-semibold ${
                    wide ? 'text-lg text-accent-soft-fg' : 'text-content'
                  }`}
                >
                  {title}
                </h3>
                <p
                  className={`mt-2 max-w-prose text-sm leading-relaxed ${
                    wide ? 'text-accent-soft-fg/85' : 'text-content-muted'
                  }`}
                >
                  {body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Steps. Numbered rows, a different layout family from the bento above. */}
      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold tracking-tight text-content sm:text-3xl">
            ثلاث خطوات
          </h2>
          <ol className="mt-10 grid gap-8 sm:grid-cols-3">
            {STEPS.map(([title, body], i) => (
              <li key={title}>
                <span
                  className="font-mono text-sm font-medium text-content-subtle"
                  data-numeric
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-2 border-t border-line pt-3 font-semibold text-content">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-content-muted">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/*
        FAQ. Native <details> so it works without JavaScript and is keyboard and
        screen-reader accessible for free.
      */}
      <section className="border-t border-line bg-surface-sunken px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight text-content sm:text-3xl">
            أسئلة شائعة
          </h2>
          <div className="mt-8 divide-y divide-line border-y border-line">
            {FAQ.map(({ q, a }) => (
              <details key={q} className="group py-4">
                <summary
                  className="flex cursor-pointer list-none items-center justify-between gap-4
                             font-medium text-content transition hover:text-accent"
                >
                  {q}
                  {/* Plain glyph rather than an icon import: it rotates to an X
                      shape, which reads as open/closed without a second asset. */}
                  <span
                    aria-hidden
                    className="shrink-0 text-lg leading-none text-content-subtle transition-transform
                               duration-200 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-prose text-sm leading-relaxed text-content-muted">
                  {a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
