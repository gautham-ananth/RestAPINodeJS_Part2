const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//import the product schema
const Product = require('../models/product');

//GET All Products
router.get('/', (req, res, next) => {
    Product.find()
        .exec()
        .then(function (doc) {
            console.log(doc);
            // if (doc.length >= 0) {
            res.status(200).json(doc);
            // }
            // else
            // {
            //     res.status(404).json({message : "No entries found"})
            // }
        })
        .catch(error => {
            console.error(error);
            res.status(500).json(error);
        })
})

//Post a Product
router.post('/', async (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    console.log("Product to create : ", JSON.stringify(product));

    try {
        console.log("before");
        const result = await product.save();
        console.log("after", result);
        res.status(201).json(
            {
                message: "One product created",
                createdProduct: result
            })
    }
    catch (error) {
        console.log("error when creating a product :", error);
        res.status(500).json({
            error: error
        })
    }
})

//Get one Product
router.get('/:productID', async (req, res, next) => {
    const productID = req.params.productID;
    console.log("productID :", productID)
    try {
        const getProduct = await Product.findById(productID).exec();
        console.log("From Database : " + getProduct);
        if (getProduct) {
            res.status(200).json(getProduct);
        }
        else {
            res.status(404).json(getProduct);
        }
    }
    catch (error) {
        console.log("Error While fetching from : " + error);
        res.status(500).json({ messafe: "No valid entry found for provided id" })
    }
})

//Patch or Update one Product
router.patch('/:productID', (req, res, next) => {
    const idToUpdate = req.params.productID;
    const updateOps = {};
    console.log(req.body)
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value
    }
    Product.update({ _id: idToUpdate }, { $set: updateOps })
        .exec()
        .then(data => {
            console.log(data);
            res.status(200).json(data);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err })
        })

})

//Delete one Product
router.delete('/:productID', (req, res, next) => {
    const idTodelete = req.params.productID;
    Product.remove({ _id: idTodelete }).exec()
        .then(data => {
            res.status(200).json(data)
        }).catch(error => {
            console.error(error);
            res.status(500).json(error);
        })

})


module.exports = router;