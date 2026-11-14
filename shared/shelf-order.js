/* Browser-local bookshelf preferences and pointer/keyboard reordering. */
'use strict';
window.createShelfOrder = ({books,onChange,announce}) => {
 const storageKey='miri-books-shelf-v1';
 const modes=['newest','oldest','title','custom'];
 const ids=new Set(books.map(b=>b.id));
 const newest=[...books].sort((a,b)=>(b.created||'').localeCompare(a.created||''));
 const collator=new Intl.Collator('en',{sensitivity:'base',numeric:true});
 let mode='newest',customOrder=[],startView='all',motion='system',showContinue=true,drag=null,suppressClickUntil=0;
 const shelf=document.querySelector('#shelf');
 const trigger=document.querySelector('[data-shelf-settings]');
 function readPreferences(value) {
   try {
     const state=JSON.parse(value||'{}')||{};
     mode=modes.includes(state.mode)?state.mode:'newest';
     startView=state.startView==='favorites'?'favorites':'all';
     motion=state.motion==='instant'?'instant':'system';
     showContinue=state.showContinue!==false;
     customOrder=Array.isArray(state.order)?[...new Set(state.order.filter(id=>ids.has(id)))]:[];
   }catch{mode='newest';customOrder=[];startView='all';motion='system';showContinue=true;}
 }
 try{readPreferences(localStorage.getItem(storageKey));}catch{}
 function persist(){try{localStorage.setItem(storageKey,JSON.stringify({mode,order:customOrder,startView,motion,showContinue}));}catch{}}
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
 dialog.innerHTML=`<div class="settings-heading"><h2 id="shelf-settings-title">Settings</h2><button class="settings-close" aria-label="Close settings" autofocus>×</button></div><section class="settings-section" aria-labelledby="settings-shelf-title"><h3 id="settings-shelf-title">Bookshelf</h3><label for="shelf-sort">Book order</label><select id="shelf-sort"><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="title">Title (A–Z)</option><option value="custom">Custom order</option></select><p class="settings-help">Drag covers with a mouse, or their grips on a touch screen. Arrow keys move a focused grip.</p><button class="reset-shelf-order">Reset order</button><label for="shelf-start">Start on</label><select id="shelf-start"><option value="all">All books</option><option value="favorites">Favorites</option></select><label class="settings-check" for="show-continue"><span>Show “Continue reading” links<small>Keep your place handy on the bookshelf.</small></span><input type="checkbox" id="show-continue"></label></section><section class="settings-section" aria-labelledby="settings-reading-title"><h3 id="settings-reading-title">Reading</h3><label for="reading-motion">Page turns</label><select id="reading-motion" aria-describedby="reading-motion-help"><option value="system">Gentle page turn</option><option value="instant">Instant — no animation</option></select><p class="settings-help" id="reading-motion-help">Always respects your device’s reduced-motion setting.</p><button class="reset-reading-settings">Reset reading settings</button></section><p class="settings-local">Saved in this browser. Favorites and reading progress stay safe when you reset settings.</p>`;
 document.body.append(dialog);
 const select=dialog.querySelector('#shelf-sort'),startSelect=dialog.querySelector('#shelf-start'),motionSelect=dialog.querySelector('#reading-motion'),continueToggle=dialog.querySelector('#show-continue');
 const help=document.createElement('span');help.id='shelf-reorder-help';help.className='sr-only';help.textContent='Drag to move this book, or use arrow keys to move it earlier or later. Escape cancels a drag.';document.body.append(help);
 const syncSettings=()=>{select.value=mode;startSelect.value=startView;motionSelect.value=motion;continueToggle.checked=showContinue;};syncSettings();
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
 startSelect.addEventListener('change',()=>{startView=startSelect.value;refresh({startViewChanged:true});announce('Start view changed.');});
 motionSelect.addEventListener('change',()=>{motion=motionSelect.value;refresh();announce(motion==='instant'?'Page turns are now instant.':'Gentle page turns enabled.');});
 continueToggle.addEventListener('change',()=>{showContinue=continueToggle.checked;refresh();announce(showContinue?'Continue reading links shown.':'Continue reading links hidden. Your place is still saved.');});
 dialog.querySelector('.reset-reading-settings').addEventListener('click',()=>{startView='all';motion='system';showContinue=true;refresh({startViewChanged:true});announce('Reading settings restored. Book order, favorites, and reading progress preserved.');});

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
   cancelAnimationFrame(drag.raf);drag.ghost?.remove();drag.card.classList.remove('is-dragging');clearTarget();
   try{if(shelf.hasPointerCapture(drag.pointerId))shelf.releasePointerCapture(drag.pointerId);}catch{}
   document.body.classList.remove('reordering-books');drag=null;
 }
 shelf.addEventListener('pointerdown',e=>{
   if(e.button!==0||e.isPrimary===false||dialog.open)return;
   const cover=e.target.closest('.cover-button'),grip=e.target.closest('[data-reorder]');
   if(!cover&&!grip)return;
   if(e.pointerType!=='mouse'&&!grip)return;
   const card=e.target.closest('[data-book-id]');if(!card)return;
   cancelDrag();drag={id:card.dataset.bookId,card,pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,x:e.clientX,y:e.clientY,active:false};
 });
 shelf.addEventListener('pointermove',e=>{
   if(!drag||e.pointerId!==drag.pointerId)return;
   drag.x=e.clientX;drag.y=e.clientY;
   if(!drag.active&&Math.hypot(drag.x-drag.startX,drag.y-drag.startY)>8)beginDrag();
   if(drag.active){e.preventDefault();positionDrag();}
 },{passive:false});
 shelf.addEventListener('pointerup',e=>{
   if(!drag||e.pointerId!==drag.pointerId)return;
   const {id,target,active:wasDragging}=drag;cancelDrag();
   if(wasDragging&&target){applyMove(id,target.id,target.after);shelf.querySelector(`[data-reorder="${id}"]`)?.focus({preventScroll:true});}
 });
 shelf.addEventListener('pointercancel',cancelDrag);
 shelf.addEventListener('lostpointercapture',e=>{if(e.target===shelf&&drag?.active&&e.pointerId===drag.pointerId)cancelDrag();});
 shelf.addEventListener('dragstart',e=>e.preventDefault());
 document.addEventListener('click',e=>{if(performance.now()<suppressClickUntil&&e.target.closest('#shelf')){e.preventDefault();e.stopImmediatePropagation();}},true);
 document.addEventListener('keydown',e=>{
   if(e.key==='Escape'&&drag){e.preventDefault();cancelDrag();announce('Book move canceled.');return;}
   const grip=e.target.closest?.('[data-reorder]');if(!grip||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;
   e.preventDefault();const visible=[...shelf.querySelectorAll('[data-book-id]')].map(el=>el.dataset.bookId),id=grip.dataset.reorder,index=visible.indexOf(id),forward=['ArrowRight','ArrowDown'].includes(e.key),target=visible[index+(forward?1:-1)];
   if(target){applyMove(id,target,forward);shelf.querySelector(`[data-reorder="${id}"]`)?.focus({preventScroll:true});}
 });
 window.addEventListener('pointerup',()=>{if(drag&&!drag.active)cancelDrag();});
 window.addEventListener('blur',cancelDrag);
 window.addEventListener('storage',e=>{if(e.key===storageKey||e.key===null){const previousStart=startView;readPreferences(e.key===storageKey?e.newValue:null);syncSettings();cancelDrag();onChange({startViewChanged:startView!==previousStart});}});
 return {orderedBooks,cancelDrag,preferences:()=>({startView,motion,showContinue})};
};
