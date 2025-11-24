import mongoose from 'mongoose'

const sessionSchema = new mongoose.Schema(
  {
    expoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Expo',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a session title'],
    },
    description: {
      type: String,
    },
    type: {
      type: String,
      enum: ['keynote', 'workshop', 'panel', 'networking'],
      default: 'workshop',
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    speaker: {
      name: {
        type: String,
        required: true,
      },
      bio: String,
      email: String,
      photo: String,
      company: String,
      title: String,
    },
    maxAttendees: {
      type: Number,
      default: 50,
    },
    registeredAttendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    status: {
      type: String,
      enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
      default: 'scheduled',
    },
  },
  {
    timestamps: true,
  }
)

const Session = mongoose.model('Session', sessionSchema)

export default Session

