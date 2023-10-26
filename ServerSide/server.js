const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const port = 3000;
const path = require('path');
const fs = require('fs');


app.set

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})

app.get('/takescreenshot',async (req,res)=>{
    
    // Launch a headless Chrome browser
    const browser = await puppeteer.launch();

    // Create a new page/tab
    const page = await browser.newPage();

    // Navigate to a website
    await page.goto('https://temp-mail.org/en/');

    const Filename = "screenshot.png";
    const screenshotPath = path.join((__dirname,"..", "Screenshots",Filename));

    // Ensure the directory exists
    if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir);
    }

    // Take a screenshot of the page
    await page.screenshot({ path: screenshotPath });

    console.log(`Screenshot saved to ${screenshotPath}`);

    // Close the browser
    await browser.close();
})

app.get("/",(req,res)=>{
    res.render(path.join(__dirname,"..","ClientSide","index.ejs"))
})

