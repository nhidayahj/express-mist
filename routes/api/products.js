const express = require('express');
const router = express.Router();

const oilDataLayer = require('../../dal/oils');
const diffuserDataLayer = require('../../dal/diffuser')

router.get('/oils', async (req, res) => {
    const allOils = await oilDataLayer.getAllOils();
    // console.log("All oils: ", allOils.toJSON())
    res.send(allOils.toJSON());
})

router.get('/oil/size/:size', async(req, res) => {
    const size = await oilDataLayer.getIndivSize(req.params.size);
    res.send(size)
})

router.get('/oil/:name', async(req,res) => {
   
    const oil = await oilDataLayer.getOilByName(req.params.name);
    
    res.send(oil);
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

router.get('/diffuser/range/:cost', async(req,res) => {
    const diffuser = await diffuserDataLayer
        .getDiffByMidRange(req.params.cost);
        res.send(diffuser)
})



module.exports = router;