const express = require('express');
require('dotenv').config();

let app = express();

app.use(
    express.urlencoded({
        extended:false
    })
);

// import in routes 
const landingRoute = require('./routes/landing')

async function main() {

    app.use('/', landingRoute)
}

main();

app.listen('3000', () => {
    console.log("server has started")
})