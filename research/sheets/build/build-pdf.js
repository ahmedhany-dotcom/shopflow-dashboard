const fs = require('fs');
const path = require('path');

function parseCSV(text){
  const rows=[]; let row=[]; let cur=''; let q=false;
  for(let i=0;i<text.length;i++){
    const c=text[i], n=text[i+1];
    if(q){
      if(c==='"' && n==='"'){cur+='"';i++;}
      else if(c==='"'){q=false;}
      else cur+=c;
    } else {
      if(c==='"'){q=true;}
      else if(c===','){row.push(cur);cur='';}
      else if(c==='\n'){row.push(cur);rows.push(row);row=[];cur='';}
      else if(c==='\r'){}
      else cur+=c;
    }
  }
  if(cur!==''||row.length){row.push(cur);rows.push(row);}
  return rows;
}
function toObjects(rows){
  if(!rows.length) return [];
  const head=rows[0].map(h=>h.trim());
  return rows.slice(1).filter(r=>r.length && r.some(v=>v && v.trim().length)).map(r=>{
    const o={}; head.forEach((h,i)=>o[h]=(r[i]??'').trim()); return o;
  });
}
function load(p){return toObjects(parseCSV(fs.readFileSync(p,'utf8')));}
function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function linkify(s){
  if(!s) return '';
  const safe = esc(s);
  return safe.replace(/(https?:\/\/[^\s,&<]+)/g,(u)=>`<a href="${u}">${u.replace(/^https?:\/\//,'').slice(0,60)}${u.length>68?'…':''}</a>`);
}

const root = path.resolve(__dirname, '..');
const data = {
  plan:    load(path.join(root, '01-execution-plan.csv')),
  videos:  load(path.join(root, '02-videos-library.csv')),
  tools:   load(path.join(root, '03-tools-accounts.csv')),
  prompts: load(path.join(root, '04-prompts-library.csv')),
};

// Group plan tasks by Day for nicer rendering
const byDay = {};
data.plan.forEach(r => {
  (byDay[r.Day] ||= []).push(r);
});

const dayOrder = Object.keys(byDay).sort((a,b)=>parseInt(a)-parseInt(b));

const planHTML = dayOrder.map(d=>{
  const rows = byDay[d];
  const totalMin = rows.reduce((a,r)=>a+(parseInt(r['Time (min)'])||0),0);
  const phase = rows[0].Phase;
  return `
  <div class="day-block">
    <h3>📅 يوم ${esc(d)} — ${esc(phase)} ${totalMin?`<small>(~${Math.round(totalMin/60*10)/10} ساعة)</small>`:''}</h3>
    <table>
      <thead><tr><th style="width:36px">#</th><th>التاسك</th><th>الخطوات</th><th style="width:70px">⏱️</th><th>الأداة</th><th>الناتج</th></tr></thead>
      <tbody>
      ${rows.map(r=>`
        <tr>
          <td><b>${esc(r['Task #'])}</b></td>
          <td><b>${esc(r['Task Title'])}</b></td>
          <td>${linkify(r['Action Steps'])}</td>
          <td>${esc(r['Time (min)'])}</td>
          <td>${linkify(r['Tool / Resource'])}</td>
          <td>${esc(r['Output / Deliverable'])}</td>
        </tr>
      `).join('')}
      </tbody>
    </table>
  </div>`;
}).join('\n');

