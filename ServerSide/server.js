const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');


app.set('view engine', 'ejs');      // set the view engine to ejs
app.use(express.static(path.join(__dirname,"..","Screenshots")))

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})

//takes a screenshot and saves it in the Screenshots folder which is served as a static folder
app.post('/takescreenshot',(req,res)=>{
    
    console.log("Taking screenshot");
    // Delete the previous screenshot if it exists
    if(fs.existsSync(path.join(__dirname,"..","Screenshots","screenshot.png")))
        fs.unlinkSync(path.join(__dirname,"..","Screenshots","screenshot.png"))
    
    const bashScriptPath = path.join(__dirname,"..","bashScripts","screenshot.sh"); // Replace with the path to your Bash script
    
    // Run the Bash script to take the screenshot
    exec(`bash ${bashScriptPath}`, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error executing the script: ${error}`);
        return res.send(error);
    }
    else
        res.send("successsfully taken screenshot")
    });
})

app.get("/",(req,res)=>{
    res.render(path.join(__dirname,"..","ClientSide","index.ejs"));
})

