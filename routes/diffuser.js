// these routes will display all items sold in website

const express = require('express');
const router = express.Router();

const {Diffuser, Diffuser_Category} = require('../models')

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
        'form':createProduct.toHTML(bootstrapField)
    })
})

// route to upload new stock
router.post('/create', async(req,res) => {
    const allCategories = await diffuserDataLayer.getAllCategory();
    const createProduct = createProductForm(allCategories);

    createProduct.handle(req, {
        'success': async (form) => {
            const newItem = new Diffuser();
            newItem.set(form.data) 
            await newItem.save()
            
            res.redirect('/diffusers');
        }, 
        'error': (form) => {
            res.render('diffusers/create', {
                'form':form.toHTML(bootstrapField)
            })
        }
    })
})




module.exports = router;