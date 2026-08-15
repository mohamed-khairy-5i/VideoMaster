import { Link } from 'react-router-dom';

/*
 * Terms of use, rewritten to be defensible instead of impressive.
 *
 * What the previous version claimed, and why each claim had to go:
 *
 *  - "الإصدار 3.2" next to a last-updated date. There is no versioned legal
 *    history behind that number. A date is verifiable, a version number is not.
 *  - A DMCA workflow ending at dmca@vidcatch.pro with a "12-24 ساعة" response
 *    promise. The domain is not registered, so the only stated way to file a
 *    takedown went nowhere, and the response time was a service commitment no
 *    single unpaid maintainer can honour.
 *  - A liability cap of "100 دولار أمريكي". Caps are normally expressed as a
 *    multiple of fees paid. Nothing is ever paid here, so quoting a dollar
 *    figure invents a commercial relationship that does not exist.
 *  - Governing law and arbitration in Saudi Arabia. Arbitrary, and a forum
 *    clause imposed on a consumer is unenforceable in most jurisdictions
 *    anyway. Removed rather than replaced with a different arbitrary country.
 *  - "نطبق حدوداً عادلة" (fair-use rate limits). No rate limiting is
 *    implemented anywhere in the codebase.
 *  - A contact block offering a "فريق قانوني", legal@vidcatch.pro, a
 *    "دردشة مباشرة" link pointing at /about#contact (no such anchor, no such
 *    feature), and a 24 business hour reply SLA. There is no team and no chat.
 *
 * The reporting channel below is the public issue tracker, which is the only
 * channel that actually exists and actually receives messages.
 */

const LAST_UPDATED = '2026-08-13';
const ISSUES_URL = 'https://github.com/mohamed-khairy-5i/VideoMaster/issues';

