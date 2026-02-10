import mongoose, { Schema, Document, Model, HydratedDocument } from 'mongoose';

// TypeScript Interfaces
export interface IGroupMember {
  userId: mongoose.Types.ObjectId;
  role: 'owner' | 'admin' | 'member';
  joinedAt: Date;
  stats: {
    totalStudyTime: number;
    rank?: number;
  };
}

export interface ILeaderboardEntry {
  userId: mongoose.Types.ObjectId;
  timeStudied: number;
  tasksCompleted: number;
  rank: number;
}

export interface IGroupSettings {
  allowMemberInvite: boolean;
  showLeaderboard: boolean;
  allowGoalSharing: boolean;
  timetablePermissions: 'view-only' | 'edit';
}

// Instance methods interface
export interface IStudyGroupMethods {
  addMember(userId: mongoose.Types.ObjectId, role?: 'admin' | 'member'): void;
  removeMember(userId: mongoose.Types.ObjectId): boolean;
  updateMemberRole(userId: mongoose.Types.ObjectId, newRole: 'admin' | 'member'): boolean;
  isMember(userId: mongoose.Types.ObjectId): boolean;
  getMemberRole(userId: mongoose.Types.ObjectId): string | null;
  updateLeaderboard(): Promise<void>;
}

// Base interface for the document data
export interface IStudyGroupBase {
  name: string;
  description?: string;
  ownerId: mongoose.Types.ObjectId;
  members: mongoose.Types.DocumentArray<IGroupMember>;
  inviteCode: string;
  isPublic: boolean;
  sharedGoals: mongoose.Types.ObjectId[];
  settings: IGroupSettings;
  leaderboard: ILeaderboardEntry[];
  createdAt: Date;
  updatedAt: Date;
}

// Combined interface for Document
export interface IStudyGroup extends IStudyGroupBase, IStudyGroupMethods, Document {
  _id: mongoose.Types.ObjectId;
}

// Progress document interface (for type safety)
export interface IProgress {
  userId: mongoose.Types.ObjectId;
  date: Date;
  timeStudied: number;
  tasksCompleted: number;
}

// Static methods interface
export interface IStudyGroupModel extends Model<IStudyGroup> {
  generateInviteCode(): string;
  findByInviteCode(code: string): Promise<HydratedDocument<IStudyGroup> | null>;
}

// Subdocument Schemas
const GroupMemberSchema = new Schema<IGroupMember>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['owner', 'admin', 'member'],
      default: 'member',
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    stats: {
      totalStudyTime: {
        type: Number,
        default: 0,
        min: 0,
      },
      rank: {
        type: Number,
        min: 1,
      },
    },
  },
  { _id: false }
);

const LeaderboardEntrySchema = new Schema<ILeaderboardEntry>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    timeStudied: {
      type: Number,
      default: 0,
      min: 0,
    },
    tasksCompleted: {
      type: Number,
      default: 0,
      min: 0,
    },
    rank: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

const GroupSettingsSchema = new Schema<IGroupSettings>(
  {
    allowMemberInvite: {
      type: Boolean,
      default: true,
    },
    showLeaderboard: {
      type: Boolean,
      default: true,
    },
    allowGoalSharing: {
      type: Boolean,
      default: true,
    },
    timetablePermissions: {
      type: String,
      enum: ['view-only', 'edit'],
      default: 'view-only',
    },
  },
  { _id: false }
);

