const { ProductItem, Product, Category } = require('../models');
const { Op } = require('sequelize');
const nodemailer = require('nodemailer'); // You'll need to install this: npm install nodemailer

// Configure your email transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-specific-password'
  }
});

async function updateExpiryStatus() {
  try {
    const today = new Date();
    
    // Update expired items
    await ProductItem.update(
      { status: 'expired' },
      {
        where: {
          expiryDate: {
            [Op.lt]: today
          }
        }
      }
    );

    // Update critical items (0-7 days)
    const sevenDays = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000));
    await ProductItem.update(
      { status: 'critical' },
      {
        where: {
          expiryDate: {
            [Op.gt]: today,
            [Op.lte]: sevenDays
          }
        }
      }
    );

    // Update warning items (8-14 days)
    const fourteenDays = new Date(today.getTime() + (14 * 24 * 60 * 60 * 1000));
    await ProductItem.update(
      { status: 'warning' },
      {
        where: {
          expiryDate: {
            [Op.gt]: sevenDays,
            [Op.lte]: fourteenDays
          }
        }
      }
    );

    // Update attention items (15-30 days)
    const thirtyDays = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
    await ProductItem.update(
      { status: 'attention' },
      {
        where: {
          expiryDate: {
            [Op.gt]: fourteenDays,
            [Op.lte]: thirtyDays
          }
        }
      }
    );

    console.log('Expiry status updated successfully');
  } catch (error) {
    console.error('Error updating expiry status:', error);
  }
}

// Run check every hour
setInterval(updateExpiryStatus, 60 * 60 * 1000);

module.exports = { updateExpiryStatus };
