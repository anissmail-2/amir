const { Farm, Crop, Sensor, User } = require('../models');
const { Op } = require('sequelize');

/**
 * Get all farms (with pagination and filtering)
 * GET /api/farms
 */
const getAllFarms = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, farm_type, status, owner_id } = req.query;
    const offset = (page - 1) * limit;

    // Build where clause
    const where = {};
    if (farm_type) where.farm_type = farm_type;
    if (status) where.status = status;
    if (owner_id) where.owner_id = owner_id;

    const { count, rows: farms } = await Farm.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['user_id', 'first_name', 'last_name', 'email']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      farms,
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
 * Get farms owned by current user
 * GET /api/farms/my-farms
 */
const getMyFarms = async (req, res, next) => {
  try {
    const farms = await Farm.findAll({
      where: { owner_id: req.user.user_id },
      include: [
        {
          model: Crop,
          as: 'crops',
          where: { status: { [Op.ne]: 'Harvested' } },
          required: false
        },
        {
          model: Sensor,
          as: 'sensors',
          where: { status: 'Online' },
          required: false
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      farms,
      count: farms.length
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get single farm by ID
 * GET /api/farms/:id
 */
const getFarmById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const farm = await Farm.findByPk(id, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['user_id', 'first_name', 'last_name', 'email', 'phone_number']
        },
        {
          model: Crop,
          as: 'crops'
        },
        {
          model: Sensor,
          as: 'sensors'
        }
      ]
    });

    if (!farm) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Farm not found'
      });
    }

    res.status(200).json({
      farm
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Create new farm
 * POST /api/farms
 */
const createFarm = async (req, res, next) => {
  try {
    const {
      farm_name,
      location,
      latitude,
      longitude,
      size_hectares,
      farm_type,
      description,
      image_url
    } = req.body;

    const farm = await Farm.create({
      owner_id: req.user.user_id,
      farm_name,
      location,
      latitude,
      longitude,
      size_hectares,
      farm_type,
      description,
      image_url,
      status: 'Active'
    });

    res.status(201).json({
      message: 'Farm created successfully',
      farm
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Update farm
 * PUT /api/farms/:id
 */
const updateFarm = async (req, res, next) => {
  try {
    const { id } = req.params;

    const farm = await Farm.findByPk(id);

    if (!farm) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Farm not found'
      });
    }

    // Check ownership
    if (farm.owner_id !== req.user.user_id && req.user.user_type !== 'Admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to update this farm'
      });
    }

    // Update farm
    await farm.update(req.body);

    res.status(200).json({
      message: 'Farm updated successfully',
      farm
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Delete farm
 * DELETE /api/farms/:id
 */
const deleteFarm = async (req, res, next) => {
  try {
    const { id } = req.params;

    const farm = await Farm.findByPk(id);

    if (!farm) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Farm not found'
      });
    }

    // Check ownership
    if (farm.owner_id !== req.user.user_id && req.user.user_type !== 'Admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to delete this farm'
      });
    }

    await farm.destroy();

    res.status(200).json({
      message: 'Farm deleted successfully'
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllFarms,
  getMyFarms,
  getFarmById,
  createFarm,
  updateFarm,
  deleteFarm
};
