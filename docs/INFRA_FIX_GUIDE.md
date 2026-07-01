# دليل إصلاح البنية التحتية والنطاق — LahbabiGuide

> **السبب الجذري:** النطاق `lahbabiguide.com` يخدم حالياً موقع **Astro** آخر (BadilHost) على Vercel، وليس تطبيق Next.js الخاص بك. الـ canonical وog:url يشيران إلى `badilhost.com`. النتيجة: Google يؤرشف المحتوى تحت نطاق خاطئ → أرشفة سيئة + أرباح AdSense ضعيفة.
>
> هذا الدليل مكتوب باللون الأبيض/الأسود: كل خطوة هنا **تُنفّذها أنت يدوياً** في لوحة DNS وVercel. لا يلمس الكود شيئاً من هذا. بعد كل نشر، شغّل `node scripts/seo/verify-deployment.mjs` للتأكد.

---

## الهدف النهائي

`https://lahbabiguide.com` (والنسخة `www`) تخدمان تطبيق Next.js المنشور على Coolify، مع:
- canonical = `https://lahbabiguide.com`
- لا وجود لأي إشارة إلى `badilhost.com`
- تحويل 301 دائم بين نسختي النطاق (apex ↔ www) لاختيار واحدة رئيسية
- شهادة SSL سارية على كلتا النسختين

---

## الخطوة 1: تأكيد أن Coolify يخدم التطبيق بشكل صحيح

1. افتح لوحة Coolify وافتح خدمة LahbabiGuide.
2. تأكد أن الحاوية تعمل وأن البناء الأخير ناجح (status: running / healthy).
3. Coolify يعطيك **Domain** (مثل `https://lahbabiguide.اسم-خادمك.com` أو IP مباشر). افتحه في المتصفح وتأكد:
   - ترى موقع LahbabiGuide (وليس BadilHost)
   - عند فتح View Source: تجد `/_next/` و`data-astro` **غير موجودة**
