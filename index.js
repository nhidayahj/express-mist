const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on')
require('dotenv').config();

let app = express();

app.set("view engine", 'hbs')

app.use(express.static("public"))

wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts')

app.use(
    express.urlencoded({
        extended:false
    })
);

// import in routes 
const landingRoute = require('./routes/landing')
const productsRoute = require('./routes/products')

async function main() {

    app.use('/', landingRoute)
    app.use('/products', productsRoute)
}

main();

app.listen('3000', () => {
    console.log("server has started")
})