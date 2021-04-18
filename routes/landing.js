const express = require('express');
const router = express.Router();

const { Diffuser, Oils } = require('../models/diffusers')

const diffuserDataLayer = require('../dal/diffuser');
const oilDataLayer = require('../dal/oils');

const { bootstrapField, searchFields } = require('../forms/searchField');

router.get('/', async (req, res) => {

    const searchProduct = searchFields();

    let queryDiffuser = Diffuser.collection();
    let queryOil = Oils.collection();

    searchProduct.handle(req, {
        'empty': async (form) => {
            let diffuser = await queryDiffuser.fetch({
                withRelated: ['category', 'tags']
            })

            let oil = await queryOil.fetch({
                withRelated: ['sizes', 'tags']
            })

            res.render('landing/home', {
                'form': form.toHTML(bootstrapField),
                'diffuser': diffuser.toJSON(),
                'oil': oil.toJSON()
            })
        },
        'error': async (form) => {
            let diffuser = await queryDiffuser.fetch({
                withRelated: ['category', 'tags']
            })

            let oil = await queryOil.fetch({
                withRelated: ['sizes', 'tags']
            })

            res.render('landing/home', {
                'form': form.toHTML(bootstrapField),
                'diffuser': diffuser.toJSON(),
                'oil': oil.toJSON()
            })
        },
        'success': async (form) => {
            if (req.query.product_type == 'diffuser') {
                console.log("OK")
                if (form.data.name) {
                    queryDiffuser = queryDiffuser
                        .where('diffuser_name', 'like', '%' + form.data.name + '%')
                }
                if (form.data.min_cost) {
                    queryDiffuser = queryDiffuser
                        .where('cost', '>=', parseFloat(req.query.min_cost) * 100.00)

                }

                if (form.data.max_cost) {
                    queryDiffuser = queryDiffuser
                        .where('cost', '<=', parseFloat(req.query.max_cost) * 100.00)

                }

                if (form.data.min_stock) {
                    queryDiffuser = queryDiffuser
                        .where('stock', '>=', form.data.min_stock)

                }

                if (form.data.max_stock) {
                    queryDiffuser = queryDiffuser
                        .where('stock', '<=', form.data.max_stock)
                }

                let allDiffuser = await queryDiffuser.fetch({
                    withRelated: ['category', 'tags']
                })
                res.render('landing/home', {
                    'form': form.toHTML(bootstrapField),
                    'diffuser': allDiffuser.toJSON(),
                })

            }

            if (req.query.product_type == 'oil') {
                console.log("OIL")
                if (form.data.name) {
                    queryOil = queryOil
                        .where('name', 'like', '%' + form.data.name + '%')
                }
                if (form.data.min_cost) {
                    queryOil = queryOil
                        .where('cost', '>=', parseFloat(req.query.min_cost) * 100.00)

                }

                if (form.data.max_cost) {
                    queryOil = queryOil
                        .where('cost', '<=', parseFloat(req.query.max_cost) * 100.00)

                }

                if (form.data.min_stock) {
                    queryOil = queryOil
                        .where('stock', '>=', form.data.min_stock)

                }

                if (form.data.max_stock) {
                    queryOil = queryOil
                        .where('stock', '<=', form.data.max_stock)
                }
                let allOil = await queryOil.fetch({
                    withRelated: ['sizes', 'tags']
                })
                res.render('landing/home', {
                    'form': form.toHTML(bootstrapField),
                    'oil': allOil.toJSON()
                })

            }
        }
    })
})





module.exports = router;