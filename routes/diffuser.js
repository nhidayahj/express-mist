// these routes will display all items sold in website

const express = require('express');
const router = express.Router();

const diffuserDataLayer = require('../dal/diffuser')

const {bootstrapField, createProductForm} = require('../forms')

router.get('/', async (req,res) => {
    const allCategories = await diffuserDataLayer.getAllCategory()
    // console.log(allCategories);
    const allDiffuser = await diffuserDataLayer.getAllDiffuser()

    res.render('products/diffuser', {
        'diffuser':allDiffuser.toJSON(),
        
    })
})


router.get('/create', async(req,res) => {
    const allCategories = await diffuserDataLayer.getAllCategory();

    const createProduct = createProductForm(allCategories);

    res.render('products/create', {
        // 'form':createProduct.toHTML(bootstrapField)
    })
})





module.exports = router;