const express = require('express');
const router = express.Router();

//GET All Products
router.get('/', (req, res, next) => {
    res.status(200).json(
        {
            message: "Handling GET Requests done"
        })
})

//Post a Product
router.post('/', (req, res, next) => {
    const product = {
        name: req.body.name,
        price: req.body.price
    }
    res.status(200).json(
        {
            message: "One product created",
            createdProduct: product
        })
})

//Get one Product
router.get('/:productID', (req, res, next) => {
    const productID = req.params.productID;
    console.log("productID :", productID)
    if (productID === 'special') {
        {
            res.status(200).json(
                {
                    message: "You discoverd the special id",
                    id: productID
                })
        }
    }
    else {
        res.status(404).json(
            {
                message: "You discoverd the wrong id",
                id: productID
            })

    }

})

//Patch or Update one Product
router.patch('/:productID', (req, res, next) => {
    res.status(200).json({
        message: "Updated the Product : " + req.params.productID
    })
})


//Delete one Product
router.delete('/:productID', (req, res, next) => {
    res.status(200).json({
        message: "Delete the Product : " + req.params.productID
    })
})


module.exports = router;