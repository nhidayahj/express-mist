const express = require('express');
const router = express.Router();

const {Diffuser} = require('../../models/diffusers')
const diffuserDataLayer = require('../../dal/diffuser')
const {createProductForm} = require('../../forms');


router.get('/', async (req,res) => {
    const allDiffusers = await diffuserDataLayer.getAllDiffuser();
    res.send(allDiffusers);
})

router.post('/', async(req,res) => {
    const allCategory = await diffuserDataLayer.getAllCategory();
    const allTags = await diffuserDataLayer.getAllTags();
    const diffuserForm = createProductForm(allCategory, allTags);

    diffuserForm.handle(req, {
        'success':async(form) => {
            let {tags, ...diffuserData} = form.data;
            const newDiffuser = new Diffuser(diffuserData);
            await newDiffuser.save();

            if (tags) {
                await newDiffuser.tags().attach(tags.split(','))
            }
            res.send(newDiffuser);
        },
        'error': (form) => {
            let errors = {};
            for (let key in form.fields) {
                if(form.fields[key].error) {
                    errors[key] = form.fields[key].error
                }
            }
            res.send(JSON.stringify(errors))
        }
    })
})



module.exports = router;