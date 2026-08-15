import { useParams, Link } from 'react-router-dom';
import VideoDownloader from '../components/VideoDownloader';
import { SUPPORTED_PLATFORMS } from '../utils/api';

/*
 * The old version of this page was actively harmful:
 *
 *  - It served /platform/instagram and /platform/facebook with full feature
 *    lists and download tips, while the extractor supports neither. A user
 *    following those pages pasted a link and got an error, on a page that had
 *    just promised it would work.
 *  - It printed invented platform statistics ("2.7B users", "500+ hours daily",
 *    "engagement 4.2%") as if they were our metrics.
 *  - YouTube claimed "تحميل بجودة 4K و 8K", plus playlist support and subtitle
 *    extraction. None of those three exist in the code.
 *  - Its closing CTA called document.querySelector('.input-field'), a class
 *    removed with the old stylesheet, so the button silently did nothing and
 *    then threw on offsetTop of null.
 *
 * Now the data is keyed off SUPPORTED_PLATFORMS, so an unsupported slug cannot
 * render a page, and every capability line describes real extractor behaviour.
 */
const DETAIL = {
  youtube: {
    blurb: 'حمّل من يوتيوب حتى 4K مع الصوت، أو استخرج المقطع الصوتي وحده.',
    can: [
      'جودات حتى 4K، بدمج الصوت والصورة داخل متصفحك',
      'استخراج الصوت بأعلى معدل بت متاح',
      'روابط youtube.com و youtu.be و Shorts',
    ],
    cannot: [
      'القوائم والقنوات: رابط واحد في المرة',
      'الترجمات لا تُستخرج',
      'البثّ المباشر أثناء بثّه',
    ],
    note: 'يوتيوب يفرض أحيانًا فحصًا آليًا على عناوين الاستضافة المشتركة. عند حدوثه نحاول تلقائيًا عبر مصادر بديلة.',
  },
  tiktok: {
    blurb: 'حمّل من تيك توك بدون العلامة المائية، بالجودة الأصلية.',
    can: [
      'نسخة بدون علامة مائية عند توفّرها',
      'الصوت الأصلي منفصلًا',
      'روابط tiktok.com والروابط المختصرة',
    ],
    cannot: ['الحسابات الخاصة', 'المقاطع المحجوبة جغرافيًا'],
    note: 'إن رفض تيك توك الطلب، نعود إلى بيانات oEmbed العامة، وقد تأتي النسخة حينها بعلامة مائية.',
  },
  vimeo: {
    blurb: 'حمّل من فيميو بالجودات التي يوفّرها الناشر.',
    can: ['كل الجودات المتاحة في مشغّل الفيديو', 'ملفات بصوت مدموج جاهزة فورًا'],
    cannot: ['الفيديوهات المحمية بكلمة مرور', 'المحتوى المدفوع أو المقيّد بنطاق معيّن'],
  },
  twitter: {
    blurb: 'حمّل الفيديوهات والصور المتحركة من تويتر/إكس.',
    can: ['كل الجودات المرفقة بالمنشور', 'روابط twitter.com و x.com'],
    cannot: ['الحسابات المحمية', 'المنشورات المحذوفة'],
  },
  reddit: {
    blurb: 'حمّل من ريديت مع الصوت، وهو ما تفشل فيه أدوات كثيرة.',
    can: ['دمج مسار الصورة مع مسار الصوت المنفصل', 'روابط reddit.com و redd.it'],
    cannot: ['المجتمعات الخاصة', 'الفيديوهات المستضافة خارج ريديت'],
    note: 'ريديت يخزّن الصوت في ملف منفصل، لذلك تُدمج معظم فيديوهاته داخل متصفحك.',
  },
  dailymotion: {
    blurb: 'حمّل من ديلي موشن بالجودات المتاحة.',
    can: ['الجودات التي يوفّرها المشغّل', 'روابط dailymotion.com و dai.ly'],
    cannot: ['المحتوى المقيّد جغرافيًا', 'البثّ المباشر'],
  },
};

export default function PlatformPage() {
  const { platform } = useParams();
  const meta = SUPPORTED_PLATFORMS.find((p) => p.key === platform);
  const detail = DETAIL[platform];

  // An unsupported slug now says so, and offers the platforms that do work,
  // instead of rendering a confident page for a platform we cannot handle.
  if (!meta || !detail) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight text-content">
          هذه المنصة غير مدعومة
        </h1>
        <p className="mt-4 max-w-prose leading-relaxed text-content-muted">
          لا ندعم هذه المنصة حاليًا. هذه هي المنصات التي تعمل فعلًا:
        </p>
        <ul className="mt-6 flex flex-wrap gap-2">
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
        <div className="mt-8">
          <Link to="/" className="btn-primary">
            العودة إلى الأداة
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="px-4 pb-14 pt-14 sm:px-6 sm:pt-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-[2rem] font-bold leading-[1.15] tracking-tight text-content sm:text-4xl">
            تحميل من {meta.label}
          </h1>
          <p className="mx-auto mt-4 max-w-prose text-[15px] leading-relaxed text-content-muted">
            {detail.blurb}
          </p>
        </div>

        <div className="mt-9">
          <VideoDownloader />
        </div>
      </section>

      {/* Two honest columns instead of four cards of invented statistics. */}
      <section className="border-t border-line bg-surface-sunken px-4 py-16 sm:px-6">
        <div className="mx-auto grid max-w-4xl gap-10 sm:grid-cols-2">
          <div>
            <h2 className="text-lg font-semibold text-content">ما يعمل</h2>
            <ul className="mt-4 space-y-3">
              {detail.can.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-[15px] leading-relaxed text-content-muted"
                >
                  <span aria-hidden className="mt-2 h-1 w-3 shrink-0 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-content">ما لا يعمل</h2>
            <ul className="mt-4 space-y-3">
              {detail.cannot.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-[15px] leading-relaxed text-content-muted"
                >
                  <span aria-hidden className="mt-2 h-1 w-3 shrink-0 rounded-full bg-line-strong" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {detail.note && (
          <p className="mx-auto mt-10 max-w-4xl rounded-card border border-line bg-surface-raised p-4 text-sm leading-relaxed text-content-muted">
            {detail.note}
          </p>
        )}
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-sm font-semibold text-content">منصات أخرى</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {SUPPORTED_PLATFORMS.filter((p) => p.key !== platform).map(({ key, label }) => (
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
    </>
  );
}
