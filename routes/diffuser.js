// these routes will display all items sold in website

const express = require('express');
const router = express.Router();

const { Diffuser, Diffuser_Category } = require('../models')

const diffuserDataLayer = require('../dal/diffuser')

const { bootstrapField, createProductForm } = require('../forms')

router.get('/', async (req, res) => {
    // const allCategories = await diffuserDataLayer.getAllCategory();
    // const allTags = await diffuserDataLayer.getAllTags();
    
    const allDiffuser = await diffuserDataLayer.getAllDiffuser();

    //convert diffuser object to json for form formatting 
    const diffuserJSON = allDiffuser.toJSON();

    console.log("All Diffuser Object: ", diffuserJSON)
    res.render('products/diffuser', {
        'diffuser': diffuserJSON,
    })
})


router.get('/create', async (req, res) => {
    const allCategories = await diffuserDataLayer.getAllCategory();
    const allTags = await diffuserDataLayer.getAllTags()
    const createProduct = createProductForm(allCategories, allTags);

    res.render('products/create', {
        'form': createProduct.toHTML(bootstrapField)
    })
})

// route to upload new stock
router.post('/create', async (req, res) => {
    const allCategories = await diffuserDataLayer.getAllCategory();
    const allTags = await diffuserDataLayer.getAllTags();

    const createProduct = createProductForm(allCategories, allTags);

    createProduct.handle(req, {
        'success': async (form) => {
            let {tags, ...productData} = form.data;
            const newItem = new Diffuser();
            newItem.set(productData)

            if (tags) {
                await newItem.tags().attach(tags.split(','))
            }
            await newItem.save()

            res.redirect('/diffusers');
        },
        'error': (form) => {
            res.send("Please specify all fields");
            res.render('diffusers/create', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/:diffuser_id/update', async (req, res) => {
    const getAllCategory = await diffuserDataLayer.getAllCategory();
    const allTags = await diffuserDataLayer.getAllTags();
    
    const diffuserToEdit = await diffuserDataLayer.getDiffuserById(req.params.diffuser_id);
    const diffuserJSON = diffuserToEdit.toJSON()
    // console.log("Diffuser to edit: ",diffuserJSON)
     // get previous tags of products
    const existingTags = diffuserJSON.tags.map((t)=>{
        return t.id
    })

    const productForm = createProductForm(getAllCategory, allTags);
    productForm.fields.diffuser_name.value = diffuserToEdit.get('diffuser_name');
    productForm.fields.description.value = diffuserToEdit.get('description');
    productForm.fields.cost.value = diffuserToEdit.get('cost');
    productForm.fields.category_id.value = diffuserToEdit.get('category_id');
    productForm.fields.stock.value = diffuserToEdit.get('stock');
    productForm.fields.tags.value = existingTags;
   


    res.render('products/update', {
        'form': productForm.toHTML(bootstrapField),
        'diffuser': diffuserJSON
    })


})

router.post('/:diffuser_id/update', async (req, res) => {
    const allCategory = diffuserDataLayer.getAllCategory();
    const allTags = diffuserDataLayer.getAllTags();
    const diffuserToEdit = await diffuserDataLayer.getDiffuserById(req.params.diffuser_id);
    // console.log("Diffuser to edit: ",diffuserToEdit.toJSON());
    
    // convert product object into JSON format
    const diffuserJSON = diffuserToEdit.toJSON();
    const productForm = createProductForm(allCategory, allTags);
    
    productForm.handle(req, {
        'success': async (form) => {
            let {tags, ...diffuserData} = form.data
            diffuserToEdit.set(diffuserData);
            await diffuserToEdit.save();

            // becuase caolan form processing requires such to format the array
            let newSelectedTags = tags.split(',');
            let existingTags = diffuserJSON.tags.map((t) => t.id)
            
            // remove existing tags
            diffuserToEdit.tags().detach(existingTags);
            diffuserToEdit.tags().attach(newSelectedTags);


            res.redirect('/diffusers');
        },
        'error': (form) => {
            res.render('products/update', {
                'form': form.toHTML(bootstrapField),
                'diffuser': diffuserJSON
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