// Main StudyGroup Schema
const StudyGroupSchema = new Schema<IStudyGroup, IStudyGroupModel, IStudyGroupMethods>(
  {
    name: {
      type: String,
      required: [true, 'Group name is required'],
      trim: true,
      minlength: [3, 'Group name must be at least 3 characters'],
      maxlength: [100, 'Group name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    members: {
      type: [GroupMemberSchema],
      validate: {
        validator: function (members: IGroupMember[]) {
          return members.length >= 1 && members.length <= 100;
        },
        message: 'Group must have between 1 and 100 members',
      },
    },
    inviteCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      minlength: 6,
      maxlength: 12,
      index: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    sharedGoals: {
      type: [Schema.Types.ObjectId],
      ref: 'Goal',
      default: [],
    },
    settings: {
      type: GroupSettingsSchema,
      default: () => ({}),
    },
    leaderboard: {
      type: [LeaderboardEntrySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
StudyGroupSchema.index({ inviteCode: 1 });
StudyGroupSchema.index({ ownerId: 1 });
StudyGroupSchema.index({ 'members.userId': 1 });
StudyGroupSchema.index({ isPublic: 1 });
StudyGroupSchema.index({ createdAt: -1 });

// Pre-save hook to ensure owner is in members (async version without next())
StudyGroupSchema.pre('save', async function () {
  if (this.isNew) {
    const ownerExists = this.members.some(
      (m: IGroupMember) => m.userId.toString() === this.ownerId.toString()
    );
    
    if (!ownerExists) {
      this.members.push({
        userId: this.ownerId,
        role: 'owner',
        joinedAt: new Date(),
        stats: {
          totalStudyTime: 0,
        },
      } as IGroupMember);
    }
  }
});

// Instance Methods
StudyGroupSchema.methods.addMember = function (
  this: IStudyGroup,
  userId: mongoose.Types.ObjectId,
  role: 'admin' | 'member' = 'member'
): void {
  const exists = this.members.some(
    (m: IGroupMember) => m.userId.toString() === userId.toString()
  );
  
  if (!exists) {
    this.members.push({
      userId,
      role,
      joinedAt: new Date(),
      stats: {
        totalStudyTime: 0,
      },
    } as IGroupMember);
  }
};

StudyGroupSchema.methods.removeMember = function (
  this: IStudyGroup,
  userId: mongoose.Types.ObjectId
): boolean {
  const index = this.members.findIndex(
    (m: IGroupMember) => m.userId.toString() === userId.toString()
  );
  
  if (index !== -1 && this.members[index].role !== 'owner') {
    this.members.splice(index, 1);
    return true;
  }
  
  return false;
};

StudyGroupSchema.methods.updateMemberRole = function (
  this: IStudyGroup,
  userId: mongoose.Types.ObjectId,
  newRole: 'admin' | 'member'
): boolean {
  const member = this.members.find(
    (m: IGroupMember) => m.userId.toString() === userId.toString()
  );
  
  if (member && member.role !== 'owner') {
    member.role = newRole;
    return true;
  }
  
  return false;
};

StudyGroupSchema.methods.isMember = function (
  this: IStudyGroup,
  userId: mongoose.Types.ObjectId
): boolean {
  return this.members.some(
    (m: IGroupMember) => m.userId.toString() === userId.toString()
  );
};

StudyGroupSchema.methods.getMemberRole = function (
  this: IStudyGroup,
  userId: mongoose.Types.ObjectId
): string | null {
  const member = this.members.find(
    (m: IGroupMember) => m.userId.toString() === userId.toString()
  );
  return member ? member.role : null;
};

StudyGroupSchema.methods.updateLeaderboard = async function (
  this: IStudyGroup
): Promise<void> {
  // Check if Progress model exists
  if (!mongoose.models.Progress) {
    console.warn('Progress model not found, skipping leaderboard update');
    return;
  }
  
  const Progress = mongoose.model('Progress');
  
  // Get study time for all members in the last 30 days
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
  interface LeaderboardData {
    userId: mongoose.Types.ObjectId;
    timeStudied: number;
    tasksCompleted: number;
  }
  
  const leaderboardData: LeaderboardData[] = await Promise.all(
    this.members.map(async (member: IGroupMember): Promise<LeaderboardData> => {
      const progressRecords = await Progress.find({
        userId: member.userId,
        date: { $gte: thirtyDaysAgo },
      }).lean<IProgress[]>();
      
      const totalTime = progressRecords.reduce(
        (sum: number, p: IProgress) => sum + (p.timeStudied || 0),
        0
      );
      
      const totalTasks = progressRecords.reduce(
        (sum: number, p: IProgress) => sum + (p.tasksCompleted || 0),
        0
      );
      
      return {
        userId: member.userId,
        timeStudied: totalTime,
        tasksCompleted: totalTasks,
      };
    })
  );
  
  // Sort by time studied (descending)
  leaderboardData.sort((a, b) => b.timeStudied - a.timeStudied);
  
  // Assign ranks
  this.leaderboard = leaderboardData.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  })) as ILeaderboardEntry[];
  
  // Update member stats
  this.members.forEach((member: IGroupMember) => {
    const leaderboardEntry = this.leaderboard.find(
      (e: ILeaderboardEntry) => e.userId.toString() === member.userId.toString()
    );
    if (leaderboardEntry) {
      member.stats.totalStudyTime = leaderboardEntry.timeStudied;
      member.stats.rank = leaderboardEntry.rank;
    }
  });
};

// Static methods
StudyGroupSchema.statics.generateInviteCode = function (): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

StudyGroupSchema.statics.findByInviteCode = async function (
  this: IStudyGroupModel,
  code: string
): Promise<HydratedDocument<IStudyGroup> | null> {
  return this.findOne({ inviteCode: code.toUpperCase() });
};

// Export the model with proper typing for Next.js
export const StudyGroup = 
  (mongoose.models.StudyGroup as IStudyGroupModel) ||
  mongoose.model<IStudyGroup, IStudyGroupModel>('StudyGroup', StudyGroupSchema);

export default StudyGroup;