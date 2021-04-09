const express = require('express');
const router = express.Router();

const {Oils} = require('../models');
const oilDataLayer = require('../dal/oils');


router.get('/', async (req,res) => {
    const allSizes = await oilDataLayer.getAllSizes;
    res.render('products/oils', {
        'oil':allSizes
    })
})

router.get('/create', async(req,res) => {

})


module.exports = router;