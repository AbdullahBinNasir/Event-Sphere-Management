import ExhibitorApplication from '../models/ExhibitorApplication.js'
import Expo from '../models/Expo.js'

// @desc    Get all exhibitor applications
// @route   GET /api/exhibitors/applications
// @access  Private (Admin/Organizer)
export const getApplications = async (req, res) => {
  try {
    const { expoId, status } = req.query
    const filter = {}

    if (expoId) filter.expoId = expoId
    if (status) filter.status = status

    const applications = await ExhibitorApplication.find(filter)
      .populate('expoId', 'title startDate endDate')
      .populate('exhibitorId', 'name email companyName phone')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      count: applications.length,
      data: applications,
    })
  } catch (error) {
    console.error('Get applications error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications',
      error: error.message,
    })
  }
}

// @desc    Get single application
// @route   GET /api/exhibitors/applications/:id
// @access  Private
export const getApplication = async (req, res) => {
  try {
    const application = await ExhibitorApplication.findById(req.params.id)
      .populate('expoId', 'title startDate endDate location')
      .populate('exhibitorId', 'name email companyName phone')
      .populate('approvedBy', 'name email')

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      })
    }

    res.json({
      success: true,
      data: application,
    })
  } catch (error) {
    console.error('Get application error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch application',
      error: error.message,
    })
  }
}

// @desc    Create exhibitor application
// @route   POST /api/exhibitors/applications
// @access  Private (Exhibitor)
export const createApplication = async (req, res) => {
  try {
    const { expoId } = req.body

    // Check if expo exists
    const expo = await Expo.findById(expoId)
    if (!expo) {
      return res.status(404).json({
        success: false,
        message: 'Expo not found',
      })
    }

    // Check if already applied
    const existingApplication = await ExhibitorApplication.findOne({
      expoId,
      exhibitorId: req.user.id,
    })

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this expo',
      })
    }

    // Get user's company name from profile if not provided
    if (!req.body.companyName) {
      const User = (await import('../models/User.js')).default
      const user = await User.findById(req.user.id).select('companyName')
      if (user && user.companyName) {
        req.body.companyName = user.companyName
      } else {
        return res.status(400).json({
          success: false,
          message: 'Company name is required. Please provide it in the application form.',
        })
      }
    }

    req.body.exhibitorId = req.user.id
    const application = await ExhibitorApplication.create(req.body)

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application,
    })
  } catch (error) {
    console.error('Create application error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to submit application',
      error: error.message,
    })
  }
}

// @desc    Approve exhibitor application
// @route   PUT /api/exhibitors/applications/:id/approve
// @access  Private (Admin/Organizer)
export const approveApplication = async (req, res) => {
  try {
    const { boothNumber, boothId } = req.body

    const application = await ExhibitorApplication.findById(req.params.id)
      .populate('expoId')

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      })
    }

    if (application.status === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Application already approved',
      })
    }

    application.status = 'approved'
    application.approvedAt = new Date()
    application.approvedBy = req.user.id
    if (boothNumber) application.boothNumber = boothNumber
    if (boothId) application.boothId = boothId

    // Update booth status in expo if boothId provided
    if (boothId && application.expoId.floorPlan) {
      const booth = application.expoId.floorPlan.booths.id(boothId)
      if (booth) {
        booth.status = 'reserved'
        booth.exhibitorId = application.exhibitorId
        await application.expoId.save()
      }
    }

    await application.save()

    res.json({
      success: true,
      message: 'Application approved successfully',
      data: application,
    })
  } catch (error) {
    console.error('Approve application error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to approve application',
      error: error.message,
    })
  }
}

// @desc    Reject exhibitor application
// @route   PUT /api/exhibitors/applications/:id/reject
// @access  Private (Admin/Organizer)
export const rejectApplication = async (req, res) => {
  try {
    const { rejectionReason } = req.body

    const application = await ExhibitorApplication.findById(req.params.id)

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      })
    }

    if (application.status === 'rejected') {
      return res.status(400).json({
        success: false,
        message: 'Application already rejected',
      })
    }

    application.status = 'rejected'
    application.rejectionReason = rejectionReason || 'Application rejected by organizer'

    await application.save()

    res.json({
      success: true,
      message: 'Application rejected',
      data: application,
    })
  } catch (error) {
    console.error('Reject application error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to reject application',
      error: error.message,
    })
  }
}

// @desc    Get exhibitor's applications
// @route   GET /api/exhibitors/my-applications
// @access  Private (Exhibitor)
export const getMyApplications = async (req, res) => {
  try {
    const applications = await ExhibitorApplication.find({
      exhibitorId: req.user.id,
    })
      .populate('expoId', 'title startDate endDate location status')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      count: applications.length,
      data: applications,
    })
  } catch (error) {
    console.error('Get my applications error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications',
      error: error.message,
    })
  }
}

