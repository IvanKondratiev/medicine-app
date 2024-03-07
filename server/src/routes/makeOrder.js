const express = require('express');
const cors = require('cors');
const router = express.Router();
router.use(express.json());
const { connection_to_db } = require('../database/connection_to_db');
router.use(cors({
    origin: '*',
}));

const add_client_sql = `
INSERT INTO clients (name, email, phone_number, address)
VALUES (?, ?, ?, ?);
`;

const find_client_by_email_sql = `
SELECT client_id FROM clients WHERE email = ?;
`;

const add_order_sql = `
INSERT INTO orders (client_id)
VALUES (?);
`;

const add_order_item_sql = `
INSERT INTO order_items (order_id, product_id, quantity, price)
VALUES (?, ?, ?, ?);
`;

router.post('/makeorder', async (req, res) => {
    const client = req.body[0];
    console.log(client)
    const products = req.body[1];
    console.log(products);

    try {
        //get client 🆔
        const existingClient = await connection_to_db.query(find_client_by_email_sql, [client.email]);

        console.log(existingClient);
        let client_id;

        if (existingClient[0].length > 0) {
            client_id = existingClient[0][0].client_id;
        } else {
            // add a new client 👨‍💻
            const addClientResult = await connection_to_db.query(add_client_sql, [client.name, client.email, client.phone, client.address]);
            client_id = addClientResult[0].insertId;
            console.log(addClientResult[0]);
        }
        
        // add order ✔️
        const addOrderResult = await connection_to_db.query(add_order_sql, [client_id]);

        console.log(addOrderResult);
        // add order_items 🛒
        const order_id = addOrderResult[0].insertId;

        let totalQuantity = 0;
        let totalOrderPrice = 0;

        for (const product of products) {
            const price_of_pos = parseFloat(product.price) * parseInt(product.quantity);
            totalQuantity += parseInt(product.quantity);
            totalOrderPrice += price_of_pos;
            await connection_to_db.query(add_order_item_sql, [order_id, product.product_id, product.quantity, price_of_pos]);
            console.log(totalQuantity);
            console.log(totalOrderPrice);
        }

        await connection_to_db.query("UPDATE orders SET total_quantity = ?, total_price = ? WHERE order_id = ?", [totalQuantity, totalOrderPrice, order_id]);

        res.send({makeorder:true});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
