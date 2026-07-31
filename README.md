# رؤيـة | Vision Platform

منصة تعليمية متكاملة للنظام الثانوي المصري بتصميم مستقبلي رائع وتقنيات حديثة.

---

## 🔑 إعدادات Firebase وتعيين متغيرات البيئة (Environment Variables)

تستخدم منصة رؤية إطار **Vite** لتجميع التطبيق. يتطلب Vite تسمية جميع متغيرات البيئة ببادئة `VITE_` حتى تصبح قابلة للاستدعاء عبر `import.meta.env.VITE_*`.

### 1. التطوير المحلي (Local Development)
1. انسخ ملف `.env.example` إلى `.env`:
   ```bash
   cp .env.example .env
   ```
2. احصل على مفاتيح تطبيق الويب من **[Firebase Console](https://console.firebase.google.com/)**:
   - إعدادات المشروع (Project Settings) ← عام (General) ← تطبيق الويب (Web App).
3. استبدل القيم النموذجية بالقيم الحقيقية لمشروعك في ملف `.env`:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
   VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXX
   ```

---

### 2. النشر على Vercel (Vercel Deployment Guide)

عند رفع التطبيق على منصة **Vercel**، يجب إضافة جميع متغيرات البيئة في لوحة تحكم Vercel لتجنب خطأ `auth/invalid-api-key`:

1. التوجه إلى لوحة تحكم **Vercel Dashboard**.
2. اختيار مشروع **Platform**.
3. الذهاب إلى: **Settings** ← **Environment Variables**.
4. إضافة المتغيرات السبعة بنفس الأسماء والمفاتيح الحقيقية:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_MEASUREMENT_ID`
5. التأكد من تحديد بيئات العمل الثلاث: **Production** و **Preview** و **Development**.
6. إطلاق نشر جديد (Redeploy) على Vercel ليتم دمج المفاتيح الجديدة أثناء مرحلة البناء (`vite build`).

---

## 🛠️ أوامر التشغيل والبناء

```bash
# تشغيل خادم التطوير المحلي
npm run dev

# بناء النسخة الإنتاجية
npm run build

# معاينة البناء الإنتاجي
npm run preview
```
