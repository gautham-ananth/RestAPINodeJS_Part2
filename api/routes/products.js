const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json(
        {
            message: "Handling GET Requests done"
        })
})

router.post('/', (req, res, next) => {
    res.status(200).json(
        {
            message: "Handling POST Requests done"
        })
})


module.exports = router;