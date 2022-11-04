const express = require('express');
const app = express();
const port = 3000;
const router = express.Router();

//Setup serving front-end code
app.use('/', express.static('static'));

//Setup middleware to do logging
app.use((req, res, next) => { //For all routes
    console.log(`${req.method} request for ${req.url}`);
    next(); //Keep going
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});