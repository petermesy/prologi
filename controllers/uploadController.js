const fs = require('fs');
const csv = require('csv-parser');
const { sequelize, Category, Product, Package, ProductItem } = require('../models');

exports.uploadCSV = async (req, res) => {
  const categories = new Map();
  const products = new Map();
  const packages = new Map();
  const productItems = [];

  // Mapping numeric location IDs to their string equivalents
  const locationMap = {
    '1': 'store',
    '2': 'distcenter'
  };

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => {
      // Collect Category
      if (!categories.has(data.categoryName)) {
        categories.set(data.categoryName, {
          categoryName: data.categoryName
        });
      }

      // Collect Product
      if (!products.has(data.productId)) {
        products.set(data.productId, {
          productId: data.productId,
          productName: data.productName,
          description: data.description,
          lifeExpectancy: parseInt(data.lifeExpectancy),
          categoryName: data.categoryName // Temporary for mapping
        });
      }

      // Collect Package
      if (!packages.has(data.packageName)) {
        packages.set(data.packageName, {
          packageName: data.packageName,
          holdingCapacity: data.holdingCapacity,
          registrationDate: new Date(data.packageRegistrationDate)
        });
      }

      // Validate and collect ProductItem
      const registrationDate = new Date(data.registrationDate);
      const expiryDate = new Date(data.expiryDate);
      if (isNaN(registrationDate.getTime()) || isNaN(expiryDate.getTime())) {
        throw new Error('Invalid date format in CSV');
      }

      // Map locationId to its string equivalent
      const mappedLocationId = locationMap[data.locationId];
      if (!mappedLocationId) {
        throw new Error(`Invalid locationId: ${data.locationId}. Must be '1' or '2'.`);
      }

      productItems.push({
        productBarcode: data.product_barcode,
        productId: data.productId,
        productName: data.productName,
        packageName: data.packageName, // Temporary for mapping
        registrationDate: registrationDate,
        location: data.location.toLowerCase(),
        locationId: mappedLocationId,
        expiryDate: expiryDate
      });
    })
    .on('end', async () => {
      const transaction = await sequelize.transaction();

      try {
        // Recreate tables (optional for development)
        await sequelize.sync({ force: true }); // ⚠️ Don't use force: true in production!

        // Create categories
        const createdCategories = await Category.bulkCreate(
          Array.from(categories.values()),
          { transaction }
        );

        const categoryMap = new Map(
          createdCategories.map(cat => [cat.categoryName, cat.categoryId])
        );

        // Create products with category references
        const productsToCreate = Array.from(products.values()).map(product => ({
          ...product,
          categoryId: categoryMap.get(product.categoryName)
        }));

        const createdProducts = await Product.bulkCreate(productsToCreate, { transaction });

        // Create packages
        const createdPackages = await Package.bulkCreate(
          Array.from(packages.values()),
          { transaction }
        );

        const packageMap = new Map(
          createdPackages.map(pkg => [pkg.packageName, pkg.packageId])
        );

        // Create product items
        const productItemsToCreate = productItems.map(item => ({
          productBarcode: item.productBarcode,
          productId: item.productId,
          productName: item.productName,
          packageId: packageMap.get(item.packageName),
          registrationDate: item.registrationDate,
          location: item.location,
          locationId: item.locationId,
          expiryDate: item.expiryDate
        }));

        await ProductItem.bulkCreate(productItemsToCreate, { transaction });

        await transaction.commit();
        fs.unlinkSync(req.file.path);
        res.status(200).json({
          message: 'Upload successful',
          stats: {
            categories: categories.size,
            products: products.size,
            packages: packages.size,
            productItems: productItems.length
          }
        });
      } catch (error) {
        await transaction.rollback();
        fs.unlinkSync(req.file.path);
        res.status(500).json({ error: error.message });
      }
    })
    .on('error', (error) => {
      fs.unlinkSync(req.file.path);
      res.status(500).json({ error: error.message });
    });
};
