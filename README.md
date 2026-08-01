# 📄 رزومه‌ساز هوشمند AI

ساخت رزومه حرفه‌ای با کمک هوش مصنوعی — رایگان، بدون سرور، یک فایل HTML

🔗 **لینک:** [niksiratforex-ux.github.io/resume-builder](https://niksiratforex-ux.github.io/resume-builder/)

## ✨ ویژگی‌ها

### 🤖 هوش مصنوعی (Groq)
- **بهبود متن سابقه کاری** — متن ساده رو تبدیل کن به توضیحات حرفه‌ای با اعداد و ارقام
- **تولید خلاصه حرفه‌ای** — AI خلاصه معرفی رو خودش مینویسه
- **پیشنهاد مهارت** — بر اساس عنوان شغلی و سابقه، مهارت پیشنهاد میده
- مدل: **Llama 3.3 70B** از Groq (رایگان، سریع)

### 🎨 ۴ قالب حرفه‌ای
- **مدرن** — طراحی تمیز با گرادیانت بنفش
- **کلاسیک** — سبک رسمی و سنتی
- **خلاقانه** — رنگی و مدرن با کارت‌های برجسته
- **مینیمال** — ساده و مینیمال

### 📄 خروجی PDF
- دانلود مستقیم رزومه به صورت PDF
- کیفیت بالا (2x resolution)
- نام فایل خودکار بر اساس نام کاربر

### 💾 ذخیره‌سازی
- ذخیره خودکار در IndexedDB
- ذخیره چند رزومه با نام‌های مختلف
- بارگذاری و ویرایش رزومه‌های قبلی

### 🌐 پشتیبانی از پراکسی
- اتصال مستقیم به Groq API
- پشتیبانی از Cloudflare Worker برای مناطق محدود شده
- سیستم smartFetch (کپی از [Ai_Chat_With_Api](https://github.com/niksiratforex-ux/Ai_Chat_With_Api))

### 📱 PWA
- قابل نصب روی موبایل و دسکتاپ
- آفلاین کار میکنه (بدون قابلیت AI)
- Service Worker + Manifest

### 🎯 سایر
- 🌙/☀️ تم تاریک و روشن
- 🇮🇷 کاملاً فارسی با پشتیبانی RTL
- 📱 ریسپانسیو — موبایل، تبلت، دسکتاپ
- ⚡ بدون فریمورک — یک فایل HTML
- 🔒 بدون سرور — همه چیز در مرورگر

## 🚀 راه‌اندازی

### استفاده ساده (GitHub Pages)
فقط فایل `index.html` رو آپلود کن و GitHub Pages رو فعال کن.

### استفاده محلی
```bash
# با Python
python3 -m http.server 8080

# یا با Node.js
npx serve .

# مرورگر: http://localhost:8080
```

⚠️ فایل رو مستقیم با `file://` باز نکنید — بعضی APIها CORS بلاک میکنن.

## 🔑 تنظیم Groq API

1. برو به [console.groq.com/keys](https://console.groq.com/keys)
2. ثبت‌نام کن (رایگان)
3. کلید API بساز (`gsk_...`)
4. توی اپ وارد کن → تست بزن

**محدودیت:** ۳۰ درخواست در دقیقه (رایگان)

## ☁️ تنظیم Cloudflare Worker (اختیاری)

اگه اتصال مستقیم به Groq کار نمیکنه (محدودیت منطقه‌ای):

1. برو به [dash.cloudflare.com](https://dash.cloudflare.com)
2. Workers & Pages → Create Worker
3. کد زیر رو جایگزین کن و Deploy کن:

```javascript
export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }
    const url = new URL(request.url);
    const target = url.searchParams.get('url');
    if (!target) return new Response('OK', { headers: { 'Access-Control-Allow-Origin': '*' } });
    try {
      const res = await fetch(target, {
        method: request.method,
        headers: { 'Content-Type': 'application/json', 'Authorization': request.headers.get('Authorization') || '' },
        body: request.method !== 'GET' ? request.body : undefined,
      });
      return new Response(res.body, {
        status: res.status,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      });
    } catch (e) {
      return new Response(JSON.stringify({ _proxy: true, _error: e.message }), {
        status: 502,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      });
    }
  },
};
```

4. لینک Worker رو کپی کن (مثلا: `https://my-proxy.username.workers.dev/?url=`)
5. توی اپ، فیلد پراکسی رو پر کن → ذخیره → تست

## 📁 ساختار پروژه

```
resume-builder/
├── index.html          ← اپلیکیشن اصلی (تکفایل)
├── manifest.json       ← PWA manifest
├── service-worker.js   ← Service Worker
├── worker.js           ← کد Cloudflare Worker (اختیاری)
├── icons/              ← آیکون‌های PWA
│   └── icon-*.png
└── README.md           ← این فایل
```

## 🛠️ تکنولوژی‌ها

| تکنولوژی | کاربرد |
|---|---|
| HTML5 | ساختار صفحه |
| CSS3 | استایل‌دهی با CSS Variables |
| Vanilla JS | بدون فریمورک |
| Groq API | هوش مصنوعی (Llama 3.3 70B) |
| html2canvas | تبدیل HTML به تصویر |
| jsPDF | ساخت PDF |
| IndexedDB | ذخیره‌سازی محلی |
| Service Worker | PWA و آفلاین |

## 📄 مجوز

MIT License

## 👨💻 توسعه‌دهنده

**Mohsen Niksirat**
- 🐙 GitHub: [@niksiratforex-ux](https://github.com/niksiratforex-ux)
- 🌐 وبسایت: [readner.eu.cc](http://readner.eu.cc)
