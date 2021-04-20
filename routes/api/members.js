const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { checkIfAuthenticatedJWT } = require('../../middleware')
const { Member, BlacklistedToken } = require('../../models/diffusers');
const memberDataLayer = require('../../dal/cart')

const generateAccessToken = (user, secret, expiresIn) => {
    return jwt.sign(user, secret, {
        'expiresIn': expiresIn
    })
}


const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

// register new customer/member
router.post('/register', async (req, res) => {
    try {
        let name = req.body.name;
        let email = req.body.email;
        let dob = req.body.dob;
        let member_date = new Date();
        let mobile_no = req.body.mobile_no;
        let password = getHashedPassword(req.body.password);

        const customer = new Member();
        customer.set('name', name)
        customer.set('dob', dob)
        customer.set('member_date', member_date)
        customer.set('email', email)
        customer.set('mobile_no', mobile_no)
        customer.set('password', password)

        await customer.save();
        res.status(200);
        res.send("Member registered")
    } catch (e) {
        res.status(400);
        res.send({
            'error':"Invalid data"
        })
        console.log(e);
    }

})

router.post('/login', async (req, res) => {
    let customer = await Member.where({
        'email': req.body.email
    }).fetch({
        require: true
    });

    try {
        if (customer && customer.get('password') == getHashedPassword(req.body.password)) {
            const id = customer.get('id');
            const customerObject = {
                'name': customer.get('name'),
                'email': customer.get('email'),
                'id': customer.get('id'),
                'dob': customer.get('dob')
            }
            let accessToken = generateAccessToken(
                customerObject, process.env.TOKEN_SECRET, '15m');
            let refreshToken = generateAccessToken(
                customerObject, process.env.REFRESH_TOKEN_SECRET, '7d')

            res.send({
                // 'message':'Registered'
                'accessToken': accessToken, 
                'refreshToken': refreshToken, 
                'id':id
            })
        }
    } catch (e) {
        res.sendStatus(401);
        res.send({
            'error': 'Incorrect login details'
        })
        console.log(e);
    }

})

router.get('/profile', checkIfAuthenticatedJWT, async (req, res) => {
    const customer = req.user;
    res.send(customer);
})


router.post('/refresh', async (req, res) => {
    let refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        res.sendStatus(401);
        res.send({
            'error': "Unathorized"
        })
    }

    let blacklistedToken = await BlacklistedToken.where({
        'token': refreshToken
    }).fetch({
        require: false
    })

    if (blacklistedToken) {
        res.status(401);
        return res.send("Refresh token is expired.")
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, customer) => {
        if (err) {
            return res.sendStatus(403);
        } else {
            let accessToken = generateAccessToken({
                'name': customer.name,
                'email': customer.email,
                'dob': customer.dob,
                'id': customer.id
            }, process.env.TOKEN_SECRET, '14m');
            res.send({ accessToken })
        }
    })
})

router.post('/logout', async (req, res) => {
    let refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        res.sendStatus(401);
    } else {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            const tokenBlacklist = new BlacklistedToken();
            tokenBlacklist.set('token', refreshToken);
            tokenBlacklist.set('date_created', new Date());
            await tokenBlacklist.save();
            res.send({
                'message': "You've successfully logged out."
            })
        })
    }
})



module.exports = router;