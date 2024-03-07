const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const makeOrder = require('../src/routes/makeOrder');
const getProducts = require('../src/routes/getProducts')
const getOrders = require('../src/routes/getOrders');
const getShops = require('../src/routes/getShops');

const app = express();
const port = 80;

app.use(cors({
    origin: '*',
}));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));
const photosFolder = path.join(__dirname, 'img', 'products');
app.use('/img/products', express.static(photosFolder));

app.use('/', makeOrder);
app.use('/', getProducts);
app.use('/', getOrders);
app.use('/', getShops);

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});