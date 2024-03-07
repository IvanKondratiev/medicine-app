const express = require('express');
const router = express.Router();
router.use(express.json());
const {connection_to_db} = require('../database/connection_to_db');

router.get('/getshops',async(_,res)=>{
    try{
        const shops = await connection_to_db.query('Select * from shops');
        res.send(shops);
    }
    catch(err){
        console.log(err);
    }

})

module.exports = router;