const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const {Member, User} = require('../../models/diffusers');
const memberDataLayer = require('../../dal/cart')

const generateAccessToken = (member) => {
    return jwt.sign({
        'username': member.get('username'),
        'email':member.get('email'),
        // 'dob':member.get('dob')
    }, process.env.TOKEN_SECRET, {
        expiresIn:'1h'
    })
}

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

// router.post('/register', async(req,res) => {
//     let name = req.body.name;
//     let email = req.body.email;
//     let dob = req.body.dob

//     res.send({

//     })
// })



router.post('/login', async(req,res) => {
    let vendor = await User.where({
        'email':req.body.email
    }).fetch({
        require:false
    });

    if (vendor && vendor.get('password') == getHashedPassword(req.body.password)) {
        let accessToken = generateAccessToken(member);
        res.send({
            accessToken
        })
    } else {
        res.send({
            'error':"Incorrect login details"
        })
    }
})


module.exports = router;