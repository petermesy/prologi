const expressAsyncHandler = require('express-async-handler');
const ShippingStage = require('../models/shippingStage');

const createDeliveryCtrl = expressAsyncHandler(async (req, res) => {
    let data = req.body;
    if (!Array.isArray(data)) data = [data];

    try {
        // Bulk create shipping stages
        const shippingStages = await ShippingStage.bulkCreate(
            data.map(item => ({
                product_id: item.product_id,
                stage_name: item.stage_name,
                stage_status: item.stage_status,
                start_time: item.start_time,
                end_time: item.end_time
            }))
        );
        res.status(201).json(shippingStages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const fetchDeliveryCtrl = expressAsyncHandler(async (req, res) => {
    const { product_id, stage_name, stage_status, start_time, end_time } = req.query;
    try {
        const filter = {};
        if (product_id) filter.product_id = product_id;
        if (stage_name) filter.stage_name = stage_name;
        if (stage_status) filter.stage_status = stage_status;
        if (start_time) filter.start_time = start_time;
        if (end_time) filter.end_time = end_time;

        const shippingStages = await ShippingStage.findAll({ where: filter });
        res.status(200).json(shippingStages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = { createDeliveryCtrl, fetchDeliveryCtrl };