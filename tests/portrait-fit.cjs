const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=path.resolve(__dirname,'..');
const server=http.createServer((request,response)=>{
 let file=path.join(root,decodeURIComponent(request.url.split('?')[0]));
 if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
 if(!fs.existsSync(file))return response.writeHead(404).end();
 response.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(response);
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 const errors=[],issues=[];let coverChecks=0,storyChecks=0;
 try{
  const base=process.env.BOOKS_TEST_URL||`http://127.0.0.1:${server.address().port}/`;
  for(const [width,height,touch] of [[320,568,true],[360,640,true],[390,844,true],[412,915,true],[600,960,true],[844,390,true],[768,1024,true],[834,1194,true],[1024,768,true],[1194,834,true],[1440,1000,false]]){
   const page=await browser.newPage({viewport:{width,height},hasTouch:touch,reducedMotion:'reduce'});page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base);const books=await page.evaluate(()=>BOOKS.map(b=>({id:b.id,pages:b.pages.length})));
   for(const navigation of ['auto','show','hide']){
    await page.evaluate(n=>{const value=JSON.stringify({navigation:n});localStorage.setItem('miri-books-shelf-v1',value);window.dispatchEvent(new StorageEvent('storage',{key:'miri-books-shelf-v1',newValue:value}));},navigation);
    for(const full of [false,true]){
     if(full){await page.locator('[data-fullscreen]:visible').first().click();await page.waitForFunction(()=>!!document.fullscreenElement);}
     for(const book of books){
      await page.evaluate(id=>location.hash='book='+id,book.id);await page.locator('#reader-stage .reader-cover:not(.back-cover)').waitFor();
      await page.locator('#reader-stage img').evaluate(image=>image.decode());
      const cover=await page.evaluate(()=>{
       const surface=document.querySelector('#reader-stage .reader-cover'),image=surface.querySelector('img'),label=surface.querySelector('.cover-label');
       const r=surface.getBoundingClientRect(),i=image.getBoundingClientRect(),l=label.getBoundingClientRect(),stage=document.querySelector('#reader-stage').getBoundingClientRect();
       return {fit:getComputedStyle(image).objectFit,inside:r.top>=stage.top-1&&r.bottom<=stage.bottom+1&&r.width<=stage.width+1,titleSeparate:l.bottom<=i.top+1,imageInside:i.bottom<=r.bottom+1&&i.top>=r.top-1,imageHeight:i.height,overflow:document.documentElement.scrollWidth>innerWidth+1};
      });
      if(width<=600&&height>width&&!(cover.fit==='contain'&&cover.inside&&cover.titleSeparate&&cover.imageInside&&cover.imageHeight>60&&!cover.overflow))issues.push({width,height,navigation,full,book:book.id,cover});
      coverChecks++;
      if(width===390&&!full&&navigation==='auto')await page.screenshot({path:`/private/tmp/book-fit-${book.id}-390.png`});
      for(let n=0;n<book.pages;n++){
       await page.evaluate(n=>location.hash=location.hash.split('&')[0]+'&page='+n,n);
       await page.waitForFunction(n=>document.querySelector('.printed-page')?.textContent===String(n+1),n);
       const result=await page.evaluate(()=>{
        const image=document.querySelector('.page-picture img'),p=document.querySelector('.page-picture').getBoundingClientRect(),r=image.getBoundingClientRect(),text=document.querySelector('.story-text').getBoundingClientRect(),number=document.querySelector('.printed-page').getBoundingClientRect();
        return {fit:getComputedStyle(image).objectFit,pictureInside:r.top>=p.top-1&&r.bottom<=p.bottom+1&&r.left>=p.left-1&&r.right<=p.right+1,textFits:text.bottom<=number.top-4,overflow:document.documentElement.scrollWidth>innerWidth+1};
       });
       if(result.fit!=='contain'||!result.pictureInside||!result.textFits||result.overflow)issues.push({width,height,navigation,full,book:book.id,n,result});storyChecks++;
      }
      await page.keyboard.press('ArrowRight');assert(await page.locator('.back-cover').isVisible());await page.locator('[data-replay]').click();assert(await page.locator('.reader-cover:not(.back-cover)').isVisible());
      await page.locator('#reader .back-library').click();assert(await page.locator('#library').isVisible());
     }
     if(full){assert(await page.evaluate(()=>!!document.fullscreenElement));await page.locator('#library [data-fullscreen]').click();}
    }
   }
   await page.close();console.log(`Checked ${width}×${height}`);
  }
  assert.deepEqual(issues,[]);assert.deepEqual(errors,[]);
  console.log(JSON.stringify({result:'PASS',coverChecks,storyChecks,checks:'Full portrait cover art, separate title, all story pages, covers/replay/back/shelf, three navigation settings, normal/fullscreen, phone/tablet/desktop',limitations:'Chrome emulation; physical iPhone/Safari not tested.'}));
 }finally{await browser.close();server.close();}
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});
