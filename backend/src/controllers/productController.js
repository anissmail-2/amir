const { Product, User, Review } = require('../models');
const { Op } = require('sequelize');

/**
 * Get all products (with search and filters)
 * GET /api/products
 */
const getAllProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      search,
      is_organic,
      min_price,
      max_price,
      status = 'Available'
    } = req.query;

    const offset = (page - 1) * limit;

    // Build where clause
    const where = { status };

    if (category) {
      where.category = category;
    }

    if (is_organic !== undefined) {
      where.is_organic = is_organic === 'true';
    }

    if (search) {
      where[Op.or] = [
        { product_name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (min_price || max_price) {
      where.price = {};
      if (min_price) where.price[Op.gte] = min_price;
      if (max_price) where.price[Op.lte] = max_price;
    }

    const { count, rows: products } = await Product.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['user_id', 'first_name', 'last_name', 'email']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      products,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get product by ID
 * GET /api/products/:id
 */
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['user_id', 'first_name', 'last_name', 'email', 'phone_number']
        },
        {
          model: Review,
          as: 'reviews',
          include: [
            {
              model: User,
              as: 'reviewer',
              attributes: ['user_id', 'first_name', 'last_name']
            }
          ],
          limit: 10,
          order: [['created_at', 'DESC']]
        }
      ]
    });

    if (!product) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Product not found'
      });
    }

    res.status(200).json({
      product
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Create product
 * POST /api/products
 */
const createProduct = async (req, res, next) => {
  try {
    const {
      product_name,
      category,
      description,
      price,
      unit,
      quantity_available,
      is_organic,
      harvest_date,
      image_url
    } = req.body;

    const product = await Product.create({
      seller_id: req.user.user_id,
      product_name,
      category,
      description,
      price,
      unit,
      quantity_available,
      is_organic,
      harvest_date,
      image_url,
      status: 'Available'
    });

    res.status(201).json({
      message: 'Product created successfully',
      product
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Update product
 * PUT /api/products/:id
 */
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Product not found'
      });
    }

    // Check ownership
    if (product.seller_id !== req.user.user_id && req.user.user_type !== 'Admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to update this product'
      });
    }

    await product.update(req.body);

    res.status(200).json({
      message: 'Product updated successfully',
      product
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Delete product
 * DELETE /api/products/:id
 */
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Product not found'
      });
    }

    // Check ownership
    if (product.seller_id !== req.user.user_id && req.user.user_type !== 'Admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to delete this product'
      });
    }

    await product.destroy();

    res.status(200).json({
      message: 'Product deleted successfully'
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
