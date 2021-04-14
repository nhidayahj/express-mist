const express = require('express');
const router = express.Router();

const oilDataLayer = require('../../dal/oils');
const diffuserDataLayer = require('../../dal/diffuser')

router.get('/oils', async(req,res) => {
    const allOils = await oilDataLayer.getAllOils();
    // console.log("All oils: ", allOils.toJSON())
    res.send(allOils.toJSON());
})


router.get('/diffusers', async (req,res) => {
    const allDiffusers = await diffuserDataLayer.getAllDiffuser();
    res.send(allDiffusers.toJSON());
})

module.exports = router;