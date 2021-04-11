const express = require('express');
const router = express.Router();

const userDataLayer = require('../dal/users');
const {User, Role} = require('../models/users');
const {bootstrapField, registerUserForm} = require('../forms/users')


router.get('/', async(req,res) => {
    const allVendors = await userDataLayer.getAllVendors();
    res.render('users/users', {
        'user':allVendors.toJSON()
    })
})

router.get('/register', async(req,res) => {
    const allRoles = await userDataLayer.getAllRoles();
    const registerVendorForm = registerUserForm(allRoles);

    res.render('users/signup', {
        'form':registerVendorForm.toHTML(bootstrapField),
    })
})

router.post('/register', async(req,res) => {
    const allRoles = await userDataLayer.getAllRoles();
    const registerVendorForm = registerUserForm(allRoles);

    registerVendorForm.handle(req,{
        'success':async(form) => {
            let{confirm_password, ...userForm} = form.data;
            const newVendor = new User(userForm);
            await newVendor.save();

            req.flash("success_message", `New user: ${newVendor.get('email')} successfully added.`)
            res.redirect('/user');
        }, 
        'error': (form) => {
            res.render('users/signup', {
                'form':form.toHTML(bootstrapField)
            })
            req.flash("error_messages", "Error adding user. Please ensure all fields are correctly entered.")
        }
    })
})



module.exports = router;