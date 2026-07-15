const slides=[...document.querySelectorAll('.slide')];
const rail=document.querySelector('.rail');
const counter=document.querySelector('#counter');
const overview=document.querySelector('#overview');
const grid=document.querySelector('#overviewGrid');
const progress=document.querySelector('#videoProgress');
const themePanel=document.querySelector('#themePanel');
const playBtn=document.querySelector('#playBtn');
let current=0;
let playTimer=null;

slides.forEach((slide,index)=>{
  const dot=document.createElement('a');
  dot.href=`#${slide.id}`;
  dot.ariaLabel=`สไลด์ ${index+1}: ${slide.dataset.label}`;
  rail.append(dot);
  const card=document.createElement('button');
  card.innerHTML=`<b>${String(index+1).padStart(2,'0')}</b><span>${slide.dataset.label}</span>`;
  card.onclick=()=>{closeOverview();slide.scrollIntoView({behavior:'smooth'})};
  grid.append(card);
});

const dots=[...rail.children];
const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting){entry.target.classList.remove('in-view');return}
    entry.target.classList.add('in-view');
    const i=slides.indexOf(entry.target);
    current=i;
    counter.textContent=`${String(i+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;
    dots.forEach((dot,n)=>dot.classList.toggle('active',n===i));
    progress.style.width=`${((i+1)/slides.length)*100}%`;
    document.title=`${entry.target.dataset.label} — Marketing Pitch`;
  });
},{threshold:.55});
slides.forEach(s=>observer.observe(s));

function openOverview(){overview.classList.add('open');overview.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}
function closeOverview(){overview.classList.remove('open');overview.setAttribute('aria-hidden','true');document.body.style.overflow=''}
function openTheme(){themePanel.classList.add('open');themePanel.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}
function closeTheme(){themePanel.classList.remove('open');themePanel.setAttribute('aria-hidden','true');document.body.style.overflow=''}
function stopPlay(){clearInterval(playTimer);playTimer=null;playBtn.classList.remove('playing');playBtn.innerHTML='<span>▶</span> PLAY'}
function togglePlay(){
  if(playTimer){stopPlay();return}
  playBtn.classList.add('playing');playBtn.innerHTML='<span>Ⅱ</span> PAUSE';
  playTimer=setInterval(()=>{current=current>=slides.length-1?0:current+1;slides[current].scrollIntoView({behavior:'smooth'})},6500);
}

document.querySelector('#overviewBtn').onclick=openOverview;
document.querySelector('#closeOverview').onclick=closeOverview;
document.querySelector('#themeBtn').onclick=openTheme;
document.querySelector('#closeTheme').onclick=closeTheme;
playBtn.onclick=togglePlay;
document.querySelectorAll('.theme-card').forEach(card=>card.onclick=()=>{
  document.body.dataset.theme=card.dataset.theme==='cinematic'?'':card.dataset.theme;
  document.querySelectorAll('.theme-card').forEach(c=>c.classList.toggle('active',c===card));
  localStorage.setItem('deck-theme',card.dataset.theme);
  setTimeout(closeTheme,280);
});
const savedTheme=localStorage.getItem('deck-theme')||'editorial';
document.body.dataset.theme=savedTheme==='cinematic'?'':savedTheme;
document.querySelectorAll('.theme-card').forEach(c=>c.classList.toggle('active',c.dataset.theme===savedTheme));
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){closeOverview();closeTheme()}
  if(e.code==='Space'&&!['INPUT','TEXTAREA','BUTTON'].includes(document.activeElement.tagName)){e.preventDefault();togglePlay()}
  if(['ArrowDown','PageDown','ArrowRight'].includes(e.key)){e.preventDefault();slides[Math.min(slides.length-1,current+1)].scrollIntoView({behavior:'smooth'})}
  if(['ArrowUp','PageUp','ArrowLeft'].includes(e.key)){e.preventDefault();slides[Math.max(0,current-1)].scrollIntoView({behavior:'smooth'})}
});

let wheelLock=false;
document.addEventListener('wheel',e=>{
  if(overview.classList.contains('open')||themePanel.classList.contains('open'))return;
  e.preventDefault();
  if(wheelLock)return;
  const amount=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY;
  if(Math.abs(amount)<12)return;
  wheelLock=true;
  const next=amount>0?Math.min(slides.length-1,current+1):Math.max(0,current-1);
  slides[next].scrollIntoView({behavior:'smooth',inline:'start'});
  setTimeout(()=>wheelLock=false,720);
},{passive:false});
