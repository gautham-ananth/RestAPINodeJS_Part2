const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');
//Get All Orders
router.get('/', (req, res, next) => {
    Order.find()
        .select('product quantity _id')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: "Get",
                            url: "http://localhost:3000/orders/" + doc._id
                        }
                    }
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        })

})

//Post an Order
router.post('/', (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                product: req.body.productId,
                quantity: req.body.quantity
            })
            order.save()
                .then(result => {
                    res.status(201).json({
                        message: "Order Stored",
                        createdOrder: {
                            _id: result._id,
                            product: result.product,
                            quantity: result.quantity
                        },
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/orders/" + result._id
                        }
                    })
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    })
                })

        })
        .catch(error => {
            res.status(500).json({
                message: "Product Not Found",
                error: error
            })
        })
})

//Get one Order
router.get('/:orderID', (req, res, next) => {
    Order.findById(req.params.orderID)
        .exec()
        .then(order => {
            if (!order) {
                return res.status(404).json({
                    message: "Order Not Found"
                })
            }
            res.status(200).json({
                order: order,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/orders"
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "Order not fount",
                error: err
            })
        })
})

//Delete one Order
router.delete('/:orderID', (req, res, next) => {
    Order.remove({ _id: req.params.orderID })
        .exec()
        .then(result => {

            res.status(200).json({
                message: "Order Deleted",
                request: {
                    type: "POST",
                    url: "http://localhost:3000/orders/",
                    body: {
                        productID: 'ID',
                        quantity: 'Number'
                    }
                }
            })

        })
        .catch(err => {
            res.status(500).json({
                message: "Order not fount",
                error: err
            })
        })
    res.status(200).json({
        message: 'Order Deleted',
        orderID: req.params.orderID
    })
})

module.exports = router;