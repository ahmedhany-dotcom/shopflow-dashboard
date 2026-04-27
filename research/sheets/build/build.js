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

const root = path.resolve(__dirname, '..');
const data = {
  plan:    load(path.join(root, '01-execution-plan.csv')),
  videos:  load(path.join(root, '02-videos-library.csv')),
  tools:   load(path.join(root, '03-tools-accounts.csv')),
  prompts: load(path.join(root, '04-prompts-library.csv')),
};

const tpl = fs.readFileSync(path.join(__dirname, 'template.html'),'utf8');
const out = tpl.replace('/*__DATA__*/', 'window.__DATA__ = ' + JSON.stringify(data) + ';');
fs.writeFileSync(path.join(root, 'local-brand-roadmap-offline.html'), out, 'utf8');
console.log('Wrote', path.join(root, 'local-brand-roadmap-offline.html'), '(' + out.length + ' bytes)');
console.log('Counts -> plan:', data.plan.length, 'videos:', data.videos.length, 'tools:', data.tools.length, 'prompts:', data.prompts.length);