4. **هام:** فعّل SSL (Let's Encrypt) من إعدادات Coolify على هذا النطاق المؤقت للتأكد من نجاح الشهادة.

> إذا فشل SSL هنا، أصلحه أولاً (عادة مسألة 80/443 مفتوحة في جدار الحماية). بدون SSL صالح على Coolify، لن تنجح الخطوات التالية.

---

## الخطوة 2: تحديد النطاق الرئيسي (اختر واحداً)

اخترتُ لك **`https://lahbabiguide.com`** (بدون www) كنطاق رئيسي لأنه:
- مطابق لكل canonical الموجود في الكود (`https://lahbabiguide.com`)
- أقصر وأسهل للأرشفة والذاكرة

> إذا أردت `www` كرئيسي، أخبرني وسأعدّل `lib/seo/site.ts` وكل المراجع. لكن القاعدة: **اختر واحداً والزمه**.

---

## الخطوة 3: تحديث سجلات DNS في لوحة المسجّل / Cloudflare

افتح لوحة إدارة DNS الخاصة بنطاقك (Cloudflare, Namecheap, GoDaddy...).

### 3.1 سجل A للـ apex (`lahbabiguide.com`)

```
النوع: A
الاسم: @   (أو LahbabiGuide.com مباشرة)
القيمة: <IP العام لخادم Coolify>
TTL: Auto / 3600
Proxy: DNS only  (مهم! لا تفعل Cloudflare proxy مؤقتاً أثناء الإعداد)
```

للحصول على IP خادم Coolify: من سطر الأوامر في الخادم شغّل `curl -4 ifconfig.me` أو انظر في لوحة Coolify.

### 3.2 سجل CNAME للـ www

```
النوع: CNAME
الاسم: www
القيمة: lahbabiguide.com   (أو اسم خادم Coolify إذا أردت)
TTL: Auto / 3600
Proxy: DNS only
```

### 3.3 إزالة أي سجل قديم يشير إلى Vercel

**هذه الخطوة الأهم.** ابحث عن أي سجل يشير إلى `cname.vercel-dns.com` أو IP خاص بـ Vercel واحذفه/استبدله. إذا بقي، ستستمر DNS في توجيه الزوار إلى مشروع BadilHost.

---

## الخطوة 4: تنظيف ارتباط النطاق مع Vercel

حتى لو حذّفت سجل DNS، قد يبقى النطاق مرتبطاً بمشروع Vercel القديم. لضمان القطع الكامل:

1. ادخل [vercel.com/dashboard](https://vercel.com/dashboard)
2. افتح **مشروع BadilHost** (أو أي مشروع يخدم `lahbabiguide.com`)
3. اذهب إلى **Settings → Domains**
4. احذف `lahbabiguide.com` و`www.lahbabiguide.com` من المشروع
5. تأكد في **Settings → Domains** لمشروع LahbabiGuide (إن كان موجوداً على Vercel أيضاً) أنه لا يطالب بهذا النطاق

> **لماذا؟** Vercel يستخدم "domain verification" عالمياً. طالما النطاق مرتبط بمشروع على Vercel، قد يظل يلتقط الطلبات حتى لو DNS يشير لمكان آخر.

---

## الخطوة 5: إعداد Coolify لاستقبال النطاق

1. في لوحة Coolify → خدمة LahbabiGuide → **Domains**
2. أضف `https://lahbabiguide.com,https://www.lahbabiguide.com` (مفصولة بفاصلة)
3. Coolify سيطلب تلقائياً شهادة Let's Encrypt لكلتيهما. انتظر 1-2 دقيقة.
4. إذا فشل الإصدار، تحقق من:
   - المنفذان 80 و443 مفتوحان في جدار حماية الخادم
   - أن سجلات DNS انتشرت (استخدم `nslookup lahbabiguide.com` من جهازك)

---

## الخطوة 6: إعداد التحويل 301 (نسخة www → apex)

Coolify لا يضيف تلقائياً تحويلاً من www إلى apex. الطريقة الأنظف:

### الخيار A (مُوصى به): عبر إعدادات Coolify/Nginx
في إعدادات النطاق داخل Coolify، فعّل **"Redirect www to non-www"** إن وجد، أو أضف في إعدادات Nginx/Proxy:

```nginx
server {
    listen 443 ssl;
    server_name www.lahbabiguide.com;
    return 301 https://lahbabiguide.com$request_uri;
}
```

### الخيار B: عبر Cloudflare (إن استخدمته لاحقاً)
Rules → Redirect Rules → إضافة قاعدة: إذا host = `www.lahbabiguide.com` → 301 إلى `https://lahbabiguide.com${http.request.uri}`

> الهدف: `curl -sIL https://www.lahbabiguide.com/robots.txt` يجب أن يرجع **301** (وليس 307 أو 200) وينتهي عند `https://lahbabiguide.com/robots.txt`.

---

## الخطوة 7: نشر التطبيق المحدّث

بعد تطبيق كل تحسينات الكود المحلية:

1. انقل الملفات المحدّثة إلى خادم Coolify (git pull أو رفع مباشر حسب إعدادك)
2. Coolify سيبني تلقائياً (أو اضغط Deploy يدوياً)
3. انتظر اكتمال البناء (يفترض أن يولّد 77 صفحة static كما كان)

---

## الخطوة 8: التحقق النهائي (هام جداً)

من جهازك المحلي، شغّل:

```bash
node scripts/seo/verify-deployment.mjs
```

يجب أن يطبع **كل الفحوصات ✓ PASS**. أي ✗ FAIL = اتبع رسالة الخطأ.

### فحوصات يدوية سريعة (احتياطية)

```bash
# 1. من أي متصفح/سطر أوامر: يجب أن يخدم Next.js
curl -s https://lahbabiguide.com/ | grep -c "data-astro"   # يجب أن يكون 0
curl -s https://lahbabiguide.com/ | grep -c "_next"        # يجب أن يكون > 0

# 2. canonical صحيح
curl -s https://lahbabiguide.com/ | grep -o 'rel="canonical"[^>]*'
# يجب أن يكون: href="https://lahbabiguide.com/"

# 3. التحويل 301
curl -s -o /dev/null -w "%{http_code}" https://www.lahbabiguide.com/
# يجب أن يكون 301 (في النهاية) أو يصل إلى 200 على apex

# 4. ads.txt و robots.txt و sitemap
curl -s https://lahbabiguide.com/ads.txt        # يحتوي pub-6564248523089374
curl -s https://lahbabiguide.com/robots.txt     # يحتوي Sitemap: https://lahbabiguide.com/sitemap.xml
curl -s https://lahbabiguide.com/sitemap.xml | grep -c "<loc>"   # > 50
```

---

## الخطوة 9: إعادة الارتباط مع Google (بعد نجاح كل ما سبق)

انتقل إلى `docs/POST_LAUNCH_INDEXING.md` لخطوات Google Search Console وطلب إعادة الفهرسة.

---

## قائمة فحص مختصرة (Checklist)

- [ ] خادم Coolify يعمل والبناء ناجح
- [ ] SSL يعمل على نطاق Coolify المؤقت
- [ ] سجل A يشير إلى IP خادم Coolify
- [ ] حُذِف سجل DNS القديم الخاص بـ Vercel
- [ ] حُذِف النطاق من مشروع BadilHost على Vercel
- [ ] Coolify يخدم `lahbabiguide.com` و`www.lahbabiguide.com`
- [ ] شهادة Let's Encrypt صالحة لكليهما
- [ ] تحويل 301 من www إلى apex
- [ ] `node scripts/seo/verify-deployment.mjs` كله PASS
- [ ] لا وجود لـ `data-astro` أو `badilhost.com` في المصدر

---

## استكشاف الأخطاء الشائعة

| المشكلة | السبب المحتمل | الحل |
|---------|--------------|------|
| ما زال يعرض BadilHost | DNS لم ينتشر بعد أو سجل Vercel ما زال موجوداً | انتظر 5-30 دقيقة (DNS propagation)، احذف النطاق من Vercel نهائياً |
| `curl` يرجع 307 بدل 301 | تحويل مؤقت من Vercel/مزول | تأكد أن الطلب لا يمر عبر Vercel إطلاقاً |
| شهادة SSL فاشلة | منفذ 80/443 مغلق أو DNS لم ينتشر | افتح المنافذ، انتظر انتشار DNS، أعد طلب الشهادة |
| `verify-deployment.mjs` يقول "badilhost canonical" | ما زال الكود/النطاق يشير للقديم | راجع الخطوة 4 (حذف من Vercel) والخطوة 5 (Coolify) |
| الصفحة بيضاء بعد النشر | خطأ build أو متغيرات بيئة ناقصة | راجع logs Coolify، تأكد `DATABASE_URL` و`GEMINI_API_KEY` مضبوطان |

---

## ملاحظة عن بيانات الاعتماد

لا تضع `ca-pub-6564248523089374` (معرّف AdSense) في متغيرات بيئة — هو موجود حالياً في الكود كنص صلب، وهذا مقبول لمعرّف الناشر العام (ليس سراً). لكن `GEMINI_API_KEY` و`DATABASE_URL` و`AUTH_SECRET` **يجب** أن تكون في متغيرات بيئة Coolify، وليست في الكود.
