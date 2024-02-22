module.exports = (app) => {

    var isStreaming=false;
    const puppeteer = require('puppeteer');
    const expressWs = require('express-ws');
    expressWs(app);
        
    // WebSocket
    app.ws('/websocket', async (ws, req) => {
        
        console.log('WebSocket client connected.');
    
        let browser;                                        //global variable to store the browser instance
        let page;                                           //global variable to store the page instance
        let frameCaptureTimeout;
        let fps=30;

        const startStream = async (msg) => {
            
            console.log(msg);

            if(!browser){
                
                browser = await puppeteer.launch(browser = await puppeteer.launch({
                    args: [
                      '--enable-audio', // Enable audio
                      '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
                    ]
                  }));
                page = await browser.newPage();
                await page.goto("https://www.youtube.com/");
                // await page.goto('https://knuth-programming-hub-9p08.onrender.com/');
                // await page.goto('https://temp-mail.org/en/');
                // await page.goto('https://sketch.io/sketchpad/');
                // await page.goto('https://poki.com/en/g/we-become-what-we-behold');
            }

            await captureFrame(msg.fps);
        };
        
        //function that captures the frame and sends it to the client over the websocket connection at the specified frame rate
        async function captureFrame(fps) {
            try{
                const screenshotBuffer = await page.screenshot({ type: 'png' });                               //capture the frame as a Buffer of PNG data
                const base64Data = screenshotBuffer.toString('base64');                                        // Convert the PNG buffer to base64 data
                console.log('Sending frame.');
                ws.send(base64Data);                                                                           // Send the base64 data over the WebSocket connection
                if(isStreaming)
                {
                    const frameInterval = 1000/parseInt(fps);                                                  // Adjust the interval (frame rate as needed)                                       
                    frameCaptureTimeout = setTimeout(()=>captureFrame(fps), frameInterval);                    // Capture the next frame after the frame interval has passed                
                }
            }
            catch(err){
                console.error(err);
            }
        };

        

        ws.on('message',async (msg) => {
            msg = JSON.parse(msg);

            if (msg.msgType == 'start') {
                isStreaming = true;
                await startStream(msg);
            }
            if(msg.msgType == 'stop'){
                if (frameCaptureTimeout) {
                    isStreaming=false;
                    console.log('Clearing frame capture timeout.');
                    clearTimeout(frameCaptureTimeout);
                    frameCaptureTimeout=null;
                }
            }
            if(msg.msgType == 'click'){
                console.log(msg);
                await page.mouse.click(msg.x,msg.y);
            }
            if(msg.msgType == 'mousemove'){
                //console.log(msg);
                await page.mouse.move(msg.x,msg.y);
            }
            if(msg.msgType == 'scroll'){
                console.log(msg);
                console.log("scrolling")
                await page.mouse.wheel({ deltaY: msg.deltaY });
            }
            if(msg.msgType == 'keyDown'){
                console.log(msg);
                await page.keyboard.down(msg.key);
            }
        });
    
        ws.on('close', async () => {
            
            if (frameCaptureTimeout) {
                isStreaming=false;
                console.log('Clearing frame capture timeout.');
                clearTimeout(frameCaptureTimeout);
                frameCaptureTimeout=null;
            }
            if (browser) {
                console.log('Closing browser.');
                await browser.close();
                browser = null;
            }

            console.log('WebSocket client disconnected.');
        });
    });

}
