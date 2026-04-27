# ⭐ التوصية النهائية — أفضل مسار تنفيذي

## 🎯 الإجابة المباشرة على "أعمل إيه دلوقتي؟"

افتح اللينك ده دلوقتي قبل أي حاجة تانية:

🔗 **https://www.youtube.com/watch?v=8vXoI7lUroQ**

> *Greg Isenberg — How I use Reddit and AI to find winning startup ideas*
> 530K+ مشاهدة · ~20 دقيقة · يوليو 2024
> Greg = صاحب Late Checkout · باع شركات بملايين · Podcast اسمه "Startup Ideas"

اتفرج، افتح ملف `ideas.md`، استخدم الـ Reddit hacks، **اطلع بـ 20 فكرة آخر اليوم**.

---

## 📊 الشيتس (مفتوحة في Excel/Google Sheets)

| الشيت | الوصف |
|---|---|
| [`sheets/01-execution-plan.csv`](sheets/01-execution-plan.csv) | كل التاسكات يوم بيوم (75+ تاسك) |
| [`sheets/02-videos-library.csv`](sheets/02-videos-library.csv) | 40+ فيديو موثوق مرتب بالأولوية |
| [`sheets/03-tools-accounts.csv`](sheets/03-tools-accounts.csv) | كل الأدوات والحسابات والريبوهات |
| [`sheets/04-prompts-library.csv`](sheets/04-prompts-library.csv) | Prompts جاهزة للنسخ |
| [`sheets/index.html`](sheets/index.html) | **داشبورد تفاعلي** يجمعهم كلهم — افتحه في المتصفح |

### إزاي تفتح الداشبورد محلياً
```bash
cd research/sheets
npx http-server .
# افتح http://localhost:8080
```
أو على VS Code استخدم اكستنشن "Live Server" بزر يمين على `index.html`.

---

## 🗓️ الجدول الزمني المقترح (20 يوم تقريباً)

### الأسبوع 1 — اللي ميغناش عنه: الفكرة + التحقق + المنافسين

| اليوم | الموضوع | أهم فيديو واحد | الناتج |
|---|---|---|---|
| **1** | لقاء فكرة | Greg Isenberg #1 (Reddit + AI) | 20 فكرة في `ideas.md` |
| **2** | تعميق Idea Machine | Greg Isenberg #2 (FULL Blueprint - 2025) | +10 أفكار من ChatGPT history + Friction audit |
| **3** | Validation | Amardeep Parmar + FLAME 4-Pillar | Top 3 ideas validated |
| **4** | تحليل المنافسين | Access Genie (Step-by-Step) | Spreadsheet لـ 5 منافسين |
| **5** | Brand mindset | Marty Neumeier + Shopify Overview | `brand-context.md` |
| **6-8** | بناء البراند | **Caleb Ralston Full Course** (5h على 3 جلسات) + workbook | `brand-voice.md` + `content-pillars.md` + first 3 posts/videos drafted |

### الأسبوع 2 — الموتور التقني (Claude + GitHub)

| اليوم | الموضوع | الناتج |
|---|---|---|
| **9** | Tooling setup | Node + Git + VS Code + Claude Desktop + Docker + GitHub PAT + repo `[brand]-hq` |
| **10** | Claude setup | Claude Project + Anthropic Skills + Marketing Skills (32) + GitHub MCP + Firecrawl MCP |
| **11** | Content engine | 30-day calendar + 5 جاهزين للنشر + Octoparse weekly monitoring |
| **12** | Data + Analytics | Plausible/GA4/Search Console/PostHog connected to Claude |
| **13** | Git skills | freeCodeCamp Git/GitHub course done |
| **14** | GitHub Actions | DevOps Directive + Claude GitHub Action (`@claude` works in PRs) |

### الأسبوع 3 — موقع 3D + الإطلاق

| اليوم | الموضوع | الناتج |
|---|---|---|
| **15** | Three.js basics | Three.js 101 + Vite project scaffolded |
| **16** | R3F portfolio | JS Mastery 5h tutorial + Hero working |
| **17-18** | Creative frontend | JS Mastery 10h Creative Frontend + scroll animations + sections + perf |
| **19** | Launch | Domain + Vercel + analytics + Search Console + first content live |

### بعد الإطلاق (شهرياً)
- **أسبوعياً**: Claude يطلع تقرير من PostHog + Search Console ويفتح PR بـ 3 تحسينات.
- **شهرياً**: re-scan للمنافسين تلقائي.
- **ربع سنوي**: review كامل للـ brand-context.md و brand-voice.md.

---

## 💡 أعلى 5 قرارات هتحسم النجاح

1. **متبدأش بناء البراند قبل ما تلاقي الفكرة.** ده الخطأ الأكبر — Greg Isenberg #1 هو أول فيديو، ومش Caleb Ralston.
2. **اختار subreddits 10K-100K members بس** — كبيرة كفاية فيها مشاكل، صغيرة كفاية مش مزدحمة.
3. **اشترك في Claude Pro/Max** — مش ترف، ده عقل البراند كله. Skills + Projects = توفير ساعات يومياً.
4. **اشتغل بالـ workbook بتاع Caleb** فعلياً مش بس تتفرج. الفرق بين اللي ينجح واللي يفشل = هل خلص الـ workbook ولا لأ.
5. **`CLAUDE.md` في كل ريبو** — هو الـ rules اللي Claude يتبعها. لو مش موجود، Claude يخمن ويغلط.

---

## 🛒 التكلفة التقريبية (USD/شهر)

| البند | التكلفة |
|---|---|
| Claude Pro (الحد الأدنى) | $20 |
| Claude Max (لو Heavy user) | $100-200 |
| Domain | ~$10/سنة |
| Vercel/Netlify | $0 (Hobby) |
| Plausible (لو فضّلته على GA4) | $9 |
| SEMrush/Osum trials | $0 (free trials) ثم اختياري |
| **الحد الأدنى** | **~$25/شهر** |
| **مع كل الـ paid tools** | **~$300/شهر** |

تقدر تبدأ بالحد الأدنى لحد ما البراند يبدأ يجيب فلوس.

---

## ✅ Checklist لو هتبدأ النهارده فعلياً

- [ ] فتحت Greg Isenberg #1 (https://www.youtube.com/watch?v=8vXoI7lUroQ).
- [ ] عملت ملف `ideas.md` على جهازي.
- [ ] جربت 3 من Google Reddit hacks على مجالي.
- [ ] لقيت 5 subreddits بحجم 10K-100K member.
- [ ] قرأت top 50 post وكتبت كل complaint.
- [ ] عندي **20 فكرة على الأقل** قبل ما أنام.

لو خلصت الـ checklist ده النهارده، إنت سابق 95% من اللي بيفكروا يبدأوا براند ومش بيبدأوا.

---

## 📚 المراجع الأساسية في الـ repo

- **الخريطة الكاملة**: [`research/local-brand-with-claude-roadmap.md`](local-brand-with-claude-roadmap.md)
- **الشيتس**: [`research/sheets/`](sheets/)
- **الداشبورد التفاعلي**: [`research/sheets/index.html`](sheets/index.html)

---

> 🔥 ملحوظة أخيرة: المعلومات هنا حُدّثت في 2026 بناءً على بحث موثق على YouTube و GitHub و Anthropic Docs و Reddit. كل المصادر أجنبية (إنجليزي) كما طُلب. لو احتجت أعمل لك Starter Repo جاهز فيه `CLAUDE.md` + `brand-context.md` + R3F Vite template + GitHub Actions، طلب كده وأبنيه.
