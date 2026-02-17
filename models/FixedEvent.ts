import mongoose, { Schema, Document, Model } from 'mongoose';

// TypeScript Interfaces
export interface IRecurrence {
  type: 'once' | 'daily' | 'weekly' | 'custom';
  days?: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[];
  startDate: Date;
  endDate?: Date;
}

export interface IFixedEvent extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  type: 'class' | 'work' | 'gym' | 'meeting' | 'personal' | 'other';
  startTime: string;
  endTime: string;
  recurrence: IRecurrence;
  location?: string;
  notes?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  getDuration(): number;
  isActiveOnDate(date: Date): boolean;
}

// Subdocument Schema
const RecurrenceSchema = new Schema<IRecurrence>(
  {
    type: {
      type: String,
      enum: ['once', 'daily', 'weekly', 'custom'],
      required: true,
    },
    days: {
      type: [String],
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      default: [],
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      default: null,
    },
  },
  { _id: false }
);

// Main FixedEvent Schema
const FixedEventSchema = new Schema<IFixedEvent>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters'],
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    type: {
      type: String,
      enum: ['class', 'work', 'gym', 'meeting', 'personal', 'other'],
      required: true,
    },
    startTime: {
      type: String,
      required: true,
      match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
    },
    endTime: {
      type: String,
      required: true,
      match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
    },
    recurrence: {
      type: RecurrenceSchema,
      required: true,
    },
    location: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
FixedEventSchema.index({ userId: 1, active: 1 });
FixedEventSchema.index({ 'recurrence.days': 1 });
FixedEventSchema.index({ startTime: 1, endTime: 1 });
FixedEventSchema.index({ userId: 1, 'recurrence.type': 1 });

// Validation: endTime must be after startTime
FixedEventSchema.pre('save', function () {
  const start = this.startTime.split(':').map(Number);
  const end = this.endTime.split(':').map(Number);
  const startMinutes = start[0] * 60 + start[1];
  const endMinutes = end[0] * 60 + end[1];

  if (endMinutes <= startMinutes) {
    throw new Error('End time must be after start time');
  }
});

// Methods
FixedEventSchema.methods.getDuration = function (): number {
  const start = this.startTime.split(':').map(Number);
  const end = this.endTime.split(':').map(Number);
  const startMinutes = start[0] * 60 + start[1];
  const endMinutes = end[0] * 60 + end[1];
  return endMinutes - startMinutes;
};

FixedEventSchema.methods.isActiveOnDate = function (date: Date): boolean {
  if (!this.active) return false;
  
  const dayNames = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ] as const;
  const dayOfWeek = dayNames[date.getDay()];

  if (this.recurrence.type === 'once') {
    return (
      date.toDateString() === this.recurrence.startDate.toDateString()
    );
  }
  
  if (this.recurrence.type === 'daily') {
    return (
      date >= this.recurrence.startDate &&
      (!this.recurrence.endDate || date <= this.recurrence.endDate)
    );
  }
  
  if (this.recurrence.type === 'weekly') {
    return (
      this.recurrence.days?.includes(dayOfWeek) &&
      date >= this.recurrence.startDate &&
      (!this.recurrence.endDate || date <= this.recurrence.endDate)
    );
  }
  
  return false;
};

export const FixedEvent: Model<IFixedEvent> =
  mongoose.models.FixedEvent ||
  mongoose.model<IFixedEvent>('FixedEvent', FixedEventSchema);