# 🚀 دليل النشر - VidCatch Pro

## نظرة عامة
هذا الدليل يوضح كيفية نشر VidCatch Pro على Netlify وإعداد البيئة بشكل صحيح.

## متطلبات النشر

### 1. المتطلبات الأساسية
- حساب GitHub (تم الإعداد ✅)
- حساب Netlify (مجاني)
- Node.js 18+ للتطوير المحلي

### 2. إعدادات البناء
```bash
Build command: npm run build
Publish directory: dist
Node.js version: 18
```

## خطوات النشر على Netlify

### الطريقة الأولى: الربط المباشر مع GitHub

1. **تسجيل الدخول إلى Netlify**
   - اذهب إلى [netlify.com](https://netlify.com)
   - سجل دخول أو أنشئ حساب جديد

2. **إضافة موقع جديد**
   - اضغط على "Add new site"
   - اختر "Import an existing project"
   - اختر "Deploy with GitHub"

3. **ربط المستودع**
   - ابحث عن `VideoMaster`
   - اختر المستودع الصحيح

4. **إعدادات البناء**
   ```
   Branch to deploy: main
   Build command: npm run build
   Publish directory: dist
   ```

5. **متغيرات البيئة (اختياري)**
   ```
   NODE_VERSION=18
   NPM_VERSION=9
   GENERATE_SOURCEMAP=false
   ```

### الطريقة الثانية: النشر اليدوي

```bash
# 1. بناء المشروع
npm run build

# 2. تثبيت Netlify CLI
npm install -g netlify-cli

# 3. تسجيل الدخول
netlify login

# 4. النشر
netlify deploy --prod --dir=dist
```

## إعدادات مخصصة

### Domain والدومين
1. في لوحة تحكم Netlify:
   - اذهب إلى Site settings
   - Domain management
   - أضف domain مخصص إذا كان متوفراً

### SSL/TLS
- Netlify يوفر SSL مجاناً تلقائياً
- سيكون متاح خلال دقائق من النشر

### الإعدادات الأمنية
الملف `netlify.toml` يحتوي على:
- إعدادات الأمان Headers
- Redirects للـ SPA
- تحسينات التخزين المؤقت

## مراقبة الأداء

### Analytics
- فعل Netlify Analytics في الإعدادات
- راقب Core Web Vitals
- تابع معدل الارتداد والزيارات

### مراقبة الأخطاء
```javascript
// إضافة في المستقبل
// Sentry أو LogRocket للمراقبة
```

## التحسينات المطلوبة

### بعد النشر الأول:
1. **إعداد CDN**
   - Netlify يوفر CDN تلقائياً
   - تأكد من تفعيل Asset Optimization

2. **تحسين الصور**
   ```bash
   # أضف في المستقبل
   npm install next-optimized-images
   ```

3. **إعداد Analytics**
   - Google Analytics 4
   - Netlify Analytics

4. **إعداد البحث**
   - Google Search Console
   - Submit Sitemap: https://yoursite.netlify.app/sitemap.xml

## استكشاف الأخطاء

### مشاكل البناء الشائعة:

1. **خطأ في التبعيات**
   ```bash
   # حل: مسح cache وإعادة التثبيت
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **خطأ في البناء**
   ```bash
   # تشغيل البناء محلياً للاختبار
   npm run build
   ```

3. **مشاكل التوجيه (Routing)**
   - تأكد من وجود `_redirects` أو `netlify.toml`
   - تحقق من إعدادات SPA

### لوج الأخطاء:
- تحقق من Netlify deploy logs
- استخدم browser developer tools
- راجع Network tab للأخطاء

## الصيانة والتحديث

### التحديثات الدورية:
```bash
# تحديث التبعيات
npm update

# تحقق من الثغرات الأمنية
npm audit

# إصلاح الثغرات
npm audit fix
```

### النسخ الاحتياطي:
- GitHub يحفظ كل التاريخ
- Netlify يحتفظ بـ deploy history
- أنشئ releases للإصدارات المهمة

## متغيرات البيئة للإنتاج

```bash
# في Netlify Dashboard > Site settings > Environment variables
VITE_API_URL=https://api.vidcatch.pro
VITE_SITE_URL=https://vidcatch.pro
VITE_GTM_ID=GTM-XXXXXXX (إذا توفر)
```

## الأمان في الإنتاج

### Headers الأمنية (في netlify.toml):
- Content Security Policy
- X-Frame-Options
- X-XSS-Protection
- HSTS headers

### مراقبة الأمان:
- فعل Netlify Security headers
- استخدم Security Scorecard tools
- راقب SSL certificate expiry

---

## ✅ Checklist قبل النشر

- [ ] تم اختبار البناء محلياً
- [ ] تم تحديث متغيرات البيئة
- [ ] تم اختبار جميع الصفحات
- [ ] تم اختبار التجاوب على الأجهزة المختلفة
- [ ] تم تحسين الصور والأصول
- [ ] تم إعداد redirects الصحيحة
- [ ] تم اختبار SEO meta tags
- [ ] تم إعداد sitemap.xml
- [ ] تم إعداد robots.txt

## 🔗 روابط مفيدة

- [Netlify Docs](https://docs.netlify.com/)
- [Vite Deployment Guide](https://vitejs.dev/guide/build.html)
- [React Router + Netlify](https://create-react-app.dev/docs/deployment/#netlify)

---

**ملاحظة**: هذا الدليل سيتم تحديثه مع إضافة ميزات جديدة وحل مشاكل جديدة أثناء الاستخدام الفعلي.