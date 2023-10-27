const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

require('./Websockets/websockets.js')(app);


app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "..", "Static")));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

app.get("/", (req, res) => {
    res.render(path.join(__dirname, "..", "ClientSide", "index.ejs"))
})
