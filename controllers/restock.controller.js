const { RestockRequest, Product, Location } = require('../models');

module.exports = {
    async createRequest(req, res) {
        const { productId, distributionCenterId, quantityRequested } = req.body;
        try {
            const request = await RestockRequest.create({
                productId,
                distributionCenterId,
                quantityRequested
            });
            res.status(201).json(request);
        } catch (err) {
            res.status(500).json({ error: 'Failed to create restock request' });
        }
    },

    // Get all restock requests (optionally filter by status)
    async getAllRequests(req, res) {
        const { status } = req.query;
        const where = status ? { status } : {};
        try {
            const requests = await RestockRequest.findAll({
                where,
                include: ['product', 'distributionCenter'],
                order: [['requestedAt', 'DESC']],
            });
            res.status(200).json(requests);
        } catch (err) {
            res.status(500).json({ error: 'Failed to retrieve restock requests' });
        }
    },

    // Update status of a request
    async updateRequestStatus(req, res) {
        const { id } = req.params;
        const { status } = req.body; // 'approved', 'rejected', 'fulfilled'
        try {
            const request = await RestockRequest.findByPk(id);
            if (!request) return res.status(404).json({ error: 'Request not found' });

            request.status = status;
            if (status === 'fulfilled') {
                request.fulfilledAt = new Date();
            }
            await request.save();
            res.status(200).json(request);
        } catch (err) {
            res.status(500).json({ error: 'Failed to update request status' });
        }
    }
};
