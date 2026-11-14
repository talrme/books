(() => {
 const groups={cozy:['01-little-library','02-moonbeam','05-reading-nook'],playful:['03-paper-parade','04-rainbow-room','08-little-atlas','09-cloud-nine'],quiet:['06-story-cinema','07-sunday-stories','10-pocket-stories']};
 let shortlist;try{shortlist=new Set(JSON.parse(localStorage.getItem('miri-design-shortlist')||'[]'));}catch{shortlist=new Set();}
 let category='all';
 function render(){
   document.querySelector('#shortlist-count').textContent=shortlist.size;
   document.querySelectorAll('[data-category]').forEach(b=>{b.classList.toggle('active',b.dataset.category===category);b.setAttribute('aria-pressed',String(b.dataset.category===category));});
   const list=window.CONCEPTS.filter(c=>category==='all'||(category==='saved'?shortlist.has(c.id):groups[category].includes(c.id)));
   document.querySelector('#design-grid').innerHTML=list.length?list.map(c=>`<article class="design-card" style="--design-bg:${c.color}"><a class="design-image" href="${c.id}/" aria-label="Explore ${c.name}"><img src="previews/${c.id}.jpg" alt="${c.name} website preview" loading="lazy" width="1000" height="645"></a><div class="design-copy"><div class="design-meta"><span>DESIGN ${c.id.slice(0,2)}</span><span>${c.label}</span></div><h3>${c.name}</h3><p>${c.description}</p><div class="design-detail">${c.detail}</div><div class="design-actions"><a href="${c.id}/">Explore this world <span>↗</span></a><button class="shortlist-button ${shortlist.has(c.id)?'is-saved':''}" data-save="${c.id}" aria-pressed="${shortlist.has(c.id)}" aria-label="${shortlist.has(c.id)?'Remove':'Add'} ${c.name} ${shortlist.has(c.id)?'from':'to'} shortlist">${shortlist.has(c.id)?'★ Shortlisted':'☆ Shortlist'}</button></div><div class="story-links"><a href="${c.id}/#book=swim&page=-1">The swimming book</a><a href="${c.id}/#book=avi&page=-1">The Avi book</a><a href="${c.id}/#book=adventure&page=-1">The blue bike book</a></div></div></article>`).join(''):'<p class="gallery-empty">Your shortlist is waiting. Tap ☆ Shortlist on a design you love.</p>';
 }
 document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.category){category=b.dataset.category;render();}if(b.dataset.save){shortlist.has(b.dataset.save)?shortlist.delete(b.dataset.save):shortlist.add(b.dataset.save);try{localStorage.setItem('miri-design-shortlist',JSON.stringify([...shortlist]));}catch{}render();}});
 render();
})();
