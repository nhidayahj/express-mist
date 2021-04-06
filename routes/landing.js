// these routes contains the extra information 
// regarding the website 

const express = require('express');
const router = express.Router();

router.get('/', (req,res) => {
    res.render('landing/home')
})


router.get('/about-us', (req,res) => {
    res.send("About Us Page")
})

router.get('/contact-us', (req,res) => {
    res.send("Contact us Page")
})

module.exports = router;