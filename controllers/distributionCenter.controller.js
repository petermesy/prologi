const { DistributionCenter } = require('../models');

module.exports = {
    // List all distribution centers
    async list(req, res) {
        try {
            const centers = await DistributionCenter.findAll();
            res.status(200).json(centers);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch distribution centers' });
        }
    },

    // Create a new distribution center
    async create(req, res) {
        const { name, address, region, level } = req.body;
        try {
            const center = await DistributionCenter.create({ name, address, region, level });
            res.status(201).json(center);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create distribution center', details: error.message });
        }
    }
};