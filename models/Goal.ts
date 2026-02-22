import mongoose, { Schema, Document, Model } from 'mongoose';

// TypeScript Interfaces
export interface IResource {
  type: 'video' | 'article' | 'pdf' | 'course' | 'book' | 'playlist' | 'other';
  title: string;
  url?: string;
  duration?: number;
  file?: string;
}

export interface ITopic {
  _id: mongoose.Types.ObjectId;
  name: string;
  order: number;
  estimatedHours: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  description?: string;
  resources: IResource[];
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number;
  masteryScore: number;
}

export interface IPrerequisite {
  goalId?: mongoose.Types.ObjectId;
  skillName?: string;
  required: boolean;
}

export interface IGoal extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  subjectId?: mongoose.Types.ObjectId;
  type: 'skill-path' | 'academic-course';
  title: string;
  description?: string;
  targetDate: Date;
  priority: 'low' | 'medium' | 'high';
  difficulty: 1 | 2 | 3 | 4 | 5;
  status: 'not-started' | 'in-progress' | 'completed' | 'paused' | 'abandoned';
  progress: number;
  topics: ITopic[];
  resources: IResource[];
  prerequisites: IPrerequisite[];
  estimatedTotalHours: number;
  actualHoursSpent: number;
  studyGroupId?: mongoose.Types.ObjectId;
  isShared: boolean;
  createdAt: Date;
  updatedAt: Date;
  calculateProgress(): number;
}

// Subdocument Schemas
const ResourceSchema = new Schema<IResource>(
  {
    type: {
      type: String,
      enum: ['video', 'article', 'pdf', 'course', 'book', 'playlist', 'other'],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    url: {
      type: String,
      trim: true,
    },
    duration: {
      type: Number,
      min: 0,
    },
    file: {
      type: String,
    },
  },
  { _id: false }
);

const TopicSchema = new Schema<ITopic>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    order: {
      type: Number,
      required: true,
      min: 1,
    },
    estimatedHours: {
      type: Number,
      required: true,
      min: 0.5,
      max: 500,
    },
    difficulty: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      required: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    resources: {
      type: [ResourceSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ['not-started', 'in-progress', 'completed'],
      default: 'not-started',
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    masteryScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  { _id: true }
);

const PrerequisiteSchema = new Schema<IPrerequisite>(
  {
    goalId: {
      type: Schema.Types.ObjectId,
      ref: 'Goal',
    },
    skillName: {
      type: String,
      trim: true,
    },
    required: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

// Main Goal Schema
const GoalSchema = new Schema<IGoal>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['skill-path', 'academic-course'],
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Goal title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    targetDate: {
      type: Date,
      required: [true, 'Target date is required'],
      validate: {
        validator: function (value: Date) {
          return value > new Date();
        },
        message: 'Target date must be in the future',
      },
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    difficulty: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      required: true,
    },
    status: {
      type: String,
      enum: ['not-started', 'in-progress', 'completed', 'paused', 'abandoned'],
      default: 'not-started',
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    topics: {
      type: [TopicSchema],
      required: true,
      validate: {
        validator: function (topics: ITopic[] | undefined) {
          return Array.isArray(topics) && topics.length >= 1 && topics.length <= 50;
        },
        message: 'Goal must have between 1 and 50 topics',
      },
    },
    resources: {
      type: [ResourceSchema],
      default: [],
    },
    prerequisites: {
      type: [PrerequisiteSchema],
      default: [],
    },
    estimatedTotalHours: {
      type: Number,
      default: 0,
      min: 0,
    },
    actualHoursSpent: {
      type: Number,
      default: 0,
      min: 0,
    },
    studyGroupId: {
      type: Schema.Types.ObjectId,
      ref: 'StudyGroup',
      default: null,
    },
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: 'Subject',
      default: null,
      index: true,
    },
    isShared: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
GoalSchema.index({ userId: 1, status: 1 });
GoalSchema.index({ targetDate: 1 });
GoalSchema.index({ priority: 1 });
GoalSchema.index({ studyGroupId: 1 });
GoalSchema.index({ createdAt: -1 });
GoalSchema.index({ type: 1 });

// Virtuals
GoalSchema.virtual('plan', {
  ref: 'StudyPlan',
  localField: '_id',
  foreignField: 'goalId',
  justOne: true,
});

GoalSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'goalId',
});

// Pre-save hook to calculate estimated total hours
GoalSchema.pre('save', function () {
  if (this.isModified('topics') && Array.isArray(this.topics) && this.topics.length > 0) {
    this.estimatedTotalHours = this.topics.reduce(
      (sum: number, topic: ITopic) => sum + topic.estimatedHours,
      0
    );
  }
});

// Methods
GoalSchema.methods.calculateProgress = function (): number {
  if (!this.topics || this.topics.length === 0) return 0;
  const totalProgress = this.topics.reduce((sum: number, topic: ITopic) => sum + topic.progress, 0);
  return Math.round(totalProgress / this.topics.length);
};

export const Goal: Model<IGoal> =
  mongoose.models.Goal || mongoose.model<IGoal>('Goal', GoalSchema);