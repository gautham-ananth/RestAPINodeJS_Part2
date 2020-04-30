const express = require('express');
const router = express.Router();

//Get All Orders
router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Orders where fetched'
    })
})

//Post an Order
router.post('/', (req, res, next) => {
    res.status(201).json({
        message: 'Orders where Updated'
    })
})

//Get one Order
router.get('/:orderID', (req, res, next) => {
    res.status(200).json({
        message: 'Order Details',
        orderID: req.params.orderID
    })
})

//Delete one Order
router.delete('/:orderID', (req, res, next) => {
    res.status(200).json({
        message: 'Order Deleted',
        orderID: req.params.orderID
    })
})

module.exports = router;