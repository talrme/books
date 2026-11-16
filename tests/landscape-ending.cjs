const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=path.resolve(__dirname,'..'),server=http.createServer((request,response)=>{
 let file=path.join(root,decodeURIComponent(request.url.split('?')[0]));if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
 if(!fs.existsSync(file))return response.writeHead(404).end();response.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(response);
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 const errors=[],issues=[];let checks=0;
 try{
  const base=process.env.BOOKS_TEST_URL||`http://127.0.0.1:${server.address().port}/`;
  for(const [width,height] of [[568,320],[667,375],[844,390],[932,430],[390,844],[768,1024],[1024,768]]){
   const page=await browser.newPage({viewport:{width,height},hasTouch:true,reducedMotion:'reduce'});page.on('pageerror',error=>errors.push(error.message));await page.goto(base);
   const books=await page.evaluate(()=>BOOKS.map(b=>({id:b.id,pages:b.pages.length})));
   for(const navigation of ['auto','show','hide']){
    await page.evaluate(n=>{const value=JSON.stringify({navigation:n});localStorage.setItem('miri-books-shelf-v1',value);window.dispatchEvent(new StorageEvent('storage',{key:'miri-books-shelf-v1',newValue:value}));},navigation);
    for(const full of [false,true]){
     if(full){await page.locator('[data-fullscreen]:visible').first().click();await page.waitForFunction(()=>!!document.fullscreenElement);}
     for(const book of books){
      await page.evaluate(({id,pages})=>location.hash=`book=${id}&page=${pages}`,book);await page.locator('.back-cover').waitFor();await page.locator('.end-picture img').evaluate(image=>image.decode());
      const metrics=await page.evaluate(()=>{
       const surface=document.querySelector('.back-cover'),title=surface.querySelector('.end-title'),image=surface.querySelector('.end-picture'),credit=surface.querySelector('.creation-note'),actions=surface.querySelector('.back-actions');
       const rect=element=>{const r=element.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height,cx:r.left+r.width/2};};
       return {surface:rect(surface),title:rect(title),image:rect(image),credit:rect(credit),actions:rect(actions),buttons:[...actions.querySelectorAll('button')].map(rect),back:rect(document.querySelector('.back-library')),stage:rect(document.querySelector('#reader-stage')),overflow:document.documentElement.scrollWidth>innerWidth+1};
      });
      if(process.env.SNAPSHOT_ONLY&&full){console.log(JSON.stringify(metrics));await page.screenshot({path:'/private/tmp/books-landscape-before.png'});return;}
      if(metrics.overflow||metrics.buttons.some(r=>r.height<44||r.bottom>metrics.surface.bottom-2||r.left<metrics.surface.left||r.right>metrics.surface.right)||metrics.surface.bottom>metrics.stage.bottom+1)issues.push({width,height,navigation,full,book:book.id,metrics});
      if(full&&height<=500&&width>height){
       const stack=[metrics.title,metrics.image,metrics.credit,metrics.actions];
       if(stack.some(r=>Math.abs(r.cx-metrics.surface.cx)>1.5)||metrics.title.bottom>metrics.image.top+1||metrics.credit.bottom>metrics.actions.top+1||metrics.back.left>30)issues.push({type:'Phone stack/header',width,height,navigation,book:book.id,metrics});
       if(book.id==='six-sleeps'&&navigation==='auto')await page.screenshot({path:`/private/tmp/books-landscape-end-${width}.png`});
      }
      if(full&&width>600&&height>500)assert(metrics.back.left>=84,'Keep tablet native-close space');
      if(full&&width<=600&&height>width)assert(metrics.back.left<40,'No tablet offset on a portrait phone');
      await page.locator('[data-replay]').click();assert(await page.locator('.reader-cover:not(.back-cover)').isVisible());await page.locator('#reader .back-library').click();assert(await page.locator('#library').isVisible());checks++;
     }
     if(full){assert(await page.evaluate(()=>!!document.fullscreenElement));await page.locator('#library [data-fullscreen]').click();}
    }
   }
   await page.close();
  }
  assert.deepEqual(issues,[]);assert.deepEqual(errors,[]);console.log(JSON.stringify({result:'PASS',checks,coverage:'Every book; landscape/portrait phones and tablets; three navigation preferences; normal/fullscreen; centered ending, visible 44px actions, phone header left alignment, tablet reserved space, replay and shelf',limitations:'Chrome touch emulation; native Safari fullscreen chrome not tested.'}));
 }finally{await browser.close();server.close();}
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});
