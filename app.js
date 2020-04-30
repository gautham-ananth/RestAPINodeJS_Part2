const express = require('express');
const app = express();
const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const morgan = require('morgan');
const bodyParser = require('body-parser');

//use morgon for logging
app.use(morgan('dev'));
//use bodyParser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//CORS Resolve
//* denotes allow all origin
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin., X-Requested-With, Content-Type, Accpet, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT,PATCH,DELETE,POST,GET');
        return res.status(200).json({});
    }
    next();
})

//Middleware routes to handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

//handle other requests
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;