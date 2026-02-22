import mongoose, { Schema, Document, Model } from 'mongoose';

// TypeScript Interfaces
export interface IActivityLog extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  type:
    | 'goal_created'
    | 'goal_completed'
    | 'task_completed'
    | 'session_completed'
    | 'plan_generated'
    | 'plan_regenerated'
    | 'milestone_achieved'
    | 'streak_achieved'
    | 'flashcard_reviewed'
    | 'group_joined'
    | 'goal_shared';
  description: string;
  relatedEntityId?: mongoose.Types.ObjectId;
  relatedEntityType?: 'Goal' | 'Task' | 'Session' | 'Plan' | 'StudyGroup' | 'Flashcard';
  metadata?: Record<string, unknown>; // Changed from 'any' to 'unknown'
  createdAt: Date;
}

// Interface for static methods
interface IActivityLogModel extends Model<IActivityLog> {
  logActivity(
    userId: mongoose.Types.ObjectId,
    type: string,
    description: string,
    options?: {
      relatedEntityId?: mongoose.Types.ObjectId;
      relatedEntityType?: string;
      metadata?: Record<string, unknown>;
    }
  ): Promise<IActivityLog>;
  
  getUserFeed(
    userId: mongoose.Types.ObjectId,
    limit?: number,
    skip?: number
  ): Promise<IActivityLog[]>;
  
  getByType(
    userId: mongoose.Types.ObjectId,
    type: string,
    limit?: number
  ): Promise<IActivityLog[]>;
  
  getRecentActivity(
    userId: mongoose.Types.ObjectId,
    days?: number
  ): Promise<IActivityLog[]>;
  
  getStats(
    userId: mongoose.Types.ObjectId,
    startDate: Date,
    endDate: Date
  ): Promise<Record<string, number>>;
}

// Main ActivityLog Schema
const ActivityLogSchema = new Schema<IActivityLog, IActivityLogModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        'goal_created',
        'goal_completed',
        'task_completed',
        'session_completed',
        'plan_generated',
        'plan_regenerated',
        'milestone_achieved',
        'streak_achieved',
        'flashcard_reviewed',
        'group_joined',
        'goal_shared',
      ],
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    relatedEntityId: {
      type: Schema.Types.ObjectId,
      default: null,
      index: true,
    },
    relatedEntityType: {
      type: String,
      enum: ['Goal', 'Task', 'Session', 'Plan', 'StudyGroup', 'Flashcard'],
      default: null,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Indexes
ActivityLogSchema.index({ userId: 1, createdAt: -1 });
ActivityLogSchema.index({ type: 1, createdAt: -1 });
ActivityLogSchema.index({ userId: 1, type: 1, createdAt: -1 });
ActivityLogSchema.index({ relatedEntityId: 1 });

// Static method to log activity
ActivityLogSchema.statics.logActivity = async function (
  userId: mongoose.Types.ObjectId,
  type: string,
  description: string,
  options: {
    relatedEntityId?: mongoose.Types.ObjectId;
    relatedEntityType?: string;
    metadata?: Record<string, unknown>;
  } = {}
): Promise<IActivityLog> {
  return this.create({
    userId,
    type,
    description,
    relatedEntityId: options.relatedEntityId,
    relatedEntityType: options.relatedEntityType,
    metadata: options.metadata || {},
  });
};

// Static method to get user activity feed
ActivityLogSchema.statics.getUserFeed = async function (
  userId: mongoose.Types.ObjectId,
  limit: number = 20,
  skip: number = 0
): Promise<IActivityLog[]> {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .lean();
};

// Static method to get activity by type
ActivityLogSchema.statics.getByType = async function (
  userId: mongoose.Types.ObjectId,
  type: string,
  limit: number = 20
): Promise<IActivityLog[]> {
  return this.find({ userId, type })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

// Static method to get recent activity
ActivityLogSchema.statics.getRecentActivity = async function (
  userId: mongoose.Types.ObjectId,
  days: number = 7
): Promise<IActivityLog[]> {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  
  return this.find({
    userId,
    createdAt: { $gte: startDate },
  })
    .sort({ createdAt: -1 })
    .lean();
};

// Static method to get activity stats
ActivityLogSchema.statics.getStats = async function (
  userId: mongoose.Types.ObjectId,
  startDate: Date,
  endDate: Date
): Promise<Record<string, number>> {
  const stats = await this.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        createdAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
      },
    },
  ]);
  
  return stats.reduce((acc, stat) => {
    acc[stat._id] = stat.count;
    return acc;
  }, {} as Record<string, number>);
};

// Method to format activity for display
ActivityLogSchema.methods.formatForDisplay = function (): {
  id: string;
  type: string;
  description: string;
  icon: string;
  timestamp: Date;
} {
  const iconMap: Record<string, string> = {
    goal_created: '🎯',
    goal_completed: '✅',
    task_completed: '☑️',
    session_completed: '📚',
    plan_generated: '🤖',
    plan_regenerated: '🔄',
    milestone_achieved: '🏆',
    streak_achieved: '🔥',
    flashcard_reviewed: '🃏',
    group_joined: '👥',
    goal_shared: '🤝',
  };
  
  return {
    id: this._id.toString(),
    type: this.type,
    description: this.description,
    icon: iconMap[this.type] || '📌',
    timestamp: this.createdAt,
  };
};

// Export with proper typing
export const ActivityLog: IActivityLogModel =
  (mongoose.models.ActivityLog as IActivityLogModel) ||
  mongoose.model<IActivityLog, IActivityLogModel>('ActivityLog', ActivityLogSchema);