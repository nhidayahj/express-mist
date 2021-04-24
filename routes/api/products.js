const express = require('express');
const router = express.Router();

const oilDataLayer = require('../../dal/oils');
const diffuserDataLayer = require('../../dal/diffuser')

router.get('/oils', async (req, res) => {
    const allOils = await oilDataLayer.getAllOils();
    // console.log("All oils: ", allOils.toJSON())
    res.send(allOils.toJSON());
})


router.get('/diffusers', async (req, res) => {
    const allDiffusers = await diffuserDataLayer.getAllDiffuser();
    res.send(allDiffusers.toJSON());
})

router.get('/diffuser/category/:category_id', async (req, res) => {
    const diffuser = await diffuserDataLayer.getDiffuserByCategory(req.params.category_id);
    res.send(diffuser)

})

router.get('/diffuser/low/:cost', async(req,res) => {
    const diffuser = await diffuserDataLayer
        .getDiffByLT(req.params.cost);
        res.send(diffuser)
})

router.get('/diffuser/mid/:cost', async(req,res) => {
     const diffuser = await diffuserDataLayer
        .getDiffByMT(req.params.cost);
        res.send(diffuser)
})

module.exports = router;