import Session from '../models/Session.js'

// @desc    Get all sessions
// @route   GET /api/sessions
// @access  Public
export const getSessions = async (req, res) => {
  try {
    const { expoId, type, status } = req.query
    const filter = {}

    if (expoId) filter.expoId = expoId
    if (type) filter.type = type
    if (status) filter.status = status

    const sessions = await Session.find(filter)
      .populate('expoId', 'title')
      .populate('registeredAttendees', 'name email')
      .sort({ startTime: 1 })

    res.json({
      success: true,
      count: sessions.length,
      data: sessions,
    })
  } catch (error) {
    console.error('Get sessions error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sessions',
      error: error.message,
    })
  }
}

// @desc    Get single session
// @route   GET /api/sessions/:id
// @access  Public
export const getSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('expoId', 'title startDate endDate')
      .populate('registeredAttendees', 'name email')

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found',
      })
    }

    res.json({
      success: true,
      data: session,
    })
  } catch (error) {
    console.error('Get session error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch session',
      error: error.message,
    })
  }
}

// @desc    Create session
// @route   POST /api/sessions
// @access  Private (Admin/Organizer)
export const createSession = async (req, res) => {
  try {
    const session = await Session.create(req.body)

    res.status(201).json({
      success: true,
      message: 'Session created successfully',
      data: session,
    })
  } catch (error) {
    console.error('Create session error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create session',
      error: error.message,
    })
  }
}

// @desc    Update session
// @route   PUT /api/sessions/:id
// @access  Private (Admin/Organizer)
export const updateSession = async (req, res) => {
  try {
    let session = await Session.findById(req.params.id)

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found',
      })
    }

    session = await Session.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.json({
      success: true,
      message: 'Session updated successfully',
      data: session,
    })
  } catch (error) {
    console.error('Update session error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update session',
      error: error.message,
    })
  }
}

// @desc    Delete session
// @route   DELETE /api/sessions/:id
// @access  Private (Admin/Organizer)
export const deleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found',
      })
    }

    await session.deleteOne()

    res.json({
      success: true,
      message: 'Session deleted successfully',
    })
  } catch (error) {
    console.error('Delete session error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete session',
      error: error.message,
    })
  }
}

// @desc    Register for session
// @route   POST /api/sessions/:id/register
// @access  Private (Attendee)
export const registerForSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found',
      })
    }

    // Check if already registered
    if (session.registeredAttendees.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this session',
      })
    }

    // Check if session is full
    if (session.registeredAttendees.length >= session.maxAttendees) {
      return res.status(400).json({
        success: false,
        message: 'Session is full',
      })
    }

    session.registeredAttendees.push(req.user.id)
    await session.save()

    res.json({
      success: true,
      message: 'Successfully registered for session',
      data: session,
    })
  } catch (error) {
    console.error('Register for session error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to register for session',
      error: error.message,
    })
  }
}

// @desc    Unregister from session
// @route   DELETE /api/sessions/:id/register
// @access  Private (Attendee)
export const unregisterFromSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found',
      })
    }

    session.registeredAttendees = session.registeredAttendees.filter(
      (id) => id.toString() !== req.user.id.toString()
    )

    await session.save()

    res.json({
      success: true,
      message: 'Successfully unregistered from session',
      data: session,
    })
  } catch (error) {
    console.error('Unregister from session error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to unregister from session',
      error: error.message,
    })
  }
}

