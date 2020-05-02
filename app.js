const express = require('express');
const app = express();
const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


//Connect to MongoDB
mongoose.connect(
    'mongodb://gautham:gautham123456@gauthamcluster-shard-00-00-vxd3h.mongodb.net:27017,gauthamcluster-shard-00-01-vxd3h.mongodb.net:27017,gauthamcluster-shard-00-02-vxd3h.mongodb.net:27017/test?ssl=true&replicaSet=GauthamCluster-shard-0&authSource=admin&retryWrites=true&w=majority',
    { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, () => {
        console.log("DB Connected");
        console.log(mongoose.connection.host);
        console.log(mongoose.connection.port);
    })

//removes the deprication warning
mongoose.Promise = global.Promise;

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