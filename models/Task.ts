import mongoose, { Schema, Document, Model } from 'mongoose';

// TypeScript Interfaces
export interface ITaskResource {
  type: string;
  url: string;
  title: string;
}

export interface IReviewSchedule {
  originalTaskId?: mongoose.Types.ObjectId;
  nextReviewDate: Date;
  reviewCount: number;
  lastReviewedAt?: Date;
}

export interface ITask extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  goalId: mongoose.Types.ObjectId;
  sessionId?: mongoose.Types.ObjectId;
  topicId?: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  type: 'read' | 'watch' | 'practice' | 'assignment' | 'quiz' | 'project' | 'review';
  estimatedDuration: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  status: 'not-started' | 'in-progress' | 'done' | 'skipped';
  dueDate?: Date;
  scheduledDate?: Date;
  scheduledTime?: string;
  completed: boolean;
  completedAt?: Date;
  timeSpent?: number;
  isReview: boolean;
  reviewSchedule?: IReviewSchedule;
  resources: ITaskResource[];
  dependsOn: mongoose.Types.ObjectId[];
  linkedTasks: mongoose.Types.ObjectId[];
  isManual: boolean;
  createdAt: Date;
  updatedAt: Date;
  markComplete(timeSpent: number): Promise<ITask>;
}

// Subdocument Schemas
const TaskResourceSchema = new Schema<ITaskResource>(
  {
    type: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const ReviewScheduleSchema = new Schema<IReviewSchedule>(
  {
    originalTaskId: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
    },
    nextReviewDate: {
      type: Date,
      required: true,
      index: true,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastReviewedAt: {
      type: Date,
      default: null,
    },
  },
  { _id: false }
);

// Main Task Schema
const TaskSchema = new Schema<ITask>(
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
      required: true,
      index: true,
    },
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: 'StudyPlan',
      default: null,
    },
    topicId: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    type: {
      type: String,
      enum: ['read', 'watch', 'practice', 'assignment', 'quiz', 'project', 'review'],
      required: true,
    },
    estimatedDuration: {
      type: Number,
      required: true,
      min: 5,
      max: 480,
    },
    difficulty: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      required: true,
    },
    status: {
      type: String,
      enum: ['not-started', 'in-progress', 'done', 'skipped'],
      default: 'not-started',
    },
    dueDate: {
      type: Date,
      default: null,
      index: true,
    },
    scheduledDate: {
      type: Date,
      default: null,
      index: true,
    },
    scheduledTime: {
      type: String,
      default: null,
      match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    timeSpent: {
      type: Number,
      default: 0,
      min: 0,
    },
    isReview: {
      type: Boolean,
      default: false,
    },
    reviewSchedule: {
      type: ReviewScheduleSchema,
      default: null,
    },
    resources: {
      type: [TaskResourceSchema],
      default: [],
    },
    dependsOn: {
      type: [Schema.Types.ObjectId],
      ref: 'Task',
      default: [],
    },
    linkedTasks: {
      type: [Schema.Types.ObjectId],
      ref: 'Task',
      default: [],
    },
    isManual: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
TaskSchema.index({ userId: 1, status: 1 });
TaskSchema.index({ goalId: 1, status: 1 });
TaskSchema.index({ dueDate: 1 });
TaskSchema.index({ scheduledDate: 1 });
TaskSchema.index({ 'reviewSchedule.nextReviewDate': 1 });
TaskSchema.index({ completed: 1 });
TaskSchema.index({ type: 1 });

// Pre-save hook
TaskSchema.pre('save', function () {
  if (this.isModified('status') && this.status === 'done' && !this.completed) {
    this.completed = true;
    this.completedAt = new Date();
  }
});

// Methods
TaskSchema.methods.markComplete = function (timeSpent: number) {
  this.status = 'done';
  this.completed = true;
  this.completedAt = new Date();
  this.timeSpent = timeSpent;
  return this.save();
};

export const Task: Model<ITask> =
  mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);