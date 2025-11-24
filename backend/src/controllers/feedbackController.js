import Feedback from '../models/Feedback.js'

// @desc    Get all feedback
// @route   GET /api/feedback
// @access  Private (Admin/Organizer)
export const getFeedback = async (req, res) => {
  try {
    const { status, type } = req.query
    const filter = {}

    if (status) filter.status = status
    if (type) filter.type = type

    const feedback = await Feedback.find(filter)
      .populate('userId', 'name email')
      .populate('respondedBy', 'name email')
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      count: feedback.length,
      data: feedback,
    })
  } catch (error) {
    console.error('Get feedback error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback',
      error: error.message,
    })
  }
}

// @desc    Get user's feedback
// @route   GET /api/feedback/my-feedback
// @access  Private
export const getMyFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ userId: req.user.id })
      .populate('respondedBy', 'name email')
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      count: feedback.length,
      data: feedback,
    })
  } catch (error) {
    console.error('Get my feedback error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback',
      error: error.message,
    })
  }
}

// @desc    Create feedback
// @route   POST /api/feedback
// @access  Private
export const createFeedback = async (req, res) => {
  try {
    req.body.userId = req.user.id
    const feedback = await Feedback.create(req.body)

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: feedback,
    })
  } catch (error) {
    console.error('Create feedback error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback',
      error: error.message,
    })
  }
}

// @desc    Update feedback status
// @route   PUT /api/feedback/:id
// @access  Private (Admin/Organizer)
export const updateFeedback = async (req, res) => {
  try {
    const { status, response } = req.body

    const feedback = await Feedback.findById(req.params.id)

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found',
      })
    }

    if (status) feedback.status = status
    if (response) {
      feedback.response = response
      feedback.respondedBy = req.user.id
    }

    await feedback.save()

    res.json({
      success: true,
      message: 'Feedback updated successfully',
      data: feedback,
    })
  } catch (error) {
    console.error('Update feedback error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update feedback',
      error: error.message,
    })
  }
}

