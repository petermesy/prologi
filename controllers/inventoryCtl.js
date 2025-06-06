const { Distribution } = require('../models');
const expressAsyncHandler = require('express-async-handler');
const express = require('express');
const router = express.Router();

// Move inventory between locations
const createDistributionCtrl = expressAsyncHandler(async (req, res) => {
    console.log('Request received:', req.body);

    try {
        let data = req.body;
        if (!Array.isArray(data)) data = [data];

        const results = [];
        for (const item of data) {
            // Try to find existing record
            const [record, created] = await Distribution.findOrCreate({
                where: {
                    product_id: item.product_id,
                    distributor_id: item.from_location
                },
                defaults: {
                    shipment_location: item.to_location,
                    shipped_at: new Date(),
                    quantity: item.quantity
                }
            });

            if (!created) {
                // If exists, update shipment_location, shipped_at, and increment quantity
                record.shipment_location = item.to_location;
                record.shipped_at = new Date();
                record.quantity = (record.quantity || 0) + Number(item.quantity);
                await record.save();
            }
            results.push(record);
        }

        res.status(201).json(results);
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
        if (from_location) filter.distributor_id = from_location;
        if (to_location) filter.shipment_location = to_location;
        if (quantity) filter.quantity = quantity;

        const distribution = await Distribution.findAll({ where: filter });
        res.json(distribution);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log({ error: error.message });
    }
});

module.exports = { createDistributionCtrl, fetchDistributionCtl };