const SECTIONS = [
  {
    id: 'what-this-is',
    title: 'ما هذه الأداة',
    body: [
      'أداة مفتوحة المصدر تعمل في المتصفح، تطلب من المنصة بيانات الفيديو المتاحة علنًا وتعرض عليك روابط التحميل المتوفرة.',
      'لا نستضيف أي فيديو ولا نخزّن أي ملف. البايتات تمرّ من المنصة إليك مباشرة عبر وسيط بثّي لا يكتب شيئًا على القرص.',
      'المشروع فردي ومجاني ويعمل على استضافة بالخطة المجانية. لا يوجد فريق دعم ولا اتفاقية مستوى خدمة.',
    ],
  },
  {
    id: 'availability',
    title: 'التوفّر والاستمرارية',
    body: [
      'الخدمة قد تتوقف في أي لحظة ودون إشعار: لتغيير في المنصة الأصلية، أو لانتهاء حدود الاستضافة المجانية، أو لأن الصيانة توقفت.',
      'لا نتعهّد بنسبة تشغيل ولا بزمن إصلاح. عندما تتعطّل منصة، يظهر لك خطأ صريح بدلًا من تحميل صامت لملف تالف.',
      'لا يوجد حدّ استخدام مبرمج حاليًا. إذا فرضت الاستضافة حدًّا، فهو حدّ المزوّد لا حدّنا.',
    ],
  },
  {
    id: 'your-responsibility',
    title: 'مسؤوليتك أنت',
    body: [
      'أنت من يقرّر ماذا يحمّل، وأنت وحدك من يحمل المسؤولية القانونية عن ذلك القرار.',
      'شروط استخدام المنصة الأصلية تبقى سارية عليك. تحميل مقطع لا تملك حقّه ولا يشمله استثناء قانوني هو انتهاك تتحمّله أنت.',
      'إعادة النشر أو البيع أو الاستخدام التجاري لمحتوى مملوك لغيرك ليس شيئًا تمنحه لك هذه الأداة، ولا تمنحه لك بأي شكل.',
      'محاولة استخدام الأداة للوصول إلى محتوى خاص أو محمي بتسجيل دخول ليست مدعومة تقنيًا، ولن نضيف دعمًا لها.',
    ],
  },
  {
    id: 'no-warranty',
    title: 'لا ضمان',
    body: [
      'الأداة تُقدَّم كما هي، دون أي ضمان صريح أو ضمني، بما في ذلك ضمان الصلاحية لغرض معيّن.',
      'لا نضمن دقة بيانات الفيديو ولا سلامة الملف الناتج ولا مطابقته للجودة المعروضة.',
      'تحقّق من الملف بعد تحميله قبل الاعتماد عليه في أي شيء يهمّك.',
    ],
  },
];

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <h1 className="text-3xl font-bold tracking-tight text-content sm:text-4xl">
        شروط الاستخدام
      </h1>
      <p className="mt-4 text-sm text-content-subtle">
        آخر تحديث:{' '}
        <time dateTime={LAST_UPDATED} data-numeric>
          13 أغسطس 2026
        </time>
      </p>

      <p className="mt-6 max-w-prose text-lg leading-relaxed text-content-muted">
        مشروع فردي مفتوح المصدر بلا عقد ولا رسوم ولا فريق. الشروط أدناه مكتوبة
        لتصف هذا الواقع بدقة، لا لتبدو أكبر منه.
      </p>

      <div className="mt-12 space-y-12">
        {SECTIONS.map((section) => (
          <section key={section.id} id={section.id}>
            <h2 className="text-xl font-semibold text-content">{section.title}</h2>
            <ul className="mt-5 space-y-3">
              {section.body.map((line) => (
                <li
                  key={line}
                  className="flex max-w-prose gap-3 text-[15px] leading-relaxed text-content-muted"
                >
                  <span
                    aria-hidden
                    className="mt-2 h-1 w-3 shrink-0 rounded-full bg-accent"
                  />
                  {line}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section
        id="liability"
        className="mt-12 rounded-card border border-line bg-surface-sunken p-6"
      >
        <h2 className="text-xl font-semibold text-content">حدود المسؤولية</h2>
        <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-content-muted">
          لا يتحمّل صاحب هذا المشروع أي مسؤولية عن ضرر مباشر أو غير مباشر ناتج عن
          استخدام الأداة أو تعذّر استخدامها، بما في ذلك فقدان بيانات أو ملف تالف
          أو أي نزاع يتعلّق بالمحتوى الذي اخترت تحميله.
        </p>
        <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-content-muted">
          لم تدفع شيئًا مقابل هذه الأداة ولا يوجد عقد بينك وبين صاحبها، فلا يوجد
          مقابل مالي يمكن استرداده ولا سقف تعويض يمكن الوعد به. إن كان هذا غير
          مقبول لحالتك، فلا تستخدم الأداة.
        </p>
        <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-content-muted">
          الكود مفتوح، ويمكنك مراجعته بنفسك قبل الاعتماد عليه. هذا هو الضمان
          الوحيد المتاح عمليًا.
        </p>
      </section>

      <section id="dmca" className="mt-8 rounded-card border border-line p-6">
        <h2 className="text-xl font-semibold text-content">
          بلاغات حقوق الملكية
        </h2>
        <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-content-muted">
          هذه الأداة لا تستضيف محتوى، لذا لا يوجد ملف على خوادمنا يمكن إزالته.
          إذا كان مقطع معيّن ينتهك حقّك، فالجهة القادرة فعليًا على إزالته هي
          المنصة التي تستضيفه.
        </p>
        <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-content-muted">
          إن كان لديك اعتراض على أن منصة بعينها مدعومة في الأداة، أو على أي جزء
          من الكود، فافتح بلاغًا في المستودع العام. هذه هي القناة الوحيدة
          الموجودة فعلًا:
        </p>
        <a
          href={ISSUES_URL}
          target="_blank"
          rel="noreferrer noopener"
          className="btn btn-quiet mt-5 inline-flex"
        >
          فتح بلاغ في المستودع
        </a>
        <p className="mt-4 max-w-prose text-sm leading-relaxed text-content-subtle">
          البلاغات تُراجع يدويًا من شخص واحد. لا يوجد زمن استجابة مضمون، ولن
          نتظاهر بغير ذلك.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-content">تعديل الشروط</h2>
        <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-content-muted">
          قد تتغيّر هذه الصفحة كلما تغيّر الكود، لأن الهدف أن تبقى مطابقة له.
          تاريخ التعديلات كامل ومعلن في سجلّ المستودع، ويمكنك مقارنة أي نسختين.
        </p>
        <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-content-muted">
          راجع أيضًا{' '}
          <Link
            to="/privacy"
            className="font-medium text-accent underline underline-offset-4"
          >
            سياسة الخصوصية
          </Link>{' '}
          و{' '}
          <Link
            to="/about"
            className="font-medium text-accent underline underline-offset-4"
          >
            حدود ما تفعله الأداة
          </Link>
          .
        </p>
      </section>
    </article>
  );
}
