const express = require('express');
const router = express.Router();

const oilDataLayer = require('../../dal/oils');

router.get('/', async(req,res) => {
    const allOils = await oilDataLayer.getAllOils();
    res.send(allOils);
})


module.exports = router;