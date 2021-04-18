const express = require('express');
const router = express.Router();

const { Oils } = require('../models/diffusers');
const oilDataLayer = require('../dal/oils');

const { bootstrapField, createOilForm } = require('../forms');
const {searchOilFields } = require('../forms/searchField');
const { checkIfAuthenticated } = require('../middleware')

router.get('/', async (req, res) => {
    // const allOilsJSON = allOils.toJSON()

    const allTags = await oilDataLayer.getAllTags()
    const allSizes = await oilDataLayer.getAllSizes()
    allSizes.unshift([0, 'Choose bottle size'])
    const oilSearch = searchOilFields(allSizes);

    let queryOil = Oils.collection();

    oilSearch.handle(req, {
        'empty': async (form) => {
            const allOils = await queryOil.fetch({
                withRelated: ['sizes', 'tags']
            });
            res.render('products/oils', {
                'form':form.toHTML(bootstrapField),
                'oil': allOils.toJSON()
            })
        }, 
        'error': async(form) => {
            const allOils = await queryOil.fetch({
                withRelated:['sizes', 'tags']
            })
            req.flash("error_messages", "No result found.")
            res.render('products/oils', {
                'form':form.toHTML(bootstrapField),
                'oil':allOils.toJSON()
            })
        },
        'success':async(form) => {
            if(form.data.name) {
                queryOil = queryOil
                .where('name', 'like', '%' + req.query.name + '%')
            }

            if(form.data.min_cost) {
                queryOil = queryOil
                    .where('cost', '>=', parseFloat(req.query.min_cost) * 100.00)
            }

            if (form.data.max_cost) {
                queryOil = queryOil
                    .where('cost', '<=', parseFloat(req.query.max_cost) * 100.00)
            }

            if(form.data.sizes !== '0') {
                queryOil = queryOil
                    .query('join', 'oils_sizes', 'oils.id', 'oil_id')
                    .where('size_id', '=', req.query.sizes)
            }

            if(form.data.min_stock) {
                queryOil = queryOil 
                    .where('stock', '>=', form.data.min_stock)
            }

            if(form.data.max_stock) {
                queryOil = queryOil 
                    .where('stock', '<=', form.data.max_stock)
            }

            

            let allOils = await queryOil.fetch({
                withRelated:['sizes', 'tags']
            })
            req.flash("success_messages", "Search result found.")
            res.render('products/oils', {
                'form':form.toHTML(bootstrapField),
                'oil':allOils.toJSON()
            })
        }
    })


})

router.get('/create', checkIfAuthenticated, async (req, res) => {
    const allOils = await oilDataLayer.getAllOils();
    const allSizes = await oilDataLayer.getAllSizes();
    const allTags = await oilDataLayer.getAllTags();

    // create form instance 
    const oilForm = createOilForm(allSizes, allTags);

    res.render('products/create', {
        form: oilForm.toHTML(bootstrapField),
        oil: allOils
    })

})

router.post('/create', checkIfAuthenticated, async (req, res) => {
    const allSizes = await oilDataLayer.getAllSizes();
    const allTags = await oilDataLayer.getAllTags();

    const newOil = createOilForm(allSizes, allTags);

    newOil.handle(req, {
        'success': async (form) => {
            let { tags, sizes, ...productData } = form.data;
            const newItem = new Oils();
            newItem.set(productData)
            await newItem.save()

            if (sizes) {
                await newItem.sizes().attach(sizes.split(','))
            }
            if (tags) {
                await newItem.tags().attach(tags.split(','))
            }
            req.flash("success_messages", `${newItem.get('name')} is successfully added.`)
            res.redirect('/oils');
        },
        'error': (form) => {
            res.render('products/create', {
                'form': form.toHTML(bootstrapField),
            })
            req.flash("error_messages", `Error adding product. Please try again.`)
        }
    })

})

router.get('/:oil_id/update', checkIfAuthenticated, async (req, res) => {
    const oil = await oilDataLayer.getOilById(req.params.oil_id);
    const oilSizes = await oilDataLayer.getAllSizes();
    const oilTags = await oilDataLayer.getAllTags();
    const oilJSON = oil.toJSON();
    // console.log(oilJSON);

    const existingTags = oilJSON.tags.map((t) => {
        return t.id
    })

    const sizes = oilJSON.sizes.map((s) => {
        return s.id
    })

    const oilForm = createOilForm(oilSizes, oilTags);
    oilForm.fields.name.value = oil.get('name');
    oilForm.fields.description.value = oil.get('description');
    oilForm.fields.cost.value = oil.get('cost');
    oilForm.fields.stock.value = oil.get('stock');
    oilForm.fields.image_url.value = oil.get('image_url');
    oilForm.fields.sizes.value = sizes;
    oilForm.fields.tags.value = existingTags;


    res.render('products/update', {
        'form': oilForm.toHTML(bootstrapField),
        'oil': oilJSON,
        'product': "oil"
    })
})

router.post('/:oil_id/update', checkIfAuthenticated, async (req, res) => {
    const oilToEdit = await oilDataLayer.getOilById(req.params.oil_id);
    const oilToEditJSON = oilToEdit.toJSON();
    const allSizes = await oilDataLayer.getAllSizes();
    const allTags = await oilDataLayer.getAllTags();

    const oilForm = createOilForm(allSizes, allTags);

    oilForm.handle(req, {
        'success': async (form) => {
            let { sizes, tags, ...productData } = form.data;
            oilToEdit.set(productData);
            await oilToEdit.save();

            let newSelectedSize = sizes.split(',');
            let existingSize = oilToEditJSON.sizes.map((s) => {
                return s.id
            })
            oilToEdit.sizes().detach(existingSize);
            oilToEdit.sizes().attach(newSelectedSize);

            let newSelectedTags = tags.split(',');
            let existingTags = oilToEditJSON.tags.map((t) => {
                return t.id
            })

            oilToEdit.tags().detach(existingTags);
            oilToEdit.tags().attach(newSelectedTags);

            req.flash("success_messages", `${oilToEdit.get('name')} is successfully updated.`)
            res.redirect('/oils');
        },
        'error': (form) => {
            res.render('products/update', {
                'form': form.toHTML(bootstrapField),
                'oil': oilToEditJSON
            })
            req.flash("error_messages", `Error updating product. Please try again`);
        }
    })

})

router.get('/:oil_id/remove', checkIfAuthenticated, async (req, res) => {
    const oilToRemove = await oilDataLayer.getOilById(req.params.oil_id);
    res.render('products/remove', {
        'oil': oilToRemove.toJSON()
    })
})

router.post('/:oil_id/remove', checkIfAuthenticated, async (req, res) => {
    const oilToRemove = await oilDataLayer.getOilById(req.params.oil_id);
    let stock = oilToRemove.get("name");
    await oilToRemove.destroy();
    req.flash("success_messages", `${stock} successfully deleted.`)
    res.redirect('/oils')
})

module.exports = router;