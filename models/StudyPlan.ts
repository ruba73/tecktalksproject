import mongoose, { Schema, Document, Model } from 'mongoose';

// TypeScript Interfaces
export interface ISpacedRepetition {
  enabled: boolean;
  intervals: number[];
}

export interface IBreakRules {
  sessionDuration: number;
  shortBreak: number;
  longBreak: number;
}

export interface IConstraints {
  lockWeekends: boolean;
  lockSpecificDays: string[];
  respectFixedEvents: boolean;
}

export interface IPlanConfig {
  spacedRepetition: ISpacedRepetition;
  bufferTimePercentage: number;
  breakRules: IBreakRules;
  constraints: IConstraints;
}

export interface IBreak {
  afterMinutes: number;
  duration: number;
}

export interface ISession {
  _id: mongoose.Types.ObjectId;
  date: Date;
  startTime: string;
  endTime: string;
  duration: number;
  topicId: mongoose.Types.ObjectId;
  topicName: string;
  type: 'study' | 'review' | 'practice' | 'quiz' | 'project';
  difficulty: number;
  taskIds: mongoose.Types.ObjectId[];
  status: 'scheduled' | 'in-progress' | 'completed' | 'skipped' | 'rescheduled';
  actualStartTime?: Date;
  actualEndTime?: Date;
  actualDuration?: number;
  breaks: IBreak[];
}

export interface IMilestone {
  _id: mongoose.Types.ObjectId;
  title: string;
  type: 'module' | 'midterm' | 'mock-exam' | 'project' | 'review';
  targetDate: Date;
  status: 'pending' | 'achieved';
  achievedAt?: Date;
}

export interface IStudyPlan extends Document {
  _id: mongoose.Types.ObjectId;
  goalId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  planVersion: number;
  config: IPlanConfig;
  sessions: ISession[];
  milestones: IMilestone[];
  aiGenerated: boolean;
  aiModel?: string;
  generationPrompt?: string;
  lastRegenerated?: Date;
  regenerationReason?: string;
  preservedSessions?: mongoose.Types.ObjectId[];
  totalPlannedHours: number;
  totalCompletedHours: number;
  completionRate: number;
  createdAt: Date;
  updatedAt: Date;
}

// Subdocument Schemas
const SpacedRepetitionSchema = new Schema<ISpacedRepetition>(
  {
    enabled: {
      type: Boolean,
      default: true,
    },
    intervals: {
      type: [Number],
      default: [1, 3, 7, 14],
      validate: {
        validator: function (intervals: number[]) {
          return intervals.every((i) => i > 0);
        },
        message: 'All intervals must be positive numbers',
      },
    },
  },
  { _id: false }
);

const BreakRulesSchema = new Schema<IBreakRules>(
  {
    sessionDuration: {
      type: Number,
      default: 60,
      min: 15,
      max: 180,
    },
    shortBreak: {
      type: Number,
      default: 10,
      min: 5,
      max: 30,
    },
    longBreak: {
      type: Number,
      default: 30,
      min: 15,
      max: 60,
    },
  },
  { _id: false }
);

const ConstraintsSchema = new Schema<IConstraints>(
  {
    lockWeekends: {
      type: Boolean,
      default: false,
    },
    lockSpecificDays: {
      type: [String],
      default: [],
    },
    respectFixedEvents: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const PlanConfigSchema = new Schema<IPlanConfig>(
  {
    spacedRepetition: {
      type: SpacedRepetitionSchema,
      default: () => ({}),
    },
    bufferTimePercentage: {
      type: Number,
      default: 20,
      min: 0,
      max: 50,
    },
    breakRules: {
      type: BreakRulesSchema,
      default: () => ({}),
    },
    constraints: {
      type: ConstraintsSchema,
      default: () => ({}),
    },
  },
  { _id: false }
);

const BreakSchema = new Schema<IBreak>(
  {
    afterMinutes: {
      type: Number,
      required: true,
      min: 5,
    },
    duration: {
      type: Number,
      required: true,
      min: 5,
      max: 60,
    },
  },
  { _id: false }
);

const SessionSchema = new Schema<ISession>(
  {
    date: {
      type: Date,
      required: true,
      index: true,
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
    duration: {
      type: Number,
      required: true,
      min: 15,
      max: 480,
    },
    topicId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    topicName: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['study', 'review', 'practice', 'quiz', 'project'],
      required: true,
    },
    difficulty: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      required: true,
    },
    taskIds: {
      type: [Schema.Types.ObjectId],
      default: [],
    },
    status: {
      type: String,
      enum: ['scheduled', 'in-progress', 'completed', 'skipped', 'rescheduled'],
      default: 'scheduled',
    },
    actualStartTime: {
      type: Date,
      default: null,
    },
    actualEndTime: {
      type: Date,
      default: null,
    },
    actualDuration: {
      type: Number,
      default: null,
      min: 0,
    },
    breaks: {
      type: [BreakSchema],
      default: [],
    },
  },
  { _id: true }
);

const MilestoneSchema = new Schema<IMilestone>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    type: {
      type: String,
      enum: ['module', 'midterm', 'mock-exam', 'project', 'review'],
      required: true,
    },
    targetDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'achieved'],
      default: 'pending',
    },
    achievedAt: {
      type: Date,
      default: null,
    },
  },
  { _id: true }
);

// Main StudyPlan Schema
const StudyPlanSchema = new Schema<IStudyPlan>(
  {
    goalId: {
      type: Schema.Types.ObjectId,
      ref: 'Goal',
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    planVersion: {
      type: Number,
      default: 1,
      min: 1,
    },
    config: {
      type: PlanConfigSchema,
      required: true,
    },
    sessions: {
      type: [SessionSchema],
      validate: {
        validator: function (sessions: ISession[]) {
          return sessions.length >= 1 && sessions.length <= 500;
        },
        message: 'Plan must have between 1 and 500 sessions',
      },
    },
    milestones: {
      type: [MilestoneSchema],
      default: [],
    },
    aiGenerated: {
      type: Boolean,
      default: false,
    },
    aiModel: {
      type: String,
      default: null,
    },
    generationPrompt: {
      type: String,
      default: null,
    },
    lastRegenerated: {
      type: Date,
      default: null,
    },
    regenerationReason: {
      type: String,
      default: null,
    },
    preservedSessions: {
      type: [Schema.Types.ObjectId],
      default: [],
    },
    totalPlannedHours: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalCompletedHours: {
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
  },
  {
    timestamps: true,
  }
);

// Indexes
StudyPlanSchema.index({ goalId: 1 });
StudyPlanSchema.index({ userId: 1 });
StudyPlanSchema.index({ 'sessions.date': 1 });
StudyPlanSchema.index({ 'sessions.status': 1 });
StudyPlanSchema.index({ planVersion: 1 });

// Methods
StudyPlanSchema.methods.calculateCompletionRate = function (): number {
  if (!this.sessions || this.sessions.length === 0) return 0;
  const completedSessions = this.sessions.filter(
    (s: ISession) => s.status === 'completed'
  ).length;
  return Math.round((completedSessions / this.sessions.length) * 100);
};

StudyPlanSchema.methods.getTotalPlannedHours = function (): number {
  if (!this.sessions || this.sessions.length === 0) return 0;
  return this.sessions.reduce((sum: number, s: ISession) => sum + s.duration / 60, 0);
};

export const StudyPlan: Model<IStudyPlan> =
  mongoose.models.StudyPlan || mongoose.model<IStudyPlan>('StudyPlan', StudyPlanSchema);