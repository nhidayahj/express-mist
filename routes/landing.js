const express = require('express');
const router = express.Router();

const { Diffuser, Oils } = require('../models/diffusers')

const diffuserDataLayer = require('../dal/diffuser');
const oilDataLayer = require('../dal/oils');

const { bootstrapField, searchDiffuserFields, searchOilFields } = require('../forms/searchField');

router.get('/', async (req, res) => {


    const allDiffuser = await diffuserDataLayer.getAllDiffuser();

    const allDiffuserCat = await diffuserDataLayer.getAllCategory();
    allDiffuserCat.unshift([0, '----'])
    const allDiffuserTags = await diffuserDataLayer.getAllTags();

    const searchDiffuser = searchDiffuserFields(allDiffuserCat, allDiffuserTags);

    // const allOil = await oilDataLayer.getAllOils();
    const oilSizes = oilDataLayer.getAllSizes();
    const allOilTags = oilDataLayer.getAllTags();
    const searchOil = searchOilFields(oilSizes, allOilTags);

    let queryDiffuser = Diffuser.collection();
    let queryOil = Oils.collection();

        searchDiffuser.handle(req, {
            'empty': async (form) => {
                let diffuser = await queryDiffuser.fetch({
                    withRelated: ['category', 'tags']
                })

                res.render('landing/home', {
                    'form': form.toHTML(bootstrapField),
                    'diffuser': diffuser,
                    
                })
            },
            'error': async (form) => {

            }
        })
    
        // searchOil.handle(req, {
        //     'empty': async(form) => {
        //         let oilProduct = await queryOil.fetch({
        //             withRelated:['sizes', 'tags']
        //         })
        //         res.render('landing/home', {
        //             'form': form.toHTML(bootstrapField),
        //             'oil': oilProduct,
        //         })
        //     }
        // })








    // res.send({
    //     'diffuser': allDiffuser,
    //     'oil': allOil
    // })


})





module.exports = router;