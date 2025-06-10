// const { Distribution } = require('../models');
const expressAsyncHandler = require('express-async-handler');
const express = require('express');
const router = express.Router();
// const { ProductItem, Product, Category, Package } = require('../models');
// const { InventoryLevel, Product, Category, ProductItem } = require('../models');
const { Distribution, InventoryLevel, Product, Category, ProductItem, DistributionCenter, Package } = require('../models');
// Move inventory between locations
// const createDistributionCtrl = expressAsyncHandler(async (req, res) => {
//     console.log('Request received:', req.body);

//     try {
//         let data = req.body;
//         if (!Array.isArray(data)) data = [data];

//         const results = [];
//         for (const item of data) {
//                if (!item.from_location) {
//             return res.status(400).json({ error: "from_location is required" });
//         }
//             // Try to find existing record
//             const [record, created] = await Distribution.findOrCreate({
//                 where: {
//                     product_id: item.product_id,
//                     distributor_id: item.from_location
//                 },
//                 defaults: {
//                     shipment_location: item.to_location,
//                     shipped_at: new Date(),
//                     quantity: item.quantity
//                 }
//             });

//             if (!created) {
//                 // If exists, update shipment_location, shipped_at, and increment quantity
//                 record.shipment_location = item.to_location;
//                 record.shipped_at = new Date();
//                 record.quantity = (record.quantity || 0) + Number(item.quantity);
//                 await record.save();
//             }
//             results.push(record);
//         }

//         res.status(201).json(results);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//         console.log(err);
//     }

 

// });
 const createDistributionCtrl = expressAsyncHandler(async (req, res) => {
    console.log('Request received:', req.body);

    try {
        let data = req.body;
        if (!Array.isArray(data)) data = [data];

        const results = [];
        for (const item of data) {
            if (!item.from_location) {
                return res.status(400).json({ error: "from_location is required" });
            }
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

            // --- InventoryLevel update logic must be here ---
            // Decrease at from_location
            const fromInv = await InventoryLevel.findOne({
                where: {
                    product_id: item.product_id,
                    location_id: item.from_location
                }
            });
            if (fromInv) {
                fromInv.quantity = Math.max(0, fromInv.quantity - Number(item.quantity));
                await fromInv.save();
            }

            // Increase at to_location
            let toInv = await InventoryLevel.findOne({
                where: {
                    product_id: item.product_id,
                    location_id: item.to_location
                }
            });
            if (toInv) {
                toInv.quantity += Number(item.quantity);
                await toInv.save();
            } else {
                await InventoryLevel.create({
                    product_id: item.product_id,
                    location_id: item.to_location,
                    quantity: Number(item.quantity),
                    last_updated: new Date()
                });
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
            console.log({ error: error.message });

    }


});
const getInventorySummary = async (req, res) => {
  try {
    // Fetch all ProductItems with their Product and Category
    const items = await ProductItem.findAll({
      include: [
        { model: Product, as: 'product', include: [{ model: Category, as: 'category' }] },
        { model: Package, as: 'package' }
      ]
    });

    // Map to frontend-friendly format
    const inventory = items.map(item => ({
      id: item.product_item_id,
      name: item.productName,
      category: item.product?.category?.categoryName || '',
      currentStock: item.currentStock || 0, // You may need to join InventoryLevel or similar
      minimumStock: item.minimumStock || 20, // Set a default or fetch from Product/InventoryLevel
      maxStock: item.maxStock || 1000, // Set a default or fetch from Product/InventoryLevel
      location: item.location,
      expiryDate: item.expiryDate ? item.expiryDate.toISOString().split('T')[0] : 'N/A',
      lastRestocked: item.registrationDate ? item.registrationDate.toISOString().split('T')[0] : 'N/A',
      status: item.status || undefined,
    }));

    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
        console.log({ error: error.message });

  }
};
module.exports = { createDistributionCtrl, fetchDistributionCtl,getInventorySummary };




// Get all inventory items (with stock info)
// const getAllInventory = async (req, res) => {
//   try {
//     const inventory = await InventoryLevel.findAll({
//       include: [
//         {
//           model: Product,
//           as: 'product',
//           include: [{ model: Category, as: 'category' }]
//         }
//       ]
//     });

//     const result = inventory.map(item => ({
//       id: item.product_id,
//       name: item.product?.productName,
//       category: item.product?.category?.categoryName,
//       currentStock: item.quantity,
//       minimumStock: item.product?.minimumStock ?? 20,
//       maxStock: item.product?.maxStock ?? 1000,
//       location: item.location_id,
//       expiryDate: item.product?.expirydate,
//       lastRestocked: item.product?.lastRestocked,
//     }));

//     res.json(result);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// Get inventory by ID
const getInventoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await InventoryLevel.findOne({
      where: { product_id: id },
      include: [
        {
          model: Product,
          as: 'product',
          include: [{ model: Category, as: 'category' }]
        }
      ]
    });
    if (!item) return res.status(404).json({ error: 'Not found' });

    res.json({
      id: item.product_id,
      name: item.product?.productName,
      category: item.product?.category?.categoryName,
      currentStock: item.quantity,
      minimumStock: item.product?.minimumStock ?? 20,
      maxStock: item.product?.maxStock ?? 1000,
      location: item.location_id,
      expiryDate: item.product?.expirydate,
      lastRestocked: item.product?.lastRestocked,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
        console.log({ error: error.message });

  }
};

// Update stock
const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const item = await InventoryLevel.findOne({ where: { product_id: id } });
    if (!item) return res.status(404).json({ error: 'Not found' });
    item.quantity = quantity;
    await item.save();
    res.json({ message: 'Stock updated', item });
  } catch (error) {
    res.status(500).json({ error: error.message });
        console.log({ error: error.message });

  }
};

