const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const puppeteer = require('puppeteer');
const puppeteerStream = require('puppeteer-stream');

const expressWs = require('express-ws');
expressWs(app);


app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "..", "Static")));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

app.get("/", (req, res) => {
    res.render(path.join(__dirname, "..", "ClientSide", "index.ejs"))
})

// WebSocket
app.ws('/websocket', async (ws, req) => {
    
    console.log('WebSocket client connected.');
  
    let browser;
    let page;
    let frameCaptureTimeout;
  
    const startStream = async () => {
      // Start streaming frames
      const frameInterval = 100;                                                // Adjust the interval (frame rate as needed)
      const captureFrame = async () => {
        const screenshotBuffer = await page.screenshot({ type: 'png' });        //capture the frame as a Buffer of PNG data
        const base64Data = screenshotBuffer.toString('base64');                       // Convert the PNG buffer to base64 data
        ws.send(base64Data);                                                    // Send the base64 data over the WebSocket connection
        frameCaptureTimeout = setTimeout(captureFrame, frameInterval);          // Capture the next frame after the frame interval has passed
      };
      captureFrame();
    };

    ws.on('connection', async () => {
        browser = await puppeteer.launch({args: ['--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'],});
        page = await browser.newPage();
        await page.goto('https://temp-mail.org/en/');
    })

    ws.on('message', (msg) => {
      if (msg === 'start') {
        startStream();
      }
      if(msg == 'stop'){
        if (frameCaptureTimeout) {
            console.log('Clearing frame capture timeout.');
            clearTimeout(frameCaptureTimeout);
            frameCaptureTimeout=null;
          }
      }  
    });
  
    ws.on('close', async () => {
      if (frameCaptureTimeout) {
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