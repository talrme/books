/* Browser-local bookshelf preferences and pointer/keyboard reordering. */
'use strict';
window.createShelfOrder = ({books,onChange,announce}) => {
 const storageKey='miri-books-shelf-v1';
 const modes=['newest','oldest','title','custom'];
 const ids=new Set(books.map(b=>b.id));
 const newest=[...books].sort((a,b)=>(b.created||'').localeCompare(a.created||''));
 const collator=new Intl.Collator('en',{sensitivity:'base',numeric:true});
 let mode='newest',customOrder=[],motion='system',view='covers',drag=null,suppressClickUntil=0;
 const shelf=document.querySelector('#shelf');
 const trigger=document.querySelector('[data-shelf-settings]');
 function readPreferences(value) {
   try {
     const state=JSON.parse(value||'{}')||{};
     mode=modes.includes(state.mode)?state.mode:'newest';
     view=state.view==='list'?'list':'covers';
     motion=state.motion==='instant'?'instant':'system';
     customOrder=Array.isArray(state.order)?[...new Set(state.order.filter(id=>ids.has(id)))]:[];
   }catch{mode='newest';customOrder=[];motion='system';view='covers';}
 }
 try{readPreferences(localStorage.getItem(storageKey));}catch{}
 function persist(){try{localStorage.setItem(storageKey,JSON.stringify({mode,order:customOrder,motion,view}));}catch{}}
 function orderedBooks(){
   if(mode==='oldest')return [...newest].reverse();
   if(mode==='title')return [...newest].sort((a,b)=>collator.compare(a.title,b.title));
   if(mode==='custom'){
     const order=[...newest.map(b=>b.id).filter(id=>!customOrder.includes(id)),...customOrder];
     return order.map(id=>books.find(b=>b.id===id));
   }
   return [...newest];
 }
 const dialog=document.createElement('dialog');dialog.className='shelf-settings';dialog.setAttribute('aria-labelledby','shelf-settings-title');
 const settingIcon=name=>{
   const paths={
     covers:'<rect x="3" y="4" width="7" height="15" rx="1.5" fill="#97bedc"/><path d="M5 5v13"/><rect x="14" y="5" width="7" height="15" rx="1.5" fill="#e99eab"/><path d="M16 6v13"/>',
     list:'<rect x="3" y="4" width="5" height="6" rx="1" fill="#97bedc"/><path d="M12 6h9m-9 3h6"/><rect x="3" y="14" width="5" height="6" rx="1" fill="#e99eab"/><path d="M12 16h9m-9 3h6"/>',
     newest:'<path d="M7 20V4m-4 4 4-4 4 4M15 6h6m-6 6h4m-4 6h2"/>',
     oldest:'<path d="M7 4v16m-4-4 4 4 4-4M15 6h2m-2 6h4m-4 6h6"/>',
     title:'<path d="m3 11 3-7 3 7M4 9h4m7 4h6l-6 7h6M15 4h6m-3-3v6"/>',
     custom:'<rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/><path d="M15 5h5v5m-3-8 3 3-3 3M9 19H4v-5m3 8-3-3 3-3"/>',
     system:'<path d="M12 5v15M3 4c4-1 6 0 9 2 3-2 5-3 9-2v15c-4-1-6 0-9 2-3-2-5-3-9-2Z"/>',
     instant:'<path d="m13 2-9 12h7l-1 8 10-13h-8Z"/>'
   };
   return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</svg>`;
 };
 const choices=(name,title,options,extra='')=>`<fieldset class="settings-choices ${extra}"><legend>${title}</legend><div class="choice-grid">${options.map(([value,label])=>`<label class="setting-option"><input type="radio" name="${name}" value="${value}"><span class="choice-body">${settingIcon(value)}<span>${label}</span><span class="choice-check" aria-hidden="true">✓</span></span></label>`).join('')}</div></fieldset>`;
 dialog.innerHTML=`<div class="settings-heading"><h2 id="shelf-settings-title">Settings</h2><button class="settings-close" aria-label="Close settings" autofocus>×</button><button class="fullscreen-toggle settings-fullscreen" data-fullscreen hidden aria-pressed="false">Fullscreen</button></div><p class="fullscreen-message" role="status" hidden></p><section class="settings-section" aria-label="Bookshelf settings">${choices('book-view','Book view',[['covers','Bookshelf'],['list','Compact list']],'view-choices')}${choices('book-order','Book order',[['newest','Newest first'],['oldest','Oldest first'],['title','Title A–Z'],['custom','Custom']])}<div class="settings-under-options"><p class="settings-help">Drag books to arrange them.<br>On touch screens, hold a cover first.</p><button class="reset-shelf-order">Reset order</button></div></section><section class="settings-section" aria-label="Reading settings">${choices('page-motion','Page turns',[['system','Gentle'],['instant','Instant']])}<div class="settings-under-options"><p class="settings-help">Respects your device’s<br>reduced-motion setting.</p><button class="reset-reading-settings">Reset</button></div></section><p class="settings-local">Saved in this browser.</p>`;
 document.body.append(dialog);
 const help=document.createElement('span');help.id='shelf-reorder-help';help.className='sr-only';help.textContent='Drag to move this book; on a touch screen, hold the cover first. Arrow keys move it earlier or later. Escape cancels a drag.';document.body.append(help);
 const syncSettings=()=>{
   for(const [name,value] of [['book-view',view],['book-order',mode],['page-motion',motion]]){
     dialog.querySelectorAll(`input[name="${name}"]`).forEach(input=>input.checked=input.value===value);
   }
 };syncSettings();
 function refresh(changes={}){persist();syncSettings();onChange(changes);}
 trigger.addEventListener('click',()=>{cancelDrag();syncSettings();dialog.showModal();});
 dialog.querySelector('.settings-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 dialog.addEventListener('close',()=>trigger.focus({preventScroll:true}));
 dialog.addEventListener('change',e=>{
   const input=e.target;if(!input.matches('input[type="radio"]'))return;
   if(input.name==='book-view'){
     view=input.value;refresh();announce(view==='list'?'Compact list view selected.':'Bookshelf view selected.');
   }else if(input.name==='book-order'){
     if(input.value==='custom'&&!customOrder.length)customOrder=orderedBooks().map(b=>b.id);
     mode=input.value;refresh();announce('Book order changed to '+input.closest('label').querySelector('.choice-body>span').textContent+'.');
   }else if(input.name==='page-motion'){
     motion=input.value;refresh();announce(motion==='instant'?'Page turns are now instant.':'Gentle page turns enabled.');
   }
 });
 dialog.querySelector('.reset-shelf-order').addEventListener('click',()=>{mode='newest';customOrder=[];refresh();announce('Book order reset. Newest first.');});
 dialog.querySelector('.reset-reading-settings').addEventListener('click',()=>{motion='system';refresh();announce('Reading settings restored. Book order and reading progress preserved.');});

 function applyMove(source,target,after){
   const current=orderedBooks().map(b=>b.id);
   if(source===target||!current.includes(source)||!current.includes(target))return;
   const next=current.filter(id=>id!==source);next.splice(next.indexOf(target)+(after?1:0),0,source);
   if(next.every((id,i)=>id===current[i]))return;
   mode='custom';customOrder=next;refresh();
   const title=books.find(b=>b.id===source).title;
   announce(title+' moved. Custom book order saved in this browser.');
 }
 function clearTarget(){shelf.querySelectorAll('.drop-before,.drop-after').forEach(el=>el.classList.remove('drop-before','drop-after'));}
 function findTarget(x,y){
   const grid=shelf.querySelector('.books-grid');if(!grid)return null;
   const bounds=grid.getBoundingClientRect();
   if(x<bounds.left-20||x>bounds.right+20||y<bounds.top-20||y>bounds.bottom+20)return null;
   let nearest=null,distance=Infinity;
   for(const card of grid.querySelectorAll('[data-book-id]')){
     if(card.dataset.bookId===drag.id)continue;
     const r=card.getBoundingClientRect(),dx=Math.max(r.left-x,0,x-r.right),dy=Math.max(r.top-y,0,y-r.bottom),d=dx*dx+dy*dy;
     if(d<distance){distance=d;nearest=card;}
   }
   if(!nearest)return null;
   const r=nearest.getBoundingClientRect();
   const oneColumn=getComputedStyle(grid).gridTemplateColumns.split(' ').length===1;
   const after=oneColumn?y>r.top+r.height/2:y<r.top?false:y>r.bottom?true:x>r.left+r.width/2;
   return {card:nearest,id:nearest.dataset.bookId,after};
 }
 function positionDrag(){
   if(!drag?.active)return;
   drag.ghost.style.left=(drag.x-drag.offsetX)+'px';drag.ghost.style.top=(drag.y-drag.offsetY)+'px';
   clearTarget();drag.target=findTarget(drag.x,drag.y);
   drag.target?.card.classList.add(drag.target.after?'drop-after':'drop-before');
 }
 function scrollDrag(){
   if(!drag?.active)return;
   const edge=65,amount=drag.y<edge?-Math.ceil((edge-drag.y)/5):drag.y>innerHeight-edge?Math.ceil((drag.y-innerHeight+edge)/5):0;
   if(amount){window.scrollBy(0,Math.max(-18,Math.min(18,amount)));positionDrag();}
   drag.raf=requestAnimationFrame(scrollDrag);
 }
 function beginDrag(){
   const card=drag.card,wrap=card.querySelector('.cover-wrap'),r=wrap.getBoundingClientRect();
   drag.active=true;drag.offsetX=drag.startX-r.left;drag.offsetY=drag.startY-r.top;
   drag.ghost=wrap.cloneNode(true);drag.ghost.classList.add('book-drag-ghost');drag.ghost.setAttribute('aria-hidden','true');drag.ghost.inert=true;
   drag.ghost.style.cssText=card.style.cssText+`;width:${r.width}px;height:${r.height}px;`;
   document.body.append(drag.ghost);card.classList.add('is-dragging');document.body.classList.add('reordering-books');
   try{shelf.setPointerCapture(drag.pointerId);}catch{}
   announce('Moving '+books.find(b=>b.id===drag.id).title+'.');positionDrag();scrollDrag();
 }
 function cancelDrag(){
   if(!drag)return;
   if(drag.active)suppressClickUntil=performance.now()+500;
   clearTimeout(drag.holdTimer);cancelAnimationFrame(drag.raf);drag.ghost?.remove();drag.card.classList.remove('is-dragging');clearTarget();
   try{if(shelf.hasPointerCapture(drag.pointerId))shelf.releasePointerCapture(drag.pointerId);}catch{}
   document.body.classList.remove('reordering-books');drag=null;
 }
 shelf.addEventListener('pointerdown',e=>{
   if(e.button!==0||e.isPrimary===false||dialog.open)return;
   const cover=e.target.closest('.cover-button');
   if(!cover)return;
   const card=e.target.closest('[data-book-id]');if(!card)return;
   cancelDrag();drag={id:card.dataset.bookId,card,pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,x:e.clientX,y:e.clientY,touch:e.pointerType!=='mouse',active:false};
   if(drag.touch)drag.holdTimer=setTimeout(()=>{if(drag)beginDrag();},350);
 });
 shelf.addEventListener('pointermove',e=>{
   if(!drag||e.pointerId!==drag.pointerId)return;
   drag.x=e.clientX;drag.y=e.clientY;
   if(!drag.active&&Math.hypot(drag.x-drag.startX,drag.y-drag.startY)>8){if(drag.touch){cancelDrag();return;}beginDrag();}
   if(drag.active){e.preventDefault();positionDrag();}
 },{passive:false});
 shelf.addEventListener('pointerup',e=>{
   if(!drag||e.pointerId!==drag.pointerId)return;
   const {id,target,active:wasDragging}=drag;cancelDrag();
   if(wasDragging&&target){applyMove(id,target.id,target.after);shelf.querySelector(`[data-reorder="${id}"]`)?.focus({preventScroll:true});}
 });
 // Cancel scrolling only after the deliberate hold; ordinary swipes stay native.
 shelf.addEventListener('touchmove',e=>{if(drag?.active&&drag.touch)e.preventDefault();},{passive:false});
 shelf.addEventListener('contextmenu',e=>{if(e.target.closest('.cover-button'))e.preventDefault();});
 shelf.addEventListener('pointercancel',cancelDrag);
 shelf.addEventListener('lostpointercapture',e=>{if(e.target===shelf&&drag?.active&&e.pointerId===drag.pointerId)cancelDrag();});
 shelf.addEventListener('dragstart',e=>e.preventDefault());
 document.addEventListener('click',e=>{if(performance.now()<suppressClickUntil&&e.target.closest('#shelf')){e.preventDefault();e.stopImmediatePropagation();}},true);
 document.addEventListener('keydown',e=>{
   if(e.key==='Escape'&&drag){e.preventDefault();cancelDrag();announce('Book move canceled.');return;}
   const cover=e.target.closest?.('[data-reorder]');if(!cover||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;
   e.preventDefault();const visible=[...shelf.querySelectorAll('[data-book-id]')].map(el=>el.dataset.bookId),id=cover.dataset.reorder,index=visible.indexOf(id),forward=['ArrowRight','ArrowDown'].includes(e.key),target=visible[index+(forward?1:-1)];
   if(target){applyMove(id,target,forward);shelf.querySelector(`[data-reorder="${id}"]`)?.focus({preventScroll:true});}
 });
 window.addEventListener('pointerup',()=>{if(drag&&!drag.active)cancelDrag();});
 window.addEventListener('blur',cancelDrag);
 window.addEventListener('storage',e=>{if(e.key===storageKey||e.key===null){readPreferences(e.key===storageKey?e.newValue:null);syncSettings();cancelDrag();onChange();}});
 return {orderedBooks,cancelDrag,preferences:()=>({motion,view})};
};
