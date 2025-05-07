const fs = require('fs');
const csv = require('csv-parser');
const { sequelize, Category, Product, Package, ProductItem } = require('../models');

exports.uploadCSV = async (req, res) => {
  const categories = new Map();
  const products = new Map();
  const packages = new Map();
  const productItems = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => {
      // Process Category
      if (!categories.has(data.categoryName)) {
        categories.set(data.categoryName, {
          categoryName: data.categoryName
        });
      }

      // Process Product
      if (!products.has(data.productId)) {
        products.set(data.productId, {
          productId: data.productId,
          productName: data.productName,
          description: data.description,
          lifeExpectancy: parseInt(data.lifeExpectancy),
          categoryName: data.categoryName // We'll use this to link to category later
        });
      }

      // Process Package
      if (!packages.has(data.packageName)) {
        packages.set(data.packageName, {
          packageName: data.packageName,
          holdingCapacity: data.holdingCapacity,
          registrationDate: new Date(data.packageRegistrationDate)
        });
      }

      // Process ProductItem
      const registrationDate = new Date(data.registrationDate);
      const expiryDate = new Date(data.expiryDate);
      
      if (isNaN(registrationDate.getTime()) || isNaN(expiryDate.getTime())) {
        throw new Error('Invalid date format in CSV');
      }

      productItems.push({
        product_barcode: data.product_barcode,
        productId: data.productId,
        packageName: data.packageName, // We'll use this to link to package later
        registrationDate: registrationDate,
        location: data.location.toLowerCase(),
        locationID: data.locationID.toLowerCase(),
        expiryDate: expiryDate
      });
    })
    .on('end', async () => {
      const transaction = await sequelize.transaction();
      
      try {
        // First, sync all models (create tables)
        await sequelize.sync({ force: true }); // Be careful with force: true in production!

        // Create categories
        const createdCategories = await Category.bulkCreate(
          Array.from(categories.values()),
          { transaction }
        );

        // Create products with category associations
        const categoryMap = new Map(
          createdCategories.map(cat => [cat.categoryName, cat.category_id])
        );

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
          createdPackages.map(pkg => [pkg.packageName, pkg.package_id])
        );

        // Create product items with all associations
        const productItemsToCreate = productItems.map(item => ({
          ...item,
          package_id: packageMap.get(item.packageName)
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