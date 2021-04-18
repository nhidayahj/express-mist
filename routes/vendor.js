const express = require('express');
const router = express.Router();
const crypto = require('crypto')
const userDataLayer = require('../dal/users');
const {User, Role} = require('../models/diffusers');
const {bootstrapField, registerUserForm, vendorLoginForm} = require('../forms/users')


const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

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
            userForm.password = getHashedPassword(userForm.password);
            const newVendor = new User(userForm);
            await newVendor.save();

            req.flash("success_message", `New user: ${newVendor.get('email')} successfully added.`)
            res.redirect('/');
        }, 
        'error': (form) => {
            res.render('users/signup', {
                'form':form.toHTML(bootstrapField)
            })
            req.flash("error_messages", "Error adding user. Please ensure all fields are correctly entered.")
        }
    })
})

router.get('/login', async(req,res) => {
    // const allRoles = await userDataLayer.getAllRoles();
    const vendorLogin = vendorLoginForm();
    res.render('users/login', {
        'form':vendorLogin.toHTML(bootstrapField)
    })

})

router.post('/login', async(req,res) => {
    // const roles = await userDataLayer.getAllRoles();
    const vendorLogin = vendorLoginForm();

    vendorLogin.handle(req, {
        'success':async(form) => {
            let vendor = await User.where({
                'email':form.data.email
            }).fetch({
                require:false
            })

            if (!vendor) {
                req.flash("error_messages", `Login access failed. Please try again. If 
                            problem still persist, please contact your administrator.`)
                res.redirect('/vendor/login')
            } else {
                if (vendor.get('password') == getHashedPassword(form.data.password)) {
                    // store the user details 
                    req.session.user = {
                        id:vendor.get('id'),
                        username:vendor.get('username'),
                        workId:vendor.get('workId'),
                        email:vendor.get('email'), 
                        role:vendor.get('role_id')
                    }
                    console.log(req.session.user)
                    req.flash("success_messages", `Welcome back, ${req.session.user.username}`);
                    res.redirect("/");
                } else {
                    req.flash("error_messages", "Login details does not exists. Please try again.");
                    res.redirect('/vendor/login')
                }
            }
        }, 
        'error': (form) => {
            res.render('users/login', {
                'form':form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/logout', async(req,res) => {
    req.session.user = null;
    req.flash('success_messages', 'Successfully logged out.');
    res.redirect('/')
})


module.exports = router;