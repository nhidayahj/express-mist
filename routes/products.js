// these routes will display all items sold in website

const express = require('express');
const router = express.Router();

const diffuserDataLayer = require('../dal/diffuser')

router.get('/', async (req,res) => {
    const allCategories = await diffuserDataLayer.getAllCategory()
    // console.log(allCategories);
    const allDiffuser = await diffuserDataLayer.getAllDiffuser()

    res.render('products/products', {
        'diffuser':allDiffuser.toJSON(),
        
    })
})


module.exports = router;