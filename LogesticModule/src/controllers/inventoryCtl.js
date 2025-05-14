const Distribution = require('../models/distribution');
const expressAsyncHandler=require('express-async-handler');
const express = require('express');
const { log } = require('console');

const router = express.Router();

// Move inventory between locations
// router.post('/move', async (req, res) => {
const createDistributionCtrl = expressAsyncHandler(async (req, res) => {
    console.log('Request received:', req.body);

    try {
        let data = req.body;
        if (!Array.isArray(data)) data = [data];

        // Bulk create distributions
        const distributions = await Distribution.bulkCreate(
            data.map(item => ({
                product_id: item.product_id,
                distribution_center_id: item.from_location,
                shipment_location: item.to_location,
                shipment_date: new Date(),
                quantity: item.quantity,
            }))
        );

        res.status(201).json(distributions);
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
});

const fetchDistributionCtl = expressAsyncHandler(async (req, res) => {
    const { product_id, from_location, to_location, quantity } = req.query;
    try {
        const filter = {};
        if (product_id) filter.product_id = product_id;
        if (from_location) filter.distribution_center_id = from_location;
        if (to_location) filter.shipment_location = to_location;
        if (quantity) filter.quantity = quantity;

        // For Sequelize
        const distribution = await Distribution.findAll({ where: filter });
        res.json(distribution);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log({error: error.message});
        
    }
});

module.exports={createDistributionCtrl,fetchDistributionCtl}

