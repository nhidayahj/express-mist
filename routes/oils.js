const express = require('express');
const router = express.Router();

const {Oils} = require('../models/oils');
const oilDataLayer = require('../dal/oils');


router.get('/', async (req,res) => {
    const allOils = await oilDataLayer.getAllOils();
    const allTags = await oilDataLayer.getAllTags();
    const allOilsJSON = allOils.toJSON()
    // console.log("All tags: ", allTags)
    console.log('all oils: ', allOilsJSON);
    res.render('products/oils', {
        'oil':allOilsJSON
    })
})

router.get('/create', async(req,res) => {

})


module.exports = router;