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
 let checks=0;const errors=[];
 try{
  const base=process.env.BOOKS_TEST_URL||`http://127.0.0.1:${server.address().port}/`;
  for(const [width,height] of [[390,844],[844,390],[768,1024],[1024,768],[1440,1000]]){
   const page=await browser.newPage({viewport:{width,height},hasTouch:width<1400,reducedMotion:'reduce'});
   page.on('pageerror',error=>errors.push(error.message));await page.goto(base);
   for(const full of [false,true]){
    if(full){await page.locator('[data-fullscreen]:visible').first().click();await page.waitForFunction(()=>!!document.fullscreenElement);}
    for(const number of [4,7,13]){
     await page.evaluate(number=>location.hash=`book=six-sleeps&page=${number-1}`,number);
     await page.waitForFunction(number=>document.querySelector('.printed-page')?.textContent===String(number),number);
     const image=page.locator('.page-picture img');await image.evaluate(image=>image.decode());
     assert((await image.getAttribute('src')).endsWith(`six-sleeps-${number}.webp?v=six-sleeps3`));
     assert.equal(await image.evaluate(image=>image.naturalWidth),1254);
     assert((await image.getAttribute('alt')).includes('Abba'));
     if(number===13){const text=await page.locator('.story-text').innerText();assert(text.includes('Miri woke up'));assert(text.includes('had all been a dream!'));}
     const fits=await page.evaluate(()=>{
      const text=document.querySelector('.story-text').getBoundingClientRect(),number=document.querySelector('.printed-page').getBoundingClientRect();
      return text.bottom<=number.top-4&&document.documentElement.scrollWidth<=innerWidth+1;
     });assert(fits,`Page ${number} fits ${width}x${height}, fullscreen=${full}`);
     if(!full&&[390,844,768].includes(width))await page.screenshot({path:`/private/tmp/six-sleeps-revision3-page${number}-${width}.png`});
     checks++;
    }
    if(full){await page.locator('#reader [data-fullscreen]').click();await page.waitForFunction(()=>!document.fullscreenElement);}
   }
   await page.goto(new URL('stories.html#six-sleeps',base).href);
   for(const number of [4,7,13]){
    const image=page.locator('#six-sleeps .draft-page').nth(number-1).locator('img');await image.scrollIntoViewIfNeeded();await image.evaluate(image=>image.decode());
    assert((await image.getAttribute('src')).endsWith(`six-sleeps-${number}.webp?v=six-sleeps3`));checks++;
   }
   assert((await page.locator('#six-sleeps .draft-page').nth(12).innerText()).includes('Miri woke up'));
   await page.close();
  }
  assert.deepEqual(errors,[]);console.log(JSON.stringify({result:'PASS',checks,coverage:'Pages 4, 7 and 13; phone/tablet/desktop; normal/fullscreen; revised art decoded, cache versions, waking text, fitting and story review',limitations:'Chrome emulation, not physical-device testing'}));
 }finally{await browser.close();server.close();}
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});
