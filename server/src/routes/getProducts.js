const express = require('express');
const router = express.Router();
const { connection_to_db } = require('../database/connection_to_db');

router.get('/getproducts', async (req, res) => {
  try {
    const { shopIds } = req.query;

    let productsQuery = 'SELECT * FROM products';
    let params = [];

    if (shopIds) {
      const placeholders = shopIds.split(',').map(() => '?').join(', ');
      productsQuery += ` WHERE shop_id IN (${placeholders})`;
      params = shopIds.split(',').map(Number);
    }

    const products = await connection_to_db.query(productsQuery, params);
    res.json([products[0]]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