// Videos grouped by stage
const vidStages = {};
data.videos.forEach(r => (vidStages[r.Stage] ||= []).push(r));
const videoHTML = Object.keys(vidStages).map(stage=>`
  <h3>🎬 ${esc(stage)}</h3>
  <table>
    <thead><tr><th>الأولوية</th><th>الصانع</th><th>الفيديو</th><th>المدة</th><th>تاريخ النشر</th><th>المشاهدات</th><th>اللينك</th></tr></thead>
    <tbody>
    ${vidStages[stage].map(r=>`
      <tr>
        <td><b>${esc(r.Priority)}</b></td>
        <td>${esc(r.Creator)}</td>
        <td><b>${esc(r['Video Title'])}</b><br/><small>${esc(r["Why It's The Best"])}</small></td>
        <td>${esc(r.Length)}</td>
        <td>${esc(r.Published)}</td>
        <td>${esc(r.Views)}</td>
        <td>${linkify(r['YouTube URL'])}</td>
      </tr>
    `).join('')}
    </tbody>
  </table>
`).join('\n');

// Tools grouped by category
const toolsCat = {};
data.tools.forEach(r => (toolsCat[r.Category] ||= []).push(r));
const toolsHTML = Object.keys(toolsCat).map(cat=>`
  <h3>🛠️ ${esc(cat)}</h3>
  <table>
    <thead><tr><th>الأداة</th><th>اللينك</th><th>ليه</th><th>التسعيرة</th><th>الأولوية</th><th>اليوم</th></tr></thead>
    <tbody>
    ${toolsCat[cat].map(r=>`
      <tr>
        <td><b>${esc(r['Tool / Account'])}</b></td>
        <td>${linkify(r.URL)}</td>
        <td>${esc(r.Why)}</td>
        <td>${esc(r.Pricing)}</td>
        <td>${esc(r.Priority)}</td>
        <td>${esc(r['When To Set Up'])}</td>
      </tr>
    `).join('')}
    </tbody>
  </table>
`).join('\n');

// Prompts grouped by phase
const promptPhase = {};
data.prompts.forEach(r => (promptPhase[r.Phase] ||= []).push(r));
const promptsHTML = Object.keys(promptPhase).map(ph=>`
  <h3>🧠 ${esc(ph)}</h3>
  ${promptPhase[ph].map(r=>`
    <div class="prompt-card">
      <div class="prompt-title"><b>${esc(r['Prompt Name'])}</b> <span class="pill">${esc(r['Use With'])}</span></div>
      <pre>${esc(r.Prompt)}</pre>
    </div>
  `).join('')}
`).join('\n');

const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8" />
<title>Local Brand Roadmap — كل الخطوات</title>
<style>
@page { size: A4; margin: 18mm 14mm; }

* { box-sizing: border-box; }

html, body {
  margin: 0; padding: 0;
  font-family: "Cairo", "Tajawal", "Segoe UI", "Helvetica Neue", Arial, sans-serif;
  font-size: 10.5pt;
  color: #0d1424;
  line-height: 1.55;
}

