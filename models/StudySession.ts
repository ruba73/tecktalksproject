import mongoose, { Schema, Document, Model } from 'mongoose';

// TypeScript Interfaces
export interface ISessionTask {
  taskId: mongoose.Types.ObjectId;
  completed: boolean;
  timeSpent: number;
}

export interface IBreakRecord {
  startTime: Date;
  endTime: Date;
  duration: number;
}

export interface IStudySession extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  goalId: mongoose.Types.ObjectId;
  sessionId?: mongoose.Types.ObjectId;
  title: string;
  type: 'study' | 'review' | 'practice' | 'project';
  plannedStartTime: Date;
  plannedDuration: number;
  actualStartTime?: Date;
  actualEndTime?: Date;
  actualDuration?: number;
  status: 'scheduled' | 'active' | 'paused' | 'completed' | 'cancelled';
  tasks: ISessionTask[];
  notes?: string;
  focusScore?: number;
  pauseCount: number;
  totalPauseTime: number;
  breaks: IBreakRecord[];
  createdAt: Date;
  updatedAt: Date;
  startSession(): Promise<IStudySession>;
  pauseSession(): Promise<IStudySession>;
  resumeSession(): Promise<IStudySession>;
  completeSession(): Promise<IStudySession>;
  cancelSession(): Promise<IStudySession>;
  addBreak(startTime: Date, endTime: Date): Promise<IStudySession>;
}

// Subdocument Schemas
const SessionTaskSchema = new Schema<ISessionTask>(
  {
    taskId: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    timeSpent: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { _id: false }
);

const BreakRecordSchema = new Schema<IBreakRecord>(
  {
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

// Main StudySession Schema
const StudySessionSchema = new Schema<IStudySession>(
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
      default: null,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    type: {
      type: String,
      enum: ['study', 'review', 'practice', 'project'],
      required: true,
    },
    plannedStartTime: {
      type: Date,
      required: true,
      index: true,
    },
    plannedDuration: {
      type: Number,
      required: true,
      min: 15,
      max: 480,
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
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['scheduled', 'active', 'paused', 'completed', 'cancelled'],
      default: 'scheduled',
      index: true,
    },
    tasks: {
      type: [SessionTaskSchema],
      default: [],
    },
    notes: {
      type: String,
      maxlength: 2000,
    },
    focusScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    pauseCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalPauseTime: {
      type: Number,
      default: 0,
      min: 0,
    },
    breaks: {
      type: [BreakRecordSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
StudySessionSchema.index({ userId: 1, status: 1 });
StudySessionSchema.index({ goalId: 1 });
StudySessionSchema.index({ plannedStartTime: 1 });
StudySessionSchema.index({ createdAt: -1 });
StudySessionSchema.index({ userId: 1, plannedStartTime: 1 });

// Methods
StudySessionSchema.methods.startSession = function () {
  this.status = 'active';
  this.actualStartTime = new Date();
  return this.save();
};

StudySessionSchema.methods.pauseSession = function () {
  this.status = 'paused';
  this.pauseCount += 1;
  return this.save();
};

StudySessionSchema.methods.resumeSession = function () {
  this.status = 'active';
  return this.save();
};

StudySessionSchema.methods.completeSession = function () {
  this.status = 'completed';
  this.actualEndTime = new Date();
  
  if (this.actualStartTime && this.plannedDuration > 0) {
    const totalTime = this.actualEndTime!.getTime() - this.actualStartTime.getTime();
    this.actualDuration = Math.round((totalTime - this.totalPauseTime) / 60000); // minutes

    // Calculate focus score (simple algorithm)
    const efficiency = this.actualDuration / this.plannedDuration;
    const pausePenalty = Math.max(0, 1 - (this.pauseCount * 0.1));
    this.focusScore = Math.round(Math.min(100, efficiency * pausePenalty * 100));
  }
  
  return this.save();
};

StudySessionSchema.methods.cancelSession = function () {
  this.status = 'cancelled';
  return this.save();
};

StudySessionSchema.methods.addBreak = function (startTime: Date, endTime: Date) {
  const duration = Math.round((endTime.getTime() - startTime.getTime()) / 60000);
  this.breaks.push({ startTime, endTime, duration });
  return this.save();
};

export const StudySession: Model<IStudySession> =
  mongoose.models.StudySession ||
  mongoose.model<IStudySession>('StudySession', StudySessionSchema);