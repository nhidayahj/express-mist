// these routes will display all items sold in website

const express = require('express');
const router = express.Router();

const { Diffuser, Diffuser_Category } = require('../models')

const diffuserDataLayer = require('../dal/diffuser')

const { bootstrapField, createProductForm } = require('../forms')

router.get('/', async (req, res) => {
    const allCategories = await diffuserDataLayer.getAllCategory()
    // console.log(allCategories);
    const allDiffuser = await diffuserDataLayer.getAllDiffuser()


    res.render('products/diffuser', {
        'diffuser': allDiffuser.toJSON(),


    })
})


router.get('/create', async (req, res) => {
    const allCategories = await diffuserDataLayer.getAllCategory();

    const createProduct = createProductForm(allCategories);

    res.render('products/create', {
        'form': createProduct.toHTML(bootstrapField)
    })
})

// route to upload new stock
router.post('/create', async (req, res) => {
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
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/:diffuser_id/update', async (req, res) => {
    const getAllCategory = await diffuserDataLayer.getAllCategory();

    const diffuserToEdit = await diffuserDataLayer.getDiffuserById(req.params.diffuser_id);
    const diffuserJSON = diffuserToEdit.toJSON()

    const productForm = createProductForm(getAllCategory);
    productForm.fields.diffuser_name.value = diffuserToEdit.get('diffuser_name')
    productForm.fields.description.value = diffuserToEdit.get('description')
    productForm.fields.cost.value = diffuserToEdit.get('cost')
    productForm.fields.category_id.value = diffuserToEdit.get('category_id')
    productForm.fields.stock.value = diffuserToEdit.get('stock')

    res.render('products/update', {
        'form': productForm.toHTML(bootstrapField),
        'diffuser': diffuserJSON
    })


})

router.post('/:diffuser_id/update', async (req, res) => {
    const getAllCategory = diffuserDataLayer.getAllCategory();
    const diffuserToEdit = diffuserDataLayer.getDiffuserById(req.params.diffuser_id);

    const productForm = createProductForm(getAllCategory);
    productForm.handle(req, {
        'success': async (form) => {
            diffuserToEdit.set(form.data);
            await diffuserToEdit.save();

            res.redirect('products/diffuser');
        },
        'error': (form) => {
            res.render('products/update', {
                'form': form.toHTML(bootstrapField),
                'diffuser': diffuserToEdit.toJSON()
            })
        }
    })

})

router.get('/:diffuser_id/remove', async (req, res) => {
    const diffuserToRemove = await diffuserDataLayer.getDiffuserById(req.params.diffuser_id);
    res.render('products/remove', {
        'diffuser': diffuserToRemove.toJSON()
    })
})

router.post('/:diffuser_id/remove', async (req, res) => {
    const diffuserToRemove = await diffuserDataLayer.getDiffuserById(req.params.diffuser_id);
    await diffuserToRemove.destroy();
    res.redirect('/diffusers')
})

module.exports = router;