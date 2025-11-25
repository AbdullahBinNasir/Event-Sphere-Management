import Expo from '../models/Expo.js'
import ExpoRegistration from '../models/ExpoRegistration.js'
import { createNotification } from './notificationController.js'

// @desc    Get all expos
// @route   GET /api/expos
// @access  Public
export const getExpos = async (req, res) => {
  try {
    const { status, organizerId } = req.query
    const filter = {}

    if (status) filter.status = status
    if (organizerId) filter.organizerId = organizerId

    const expos = await Expo.find(filter)
      .populate('organizerId', 'name email')
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      count: expos.length,
      data: expos,
    })
  } catch (error) {
    console.error('Get expos error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch expos',
      error: error.message,
    })
  }
}

// @desc    Get single expo
// @route   GET /api/expos/:id
// @access  Public
export const getExpo = async (req, res) => {
  try {
    const expo = await Expo.findById(req.params.id)
      .populate('organizerId', 'name email')
      .populate('floorPlan.booths.exhibitorId', 'name email companyName')

    if (!expo) {
      return res.status(404).json({
        success: false,
        message: 'Expo not found',
      })
    }

    res.json({
      success: true,
      data: expo,
    })
  } catch (error) {
    console.error('Get expo error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch expo',
      error: error.message,
    })
  }
}

// @desc    Create expo
// @route   POST /api/expos
// @access  Private (Admin/Organizer)
export const createExpo = async (req, res) => {
  try {
    req.body.organizerId = req.user.id
    const expo = await Expo.create(req.body)

    res.status(201).json({
      success: true,
      message: 'Expo created successfully',
      data: expo,
    })
  } catch (error) {
    console.error('Create expo error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create expo',
      error: error.message,
    })
  }
}

// @desc    Update expo
// @route   PUT /api/expos/:id
// @access  Private (Admin/Organizer)
export const updateExpo = async (req, res) => {
  try {
    let expo = await Expo.findById(req.params.id)

    if (!expo) {
      return res.status(404).json({
        success: false,
        message: 'Expo not found',
      })
    }

    // Check if user is organizer or admin
    if (expo.organizerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this expo',
      })
    }

    expo = await Expo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.json({
      success: true,
      message: 'Expo updated successfully',
      data: expo,
    })
  } catch (error) {
    console.error('Update expo error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update expo',
      error: error.message,
    })
  }
}

// @desc    Delete expo
// @route   DELETE /api/expos/:id
// @access  Private (Admin/Organizer)
export const deleteExpo = async (req, res) => {
  try {
    const expo = await Expo.findById(req.params.id)

    if (!expo) {
      return res.status(404).json({
        success: false,
        message: 'Expo not found',
      })
    }

    // Check if user is organizer or admin
    if (expo.organizerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this expo',
      })
    }

    await expo.deleteOne()

    res.json({
      success: true,
      message: 'Expo deleted successfully',
    })
  } catch (error) {
    console.error('Delete expo error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete expo',
      error: error.message,
    })
  }
}

// @desc    Register attendee for an expo
// @route   POST /api/expos/:id/register
// @access  Private (Attendee)
export const registerForExpo = async (req, res) => {
  try {
    const expo = await Expo.findById(req.params.id)

    if (!expo) {
      return res.status(404).json({
        success: false,
        message: 'Expo not found',
      })
    }

    // Only allow registration for published or ongoing expos
    if (!['published', 'ongoing'].includes(expo.status)) {
      return res.status(400).json({
        success: false,
        message: 'Registration is only available for published expos',
      })
    }

    let registration = await ExpoRegistration.findOne({
      expoId: expo._id,
      attendeeId: req.user._id,
    })

    if (registration && registration.status === 'registered') {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this expo',
      })
    }

    if (!registration) {
      registration = await ExpoRegistration.create({
        expoId: expo._id,
        attendeeId: req.user._id,
      })
    } else {
      registration.status = 'registered'
      registration.updatedAt = Date.now()
      await registration.save()
    }

    await createNotification(
      req.user._id,
      `You're registered for ${expo.title}. See you there!`,
      'success'
    )

    res.json({
      success: true,
      message: 'Successfully registered for expo',
      data: registration,
    })
  } catch (error) {
    console.error('Register for expo error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to register for expo',
      error: error.message,
    })
  }
}

// @desc    Cancel expo registration
// @route   DELETE /api/expos/:id/register
// @access  Private (Attendee)
export const cancelExpoRegistration = async (req, res) => {
  try {
    const registration = await ExpoRegistration.findOne({
      expoId: req.params.id,
      attendeeId: req.user._id,
      status: 'registered',
    })

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found',
      })
    }

    registration.status = 'cancelled'
    registration.updatedAt = Date.now()
    await registration.save()

    await createNotification(
      req.user._id,
      'Your expo registration has been cancelled.',
      'info'
    )

    res.json({
      success: true,
      message: 'Registration cancelled successfully',
    })
  } catch (error) {
    console.error('Cancel expo registration error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to cancel registration',
      error: error.message,
    })
  }
}

// @desc    Get attendee expo registrations
// @route   GET /api/expos/my-registrations
// @access  Private (Attendee)
export const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await ExpoRegistration.find({
      attendeeId: req.user._id,
      status: 'registered',
    })
      .populate('expoId')
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      count: registrations.length,
      data: registrations,
    })
  } catch (error) {
    console.error('Get expo registrations error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch expo registrations',
      error: error.message,
    })
  }
}