// Low stock items
const getLowStockItems = async (req, res) => {
  try {
    const inventory = await InventoryLevel.findAll({
      include: [{ model: Product, as: 'product' }]
    });
    const result = inventory.filter(item =>
      item.quantity <= (item.product?.minimumStock ?? 20)
    ).map(item => ({
      id: item.product_id,
      name: item.product?.productName,
      category: item.product?.category?.categoryName,
      currentStock: item.quantity,
      minimumStock: item.product?.minimumStock ?? 20,
      maxStock: item.product?.maxStock ?? 1000,
      location: item.location_id,
      expiryDate: item.product?.expirydate,
      lastRestocked: item.product?.lastRestocked,
    }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log({ error: error.message });
  }
};

// Expiring soon items (expiryDate within 30 days)
const getExpiringItems = async (req, res) => {
  try {
    const now = new Date();
    const in30 = new Date();
    in30.setDate(now.getDate() + 30);

    const inventory = await InventoryLevel.findAll({
      include: [{ model: Product, as: 'product' }]
    });

    const result = inventory.filter(item => {
      const expiry = item.product?.expirydate ? new Date(item.product.expirydate) : null;
      return expiry && expiry > now && expiry <= in30;
    }).map(item => ({
      id: item.product_id,
      name: item.product?.productName,
      category: item.product?.category?.categoryName,
      currentStock: item.quantity,
      minimumStock: item.product?.minimumStock ?? 20,
      maxStock: item.product?.maxStock ?? 1000,
      location: item.location_id,
      expiryDate: item.product?.expirydate,
      lastRestocked: item.product?.lastRestocked,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
        console.log({ error: error.message });

  }
};

// const getAllInventory = async (req, res) => {
//   try {
//     const inventory = await InventoryLevel.findAll({
//       include: [
//         {
//           model: Product,
//           as: 'product',
//           include: [{ model: Category, as: 'category' }]
//         },
//         {
//           model: DistributionCenter,
//           as: 'location'
//         }
//       ]
//     });

//     const result = inventory.map(item => ({
//       id: item.product_id,
//       name: item.product?.productName,
//       category: item.product?.category?.categoryName,
//       currentStock: item.quantity,
//       minimumStock: item.product?.minimumStock ?? 20,
//       maxStock: item.product?.maxStock ?? 1000,
//       location: item.location?.name, // Use location name from DistributionCenter
//       expiryDate: item.product?.expirydate,
//       lastRestocked: item.product?.lastRestocked,
//     }));

//     res.json(result);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//     console.log({ error: error.message });

//   }
// };

const getAllInventory = async (req, res) => {
  try {
    // Find all products, include their category and inventory (LEFT JOIN)
    const products = await Product.findAll({
      include: [
        { model: Category, as: 'category' },
        {
          model: InventoryLevel,
          as: 'inventoryLevels',
          required: false, // LEFT JOIN!
          include: [
            { model: DistributionCenter, as: 'location', required: false }
          ]
        }
      ]
    });

    // Flatten the result for the frontend
    const result = [];
    products.forEach(product => {
      if (product.inventoryLevels && product.inventoryLevels.length > 0) {
        product.inventoryLevels.forEach(inv => {
          result.push({
            id: product.product_id,
            name: product.productName,
            category: product.category?.categoryName ?? '',
            currentStock: inv.quantity ?? 0,
            minimumStock: product.minimumStock ?? 20,
            maxStock: product.maxStock ?? 1000,
            location: inv.location?.name ?? '',
            locationId: inv.location?.center_id ?? '', // <-- Add this line!            expiryDate: product.expirydate ?? '',
            lastRestocked: inv.lastRestocked ?? '',
          });
        });
      } else {
        // No inventory record, show zero stock
        result.push({
          id: product.product_id,
          name: product.productName,
          category: product.category?.categoryName ?? '',
          currentStock: 0,
          minimumStock: product.minimumStock ?? 20,
          maxStock: product.maxStock ?? 1000,
          location: '',
          expiryDate: product.expirydate ?? '',
          lastRestocked: '',
        });
      }
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  createDistributionCtrl,
  fetchDistributionCtl,
  getInventorySummary,
  getAllInventory,
  getInventoryById,
  updateStock,
  getLowStockItems,
  getExpiringItems
};