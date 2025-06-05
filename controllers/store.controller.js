const { InventoryLevel, Product, Location } = require('../models');

module.exports = {
    async getInventoryByLocation(req, res) {
        const { location_id } = req.params;
        try {
            const inventory = await InventoryLevel.findAll({
                where: { location_id },
                include: ['product', 'location'],
            });
            res.status(200).json(inventory);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch inventory' });
        }
    },

    async upsertInventory(req, res) {
        const { product_id, location_id, quantity } = req.body;
        try {
            const [record, created] = await InventoryLevel.upsert({
                product_id,
                location_id,
                quantity,
                last_updated: new Date(),
            }, { returning: true });

            res.status(created ? 201 : 200).json(record);
        } catch (error) {
            res.status(500).json({ error: 'Failed to upsert inventory' });
        }
    },

    async adjustInventory(req, res) {
        const { product_id, location_id } = req.params;
        const { delta } = req.body; // positive or negative number

        try {
            const inventory = await InventoryLevel.findOne({ where: { product_id, location_id } });
            if (!inventory) {
                return res.status(404).json({ error: 'Inventory record not found' });
            }

            inventory.quantity += delta;
            inventory.last_updated = new Date();
            await inventory.save();

            res.status(200).json(inventory);
        } catch (error) {
            res.status(500).json({ error: 'Failed to adjust inventory' });
        }
    },

    async deleteInventory(req, res) {
        const { product_id, location_id } = req.params;
        try {
            const result = await InventoryLevel.destroy({ where: { product_id, location_id } });
            if (result === 0) {
                return res.status(404).json({ error: 'Inventory record not found' });
            }
            res.status(200).json({ message: 'Deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete inventory' });
        }
    }
};
