import mongoose, { Schema, Document, Model } from 'mongoose';

// TypeScript Interfaces
export interface ITopicMastery {
  topicId: mongoose.Types.ObjectId;
  topicName: string;
  score: number;
  quizzesTaken: number;
  reviewsCompleted: number;
}

export interface IProgress extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  goalId?: mongoose.Types.ObjectId;
  date: Date;
  week: number;
  month: number;
  year: number;
  plannedTime: number;
  actualTime: number;
  timeStudied: number;
  tasksPlanned: number;
  tasksCompleted: number;
  tasksSkipped: number;
  completionRate: number;
  topicMastery: ITopicMastery[];
  currentStreak: number;
  burnoutScore: number;
  status: 'behind' | 'on-track' | 'ahead';
  createdAt: Date;
  updatedAt: Date;
  calculateBurnout(): number;
  updateStatus(): Promise<IProgress>;
}

// Subdocument Schema
const TopicMasterySchema = new Schema<ITopicMastery>(
  {
    topicId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    topicName: {
      type: String,
      required: true,
      trim: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    quizzesTaken: {
      type: Number,
      default: 0,
      min: 0,
    },
    reviewsCompleted: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { _id: false }
);

// Main Progress Schema
const ProgressSchema = new Schema<IProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    goalId: {
      type: Schema.Types.ObjectId,
      ref: 'Goal',
      default: null,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    week: {
      type: Number,
      required: true,
      index: true,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
      index: true,
    },
    year: {
      type: Number,
      required: true,
      index: true,
    },
    plannedTime: {
      type: Number,
      default: 0,
      min: 0,
    },
    actualTime: {
      type: Number,
      default: 0,
      min: 0,
    },
    timeStudied: {
      type: Number,
      default: 0,
      min: 0,
    },
    tasksPlanned: {
      type: Number,
      default: 0,
      min: 0,
    },
    tasksCompleted: {
      type: Number,
      default: 0,
      min: 0,
    },
    tasksSkipped: {
      type: Number,
      default: 0,
      min: 0,
    },
    completionRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    topicMastery: {
      type: [TopicMasterySchema],
      default: [],
    },
    currentStreak: {
      type: Number,
      default: 0,
      min: 0,
    },
    burnoutScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: ['behind', 'on-track', 'ahead'],
      default: 'on-track',
    },
  },
  {
    timestamps: true,
  }
);

// Compound Indexes
ProgressSchema.index({ userId: 1, date: -1 });
ProgressSchema.index({ goalId: 1, date: -1 });
ProgressSchema.index({ userId: 1, week: 1, year: 1 });
ProgressSchema.index({ userId: 1, month: 1, year: 1 });
ProgressSchema.index({ userId: 1, goalId: 1, date: -1 });

// Pre-save hook to calculate completion rate
ProgressSchema.pre('save', function () {
  if (this.tasksPlanned > 0) {
    this.completionRate = Math.round(
      (this.tasksCompleted / this.tasksPlanned) * 100
    );
  }
});

// Methods
ProgressSchema.methods.calculateBurnout = function (): number {
  // Simple burnout calculation based on:
  // - Planned vs actual time ratio
  // - Completion rate
  // - Consecutive high-load days
  
  const timeRatio = this.plannedTime > 0 
    ? this.actualTime / this.plannedTime 
    : 0;
  
  const completionPressure = this.completionRate < 50 ? 1.5 : 1.0;
  
  const burnout = Math.min(
    100,
    ((1 - this.completionRate / 100) * 50 + 
     timeRatio * 30 * completionPressure)
  );
  
  return Math.round(burnout);
};

ProgressSchema.methods.updateStatus = function () {
  if (this.completionRate >= 80 && this.actualTime <= this.plannedTime * 1.1) {
    this.status = 'ahead';
  } else if (this.completionRate < 60 || this.actualTime > this.plannedTime * 1.3) {
    this.status = 'behind';
  } else {
    this.status = 'on-track';
  }
  return this.save();
};

// Static methods
ProgressSchema.statics.getWeeklyProgress = async function (
  userId: mongoose.Types.ObjectId,
  week: number,
  year: number
) {
  return this.find({ userId, week, year }).sort({ date: 1 });
};

ProgressSchema.statics.getMonthlyProgress = async function (
  userId: mongoose.Types.ObjectId,
  month: number,
  year: number
) {
  return this.find({ userId, month, year }).sort({ date: 1 });
};

ProgressSchema.statics.calculateStreak = async function (
  userId: mongoose.Types.ObjectId
) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let streak = 0;
  const currentDate = new Date(today);

  while (true) {
    const progress = await this.findOne({
      userId,
      date: {
        $gte: currentDate,
        $lt: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000),
      },
    });
    
    if (!progress || progress.timeStudied === 0) {
      break;
    }
    
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }
  
  return streak;
};

// Model interface with statics for TypeScript
export interface IProgressModel extends Model<IProgress> {
  getWeeklyProgress(
    userId: mongoose.Types.ObjectId,
    week: number,
    year: number
  ): Promise<IProgress[]>;
  getMonthlyProgress(
    userId: mongoose.Types.ObjectId,
    month: number,
    year: number
  ): Promise<IProgress[]>;
  calculateStreak(userId: mongoose.Types.ObjectId): Promise<number>;
}

export const Progress: IProgressModel =
  (mongoose.models.Progress as IProgressModel) ||
  mongoose.model<IProgress, IProgressModel>('Progress', ProgressSchema);