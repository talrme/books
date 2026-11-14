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
   const paths = {share:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m9 10.5 6-4M9 13.5l6 4"/>',settings:'<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3" fill="var(--bg)"/><circle cx="16" cy="17" r="3" fill="var(--bg)"/>',expand:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',reread:'<path fill="#fff9dd" d="M12 9C8 6 5 6 2 7v13c4-1 7 0 10 2 3-2 6-3 10-2V7c-3-1-6-1-10 2Z"/><path d="M12 10v12M7 3a7 7 0 0 1 12 1M19 1v4h-4"/><path fill="#efbc42" stroke="none" d="m5 1 1 2 2 1-2 1-1 2-1-2-2-1 2-1Z"/>',bookshelf:'<path fill="#e99eab" d="m3 5 4-1 3 15-4 1Z"/><path fill="#efd066" d="M10 3h4v16h-4Z"/><path fill="#97bedc" d="m16 7 4 1-2 12-4-1Z"/><path d="M2 21h20M4 8l3-1M11 7h2m4 3 2 1"/>',right:'<path d="m9 5 7 7-7 7"/>',left:'<path d="m15 5-7 7 7 7"/>',close:'<path d="m6 6 12 12M18 6 6 18"/>',book:'<path d="M12 5v15M3 4c4-1 6 0 9 2 3-2 5-3 9-2v15c-4-1-6 0-9 2-3-2-5-3-9-2Z"/>',grid:'<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',replay:'<path d="M3 10a9 9 0 1 1 2 8M3 3v7h7"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 1v2m0 18v2M1 12h2m18 0h2M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2"/>',moon:'<path d="M21 13A9 9 0 0 1 11 3a9 9 0 1 0 10 10Z"/>',flower:'<path d="M12 8C3-5-5 13 8 12c-13 9 5 17 4 4 9 13 17-5 4-4C29 3 11-5 12 8Z"/><circle cx="12" cy="12" r="2"/>',rainbow:'<path d="M2 20v-5a10 10 0 0 1 20 0v5M6 20v-5a6 6 0 0 1 12 0v5M10 20v-5a2 2 0 0 1 4 0v5"/>',spark:'<path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z"/>',leaf:'<path d="M20 3C6 0 0 11 7 18S24 18 20 3ZM3 22 16 9"/>',compass:'<circle cx="12" cy="12" r="10"/><path d="m16 8-2 6-6 2 2-6Z"/>',cloud:'<path d="M6 19a5 5 0 0 1-1-10 7 7 0 0 1 13-2 6 6 0 1 1 0 12Z"/>'};
   return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths.spark}</svg>`;
 };
 const esc = v => String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let saved = {};
 try { saved = JSON.parse(localStorage.getItem('miri-books-v1') || '{}') || {}; } catch {}
 let progress = saved.progress && typeof saved.progress === 'object' ? saved.progress : {};
 let active = null, pageIndex = -1, pageAnimation = null, turnLayer = null;
 const reduce = matchMedia('(prefers-reduced-motion: reduce)');
 const persist = () => {try {localStorage.setItem('miri-books-v1',JSON.stringify({progress}));} catch {}};
 // Normalize old saved data without discarding reading positions.
 persist();
 const cover = b => imageUrl(b);
 const creationLabel = b => {
   if(!/^\d{4}-\d{2}(?:-\d{2})?$/.test(b.created||''))return '';
   const date=new Date(b.created.slice(0,7)+'-01T12:00:00Z');
   return Number.isNaN(date.getTime())?'':new Intl.DateTimeFormat('en-US',{month:'long',year:'numeric',timeZone:'UTC'}).format(date);
 };
 const coverArt = b => `<img src="${cover(b)}" alt="${esc(b.title)} cover illustration"><span class="cover-label"><strong>${esc(b.title)}</strong></span><span class="cover-spine" aria-hidden="true"></span>`;
 const card = (b,i) => `<article class="book-card" data-book-id="${b.id}" style="${vars(b)};--card-i:${i}"><div class="cover-wrap"><span class="book-pages" aria-hidden="true"></span><button class="cover-button" data-open="${b.id}" data-reorder="${b.id}" aria-describedby="shelf-reorder-help" aria-label="Read ${esc(b.title)}">${coverArt(b)}</button></div></article>`;
 const listCard = (b,i) => `<article class="book-card list-card" data-book-id="${b.id}" style="${vars(b)};--card-i:${i}"><div class="cover-wrap list-cover-wrap"><button class="cover-button" data-open="${b.id}" data-reorder="${b.id}" aria-describedby="shelf-reorder-help" aria-label="Read ${esc(b.title)}"><span class="list-thumbnail" aria-hidden="true">${coverArt(b)}</span><span class="list-details"><strong>${esc(b.title)}</strong><span>${b.pages.length} pages${creationLabel(b)?' · '+creationLabel(b):''}</span></span><span class="list-arrow" aria-hidden="true">${icon('right')}</span></button></div></article>`;
 document.body.classList.add('theme-'+concept.layout,'font-'+concept.font);
 document.documentElement.style.setProperty('--bg',concept.color);
 document.documentElement.style.setProperty('--ink',concept.ink);
 document.documentElement.style.setProperty('--accent',concept.accent);
 document.title = concept.name+' · Miri’s Little World';
 $('#app').innerHTML = `<main id="library"><header class="site-header"><a class="brand" href="./"><span class="brand-mark"><img src="shared/book-stack.svg" alt="" width="38" height="38"></span><h1>Miri’s books</h1></a><div class="shelf-tools"><button class="shelf-settings-trigger" data-shelf-settings aria-label="Settings">${icon('settings')}<span>Settings</span></button><button class="fullscreen-toggle shelf-fullscreen" data-fullscreen hidden aria-pressed="false">${icon('expand')}<span>Fullscreen</span></button></div></header><p class="fullscreen-message" role="status" hidden></p><div id="shelf"></div></main><section id="reader" class="reader reader-paper" hidden role="region" aria-label="Book reader"><header class="reader-header"><button class="back-library" data-close aria-label="Back to bookshelf">${icon('left')}<span>Bookshelf</span></button><span class="reader-title"></span><div class="reader-tools"><button class="fullscreen-toggle" data-fullscreen hidden aria-pressed="false">${icon('expand')}<span>Fullscreen</span></button></div></header><p class="fullscreen-message" role="status" hidden></p><div class="reader-stage" id="reader-stage"></div><footer class="reader-footer"><div class="reader-controls"><button class="page-prev" data-prev aria-label="Previous page">${icon('left')}</button><div class="reading-position"><span class="page-counter" aria-live="polite" aria-atomic="true"></span><nav class="page-dots" aria-label="Book pages"></nav></div><button class="page-next" data-next aria-label="Next page">${icon('right')}</button></div></footer></section><div class="share-dock"><button data-open-share aria-label="Share" title="Share">${icon('share')}<span>Share</span></button></div><dialog class="share-dialog" aria-labelledby="share-title"><div class="share-heading"><h2 id="share-title">Share</h2><button data-close-share aria-label="Close sharing">×</button></div><p class="share-description"></p><label for="share-url">Link</label><input id="share-url" type="url" readonly spellcheck="false"><div class="share-actions"><button data-copy-link>Copy link</button><button data-native-share>${icon('share')}<span>Share…</span></button></div><p class="share-status" role="status" aria-live="polite"></p></dialog><div class="sr-only" role="status" id="status"></div>`;


 // Share the selected book, not its current page or local shelf preferences.
 const shareDialog=$('.share-dialog');
 let shareDetails=null;
 function openShare() {
   if(isSiteFullscreen())return;
   shelfOrder.cancelDrag();
   const url=new URL('./',location.href);
   if(active)url.hash='book='+encodeURIComponent(active.id);
   shareDetails={title:active?active.title:concept.name,url:url.href};
   $('#share-title').textContent=active?'Share this book':'Share bookshelf';
   $('.share-description').textContent=active?active.title:'Miri’s books';
   $('#share-url').value=shareDetails.url;
   $('.share-status').textContent='';
   $('[data-native-share]').hidden=typeof navigator.share!=='function';
   shareDialog.showModal();
   $('[data-close-share]').focus({preventScroll:true});
 }
 async function copyShareLink() {
   if(!shareDetails)return;
   const link=shareDetails.url,status=$('.share-status');
   try{
     if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');
     await navigator.clipboard.writeText(link);status.textContent='Link copied.';
   }catch{
     const input=$('#share-url');input.focus();input.select();
     let copied=false;try{copied=document.execCommand('copy');}catch{}
     status.textContent=copied?'Link copied.':'Link selected. Touch and hold to copy, or use your keyboard’s Copy command.';
   }
 }
 async function nativeShare() {
   if(!shareDetails)return;
   if(typeof navigator.share!=='function'){await copyShareLink();return;}
   try{await navigator.share(shareDetails);}
   catch(error){if(error.name!=='AbortError')$('.share-status').textContent='Sharing is unavailable right now. You can copy the link instead.';}
 }
 shareDialog.addEventListener('close',()=>{$('[data-open-share]').focus({preventScroll:true});});
 shareDialog.addEventListener('click',e=>{if(e.target===shareDialog){const r=shareDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)shareDialog.close();}});

 const reader=$('#reader'),fullscreenRoot=document.documentElement;
 let fullscreenPending=false,wasSiteFullscreen=false,lastFullscreenExit=-Infinity;
 const isSiteFullscreen=()=> (document.fullscreenElement||document.webkitFullscreenElement)===fullscreenRoot;
 const canFullscreen=()=>Boolean(
   (fullscreenRoot.requestFullscreen&&document.fullscreenEnabled!==false)||
   (fullscreenRoot.webkitRequestFullscreen&&document.webkitFullscreenEnabled!==false)
 );
 function updateFullscreen() {
   const full=isSiteFullscreen();
   if(wasSiteFullscreen&&!full)lastFullscreenExit=performance.now();
   wasSiteFullscreen=full;
   fullscreenRoot.classList.toggle('site-fullscreen',full);
   reader.classList.toggle('is-fullscreen',full);
   document.querySelectorAll('[data-fullscreen]').forEach(button=>{
     button.hidden=!full&&!canFullscreen();button.disabled=fullscreenPending;
     button.setAttribute('aria-pressed',String(full));
     button.setAttribute('aria-label',full?'Exit fullscreen':'Fullscreen');
     button.title=full?'Exit fullscreen':'Fullscreen';
     button.innerHTML=`${icon(full?'close':'expand')}<span>${full?'Exit fullscreen':'Fullscreen'}</span>`;
   });
   stopAnimation();
 }
 async function leaveFullscreen() {
   if(!isSiteFullscreen())return;
   const exit=document.exitFullscreen||document.webkitExitFullscreen;
   if(exit)await exit.call(document);
 }
 async function toggleFullscreen() {
   if(fullscreenPending)return;
   document.querySelectorAll('.fullscreen-message').forEach(message=>message.hidden=true);
   fullscreenPending=true;document.querySelectorAll('[data-fullscreen]').forEach(button=>button.disabled=true);
   try{
     if(isSiteFullscreen())await leaveFullscreen();
     else if(canFullscreen()){
       const request=fullscreenRoot.requestFullscreen||fullscreenRoot.webkitRequestFullscreen;
       await request.call(fullscreenRoot);
     }
   }catch{
     const host=$('dialog[open]')||(active?reader:$('#library'));
     const message=host.querySelector('.fullscreen-message');
     message.textContent='Fullscreen is unavailable right now. You can keep browsing here.';message.hidden=false;
   }finally{fullscreenPending=false;updateFullscreen();}
 }
 document.addEventListener('fullscreenchange',updateFullscreen);
 document.addEventListener('webkitfullscreenchange',updateFullscreen);

 const shelfOrder=window.createShelfOrder({books,onChange:()=>{stopAnimation();renderShelf();},announce:message=>$('#status').textContent=message});
 updateFullscreen();
 function renderShelf() {
   shelfOrder.cancelDrag();
   const list = shelfOrder.orderedBooks();
   const compact=shelfOrder.preferences().view==='list';
   const html=`<div class="books-grid ${compact?'books-list':''}">${list.map(compact?listCard:card).join('')}</div>`;
   $('#shelf').innerHTML=html;
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
   renderPage();updateFullscreen();if(hash)setHash(true);
   animatePage(1);
   $('#reader').tabIndex=-1;$('#reader').focus({preventScroll:true});
 }
 function closeBook(hash=true) {
   if(!active)return;
   document.querySelectorAll('.fullscreen-message').forEach(message=>message.hidden=true);
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
   $('.page-dots').innerHTML=`<button data-page="-1" class="${coverPage?'current':''}" aria-label="Go to front cover" title="Front cover" ${coverPage?'aria-current="page"':''}>F</button>`+b.pages.map((_,i)=>`<button data-page="${i}" class="${i===pageIndex?'current':''}" aria-label="Go to page ${i+1}" ${i===pageIndex?'aria-current="page"':''}>${i+1}</button>`).join('')+`<button data-page="${b.pages.length}" class="${back?'current':''}" aria-label="Go to back cover" title="Back cover" ${back?'aria-current="page"':''}>B</button>`;
   if(pageIndex>=0){progress[b.id]=pageIndex;persist();}
 }
 function stopAnimation() {
   pageAnimation?.cancel();pageAnimation=null;
   turnLayer?.remove();turnLayer=null;
 }
 function animatePage(direction,previous) {
   if(reduce.matches||shelfOrder.preferences().motion==='instant')return;
   const stage=$('#reader-stage'),surface=stage.querySelector('.book-surface');
   // Covers fade in place. Portrait phones turn one full-width leaf.
   if(!previous?.classList.contains('story-page')||!surface.classList.contains('story-page')){
     pageAnimation=surface.animate([{opacity:.88},{opacity:1}],{duration:160,easing:'ease-out'});
     return;
   }
   const rect=surface.getBoundingClientRect(),stageRect=stage.getBoundingClientRect();
   const layer=document.createElement('div');layer.className='page-turn-layer';
   layer.setAttribute('aria-hidden','true');layer.inert=true;
   layer.style.cssText=`left:${rect.left-stageRect.left}px;top:${rect.top-stageRect.top}px;width:${rect.width}px;height:${rect.height}px;${vars(active)}`;
   const snapshot=(source,left=0)=>{
     const clone=source.cloneNode(true);
     clone.removeAttribute('id');clone.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));
     clone.style.cssText=`position:absolute;top:0;left:${left}px;width:${rect.width}px;height:${rect.height}px;margin:0;box-shadow:none;`;
     return clone;
   };
   // Hold the old page intact while the next illustration decodes.
   previous.style.cssText=`position:absolute;top:0;left:0;width:${rect.width}px;height:${rect.height}px;margin:0;box-shadow:none;`;
   const wholePage=matchMedia('(max-width:600px) and (orientation:portrait)').matches;
   const stationary=document.createElement('div');stationary.className='turn-stationary '+(direction>0?'hold-left':'hold-right');stationary.hidden=true;
   stationary.append(snapshot(previous,direction>0?0:-rect.width/2));
   const sheet=document.createElement('div');sheet.className=(wholePage?'turning-page ':'turning-half ')+(direction>0?'turn-forward':'turn-backward');sheet.hidden=true;
   for(const [side,source] of [['front',previous],['back',surface]]){
     if(wholePage&&side==='back')continue;
     const face=document.createElement('div');face.className='turn-face turn-'+side;
     face.append(snapshot(source,wholePage?0:(side==='front')===(direction>0)?-rect.width/2:0));sheet.append(face);
   }
   layer.dataset.phase='loading';layer.append(previous,...(wholePage?[]:[stationary]),sheet);stage.append(layer);turnLayer=layer;
   const images=[...surface.querySelectorAll('img'),...layer.querySelectorAll('img')];
   Promise.allSettled(images.map(image=>image.decode?image.decode():Promise.resolve())).then(()=>{
     // A later turn, close, resize, or preference change may have replaced this layer.
     if(turnLayer!==layer)return;
     previous.remove();stationary.hidden=false;sheet.hidden=false;layer.dataset.phase='turning';
     const animation=sheet.animate([
       {transform:'rotateY(0deg)'},
       {transform:`rotateY(${direction>0?-180:180}deg)`}
     ],{duration:240,easing:'ease-in-out',fill:'forwards'});
     pageAnimation=animation;
     animation.finished.then(()=>{
       // Half-sheet backs match the destination; a full leaf reveals it underneath.
       layer.remove();
       if(pageAnimation===animation){pageAnimation=null;turnLayer=null;}
     },()=>layer.remove());
   });
 }
 function turnTo(index) {
   if(!active||index===pageIndex||index< -1||index>active.pages.length)return;
   const direction=index>pageIndex?1:-1;
   // When skipping a still-loading page, keep the last visible (decoded) page.
   const previous=(turnLayer?.dataset.phase==='loading'?turnLayer.querySelector(':scope > .story-page'):null)||$('#reader-stage .book-surface');
   stopAnimation();
   pageIndex=index;if(index===-1){progress[active.id]=-1;persist();}
   renderPage();setHash();animatePage(direction,previous);
 }
 document.addEventListener('click',e=>{
   if(e.target.closest('.brand')&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey&&e.button===0){e.preventDefault();renderShelf();window.scrollTo(0,0);return;}
   const b=e.target.closest('button');if(!b)return;
   if(b.hasAttribute('data-open-share')){openShare();return;}
   if(b.hasAttribute('data-close-share')){shareDialog.close();return;}
   if(b.hasAttribute('data-copy-link')){void copyShareLink();return;}
   if(b.hasAttribute('data-native-share')){void nativeShare();return;}
   if(b.hasAttribute('data-fullscreen')){void toggleFullscreen();return;}
   if(b.dataset.open){openBook(b.dataset.open,-1);return;}
   if(b.hasAttribute('data-close')){closeBook();return;}
   if(b.hasAttribute('data-next'))turnTo(pageIndex+1);
   if(b.hasAttribute('data-prev'))turnTo(pageIndex-1);
   if(b.hasAttribute('data-page'))turnTo(Number(b.dataset.page));
   if(b.hasAttribute('data-replay'))turnTo(-1);
 });
 document.addEventListener('keydown',e=>{
   if(e.altKey||e.metaKey||e.ctrlKey)return;
   if(e.key==='Escape'&&(isSiteFullscreen()||performance.now()-lastFullscreenExit<350)){
     e.preventDefault();void leaveFullscreen().catch(()=>{});return;
   }
   if($('dialog[open]')||!active)return;
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
 window.addEventListener('storage',e=>{if(e.key==='miri-books-v1'){try{const state=JSON.parse(e.newValue||'{}');progress=state?.progress&&typeof state.progress==='object'?state.progress:{};renderShelf();}catch{}}});
 renderShelf();fromHash();
})();
