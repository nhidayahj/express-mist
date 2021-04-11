const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on')
require('dotenv').config();
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const flash = require('connect-flash');

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

app.use(session({
    'store': new FileStore(),
    'secret':process.env.SESSION_SECRET_KEY,
    'resave':false,
    'saveUninitialized':true
}))

app.use(flash());
app.use(function (req,res,next) {
    res.locals.success_messages = req.flash("success_messages");
    res.locals.error_messages = req.flash("error_messages");
    next();
})

// import in routes 
const landingRoute = require('./routes/landing');
const diffuserRoute = require('./routes/diffuser');
const oilsRoute = require('./routes/oils');

async function main() {

    app.use('/', landingRoute)
    app.use('/diffusers', diffuserRoute)
    app.use('/oils', oilsRoute)
}

main();

app.listen('3000', () => {
    console.log("server has started")
})