import { Link } from 'react-router-dom';

/*
 * A privacy policy is a legal statement, so the only acceptable version is one
 * that matches the code. The previous text did not, and it overclaimed in the
 * direction that creates liability:
 *
 *  - It described three categories of cookies in use (session, security,
 *    performance). The site sets zero cookies and has no analytics.
 *  - It claimed IP addresses were stored for 30 days and video URLs erased
 *    within 24 hours. There is no database and no logging layer, so neither
 *    retention period describes anything real.
 *  - It claimed "periodic security audits", "advanced firewalls" and formal
 *    GDPR / CCPA / Gulf compliance programmes. Declaring compliance you have not
 *    implemented is worse than saying nothing.
 *  - It offered privacy@, delete@ and a /contact form. The domain is not
 *    registered and /contact is not a route, so every stated way to exercise
 *    your rights was a dead end.
 *
 * Rewritten to describe exactly what the request path does. The honest version
 * is also the stronger one: there is nothing to delete because nothing is kept.
 */

const LAST_UPDATED = '2026-08-12';

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <h1 className="text-3xl font-bold tracking-tight text-content sm:text-4xl">
        سياسة الخصوصية
      </h1>
      <p className="mt-4 text-sm text-content-subtle">
        آخر تحديث:{' '}
        <time dateTime={LAST_UPDATED} data-numeric>
          12 أغسطس 2026
        </time>
      </p>

      <p className="mt-6 max-w-prose text-lg leading-relaxed text-content-muted">
        لا حسابات، ولا ملفات تعريف ارتباط، ولا تحليلات، ولا قاعدة بيانات. هذه
        الصفحة تشرح ما يحدث تقنيًا عند استخدامك الأداة.
      </p>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-content">ما لا نجمعه</h2>
        <ul className="mt-5 space-y-3">
          {[
            'لا نطلب حسابًا ولا بريدًا إلكترونيًا ولا أي بيانات تسجيل.',
            'لا نضع ملفات تعريف ارتباط. لا للجلسات، ولا للتفضيلات، ولا للتتبّع.',
            'لا نستخدم Google Analytics ولا أي أداة قياس أو بكسل تتبّع من طرف ثالث.',
            'لا نحتفظ بسجلّ للروابط التي تحلّلها ولا للملفات التي تحمّلها.',
            'لا نحتفظ بأي ملف فيديو أو صوت على خوادمنا، لا مؤقتًا ولا دائمًا.',
          ].map((item) => (
            <li
              key={item}
              className="flex max-w-prose gap-3 text-[15px] leading-relaxed text-content-muted"
            >
              <span aria-hidden className="mt-2 h-1 w-3 shrink-0 rounded-full bg-accent" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-content">ما يحدث عند تحليل رابط</h2>
        <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-content-muted">
          <p className="max-w-prose">
            يُرسل الرابط إلى دالة على الخادم، فتسأل المنصة عن بيانات الفيديو وتعيد
            لك قائمة الجودات. تعمل الدالة في الذاكرة وتنتهي مع انتهاء الطلب، ولا
            تكتب الرابط في أي مكان.
          </p>
          <p className="max-w-prose">
            عند اختيارك جودة، تمرّ بايتات الملف عبر وسيط بثّي ينقلها من المنصة إليك
            دون تخزين. هذا الوسيط ضروري لأن خوادم المنصات ترفض الطلبات القادمة
            مباشرة من المتصفح.
          </p>
          <p className="max-w-prose">
            دمج الصوت مع الصورة للجودات العالية يتم بالكامل داخل متصفحك. الملف لا
            يُرفع إلى أي خادم في هذه المرحلة، ولا يغادر جهازك.
          </p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-content">ما تراه أطراف أخرى</h2>
        <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-content-muted">
          <p className="max-w-prose">
            الوضوح هنا مهم: نحن لا نتحكّم في كل طرف على المسار.
          </p>
          <ul className="mt-4 space-y-3">
            {[
              ['مزوّد الاستضافة', 'يرى عنوان IP والطلبات الواردة على مستوى الشبكة، كما هو الحال مع أي موقع على الإنترنت. هذا خارج سيطرتنا ويخضع لسياسة المزوّد.'],
              ['المنصة الأصلية', 'يوتيوب أو تيك توك أو غيرها ترى طلبًا لبيانات الفيديو صادرًا من خادمنا، لا من جهازك.'],
              ['خطوط Google Fonts', 'تُحمّل الخطوط من fonts.gstatic.com، وهو ما يعرّض عنوان IP الخاص بك لجوجل عند أول زيارة. استضافة الخطوط محليًا خطوة مخطّطة لإزالة هذا الطرف.'],
              ['شبكة jsDelivr', 'ملفات ffmpeg.wasm تُحمّل من cdn.jsdelivr.net عند أول عملية دمج فقط.'],
            ].map(([who, what]) => (
              <li key={who} className="max-w-prose">
                <strong className="font-semibold text-content">{who}:</strong> {what}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-12 rounded-card border border-line bg-surface-sunken p-6">
        <h2 className="text-xl font-semibold text-content">حقوقك</h2>
        <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-content-muted">
          حقوق الوصول إلى بياناتك أو تصحيحها أو حذفها تفترض وجود بيانات محفوظة
          مرتبطة بك. لا يوجد لدينا ما يُحذف: لا حساب، ولا سجل تحميل، ولا ملف تعريف.
          إن أردت التوقف عن الاستخدام، أغلق الصفحة.
        </p>
        <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-content-muted">
          راجع أيضًا{' '}
          <Link to="/terms" className="font-medium text-accent underline underline-offset-4">
            شروط الاستخدام
          </Link>
          .
        </p>
      </section>
    </article>
  );
}
