const express = require('express');
const router = express.Router();

const {Oils} = require('../models/oils');
const oilDataLayer = require('../dal/oils');

const {bootstrapField, createOilForm} = require('../forms');

router.get('/', async (req,res) => {
    const allOils = await oilDataLayer.getAllOils();
    const allOilsJSON = allOils.toJSON()
    // console.log("All tags: ", allTags)
    // console.log('all oils: ', allOilsJSON);
    res.render('products/oils', {
        'oil':allOilsJSON
    })
})

router.get('/create', async(req,res) => {
    const allOils = await oilDataLayer.getAllOils();
    const allSizes = await oilDataLayer.getAllSizes();
    const allTags = await oilDataLayer.getAllTags();

    // create form instance 
    const oilForm = createOilForm(allSizes, allTags);

    res.render('products/create', {
        form:oilForm.toHTML(bootstrapField),
        oil:allOils
    })

})

router.post('/create', async(req,res) => {
    const allSizes = await oilDataLayer.getAllSizes();
    const allTags = await oilDataLayer.getAllTags();

    const newOil = createOilForm(allSizes, allTags);

    newOil.handle(req, {
        'success': async (form) => {
            let {tags, sizes, ...productData} = form.data;
            const newItem = new Oils();
            newItem.set(productData)
            await newItem.save()

            if (sizes) {
                await newItem.sizes().attach(sizes.split(','))
            }            
            if (tags) {
                await newItem.tags().attach(tags.split(','))
            }

            res.redirect('/oils');
        },
        'error': (form) => {
            res.render('products/create', {
                'form': form.toHTML(bootstrapField),
            })
        }
    })

})

router.get('/:oil_id/update', async(req,res) => {
    const oil = await oilDataLayer.getOilById(req.params.oil_id);
    const oilSizes = await oilDataLayer.getAllSizes();
    const oilTags = await oilDataLayer.getAllTags();
    const oilJSON = oil.toJSON()

    const oilToEdit = createOilForm(oilSizes, oilTags)

    res.render('products/update', {
        'form':oilToEdit.toHTML(bootstrapField),
        'oil':oilJSON
    })
})

module.exports = router;