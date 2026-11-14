(() => {
 'use strict';
 const books = window.BOOKS;
 const concept = window.CONCEPTS.find(c => c.id === document.body.dataset.concept) || window.CONCEPTS[0];
 const assetRoot = '../shared/assets/';
 const $ = s => document.querySelector(s);
 const icon = (name) => {
   const paths = {heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',right:'<path d="m9 5 7 7-7 7"/>',left:'<path d="m15 5-7 7 7 7"/>',close:'<path d="m6 6 12 12M18 6 6 18"/>',book:'<path d="M12 5v15M3 4c4-1 6 0 9 2 3-2 5-3 9-2v15c-4-1-6 0-9 2-3-2-5-3-9-2Z"/>',grid:'<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',replay:'<path d="M3 10a9 9 0 1 1 2 8M3 3v7h7"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 1v2m0 18v2M1 12h2m18 0h2M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2"/>',moon:'<path d="M21 13A9 9 0 0 1 11 3a9 9 0 1 0 10 10Z"/>',flower:'<path d="M12 8C3-5-5 13 8 12c-13 9 5 17 4 4 9 13 17-5 4-4C29 3 11-5 12 8Z"/><circle cx="12" cy="12" r="2"/>',rainbow:'<path d="M2 20v-5a10 10 0 0 1 20 0v5M6 20v-5a6 6 0 0 1 12 0v5M10 20v-5a2 2 0 0 1 4 0v5"/>',spark:'<path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z"/>',leaf:'<path d="M20 3C6 0 0 11 7 18S24 18 20 3ZM3 22 16 9"/>',compass:'<circle cx="12" cy="12" r="10"/><path d="m16 8-2 6-6 2 2-6Z"/>',cloud:'<path d="M6 19a5 5 0 0 1-1-10 7 7 0 0 1 13-2 6 6 0 1 1 0 12Z"/>'};
   return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths.spark}</svg>`;
 };
 const esc = v => String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let saved = {};
 try { saved = JSON.parse(localStorage.getItem('miri-books-v1') || '{}') || {}; } catch {}
 let favorites = new Set(Array.isArray(saved.favorites) ? saved.favorites.filter(id=>books.some(b=>b.id===id)) : []);
 let progress = saved.progress && typeof saved.progress === 'object' ? saved.progress : {};
 let filter = 'all', featureIndex = 0, active = null, pageIndex = -1, busy = false, lastOpener = null, transitionId = 0;
 const reduce = matchMedia('(prefers-reduced-motion: reduce)');
 const persist = () => {try {localStorage.setItem('miri-books-v1',JSON.stringify({favorites:[...favorites],progress}));} catch {}};
 const cover = b => `${assetRoot}${b.id}-0.webp`;
 const favoriteButton = b => `<button class="favorite ${favorites.has(b.id)?'is-favorite':''}" data-favorite="${b.id}" aria-label="${favorites.has(b.id)?'Remove':'Add'} ${esc(b.title)} ${favorites.has(b.id)?'from':'to'} favorites" aria-pressed="${favorites.has(b.id)}">${icon('heart')}</button>`;
 const readLabel = b => Number.isInteger(progress[b.id]) && progress[b.id]>=0 && progress[b.id]<b.pages.length ? 'Keep reading' : 'Read story';
 const card = (b,i) => `<article class="book-card" style="--book-bg:${b.color};--book-ink:${b.ink};--card-i:${i}" data-book-card="${b.id}"><div class="cover-wrap"><button class="cover-button" data-open="${b.id}" aria-label="Read ${esc(b.title)}"><img src="${cover(b)}" alt="${esc(b.title)} — ${esc(b.style)} cover illustration" ${i===0?'fetchpriority="high"':'loading="lazy"'}><span class="cover-label"><span>MIRI’S LITTLE WORLD</span><strong>${esc(b.title)}</strong></span><span class="cover-spine"></span></button>${favoriteButton(b)}</div><div class="book-info"><span class="story-number">0${i+1}</span><p class="book-category">${esc(b.category)}</p><h2><button data-open="${b.id}">${esc(b.title)}</button></h2><p class="book-short">${esc(b.short)}</p><button class="read-link" data-open="${b.id}">${readLabel(b)} ${icon('right')}</button></div></article>`;
 const featured = b => `<section class="feature" style="--book-bg:${b.color};--book-ink:${b.ink}"><img class="feature-art" src="${cover(b)}" alt="${esc(b.title)} cover illustration"><div class="feature-copy"><span class="eyebrow">${concept.layout==='cinema'?'THE FEATURE STORY':'A LITTLE DAYDREAM'}</span><h2>${esc(b.title)}</h2><p>${esc(b.short)}</p><button class="primary" data-open="${b.id}">${readLabel(b)} ${icon('right')}</button></div>${favoriteButton(b)}</section>`;
 document.body.classList.add('theme-'+concept.layout,'font-'+concept.font);
 document.documentElement.style.setProperty('--bg',concept.color);
 document.documentElement.style.setProperty('--ink',concept.ink);
 document.documentElement.style.setProperty('--accent',concept.accent);
 document.title = concept.name+' · Miri’s Little World';
 $('#app').innerHTML = `<main id="library"><header class="site-header"><a class="brand" href="./" aria-label="${esc(concept.name)} home"><span class="brand-mark">${icon(concept.mark)}</span><span>${esc(concept.name)}</span></a><a class="concept-link" href="../">${icon('grid')}<span>Explore the 10 designs</span></a></header><section class="intro"><p class="eyebrow">MIRI’S LITTLE WORLD</p><h1>${esc(concept.heading).replace('\n','<br>')}</h1><p class="intro-sub">${esc(concept.tag)}</p><span class="intro-decoration" aria-hidden="true">${icon(concept.mark)}</span></section><div class="library-toolbar"><nav class="filter-tabs" aria-label="Filter stories"><button data-filter="all" class="active" aria-pressed="true">${icon('book')} All stories <span>${books.length}</span></button><button data-filter="favorites" aria-pressed="false">${icon('heart')} Favorites <span class="favorite-count">${favorites.size}</span></button></nav><span class="shelf-note">Made for little readers & the people they love</span></div><div id="shelf"></div><footer class="library-footer"><span>${icon('heart')} Little stories, made with love.</span><span>Three adventures. As many rereads as you like.</span></footer></main><section id="reader" class="reader reader-${concept.reader}" hidden role="region" aria-label="Book reader"><header class="reader-header"><button class="back-library" data-close>${icon('left')}<span>Bookshelf</span></button><span class="reader-title"></span><div class="reader-actions"></div></header><div class="reader-stage" id="reader-stage"></div><footer class="reader-footer"><div class="reader-controls"><button class="page-prev" data-prev aria-label="Previous page">${icon('left')}</button><div class="reading-position"><span class="page-counter" aria-live="polite" aria-atomic="true"></span><nav class="page-dots" aria-label="Book pages"></nav></div><button class="page-next" data-next aria-label="Next page">${icon('right')}</button></div><p class="gesture-hint">Swipe or use the arrows to turn the page</p></footer></section><div class="sr-only" role="status" id="status"></div>`;
 function renderShelf() {
   const list = books.filter(b=>filter==='all'||favorites.has(b.id));
   document.querySelectorAll('[data-filter]').forEach(b=>{const yes=b.dataset.filter===filter;b.classList.toggle('active',yes);b.setAttribute('aria-pressed',String(yes));});
   $('.favorite-count').textContent=favorites.size;
   if (!list.length) {$('#shelf').innerHTML=`<div class="empty-state">${icon('heart')}<h2>A little shelf of favorites.</h2><p>Tap a heart on a book to keep it close.</p><button class="primary" data-filter="all">Explore all stories ${icon('right')}</button></div>`;return;}
   featureIndex = Math.min(featureIndex,list.length-1);
   let html = '';
   if (concept.layout==='cinema') html=featured(list[featureIndex])+`<div class="section-label"><span>THE STORY COLLECTION</span><span>01 — 0${list.length}</span></div><div class="books-grid">${list.map(card).join('')}</div>`;
   else if (concept.layout==='cloud') html=`<div class="cloud-carousel">${featured(list[featureIndex])}<nav class="carousel-nav" aria-label="Choose a story"><button data-feature-step="-1" aria-label="Previous story">${icon('left')}</button><span>${featureIndex+1} / ${list.length}</span><button data-feature-step="1" aria-label="Next story">${icon('right')}</button></nav><div class="cloud-thumbnails">${list.map((b,i)=>`<button data-feature="${i}" class="${i===featureIndex?'selected':''}" aria-label="Show ${esc(b.title)}" aria-pressed="${i===featureIndex}"><img src="${cover(b)}" alt=""><span>${esc(b.title)}</span></button>`).join('')}</div></div>`;
   else html=`${concept.layout==='atlas'?'<div class="trail-label">YOUR STORY TRAIL <span>Three lovely places to begin</span></div>':''}<div class="books-grid">${list.map(card).join('')}</div>`;
   $('#shelf').innerHTML=html;
 }
 function updateFavorite(id) {
   const restoreFocus = document.activeElement?.dataset.favorite === id;
   favorites.has(id)?favorites.delete(id):favorites.add(id);persist();
   renderShelf();
   if(active) $('.reader-actions').innerHTML=favoriteButton(active)+`<button data-close aria-label="Close book">${icon('close')}</button>`;
   if(restoreFocus) $(active?`.reader-actions [data-favorite="${id}"]`:`[data-favorite="${id}"]`)?.focus({preventScroll:true});
   $('#status').textContent=favorites.has(id)?'Added to favorites':'Removed from favorites';
 }
 const setHash = (push=false) => {
   const next = active ? `#book=${active.id}&page=${pageIndex}` : location.pathname+location.search;
   history[push?'pushState':'replaceState'](null,'',next);
 };
 function openBook(id,index,hash=true) {
   const b=books.find(b=>b.id===id);if(!b)return;
   lastOpener=document.activeElement;
   transitionId++;busy=false;
   active=b;
   const resume = Number.isInteger(progress[b.id]) && progress[b.id]>=0 && progress[b.id]<b.pages.length ? progress[b.id] : -1;
   pageIndex=Number.isInteger(index)?Math.max(-1,Math.min(index,b.pages.length)):resume;
   $('#library').hidden=true;$('#reader').hidden=false;document.body.classList.add('reading');
   $('#reader').dataset.book=b.id;
   $('.reader-title').textContent=b.title;
   $('.reader-actions').innerHTML=favoriteButton(b)+`<button data-close aria-label="Close book">${icon('close')}</button>`;
   renderPage();if(hash)setHash(true);
   if(!reduce.matches)$('#reader-stage').animate([{opacity:0,transform:'translateY(25px) scale(.94) rotate(-1deg)'},{opacity:1,transform:'none'}],{duration:650,easing:'cubic-bezier(.2,.8,.2,1)'});
   $('#reader').tabIndex=-1;$('#reader').focus({preventScroll:true});
 }
 function closeBook(hash=true) {
   if(!active)return;
   transitionId++;active=null;busy=false;$('#reader').hidden=true;$('#library').hidden=false;document.body.classList.remove('reading');
   if(hash)setHash();renderShelf();
   if(lastOpener?.isConnected)lastOpener.focus({preventScroll:true});else $('[data-open]')?.focus({preventScroll:true});
 }
 function renderPage() {
   const b=active;if(!b)return;
   const coverPage=pageIndex===-1,end=pageIndex===b.pages.length;
   $('#reader-stage').dataset.motion=b.motion;
   $('#reader-stage').style.setProperty('--book-bg',b.color);
   $('#reader-stage').style.setProperty('--book-ink',b.ink);
   if(end) {
     $('#reader-stage').innerHTML=`<article class="end-page"><div class="end-art"><img src="${cover(b)}" alt=""><div class="end-sparkles" aria-hidden="true">${Array.from({length:9},(_,i)=>`<span style="--i:${i}">${icon(b.id==='swim'?'sun':b.id==='avi'?'heart':'leaf')}</span>`).join('')}</div></div><p class="eyebrow">THE END · UNTIL NEXT TIME</p><h1>${esc(b.end)}</h1><p>${esc(b.endSub)}</p><div class="end-actions"><button class="primary" data-replay>${icon('replay')} Read again</button><button class="secondary" data-close>${icon('book')} Back to bookshelf</button></div></article>`;
   } else if(coverPage) {
     $('#reader-stage').innerHTML=`<article class="story-page title-page"><div class="page-picture"><img src="${cover(b)}" alt="${esc(b.title)} cover illustration"></div><div class="page-copy"><p class="eyebrow">MIRI’S LITTLE WORLD</p><h1>${esc(b.title)}</h1><p class="cover-subtitle">${esc(b.short)}</p><span class="title-rule"></span><p class="read-together">A little story to read together.</p><button class="primary" data-next>Open the book ${icon('right')}</button></div></article>`;
   } else {
     const p=b.pages[pageIndex];
     $('#reader-stage').innerHTML=`<article class="story-page"><div class="page-picture"><img src="${assetRoot}${b.id}-${pageIndex+1}.webp" alt="${esc(p.alt)}" fetchpriority="high"></div><div class="page-copy"><span class="page-chapter">${esc(b.category)}</span><p class="story-text">${esc(p.text)}</p><span class="printed-page">${pageIndex+1}</span></div></article>`;
     const prefetch=new Image();if(pageIndex+1<b.pages.length)prefetch.src=`${assetRoot}${b.id}-${pageIndex+2}.webp`;
   }
   $('.page-prev').disabled=coverPage;
   $('.page-next').disabled=end;
   $('.page-next').setAttribute('aria-label',coverPage?'Start story':pageIndex===b.pages.length-1?'Finish story':'Next page');
   $('.page-counter').textContent=coverPage?'A story for you':end?'The end':`${pageIndex+1} / ${b.pages.length}`;
   $('.page-dots').innerHTML=Array.from({length:b.pages.length},(_,i)=>`<button data-page="${i}" class="${i===pageIndex?'current':''}" aria-label="Go to page ${i+1}" ${i===pageIndex?'aria-current="page"':''}></button>`).join('');
   $('.gesture-hint').textContent=end?'A favorite story is always ready for another read.':'Swipe or use the arrows to turn the page';
   progress[b.id]=pageIndex;persist();
 }
 async function turnTo(index) {
   if(!active||busy||index===pageIndex||index< -1||index>active.pages.length)return;
   busy=true;const token=++transitionId,forward=index>pageIndex,stage=$('#reader-stage');
   try {
     if(!reduce.matches) {
       const old=stage.firstElementChild;
       const key=active.motion;
       let frames;
       if(key==='turn')frames=[{opacity:1,transform:'perspective(1600px) rotateY(0)'},{opacity:.1,transform:`perspective(1600px) rotateY(${forward?-68:68}deg)`}];
       else if(key==='flutter')frames=[{opacity:1,transform:'translateY(0) rotate(0)'},{opacity:0,transform:`translate(${forward?-5:5}%, -4%) rotate(${forward?-4:4}deg) scale(.98)`}];
       else frames=[{opacity:1,filter:'blur(0)',transform:'scale(1)'},{opacity:0,filter:'blur(3px)',transform:'scale(1.035)'}];
       await old.animate(frames,{duration:220,easing:'ease-in',fill:'forwards'}).finished;
       if(!active||token!==transitionId)return;
     }
     pageIndex=index;renderPage();setHash();
     if(!reduce.matches) {
       const key=active.motion;
       let frames=key==='turn'?[{opacity:.1,transform:`perspective(1600px) rotateY(${forward?55:-55}deg)`},{opacity:1,transform:'perspective(1600px) rotateY(0)'}]:key==='flutter'?[{opacity:0,transform:`translate(${forward?4:-4}%, 3%) rotate(${forward?3:-3}deg)`},{opacity:1,transform:'none'}]:[{opacity:0,clipPath:'circle(8% at 50% 50%)'},{opacity:1,clipPath:'circle(150% at 50% 50%)'}];
       await stage.firstElementChild.animate(frames,{duration:400,easing:'cubic-bezier(.2,.8,.2,1)'}).finished;
     }
   } finally {if(token===transitionId)busy=false;}
 }
 document.addEventListener('click',e=>{
   const b=e.target.closest('button');if(!b)return;
   if(b.dataset.favorite){updateFavorite(b.dataset.favorite);return;}
   if(b.dataset.open){openBook(b.dataset.open);return;}
   if(b.hasAttribute('data-close')){closeBook();return;}
   if(b.dataset.filter){filter=b.dataset.filter;featureIndex=0;renderShelf();return;}
   if(b.hasAttribute('data-feature')||b.hasAttribute('data-feature-step')) {
     const list=books.filter(x=>filter==='all'||favorites.has(x.id));
     featureIndex=b.hasAttribute('data-feature')?Number(b.dataset.feature):(featureIndex+Number(b.dataset.featureStep)+list.length)%list.length;renderShelf();return;
   }
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
 let start=null;
 $('#reader-stage').addEventListener('pointerdown',e=>{if(e.target.closest('button')||e.isPrimary===false)return;start={x:e.clientX,y:e.clientY,t:Date.now()};});
 $('#reader-stage').addEventListener('pointerup',e=>{if(!start)return;const dx=e.clientX-start.x,dy=e.clientY-start.y,dt=Date.now()-start.t;start=null;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.6&&dt<1100)turnTo(pageIndex+(dx<0?1:-1));});
 $('#reader-stage').addEventListener('pointercancel',()=>start=null);
 const fromHash=()=>{
   const p=new URLSearchParams(location.hash.slice(1));const id=p.get('book');
   if(id&&books.some(b=>b.id===id)){const n=Number(p.get('page'));openBook(id,Number.isInteger(n)?n:-1,false);}else closeBook(false);
 };
 window.addEventListener('hashchange',fromHash);
 window.addEventListener('storage',e=>{if(e.key==='miri-books-v1'){try{const state=JSON.parse(e.newValue||'{}');favorites=new Set(Array.isArray(state.favorites)?state.favorites:[]);renderShelf();if(active)$('.reader-actions').innerHTML=favoriteButton(active)+`<button data-close aria-label="Close book">${icon('close')}</button>`;}catch{}}});
 renderShelf();fromHash();
})();
