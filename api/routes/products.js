const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const fileFilter = function (req, file, cb) {
    //reject a file
    if (file.mimetype === 'image/jpeg') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}
// const upload = multer({ dest: 'uploads/' });
const upload = multer(
    {
        storage: storage,
        limits: { fileSize: 1024 * 1024 * 5 },
        fileFilter: fileFilter
    });

//import the product schema
const Product = require('../models/product');

//GET All Products
router.get('/', (req, res, next) => {
    Product.find()
        .select("name price _id productImage ")
        .exec()
        .then(function (docs) {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        "name": doc.name,
                        "price": doc.price,
                        productImage: doc.productImage,
                        "_id": doc.id,
                        "requests": {
                            "type": "GET",
                            "url": "http://localhost:3000/products/" + doc._id
                        }
                    }
                })
            }
            console.log(response);
            // if (doc.length >= 0) {
            res.status(200).json(response);
            // }
            // else
            // {
            //     res.status(404).json({message : "No entries found"})
            // }
        })
        .catch(errorHandler, res)
})

//Post a Product
router.post('/', upload.single('productImage'), checkAuth, async (req, res, next) => {
    console.log(req.file)
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    console.log("Product to create : ", JSON.stringify(product));

    try {
        console.log("before");
        const result = await product.save();
        console.log("after", result);
        res.status(201).json(
            {
                message: "Producted Created Successfully",
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    reqest: {
                        type: "GET",
                        "url": "http://localhost:3000/products/" + result._id
                    }
                }
            })
    }
    catch (error) {
        errorHandler(error, res)
    }
})

//Get one Product
router.get('/:productID', async (req, res, next) => {
    try {
        const productID = req.params.productID;
        const getProduct = await Product.findById(productID)
            .select("name price _id productImage")
            .exec();
        console.log("From Database : " + getProduct);
        if (getProduct) {
            res.status(200).json({
                product: getProduct,
                request: {
                    type: "GET All Products",
                    url: "http://localhost:3000/products"
                }
            });
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
            res.status(200).json({
                message: "Product Updated",
                request: {
                    type: "GET",
                    url: "http://localhost:3000/products/" + idToUpdate
                }
            });
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
            res.status(200).json({
                message: "Product Deleted",
                reqest: {
                    type: 'POST',
                    url: "http://localhost:3000:/products/",
                    data: {
                        name: "String",
                        price: "Number"
                    }
                }
            })
        }).catch(error => {
            console.error(error);
            res.status(500).json(error);
        })

})

function errorHandler(error, res) {
    console.error(error);
    res.status(500).json(error);

}

module.exports = router;