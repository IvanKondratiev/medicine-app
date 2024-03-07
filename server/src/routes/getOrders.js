const express = require('express');
const cors = require('cors');
const router = express.Router();
router.use(express.json());
const { connection_to_db } = require('../database/connection_to_db');
router.use(cors({
    origin: '*',
}));

const client_db_query = 'Select client_id from clients Where email = ? and phone_number = ?';
const orders_query = 'SELECT o.order_id, o.client_id, SUM(oi.quantity) as total_quantity, SUM(oi.price) as total_price FROM orders o JOIN order_items oi ON o.order_id = oi.order_id WHERE o.client_id = ? GROUP BY o.order_id';
const order_items_query = 'SELECT oi.product_id, oi.order_item_id, oi.quantity, oi.price, p.name, p.photo, p.description, p.unique_code FROM order_items oi JOIN products p ON oi.product_id = p.product_id WHERE oi.order_id = ?';

router.post('/getorders', async (req, res) => {
    const client = {
        email: req.body.email,
        phone: req.body.phone
    }
    const result = [];
    try {
        const client_db = await connection_to_db.query(client_db_query, [client.email, client.phone]);

        if (client_db[0] && client_db[0].length > 0) {
            const orders = await connection_to_db.query(orders_query, [client_db[0][0].client_id]);
            result.push({found:true});
            for (const order of orders[0]) {
                const orderItems = await connection_to_db.query(order_items_query, [order.order_id]);
                result.push({
                    order: {
                        order_id: order.order_id,
                        client_id: order.client_id,
                        total_quantity: order.total_quantity,
                        total_price: order.total_price
                    },
                    order_items: orderItems[0]
                });
            }

            res.send(result);
            return;
        }
        return res.send([{found:false}])
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: 'Internal Server Error' });
    }
});

module.exports = router;
