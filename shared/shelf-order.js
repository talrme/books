/* Browser-local bookshelf preferences and pointer/keyboard reordering. */
'use strict';
window.createShelfOrder = ({books,onChange,announce}) => {
 const storageKey='miri-books-shelf-v1';
 const modes=['newest','oldest','title','custom'];
 const ids=new Set(books.map(b=>b.id));
 const newest=[...books].sort((a,b)=>(b.created||'').localeCompare(a.created||''));
 const collator=new Intl.Collator('en',{sensitivity:'base',numeric:true});
 let mode='newest',customOrder=[],motion='system',drag=null,suppressClickUntil=0;
 const shelf=document.querySelector('#shelf');
 const trigger=document.querySelector('[data-shelf-settings]');
 function readPreferences(value) {
   try {
     const state=JSON.parse(value||'{}')||{};
     mode=modes.includes(state.mode)?state.mode:'newest';
     motion=state.motion==='instant'?'instant':'system';
     customOrder=Array.isArray(state.order)?[...new Set(state.order.filter(id=>ids.has(id)))]:[];
   }catch{mode='newest';customOrder=[];motion='system';}
 }
 try{readPreferences(localStorage.getItem(storageKey));}catch{}
 function persist(){try{localStorage.setItem(storageKey,JSON.stringify({mode,order:customOrder,motion}));}catch{}}
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
 dialog.innerHTML=`<div class="settings-heading"><h2 id="shelf-settings-title">Settings</h2><button class="settings-close" aria-label="Close settings" autofocus>×</button><button class="fullscreen-toggle settings-fullscreen" data-fullscreen hidden aria-pressed="false">Fullscreen</button></div><p class="fullscreen-message" role="status" hidden></p><section class="settings-section" aria-labelledby="settings-shelf-title"><h3 id="settings-shelf-title">Bookshelf</h3><label for="shelf-sort">Book order</label><select id="shelf-sort"><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="title">Title (A–Z)</option><option value="custom">Custom order</option></select><p class="settings-help">Drag a book to move it. On touch screens, hold the cover first. Arrow keys move a focused cover.</p><button class="reset-shelf-order">Reset order</button></section><section class="settings-section" aria-labelledby="settings-reading-title"><h3 id="settings-reading-title">Reading</h3><label for="reading-motion">Page turns</label><select id="reading-motion" aria-describedby="reading-motion-help"><option value="system">Gentle page turn</option><option value="instant">Instant — no animation</option></select><p class="settings-help" id="reading-motion-help">Always respects your device’s reduced-motion setting.</p><button class="reset-reading-settings">Reset reading settings</button></section><p class="settings-local">Saved in this browser. Your reading progress stays safe when you reset settings.</p>`;
 document.body.append(dialog);
 const select=dialog.querySelector('#shelf-sort'),motionSelect=dialog.querySelector('#reading-motion');
 const help=document.createElement('span');help.id='shelf-reorder-help';help.className='sr-only';help.textContent='Drag to move this book; on a touch screen, hold the cover first. Arrow keys move it earlier or later. Escape cancels a drag.';document.body.append(help);
 const syncSettings=()=>{select.value=mode;motionSelect.value=motion;};syncSettings();
 function refresh(changes={}){persist();syncSettings();onChange(changes);}
 trigger.addEventListener('click',()=>{cancelDrag();syncSettings();dialog.showModal();});
 dialog.querySelector('.settings-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 dialog.addEventListener('close',()=>trigger.focus({preventScroll:true}));
 select.addEventListener('change',()=>{
   if(select.value==='custom'&&!customOrder.length)customOrder=orderedBooks().map(b=>b.id);
   mode=select.value;refresh();announce('Book order changed to '+select.selectedOptions[0].textContent+'.');
 });
 dialog.querySelector('.reset-shelf-order').addEventListener('click',()=>{mode='newest';customOrder=[];refresh();announce('Book order reset. Newest first.');});
 motionSelect.addEventListener('change',()=>{motion=motionSelect.value;refresh();announce(motion==='instant'?'Page turns are now instant.':'Gentle page turns enabled.');});
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
 return {orderedBooks,cancelDrag,preferences:()=>({motion})};
};
