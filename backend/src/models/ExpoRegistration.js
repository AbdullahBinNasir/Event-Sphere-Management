import mongoose from 'mongoose'

const expoRegistrationSchema = new mongoose.Schema(
  {
    expoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Expo',
      required: true,
    },
    attendeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['registered', 'cancelled'],
      default: 'registered',
    },
    notes: String,
  },
  {
    timestamps: true,
  }
)

// Prevent duplicate registrations for same expo by same attendee
expoRegistrationSchema.index({ expoId: 1, attendeeId: 1 }, { unique: true })

const ExpoRegistration = mongoose.model('ExpoRegistration', expoRegistrationSchema)

export default ExpoRegistration





