const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on')
require('dotenv').config();
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const flash = require('connect-flash');
const csrf = require('csurf');
// cors is only for browser use
const cors = require('cors');

let app = express();
app.use(cors());

app.set("view engine", 'hbs')

// app.use(express.static(__dirname + '/public'))
app.use(express.static('public'))

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

const csrfInstance = csrf();
app.use(function(req,res,next) {
    if (req.url.slice(0,5) == '/api/' || req.url === '/checkout/process_payment' ) {
        return next()
    } else {
        csrfInstance(req,res,next)
    }
})


app.use(flash());
app.use(function (req,res,next) {
    res.locals.success_messages = req.flash("success_messages");
    res.locals.error_messages = req.flash("error_messages");
    next();
})

// share CSRF with hbs file


// global middleware to shared with hbs file
app.use(function (req,res, next) {
    res.locals.user = req.session.user;
    next();
})

app.use(function (req, res, next) {
    if (req.csrfToken) {
        res.locals.csrfToken = req.csrfToken();
    } 
    next()
})


// routes 
const landingRoute = require('./routes/landing');
const diffuserRoute = require('./routes/diffuser');
const oilsRoute = require('./routes/oils');
const vendorRoute = require('./routes/vendor');
const orderRoute = require('./routes/orders');

// api routes
const api = {
    'products':require('./routes/api/products'),
    'members':require('./routes/api/members'),
    'cartItems':require('./routes/api/cartItems'),
    // 'orders':require('./routes/api/custShipAddress'),
    'checkout':require('./routes/api/checkout'),
}

async function main() {

    app.use('/', landingRoute);
    app.use('/diffusers', diffuserRoute);
    app.use('/oils', oilsRoute);
    app.use('/vendor', vendorRoute);
    app.use('/orders', orderRoute);
    app.use('/api/members', express.json(), api.members)
    app.use('/api/products', express.json(), api.products)
    app.use('/api/shoppingCart', express.json(), api.cartItems)
    // app.use('/api/shipping', express.json(), api.orders)
    app.use('/api/checkout', api.checkout)
}

main();

app.listen(process.env.PORT, () => {
    console.log("server has started")
})
