import { Link } from 'react-router-dom';
import { SUPPORTED_PLATFORMS } from '../utils/api';

/*
 * This page was entirely fabricated. It claimed a founding story in 2020 by "a
 * team of 3 developers", 15.8 million downloads, 892K monthly users, a 99.8%
 * success rate, "85+ platforms", "servers distributed across 40+ countries",
 * "advanced AI algorithms", "multi-layer malware scanning", and a support team
 * available 24/7. None of it is true. The project is one person, the hosting is
 * a free tier, and there is no team to staff a support desk.
 *
 * An about page exists to answer "who is behind this and why should I trust
 * them". Invented credentials answer it in the worst possible way, because a
 * visitor who checks even one claim stops believing all of them. What is left
 * here is verifiable: how the thing works, what it costs to run, what it cannot
 * do.
 */
export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <h1 className="text-3xl font-bold tracking-tight text-content sm:text-4xl">
        عن هذه الأداة
      </h1>
      <p className="mt-5 max-w-prose text-lg leading-relaxed text-content-muted">
        أداة واحدة تفعل شيئًا واحدًا: تعطيك ملف الفيديو الذي طلبته، بدون إعلانات
        ولا نوافذ منبثقة ولا تسجيل.
      </p>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-content">لماذا بُنيت</h2>
        <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-content-muted">
          <p className="max-w-prose">
            معظم مواقع تحميل الفيديو تعمل بالطريقة نفسها: تفتح الرابط، فتقفز
            نافذتان، ويتحوّل زر التحميل إلى إعلان، وبعد ثلاث محاولات تحصل على ملف
            بجودة 360p أو على ملف صامت. الموقع لا يكسب من الخدمة، بل من الإعلانات
            التي تعترضك قبل الوصول إليها.
          </p>
          <p className="max-w-prose">
            هذه الأداة مبنية على العكس: لا تحقّق أي دخل، ولذلك لا يوجد سبب لإدخال
            أي شيء بينك وبين الملف. تكلفة تشغيلها قريبة من الصفر لأن الخادم لا
            يعالج فيديو ولا يخزّنه، والعمل الثقيل يحدث على جهازك.
          </p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-content">كيف تعمل فعليًا</h2>
        <ol className="mt-5 space-y-5">
          {[
            [
              'قراءة بيانات الفيديو',
              'يسأل الخادم المنصة عن بيانات الفيديو ويستخرج روابط المسارات المتاحة. لا يحمّل الفيديو ولا يمسّه.',
            ],
            [
              'تمرير البيانات',
              'تمرّ البايتات عبر وسيط بثّي لا يخزّن شيئًا. هذا ضروري لأن خوادم المنصات ترفض الطلبات القادمة مباشرة من المتصفح، وليس لأننا نريد رؤية ما تحمّله.',
            ],
            [
              'الدمج على جهازك',
              'الجودات فوق 720p محفوظة كمسار صورة بلا صوت ومسار صوت منفصل. يُنزّل المتصفح المسارين ويدمجهما بـ ffmpeg.wasm بنسخ مباشر بدون إعادة ترميز، فلا تفقد جودة ولا يُرفع الملف إلى أي مكان.',
            ],
          ].map(([title, body], i) => (
            <li key={title} className="flex gap-4">
              <span
                className="mt-0.5 font-mono text-sm text-content-subtle"
                data-numeric
                aria-hidden
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="font-semibold text-content">{title}</h3>
                <p className="mt-1.5 max-w-prose text-[15px] leading-relaxed text-content-muted">
                  {body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-content">ما لا تفعله هذه الأداة</h2>
        <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-content-muted">
          الحدود مكتوبة هنا لأن معرفتها مقدّمًا أفضل من اكتشافها بعد محاولة فاشلة.
        </p>
        <ul className="mt-5 space-y-3">
          {[
            'لا تدعم إنستغرام ولا فيسبوك. كلتاهما تطلب جلسة مسجّلة، وتخزين حسابات المستخدمين ليس شيئًا نريد فعله.',
            'لا تحمّل المحتوى الخاص أو المحمي بكلمة مرور أو المدفوع.',
            'لا تدعم البثّ المباشر أثناء بثّه.',
            'لا تحمّل قائمة تشغيل كاملة أو قناة بضغطة واحدة.',
            'الدمج المحلي يحتاج ذاكرة الجهاز، لذلك للملفات الكبيرة جدًا على الهاتف نطلب منك اختيار جودة أقل بدل أن نتسبّب في تعليق المتصفح.',
          ].map((item) => (
            <li
              key={item}
              className="flex max-w-prose gap-3 text-[15px] leading-relaxed text-content-muted"
            >
              <span aria-hidden className="mt-2 h-1 w-3 shrink-0 rounded-full bg-line-strong" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-content">المنصات المدعومة</h2>
        <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-content-muted">
          ست منصات، كل واحدة مُختبرة. القائمة قصيرة لأنها حقيقية.
        </p>
        <ul className="mt-5 flex flex-wrap gap-2">
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
      </section>

      <section className="mt-12 rounded-card border border-line bg-surface-sunken p-6">
        <h2 className="text-xl font-semibold text-content">من يقف خلفها</h2>
        <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-content-muted">
          مشروع فردي مفتوح المصدر، يعمل على استضافة مجانية. لا شركة، ولا فريق دعم،
          ولا مستثمرون. هذا يعني أن الأداة لا يمكن أن تُباع لمعلن، ويعني أيضًا أن
          الإصلاحات تأتي بوتيرة شخص واحد.
        </p>
        <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-content-muted">
          لتفاصيل ما نجمعه وما لا نجمعه، اقرأ{' '}
          <Link to="/privacy" className="font-medium text-accent underline underline-offset-4">
            سياسة الخصوصية
          </Link>
          .
        </p>
      </section>
    </article>
  );
}
