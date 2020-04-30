const http = require('http');
const app = require('./app');

const port = process.env.PORT || 3000;

//create a server by taking app.js as an argument
const server = http.createServer(app);


server.listen(port);