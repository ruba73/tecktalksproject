import mongoose, { Schema, Document, Model } from 'mongoose';

// TypeScript Interfaces
export interface INotification extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  type: 'reminder' | 'achievement' | 'deadline' | 'review-due' | 'system' | 'group-invite';
  title: string;
  message: string;
  actionUrl?: string;
  relatedEntityId?: mongoose.Types.ObjectId;
  relatedEntityType?: 'Goal' | 'Task' | 'Session' | 'StudyGroup' | 'Flashcard';
  isRead: boolean;
  readAt?: Date;
  scheduledFor?: Date;
  sent: boolean;
  createdAt: Date;
  // Instance methods
  markAsRead(): Promise<INotification>;
  markAsSent(): Promise<INotification>;
}

// Interface for static methods
interface INotificationModel extends Model<INotification> {
  createNotification(
    userId: mongoose.Types.ObjectId,
    type: string,
    title: string,
    message: string,
    options?: {
      actionUrl?: string;
      relatedEntityId?: mongoose.Types.ObjectId;
      relatedEntityType?: string;
      scheduledFor?: Date;
    }
  ): Promise<INotification>;

  getUnreadCount(userId: mongoose.Types.ObjectId): Promise<number>;

  getUnread(
    userId: mongoose.Types.ObjectId,
    limit?: number
  ): Promise<INotification[]>;

  getAll(
    userId: mongoose.Types.ObjectId,
    limit?: number,
    skip?: number
  ): Promise<INotification[]>;

  markAllAsRead(
    userId: mongoose.Types.ObjectId
  ): Promise<{ acknowledged: boolean; modifiedCount: number; matchedCount: number }>;

  deleteOldNotifications(
    userId: mongoose.Types.ObjectId,
    daysOld?: number
  ): Promise<{ acknowledged: boolean; deletedCount: number }>;

  getPendingScheduled(): Promise<INotification[]>;

  createReminder(
    userId: mongoose.Types.ObjectId,
    title: string,
    message: string,
    scheduledFor: Date,
    relatedEntityId?: mongoose.Types.ObjectId,
    relatedEntityType?: string
  ): Promise<INotification>;

  createAchievement(
    userId: mongoose.Types.ObjectId,
    title: string,
    message: string,
    relatedEntityId?: mongoose.Types.ObjectId
  ): Promise<INotification>;

  createDeadlineWarning(
    userId: mongoose.Types.ObjectId,
    goalTitle: string,
    daysLeft: number,
    goalId: mongoose.Types.ObjectId
  ): Promise<INotification>;
}

// Main Notification Schema
const NotificationSchema = new Schema<INotification, INotificationModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['reminder', 'achievement', 'deadline', 'review-due', 'system', 'group-invite'],
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, 'Message cannot exceed 500 characters'],
    },
    actionUrl: {
      type: String,
      trim: true,
      default: null,
    },
    relatedEntityId: {
      type: Schema.Types.ObjectId,
      default: null,
      index: true,
    },
    relatedEntityType: {
      type: String,
      enum: ['Goal', 'Task', 'Session', 'StudyGroup', 'Flashcard'],
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
      default: null,
    },
    scheduledFor: {
      type: Date,
      default: null,
      index: true,
    },
    sent: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Compound Indexes
NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ scheduledFor: 1, sent: 1 });
NotificationSchema.index({ userId: 1, type: 1, isRead: 1 });

// Instance Methods
NotificationSchema.methods.markAsRead = function (): Promise<INotification> {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

NotificationSchema.methods.markAsSent = function (): Promise<INotification> {
  this.sent = true;
  return this.save();
};

// Static methods
NotificationSchema.statics.createNotification = async function (
  userId: mongoose.Types.ObjectId,
  type: string,
  title: string,
  message: string,
  options: {
    actionUrl?: string;
    relatedEntityId?: mongoose.Types.ObjectId;
    relatedEntityType?: string;
    scheduledFor?: Date;
  } = {}
): Promise<INotification> {
  return this.create({
    userId,
    type,
    title,
    message,
    actionUrl: options.actionUrl,
    relatedEntityId: options.relatedEntityId,
    relatedEntityType: options.relatedEntityType,
    scheduledFor: options.scheduledFor,
    sent: !options.scheduledFor, // If not scheduled, mark as sent immediately
  });
};

NotificationSchema.statics.getUnreadCount = async function (
  userId: mongoose.Types.ObjectId
): Promise<number> {
  return this.countDocuments({ userId, isRead: false });
};

NotificationSchema.statics.getUnread = async function (
  userId: mongoose.Types.ObjectId,
  limit: number = 20
): Promise<INotification[]> {
  return this.find({ userId, isRead: false })
    .sort({ createdAt: -1 })
    .limit(limit);
};

NotificationSchema.statics.getAll = async function (
  userId: mongoose.Types.ObjectId,
  limit: number = 50,
  skip: number = 0
): Promise<INotification[]> {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
};

NotificationSchema.statics.markAllAsRead = async function (
  userId: mongoose.Types.ObjectId
) {
  return this.updateMany(
    { userId, isRead: false },
    { $set: { isRead: true, readAt: new Date() } }
  );
};

NotificationSchema.statics.deleteOldNotifications = async function (
  userId: mongoose.Types.ObjectId,
  daysOld: number = 30
) {
  const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
  return this.deleteMany({
    userId,
    isRead: true,
    createdAt: { $lt: cutoffDate },
  });
};

NotificationSchema.statics.getPendingScheduled = async function (): Promise<INotification[]> {
  const now = new Date();
  return this.find({
    sent: false,
    scheduledFor: { $lte: now },
  });
};

NotificationSchema.statics.createReminder = async function (
  userId: mongoose.Types.ObjectId,
  title: string,
  message: string,
  scheduledFor: Date,
  relatedEntityId?: mongoose.Types.ObjectId,
  relatedEntityType?: string
): Promise<INotification> {
  return this.createNotification(userId, 'reminder', title, message, {
    scheduledFor,
    relatedEntityId,
    relatedEntityType,
  });
};

NotificationSchema.statics.createAchievement = async function (
  userId: mongoose.Types.ObjectId,
  title: string,
  message: string,
  relatedEntityId?: mongoose.Types.ObjectId
): Promise<INotification> {
  return this.createNotification(userId, 'achievement', title, message, {
    relatedEntityId,
  });
};

NotificationSchema.statics.createDeadlineWarning = async function (
  userId: mongoose.Types.ObjectId,
  goalTitle: string,
  daysLeft: number,
  goalId: mongoose.Types.ObjectId
): Promise<INotification> {
  return this.createNotification(
    userId,
    'deadline',
    'Deadline Approaching',
    `${goalTitle} deadline is in ${daysLeft} days`,
    {
      actionUrl: `/goals/${goalId}`,
      relatedEntityId: goalId,
      relatedEntityType: 'Goal',
    }
  );
};

// Export with proper typing
export const Notification: INotificationModel =
  (mongoose.models.Notification as INotificationModel) ||
  mongoose.model<INotification, INotificationModel>('Notification', NotificationSchema);