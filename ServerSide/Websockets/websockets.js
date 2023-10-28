const { json } = require('express');

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

            browser = await puppeteer.launch({args: ['--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36']});
            page = await browser.newPage();
        
            // await page.goto('https://temp-mail.org/en/');
            await page.goto('https://sketch.io/sketchpad/');
            // Start streaming frames
            const frameInterval = 1000/parseInt(msg.fps);                                             // Adjust the interval (frame rate as needed)
                                                        
            console.log(frameInterval)

            await captureFrame(frameInterval);
        };
        
        const captureFrame = async (frameInterval) => {
            try{
                const screenshotBuffer = await page.screenshot({ type: 'png' });                  //capture the frame as a Buffer of PNG data
                const base64Data = screenshotBuffer.toString('base64');                           // Convert the PNG buffer to base64 data
                console.log('Sending frame.');
                ws.send(base64Data);                                                          // Send the base64 data over the WebSocket connection
                if(isStreaming)
                    frameCaptureTimeout = setTimeout(captureFrame, frameInterval);                    // Capture the next frame after the frame interval has passed                
            }
            catch(err){
                console.error(err);
            }
        };


        ws.on('message',async (msg) => {
            msg = JSON.parse(msg);

            if (msg.msgType == 'start') {
                isStreaming = true;
                console.log('Starting stream.');
                await startStream(msg);
                console.log('Stream started.');
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