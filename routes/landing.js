const express = require('express');
const router = express.Router();


const diffuserDataLayer = require('../dal/diffuser');
const oilDataLayer = require('../dal/oils');
// const {bootstrapField, searchFields} = require('../forms/searchField');

router.get('/', async(req,res) => {
    const allDiffuser = await diffuserDataLayer.getAllDiffuser();
    const allDiffuserJSON = allDiffuser.toJSON();
    const allDiffuserCat = await diffuserDataLayer.getAllCategory();
    allDiffuserCat.unshift([0], '----')
    const allDiffuserTags = await diffuserDataLayer.getAllTags();
    
    
    const allOil = await oilDataLayer.getAllOils();
    const allOilJSON = allOil.toJSON();
    const oilSizes = oilDataLayer.getAllSizes();
    const allOilTags = oilDataLayer.getAllTags();

    
    res.render('landing/home', {
        'diffuser':allDiffuserJSON,
        'oil':allOilJSON
    })

    
})



module.exports = router;