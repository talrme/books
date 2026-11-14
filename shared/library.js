(() => {
 'use strict';
 const books = window.BOOKS;
 const concept = {name:'Miri’s books',layout:'parade',reader:'paper',font:'round',color:'#f8ead2',ink:'#282751',accent:'#ce4055'};
 const assetRoot = 'shared/assets/';
 const imageUrl = (b,n=0) => `${assetRoot}${b.id}-${n}.webp?v=family2`;
 const frame = b => ({swim:'#97bedc',avi:'#e99eab',adventure:'#e7c658','rainbow-song':'#b8a0cf'}[b.id] || '#97bedc');
 const vars = b => `--book-bg:${b.color};--book-ink:${b.ink};--frame:${frame(b)}`;
 const $ = s => document.querySelector(s);
 const icon = (name) => {
   const paths = {reread:'<path fill="#fff9dd" d="M12 9C8 6 5 6 2 7v13c4-1 7 0 10 2 3-2 6-3 10-2V7c-3-1-6-1-10 2Z"/><path d="M12 10v12M7 3a7 7 0 0 1 12 1M19 1v4h-4"/><path fill="#efbc42" stroke="none" d="m5 1 1 2 2 1-2 1-1 2-1-2-2-1 2-1Z"/>',bookshelf:'<path fill="#e99eab" d="m3 5 4-1 3 15-4 1Z"/><path fill="#efd066" d="M10 3h4v16h-4Z"/><path fill="#97bedc" d="m16 7 4 1-2 12-4-1Z"/><path d="M2 21h20M4 8l3-1M11 7h2m4 3 2 1"/>',heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',right:'<path d="m9 5 7 7-7 7"/>',left:'<path d="m15 5-7 7 7 7"/>',close:'<path d="m6 6 12 12M18 6 6 18"/>',book:'<path d="M12 5v15M3 4c4-1 6 0 9 2 3-2 5-3 9-2v15c-4-1-6 0-9 2-3-2-5-3-9-2Z"/>',grid:'<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',replay:'<path d="M3 10a9 9 0 1 1 2 8M3 3v7h7"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 1v2m0 18v2M1 12h2m18 0h2M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2"/>',moon:'<path d="M21 13A9 9 0 0 1 11 3a9 9 0 1 0 10 10Z"/>',flower:'<path d="M12 8C3-5-5 13 8 12c-13 9 5 17 4 4 9 13 17-5 4-4C29 3 11-5 12 8Z"/><circle cx="12" cy="12" r="2"/>',rainbow:'<path d="M2 20v-5a10 10 0 0 1 20 0v5M6 20v-5a6 6 0 0 1 12 0v5M10 20v-5a2 2 0 0 1 4 0v5"/>',spark:'<path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z"/>',leaf:'<path d="M20 3C6 0 0 11 7 18S24 18 20 3ZM3 22 16 9"/>',compass:'<circle cx="12" cy="12" r="10"/><path d="m16 8-2 6-6 2 2-6Z"/>',cloud:'<path d="M6 19a5 5 0 0 1-1-10 7 7 0 0 1 13-2 6 6 0 1 1 0 12Z"/>'};
   return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths.spark}</svg>`;
 };
 const esc = v => String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let saved = {};
 try { saved = JSON.parse(localStorage.getItem('miri-books-v1') || '{}') || {}; } catch {}
 let favorites = new Set(Array.isArray(saved.favorites) ? saved.favorites.filter(id=>books.some(b=>b.id===id)) : []);
 let progress = saved.progress && typeof saved.progress === 'object' ? saved.progress : {};
 let filter = 'all', active = null, pageIndex = -1, pageAnimation = null, turnLayer = null;
 const reduce = matchMedia('(prefers-reduced-motion: reduce)');
 const persist = () => {try {localStorage.setItem('miri-books-v1',JSON.stringify({favorites:[...favorites],progress}));} catch {}};
 const cover = b => imageUrl(b);
 const creationLabel = b => {
   if(!/^\d{4}-\d{2}(?:-\d{2})?$/.test(b.created||''))return '';
   const date=new Date(b.created.slice(0,7)+'-01T12:00:00Z');
   return Number.isNaN(date.getTime())?'':new Intl.DateTimeFormat('en-US',{month:'long',year:'numeric',timeZone:'UTC'}).format(date);
 };
 const favoriteButton = b => `<button class="favorite ${favorites.has(b.id)?'is-favorite':''}" data-favorite="${b.id}" aria-label="${favorites.has(b.id)?'Remove':'Add'} ${esc(b.title)} ${favorites.has(b.id)?'from':'to'} favorites" aria-pressed="${favorites.has(b.id)}">${icon('heart')}</button>`;
 const readLabel = b => Number.isInteger(progress[b.id]) && progress[b.id]>=0 && progress[b.id]<b.pages.length ? 'Keep reading' : 'Read story';
 const coverArt = b => `<img src="${cover(b)}" alt="${esc(b.title)} cover illustration"><span class="cover-label"><strong>${esc(b.title)}</strong></span><span class="cover-spine" aria-hidden="true"></span>`;
 const card = (b,i) => `<article class="book-card" style="${vars(b)};--card-i:${i}"><div class="cover-wrap"><span class="book-pages" aria-hidden="true"></span><button class="cover-button" data-open="${b.id}" aria-label="Read ${esc(b.title)}">${coverArt(b)}</button>${favoriteButton(b)}</div>${Number.isInteger(progress[b.id])&&progress[b.id]>=0&&progress[b.id]<b.pages.length?`<button class="resume-link" data-open="${b.id}" data-resume="true">Continue at page ${progress[b.id]+1} ${icon('right')}</button>`:''}</article>`;
 document.body.classList.add('theme-'+concept.layout,'font-'+concept.font);
 document.documentElement.style.setProperty('--bg',concept.color);
 document.documentElement.style.setProperty('--ink',concept.ink);
 document.documentElement.style.setProperty('--accent',concept.accent);
 document.title = concept.name+' · Miri’s Little World';
 $('#app').innerHTML = `<main id="library"><header class="site-header"><a class="brand" href="./"><span class="brand-mark">${icon('flower')}</span><h1>Miri’s books</h1></a><nav class="filter-tabs" aria-label="Filter books"><button data-filter="all" class="active" aria-pressed="true">All books</button><button data-filter="favorites" aria-pressed="false">${icon('heart')} Favorites <span class="favorite-count">${favorites.size}</span></button></nav></header><div id="shelf"></div></main><section id="reader" class="reader reader-paper" hidden role="region" aria-label="Book reader"><header class="reader-header"><button class="back-library" data-close>${icon('left')}<span>Bookshelf</span></button><span class="reader-title"></span><div class="reader-actions"></div></header><div class="reader-stage" id="reader-stage"></div><footer class="reader-footer"><div class="reader-controls"><button class="page-prev" data-prev aria-label="Previous page">${icon('left')}</button><div class="reading-position"><span class="page-counter" aria-live="polite" aria-atomic="true"></span><nav class="page-dots" aria-label="Book pages"></nav></div><button class="page-next" data-next aria-label="Next page">${icon('right')}</button></div></footer></section><div class="sr-only" role="status" id="status"></div>`;

 function renderShelf() {
   const list = books.filter(b=>filter==='all'||favorites.has(b.id));
   document.querySelectorAll('[data-filter]').forEach(b=>{const yes=b.dataset.filter===filter;b.classList.toggle('active',yes);b.setAttribute('aria-pressed',String(yes));});
   $('.favorite-count').textContent=favorites.size||'';
   if (!list.length) {$('#shelf').innerHTML=`<div class="empty-state">${icon('heart')}<h2>A little shelf of favorites.</h2><p>Tap a heart on a book to keep it close.</p><button class="primary" data-filter="all">Explore all stories ${icon('right')}</button></div>`;return;}
   const html=`<div class="books-grid">${list.map(card).join('')}</div>`;
   $('#shelf').innerHTML=html;
 }
 function updateFavorite(id) {
   const restoreFocus = document.activeElement?.dataset.favorite === id;
   favorites.has(id)?favorites.delete(id):favorites.add(id);persist();
   renderShelf();
   if(active) $('.reader-actions').innerHTML=favoriteButton(active);
   if(restoreFocus) $(active?`.reader-actions [data-favorite="${id}"]`:`[data-favorite="${id}"]`)?.focus({preventScroll:true});
   $('#status').textContent=favorites.has(id)?'Added to favorites':'Removed from favorites';
 }
 const setHash = (push=false) => {
   const next = active ? `#book=${active.id}&page=${pageIndex}` : location.pathname+location.search;
   history[push?'pushState':'replaceState'](null,'',next);
 };
 function openBook(id,index,hash=true) {
   const b=books.find(b=>b.id===id);if(!b)return;
   stopAnimation();
   active=b;
   pageIndex=Number.isInteger(index)?Math.max(-1,Math.min(index,b.pages.length)):-1;
   $('#library').hidden=true;$('#reader').hidden=false;document.body.classList.add('reading');
   $('#reader').dataset.book=b.id;
   $('.reader-title').textContent=b.title;
   $('.reader-actions').innerHTML=favoriteButton(b);
   renderPage();if(hash)setHash(true);
   animatePage(1);
   $('#reader').tabIndex=-1;$('#reader').focus({preventScroll:true});
 }
 function closeBook(hash=true) {
   if(!active)return;
   stopAnimation();active=null;$('#reader').hidden=true;$('#library').hidden=false;document.body.classList.remove('reading');
   if(hash)setHash();renderShelf();
   $('[data-open]')?.focus({preventScroll:true});
 }
 function renderPage() {
   const b=active;if(!b)return;
   const coverPage=pageIndex===-1,back=pageIndex===b.pages.length;
   const stage=$('#reader-stage');stage.style.cssText=vars(b);
   if(coverPage){
     stage.innerHTML=`<div class="cover-spread"><article class="reader-cover book-surface" style="${vars(b)}" aria-label="${esc(b.title)} front cover">${coverArt(b)}</article></div>`;
   }else if(back){
     stage.innerHTML=`<div class="cover-spread"><article class="reader-cover back-cover book-surface" style="${vars(b)}" aria-label="${esc(b.title)} back cover"><h2 class="end-title">The End</h2><div class="end-illustration"><figure class="end-picture"><img src="${cover(b)}" alt="${esc(b.title)} cover illustration"></figure>${creationLabel(b)?`<p class="creation-note">Created ${esc(creationLabel(b))}</p>`:''}</div><div class="back-actions"><button class="end-action" data-replay><span class="action-picture reread-picture">${icon('reread')}</span><span>Read Again</span></button><button class="end-action" data-close><span class="action-picture shelf-picture">${icon('bookshelf')}</span><span>Bookshelf</span></button></div><span class="cover-spine" aria-hidden="true"></span></article></div>`;
   }else{
     const p=b.pages[pageIndex];
     stage.innerHTML=`<article class="story-page book-surface"><div class="page-picture"><img src="${imageUrl(b,pageIndex+1)}" alt="${esc(p.alt)}" fetchpriority="high"></div><div class="page-copy"><p class="story-text">${esc(p.text)}</p><span class="printed-page" aria-label="Page ${pageIndex+1}">${pageIndex+1}</span></div></article>`;
     if(pageIndex+1<b.pages.length){const image=new Image();image.src=imageUrl(b,pageIndex+2);}
   }
   $('.page-prev').disabled=coverPage;$('.page-next').disabled=back;
   $('.page-next').setAttribute('aria-label',coverPage?'Turn the cover':pageIndex===b.pages.length-1?'Turn to back cover':'Next page');
   $('.page-counter').textContent=coverPage?'Cover':back?'Back cover':`${pageIndex+1} / ${b.pages.length}`;
   $('.page-dots').innerHTML=`<button data-page="-1" class="${coverPage?'current':''}" aria-label="Go to cover" ${coverPage?'aria-current="page"':''}>C</button>`+b.pages.map((_,i)=>`<button data-page="${i}" class="${i===pageIndex?'current':''}" aria-label="Go to page ${i+1}" ${i===pageIndex?'aria-current="page"':''}>${i+1}</button>`).join('');
   if(pageIndex>=0){progress[b.id]=pageIndex;persist();}
 }
 function stopAnimation() {
   pageAnimation?.cancel();pageAnimation=null;
   turnLayer?.remove();turnLayer=null;
 }
 function animatePage(direction,previous) {
   if(reduce.matches)return;
   const stage=$('#reader-stage'),surface=stage.querySelector('.book-surface');
   // Covers fade in place; only a half-sheet turns, never the whole reading surface.
   if(!previous?.classList.contains('story-page')||!surface.classList.contains('story-page')){
     pageAnimation=surface.animate([{opacity:.88},{opacity:1}],{duration:160,easing:'ease-out'});
     return;
   }
   const rect=surface.getBoundingClientRect(),stageRect=stage.getBoundingClientRect();
   const layer=document.createElement('div');layer.className='page-turn-layer';
   layer.setAttribute('aria-hidden','true');layer.inert=true;
   layer.style.cssText=`left:${rect.left-stageRect.left}px;top:${rect.top-stageRect.top}px;width:${rect.width}px;height:${rect.height}px;${vars(active)}`;
   const sheet=document.createElement('div');sheet.className='turning-half '+(direction>0?'turn-forward':'turn-backward');
   for(const [side,source] of [['front',previous],['back',surface]]){
     const face=document.createElement('div');face.className='turn-face turn-'+side;
     const clone=source.cloneNode(true);
     clone.removeAttribute('id');clone.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));
     clone.style.cssText=`position:absolute;top:0;left:${(side==='front')===(direction>0)?-rect.width/2:0}px;width:${rect.width}px;height:${rect.height}px;margin:0;box-shadow:none;`;
     face.append(clone);sheet.append(face);
   }
   layer.append(sheet);stage.append(layer);turnLayer=layer;
   const animation=sheet.animate([
     {transform:'rotateY(0deg)'},
     {transform:`rotateY(${direction>0?-180:180}deg)`}
   ],{duration:240,easing:'ease-in-out',fill:'forwards'});
   pageAnimation=animation;
   animation.finished.then(()=>{
     layer.remove();
     if(pageAnimation===animation){pageAnimation=null;turnLayer=null;}
   },()=>layer.remove());
 }
 function turnTo(index) {
   if(!active||index===pageIndex||index< -1||index>active.pages.length)return;
   const direction=index>pageIndex?1:-1;
   stopAnimation();
   const previous=$('#reader-stage .book-surface');
   pageIndex=index;if(index===-1){progress[active.id]=-1;persist();}
   renderPage();setHash();animatePage(direction,previous);
 }
 document.addEventListener('click',e=>{
   const b=e.target.closest('button');if(!b)return;
   if(b.dataset.favorite){updateFavorite(b.dataset.favorite);return;}
   if(b.dataset.open){openBook(b.dataset.open,b.dataset.resume?progress[b.dataset.open]:-1);return;}
   if(b.hasAttribute('data-close')){closeBook();return;}
   if(b.dataset.filter){filter=b.dataset.filter;renderShelf();return;}
   if(b.hasAttribute('data-next'))turnTo(pageIndex+1);
   if(b.hasAttribute('data-prev'))turnTo(pageIndex-1);
   if(b.hasAttribute('data-page'))turnTo(Number(b.dataset.page));
   if(b.hasAttribute('data-replay'))turnTo(-1);
 });
 document.addEventListener('keydown',e=>{
   if(!active||e.altKey||e.metaKey||e.ctrlKey)return;
   if(e.key==='Escape'){e.preventDefault();closeBook();}
   if(e.key==='ArrowRight'){e.preventDefault();turnTo(pageIndex+1);}
   if(e.key==='ArrowLeft'){e.preventDefault();turnTo(pageIndex-1);}
 });
 let start=null, suppressClickUntil=0;
 $('#reader-stage').addEventListener('pointerdown',e=>{if(e.target.closest('button')||e.isPrimary===false)return;start={x:e.clientX,y:e.clientY,t:Date.now()};});
 $('#reader-stage').addEventListener('pointerup',e=>{if(!start)return;const dx=e.clientX-start.x,dy=e.clientY-start.y,dt=Date.now()-start.t;start=null;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.6&&dt<1100){suppressClickUntil=performance.now()+600;turnTo(pageIndex+(dx<0?1:-1));}});
 $('#reader-stage').addEventListener('pointercancel',()=>start=null);
 $('#reader-stage').addEventListener('click',e=>{if(!active||performance.now()<suppressClickUntil||e.target.closest('button,a')||window.getSelection()?.toString())return;const r=$('#reader-stage').getBoundingClientRect();turnTo(pageIndex+(e.clientX<r.left+r.width/2?-1:1));});
 const fromHash=()=>{
   const p=new URLSearchParams(location.hash.slice(1));const id=p.get('book');
   if(id&&books.some(b=>b.id===id)){const n=p.has('page')?Number(p.get('page')):-1;openBook(id,Number.isInteger(n)?n:-1,false);}else closeBook(false);
 };
 window.addEventListener('resize',stopAnimation);
 reduce.addEventListener('change',stopAnimation);
 window.addEventListener('hashchange',fromHash);
 window.addEventListener('storage',e=>{if(e.key==='miri-books-v1'){try{const state=JSON.parse(e.newValue||'{}');favorites=new Set(Array.isArray(state.favorites)?state.favorites:[]);renderShelf();if(active)$('.reader-actions').innerHTML=favoriteButton(active);}catch{}}});
 renderShelf();fromHash();
})();
