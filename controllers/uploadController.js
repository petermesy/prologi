const fs = require("fs");
const csv = require("csv-parser");
const {
  sequelize,
  Category,
  Product,
  Package,
  ProductItem,
} = require("../models");

exports.uploadCSV = async (req, res) => {
  const categories = new Map();
  const products = new Map();
  const packages = new Map();
  const productItems = [];

  const locationMap = {
    1: "store",
    2: "distcenter",
  };

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => {
      // Trim all string fields to avoid whitespace issues
      Object.keys(data).forEach((key) => {
        if (typeof data[key] === "string") data[key] = data[key].trim();
      });

      // Categories
      if (!categories.has(data.categoryName)) {
        categories.set(data.categoryName, {
          categoryName: data.categoryName,
        });
      }

      // Products
      if (!products.has(data.productId)) {
        products.set(data.productId, {
          productId: data.productId,
          productName: data.productName,
          description: data.description,
          lifeExpectancy: parseInt(data.lifeExpectancy),
          categoryName: data.categoryName,
        });
      }

      // Packages
      const pkgName = data.packageName.trim();
      if (!packages.has(pkgName)) {
        packages.set(pkgName, {
          packageName: pkgName,
          holdingCapacity: data.holdingCapacity,
          registrationDate: new Date(data.packageRegistrationDate),
        });
      }

      // Dates
      const registrationDate = new Date(data.registrationDate);
      const expiryDate = new Date(data.expiryDate);
      if (isNaN(registrationDate.getTime()) || isNaN(expiryDate.getTime())) {
        throw new Error("Invalid date format in CSV");
      }

      // Location mapping
      const mappedLocationId = locationMap[data.locationId];
      if (!mappedLocationId) {
        throw new Error(
          `Invalid locationId: ${data.locationId}. Must be '1' or '2'.`
        );
      }

      productItems.push({
        product_barcode: data.product_barcode,
        productId: data.productId,
        productName: data.productName,
        packageName: pkgName,
        registrationDate: registrationDate,
        location: data.location.toLowerCase(),
        locationId: mappedLocationId,
        expiryDate: expiryDate,
      });
    })
    .on("end", async () => {
      const transaction = await sequelize.transaction();

      try {
        await sequelize.sync();

        // Check for existing barcodes before inserting
        const existingBarcodes = await ProductItem.findAll({
          where: {
            product_barcode: productItems.map((item) => item.product_barcode),
          },
          attributes: ["product_barcode"],
        });

        const existingBarcodeSet = new Set(
          existingBarcodes.map((item) => item.product_barcode)
        );
        const duplicates = productItems.filter((item) =>
          existingBarcodeSet.has(item.product_barcode)
        );

        if (duplicates.length > 0) {
          fs.unlinkSync(req.file.path);
          return res.status(400).json({
            error: `Duplicate barcode(s) detected: ${duplicates
              .map((d) => d.product_barcode)
              .join(", ")}`,
            message: "Some items already exist in the system.",
          });
        }

        // Bulk create categories
        const createdCategories = await Category.bulkCreate(
          Array.from(categories.values()),
          { transaction, ignoreDuplicates: true }
        );
        const categoryMap = new Map(
          createdCategories.map((cat) => [cat.categoryName, cat.categoryId])
        );

        // Bulk create products
        const productsToCreate = Array.from(products.values()).map(
          (product) => ({
            product_id: product.productId,
            productName: product.productName,
            description: product.description,
            LifeExpectancy: product.lifeExpectancy,
            categoryId: categoryMap.get(product.categoryName),
          })
        );
        await Product.bulkCreate(productsToCreate, {
          transaction,
          ignoreDuplicates: true,
        });

        // Bulk create packages
        await Package.bulkCreate(Array.from(packages.values()), {
          transaction,
          ignoreDuplicates: true,
        });
        // Fetch all packages to ensure you have all IDs
        const allPackages = await Package.findAll({ transaction });
        // Use trimmed, lowercased names for robust matching
        const packageMap = new Map(
          allPackages.map((pkg) => [
            pkg.packageName.trim().toLowerCase(),
            pkg.package_id,
          ])
        );

        // Validate all productItems have a valid packageId
        const missingPackages = productItems.filter(
          (item) => !packageMap.get(item.packageName.trim().toLowerCase())
        );
        if (missingPackages.length > 0) {
          await transaction.rollback();
          fs.unlinkSync(req.file.path);
          return res.status(400).json({
            error: `Missing package(s) for: ${[
              ...new Set(missingPackages.map((i) => i.packageName)),
            ].join(", ")}`,
          });
        }

        // Bulk create product items
        const productItemsToCreate = productItems.map((item) => ({
          product_barcode: item.product_barcode,
          productId: item.productId,
          productName: item.productName,
          packageId: packageMap.get(item.packageName.trim().toLowerCase()),
          registrationDate: item.registrationDate,
          location: item.location,
          locationId: item.locationId,
          expiryDate: item.expiryDate,
        }));

        await ProductItem.bulkCreate(productItemsToCreate, { transaction });

        await transaction.commit();
        fs.unlinkSync(req.file.path);
        res.status(200).json({
          message: "Upload successful",
          stats: {
            categories: categories.size,
            products: products.size,
            packages: packages.size,
            productItems: productItems.length,
          },
        });
      } catch (error) {
        await transaction.rollback();
        fs.unlinkSync(req.file.path);
        res.status(500).json({ error: error.message });
      }
    })
    .on("error", (error) => {
      fs.unlinkSync(req.file.path);
      res.status(500).json({ error: error.message });
    });
};