h1, h2, h3, h4 { color: #0b1530; margin: 0 0 8pt; }
h1 { font-size: 28pt; line-height: 1.15; }
h2 { font-size: 18pt; border-bottom: 2px solid #7c5cff; padding-bottom: 4pt; margin-top: 24pt; page-break-before: always; }
h2:first-of-type { page-break-before: auto; }
h3 { font-size: 13pt; color: #2a3658; margin-top: 16pt; }
small { color: #6b7a99; font-weight: 500; }
a { color: #2563eb; text-decoration: none; word-break: break-word; }
a:hover { text-decoration: underline; }
code { background:#eef1f8; padding: 1pt 4pt; border-radius: 3pt; font-family: ui-monospace, "SF Mono", Consolas, monospace; font-size: 9.5pt; }

.cover {
  text-align: center;
  padding: 60pt 20pt 40pt;
  background: linear-gradient(135deg, #7c5cff 0%, #22d3ee 100%);
  color: white;
  border-radius: 18pt;
  margin-bottom: 30pt;
}
.cover h1 { color: white; font-size: 32pt; margin-bottom: 12pt; }
.cover .sub { font-size: 14pt; opacity: 0.95; margin-bottom: 18pt; }
.cover .stats {
  display: flex; justify-content: center; gap: 24pt; flex-wrap: wrap;
  margin-top: 16pt;
}
.cover .stat { background: rgba(255,255,255,0.18); padding: 10pt 16pt; border-radius: 10pt; min-width: 100pt; }
.cover .stat b { display: block; font-size: 22pt; }
.cover .stat span { font-size: 10pt; opacity: 0.95; }

.toc { padding: 14pt 18pt; background: #f4f6fc; border-right: 4px solid #7c5cff; border-radius: 8pt; margin: 20pt 0; }
.toc h2 { border: 0; margin: 0 0 8pt; padding: 0; page-break-before: auto; }
.toc ol { margin: 0; padding-right: 18pt; }
.toc li { margin: 3pt 0; }

.callout {
  background: #fffbeb;
  border-right: 4px solid #f59e0b;
  padding: 12pt 16pt;
  border-radius: 8pt;
  margin: 14pt 0;
}
.callout.start { background: linear-gradient(135deg, #f0fdfa, #ecfeff); border-color: #22d3ee; }
.callout.success { background: #f0fdf4; border-color: #16a34a; }

table {
  width: 100%;
  border-collapse: collapse;
  margin: 8pt 0 14pt;
  page-break-inside: auto;
  font-size: 9.5pt;
}
thead { display: table-header-group; }
tr { page-break-inside: avoid; page-break-after: auto; }
th, td {
  border: 1px solid #d8dde8;
  padding: 5pt 7pt;
  text-align: right;
  vertical-align: top;
  word-wrap: break-word;
  overflow-wrap: anywhere;
}
th {
  background: #1e293b;
  color: white;
  font-weight: 600;
  font-size: 9pt;
}
tbody tr:nth-child(even) { background: #f8fafc; }

.day-block { page-break-inside: avoid; margin-bottom: 12pt; }

.steps-grid { display: block; margin: 12pt 0; }
.step-card {
  border: 1px solid #d8dde8;
  border-right: 4px solid #7c5cff;
  border-radius: 8pt;
  padding: 10pt 14pt;
  margin: 8pt 0;
  background: white;
  page-break-inside: avoid;
}
.step-card h4 { color: #4f46e5; font-size: 12pt; margin: 0 0 4pt; }

.prompt-card {
  border: 1px solid #d8dde8;
  border-radius: 8pt;
  padding: 10pt 14pt;
  margin: 8pt 0 14pt;
  background: #fafbfd;
  page-break-inside: avoid;
}
.prompt-title { margin-bottom: 4pt; font-size: 11pt; }
.prompt-card pre {
  background: #0f172a;
  color: #e2e8f0;
  padding: 10pt;
  border-radius: 6pt;
  font-family: ui-monospace, Consolas, monospace;
  font-size: 8.5pt;
  white-space: pre-wrap;
  word-break: break-word;
  margin: 4pt 0 0;
  direction: ltr;
  text-align: left;
}

.pill {
  display: inline-block;
  padding: 1pt 7pt;
  border-radius: 999pt;
  font-size: 8.5pt;
  background: #e0e7ff;
  color: #312e81;
  margin-right: 4pt;
}

ul, ol { margin: 6pt 0 6pt 0; padding-right: 18pt; }
li { margin: 3pt 0; }

.kpi-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 10pt;
  margin: 14pt 0;
}
.kpi { background: #f4f6fc; border-radius: 8pt; padding: 10pt 14pt; text-align: center; }
.kpi b { display:block; font-size: 22pt; color: #4f46e5; }
.kpi span { font-size: 9.5pt; color: #6b7a99; }

footer.page-footer {
  position: running(footer);
  text-align: center;
  font-size: 8pt;
  color: #6b7a99;
}
@page { @bottom-center { content: "Local Brand Roadmap · صفحة " counter(page) " من " counter(pages); font-size: 8pt; color: #6b7a99; } }
</style>
</head>
<body>

<div class="cover">
  <h1>🚀 Local Brand Roadmap</h1>
  <div class="sub">دليل شامل من A إلى Z لإطلاق Local Brand باستخدام Claude</div>
  <div class="stats">
    <div class="stat"><b>${data.plan.length}</b><span>تاسك يوم بيوم</span></div>
    <div class="stat"><b>${data.videos.length}</b><span>فيديو موثوق</span></div>
    <div class="stat"><b>${data.tools.length}</b><span>أداة وحساب</span></div>
    <div class="stat"><b>${data.prompts.length}</b><span>Prompt جاهز</span></div>
  </div>
  <div style="margin-top:18pt;font-size:11pt;opacity:0.9">حُدّث في 2026 · مصادر أجنبية فقط</div>
</div>

<div class="toc">
  <h2 style="page-break-before:auto !important">📑 جدول المحتويات</h2>
  <ol>
    <li>القرار الأول — افتح ده دلوقتي</li>
    <li>Greg Isenberg's 5-Step Idea Discovery Method</li>
    <li>الجدول الزمني الكامل (20 يوم)</li>
    <li>الخطة اليومية بالتفصيل (${data.plan.length} تاسك)</li>
    <li>مكتبة الفيديوهات (${data.videos.length} فيديو)</li>
    <li>الأدوات والحسابات والريبوهات (${data.tools.length})</li>
    <li>مكتبة الـ Prompts (${data.prompts.length})</li>
    <li>التوصية النهائية + Checklist اليوم 1</li>
  </ol>
</div>

<h2>1️⃣ القرار الأول — افتح ده دلوقتي</h2>

<div class="callout start">
  <h3 style="margin-top:0">🎬 الفيديو الأول والوحيد اللي تبدأ بيه النهارده</h3>
  <p><b>Greg Isenberg — How I use Reddit and AI to find winning startup ideas</b></p>
  <ul>
    <li>📅 يوليو 2024 · ⏱️ ~20 دقيقة · 👁️ <b>530,000+</b> مشاهدة</li>
    <li>🏆 الأكثر مشاهدة عالمياً في الموضوع ده</li>
    <li>👤 Greg Isenberg — صاحب Late Checkout · Podcast اسمه Startup Ideas · باع شركات بملايين</li>
    <li>🔗 <a href="https://www.youtube.com/watch?v=8vXoI7lUroQ">https://www.youtube.com/watch?v=8vXoI7lUroQ</a></li>
  </ul>
  <p><b>الناتج المطلوب آخر اليوم:</b> ملف <code>ideas.md</code> فيه على الأقل 20 فكرة براند مستخرجة من شكاوى حقيقية في Reddit.</p>
</div>

<h2>2️⃣ Greg Isenberg's 5-Step Idea Discovery Method</h2>

<p><b>ملحوظة مهمة:</b> Gummy Search اتقفل، البديل الرسمي هو <a href="https://ideabrowser.com/join">IdeaBrowser</a>.</p>

<div class="step-card">
  <h4>Step 1 — Find Trending Subreddits via IdeaBrowser</h4>
  <ul>
    <li>استخدم <a href="https://ideabrowser.com/join">IdeaBrowser</a> (بديل Gummy Search).</li>
    <li>ركّز على communities من <b>10K-100K member</b> — تجاوب على سؤال "Why now?".</li>
    <li>راقب daily / weekly / monthly growth trends.</li>
    <li>اختار niches فيها <b>unfair advantage</b> عندك.</li>
  </ul>
</div>

<div class="step-card">
  <h4>Step 2 — Analyze Subreddit for Problems & Solutions</h4>
  <ul>
    <li>ضيف الـ subreddits لـ "audience" واحد في IdeaBrowser.</li>
    <li><b>Pain & Anger</b> — افحص الشكاوى الأكثر تكراراً.</li>
    <li><b>Advice Requests</b> — اللي الناس بتسأل عنه = blind spots في السوق.</li>
    <li><b>Solution Requests</b> — المنافسة الموجودة + الأدوات اللي الناس عايزة تكون موجودة.</li>
    <li><b>🔑 Key:</b> دوّن الـ themes المتكررة، مش الـ one-offs.</li>
  </ul>
</div>

<div class="step-card">
  <h4>Step 3 — Identify Creators in the Niche</h4>
  <ul>
    <li>استخدم <a href="https://perplexity.ai">Perplexity.ai</a> تلاقي top influencers.</li>
    <li>ابحث على YouTube عن أشهر فيديوهاتهم.</li>
    <li><b>اقرأ الكومنتات</b> — هي اللي هتفهمك احتياجات الجمهور.</li>
    <li>طبّق على <b>20-25 فيديو</b> عشان تاخد deep insights.</li>
    <li>النتيجة: تفكر زي جمهورك المستهدف.</li>
  </ul>
</div>

<div class="step-card">
  <h4>Step 4 — Wireframe Your Solution</h4>
  <ul>
    <li>على أساس الـ insights، اعمل sketch للمنتج/الخدمة.</li>
    <li>استخدم <a href="https://framer.com">Framer</a> للـ prototyping السريع.</li>
    <li>اختار اسم catchy + relevant + .com-able.</li>
    <li>مثال Greg: <b>DesignScientist.com</b> — تصميم مركّز على conversion.</li>
  </ul>
</div>

<div class="step-card">
  <h4>Step 5 — Create Content That Resonates</h4>
  <ul>
    <li>استخدم خاصية "Top Content" في IdeaBrowser.</li>
    <li>حلّل اللي بيشتغل في الـ community (Memes? Long-form? Lists?).</li>
    <li>اسأل AI عن content preferences.</li>
    <li>🤖 عامل Claude/ChatGPT كـ <b>"Entrepreneurial Assistant"</b>.</li>
  </ul>
</div>

<h2>3️⃣ الجدول الزمني الكامل — 20 يوم</h2>

<table>
  <thead><tr><th>الأسبوع</th><th>المرحلة</th><th>الناتج</th></tr></thead>
  <tbody>
    <tr><td><b>الأسبوع 1</b><br/>(يوم 1-8)</td><td>الفكرة + التحقق + المنافسين + بناء البراند</td><td>brand-context.md, brand-voice.md, content-pillars.md, competitor spreadsheet, top 3 ideas validated</td></tr>
    <tr><td><b>الأسبوع 2</b><br/>(يوم 9-14)</td><td>الموتور التقني — Claude + Skills + GitHub</td><td>Claude Project + 32 Marketing Skill + GitHub MCP + Content calendar + GitHub Action</td></tr>
    <tr><td><b>الأسبوع 3</b><br/>(يوم 15-19)</td><td>موقع 3D + الإطلاق</td><td>Three.js → R3F → Custom 3D website live على Vercel + Search Console + Analytics</td></tr>
    <tr><td><b>بعد ذلك</b><br/>(يوم 20+)</td><td>iterate أسبوعياً وشهرياً</td><td>Claude يطلع PRs بتحسينات تلقائياً + شهرياً re-scan للمنافسين</td></tr>
  </tbody>
</table>

<h2>4️⃣ الخطة اليومية بالتفصيل (${data.plan.length} تاسك)</h2>
${planHTML}

<h2>5️⃣ مكتبة الفيديوهات (${data.videos.length} فيديو)</h2>
${videoHTML}

<h2>6️⃣ الأدوات والحسابات والريبوهات (${data.tools.length})</h2>
${toolsHTML}

<h2>7️⃣ مكتبة الـ Prompts (${data.prompts.length})</h2>
<p>كل Prompt جاهز للنسخ-اللصق في Claude أو ChatGPT. بدّل [النصوص بين الأقواس] بمحتواك.</p>
${promptsHTML}

<h2>8️⃣ التوصية النهائية + Checklist اليوم 1</h2>

<div class="callout success">
  <h3 style="margin-top:0">✅ Checklist لو هتبدأ النهارده فعلياً</h3>
  <ul>
    <li>☐ سجلت في <a href="https://ideabrowser.com/join">IdeaBrowser</a> (Free trial).</li>
    <li>☐ فتحت Greg Isenberg #1 (https://www.youtube.com/watch?v=8vXoI7lUroQ) واتفرجت عليه كامل.</li>
    <li>☐ عملت ملف <code>ideas.md</code> على جهازي.</li>
    <li>☐ جربت 4 من Google Reddit hacks على مجالي.</li>
    <li>☐ لقيت 5-10 subreddits بحجم 10K-100K member.</li>
    <li>☐ ضفتهم في "audience" واحد في IdeaBrowser.</li>
    <li>☐ راجعت Pain & Anger / Advice Requests / Solution Requests.</li>
    <li>☐ عندي <b>20 فكرة على الأقل</b> قبل ما أنام.</li>
  </ul>
</div>

<h3>💡 أعلى 5 قرارات هتحسم النجاح</h3>
<ol>
  <li><b>متبدأش بناء البراند قبل ما تلاقي الفكرة.</b> Greg Isenberg الأول، مش Caleb Ralston.</li>
  <li><b>Subreddits 10K-100K members بس.</b> الـ Sweet Spot الذهبي.</li>
  <li><b>اشترك في Claude Pro/Max.</b> توفير ساعات يومياً — مش ترف.</li>
  <li><b>اشتغل بالـ workbook بتاع Caleb فعلياً.</b> الفرق بين النجاح والفشل = هل خلصته ولا لأ.</li>
  <li><b><code>CLAUDE.md</code> في كل ريبو.</b> هو الـ rules اللي Claude يتبعها.</li>
</ol>

<h3>💸 التكلفة التقريبية (USD/شهر)</h3>
<table>
  <tbody>
    <tr><td>Claude Pro</td><td>$20</td></tr>
    <tr><td>Claude Max (لو heavy user)</td><td>$100-200</td></tr>
    <tr><td>Domain</td><td>~$10/سنة</td></tr>
    <tr><td>Vercel/Netlify</td><td>$0 (Hobby)</td></tr>
    <tr><td>IdeaBrowser</td><td>Free trial → ~$30/mo</td></tr>
    <tr><td>Plausible (analytics)</td><td>$9</td></tr>
    <tr><td><b>الحد الأدنى</b></td><td><b>~$25/شهر</b></td></tr>
    <tr><td><b>كل الـ paid tools</b></td><td><b>~$300/شهر</b></td></tr>
  </tbody>
</table>

<div class="callout">
  <h3 style="margin-top:0">📦 الملفات الكاملة للـ Roadmap</h3>
  <ul>
    <li><b>الداشبورد التفاعلي offline:</b> local-brand-roadmap-offline.html (90 KB · يفتح بدون انترنت)</li>
    <li><b>الـ CSVs:</b> 4 ملفات تستوردهم في Excel/Google Sheets</li>
    <li><b>المراجع:</b> local-brand-with-claude-roadmap.md + FINAL-RECOMMENDATION.md</li>
    <li><b>الحزمة الكاملة:</b> local-brand-roadmap-bundle.zip</li>
  </ul>
  <p>كلهم في مستودع GitHub: <a href="https://github.com/ahmedhany-dotcom/shopflow-dashboard/pull/1">PR #1</a></p>
</div>

</body>
</html>`;

const outHtml = path.join(__dirname, 'pdf-source.html');
fs.writeFileSync(outHtml, html, 'utf8');
console.log('Wrote PDF source HTML:', outHtml, '(' + html.length + ' bytes)');
console.log('Counts -> plan:', data.plan.length, 'videos:', data.videos.length, 'tools:', data.tools.length, 'prompts:', data.prompts.length);
