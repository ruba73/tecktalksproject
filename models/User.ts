import mongoose, { Schema, Document, Model } from 'mongoose';
/*you should use interfaces (or types) when:

The object structure is used in multiple places
You want to enforce a contract for function parameters or return values
The shape is complex or needs documentation
You're defining a reusable data model*/
// TypeScript Interfaces
export interface IWeeklyAvailabilitySlot {
  startTime: string;
  endTime: string;
}

export interface IWeeklyAvailability {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  slots: IWeeklyAvailabilitySlot[];
}

export interface IUserProfile {
  schoolLevel?: 'high-school' | 'undergraduate' | 'graduate' | 'professional';// question mark means not required 
  weeklyAvailability: IWeeklyAvailability[];
  preferredSessionLength: 25 | 45 | 60 | 90;
  focusHours: 'morning' | 'afternoon' | 'evening' | 'night' | 'flexible';
  timezone: string;
  language: string;
  /* Map in TypeScript is a built-in data structure that stores key-value pairs, similar to an object but with some important differences.*/
  skillsLevel: Map<string, 'beginner' | 'intermediate' | 'advanced'>;
}

export interface IBreakRules {
  enabled: boolean;
  workDuration: number;
  breakDuration: number;
  longBreak: number;
}

export interface INotificationPreferences {/*Notification settings
  Why: Control how/when user receives alerts*/
  email: boolean;
  push: boolean;
  inApp: boolean;
  reminderMinutesBefore: number;
  dailyReminder: boolean;
  weeklyReport: boolean;
}

export interface IAccessibility {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  reducedMotion: boolean;
}

export interface IUserPreferences {
  maxStudyHoursPerDay: number;
  maxSessionsPerDay: number;
  preferredRestDay: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday' | 'none';
  sessionLength: number;
  breakRules: IBreakRules;
  difficultyBalancing: boolean;
  bufferTime: number;
  notifications: INotificationPreferences;
  accessibility: IAccessibility;
}

export interface IUserStats {
  totalGoals: number;
  completedGoals: number;
  totalStudyTime: number;
  currentStreak: number;
  longestStreak: number;
  totalTasks: number;
  completedTasks: number;
}
//Document:When you create a Mongoose schema and model, the resulting objects aren't just plain JavaScript objects - they have special methods and properties from MongoDB. By extending Document, you tell TypeScript about these extra features.
//for example: save(),delete(),isModified(),etc,,
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;/* User's display name or username
  Why unique: No two users can have the same name (like Twitter handles)
  Example: "john_doe", "alice_smith"
  Used for:
  Displaying in the UI ("Welcome, John!")
  User profiles
  @mentions in study groups*/
  email: string;
  password: string;
  googleId?: string;
  avatar?: string;/*URL to user's profile picture
  Why: Personalization and visual identification
  Example:
  "https://example.com/avatars/user123.jpg"
  "/uploads/avatars/alice.png"
  "https://ui-avatars.com/api/?name=Alice+Smith" (generated avatar)*/
  profile: IUserProfile;
  preferences: IUserPreferences;
  stats: IUserStats;
  onboardingCompleted: boolean;
  onboardingStep?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Subdocument Schemas
const WeeklyAvailabilitySlotSchema = new Schema(
  {
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
  },
  { _id: false }
);

const WeeklyAvailabilitySchema = new Schema(
  {
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      required: true,
    },
    slots: [WeeklyAvailabilitySlotSchema],
  },
  { _id: false }
);

const UserProfileSchema = new Schema(
  {
    schoolLevel: {
      type: String,
      enum: ['high-school', 'undergraduate', 'graduate', 'professional'],
      default: null,
    },
    weeklyAvailability: {
      type: [WeeklyAvailabilitySchema],
      default: [],
    },
    preferredSessionLength: {
      type: Number,
      enum: [25, 45, 60, 90],
      default: 60,
    },
    focusHours: {
      type: String,
      enum: ['morning', 'afternoon', 'evening', 'night', 'flexible'],
      default: 'flexible',
    },
    timezone: {
      type: String,
      default: 'UTC',
    },
    language: {
      type: String,
      default: 'en',
    },
    skillsLevel: {
      type: Map,
      of: String,
      default: new Map(),
    },
  },
  { _id: false }
);

const BreakRulesSchema = new Schema(
  {
    enabled: {
      type: Boolean,
      default: true,
    },
    workDuration: {
      type: Number,
      default: 50,
      min: 15,
      max: 120,
    },
    breakDuration: {
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

const NotificationPreferencesSchema = new Schema(
  {
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: true },
    inApp: { type: Boolean, default: true },
    reminderMinutesBefore: { type: Number, default: 30 },
    dailyReminder: { type: Boolean, default: true },
    weeklyReport: { type: Boolean, default: true },
  },
  { _id: false }
);

const AccessibilitySchema = new Schema(
  {
    darkMode: { type: Boolean, default: false },
    fontSize: {
      type: String,
      enum: ['small', 'medium', 'large'],
      default: 'medium',
    },
    reducedMotion: { type: Boolean, default: false },
  },
  { _id: false }
);

const UserPreferencesSchema = new Schema(
  {
    maxStudyHoursPerDay: {
      type: Number,
      default: 6,
      min: 1,
      max: 16,
    },
    maxSessionsPerDay: {
      type: Number,
      default: 4,
      min: 1,
      max: 10,
    },
    preferredRestDay: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'none'],
      default: 'sunday',
    },
    sessionLength: {
      type: Number,
      default: 60,
    },
    breakRules: {
      type: BreakRulesSchema,
      default: () => ({}),
    },
    difficultyBalancing: {
      type: Boolean,
      default: true,
    },
    bufferTime: {
      type: Number,
      default: 20,
      min: 0,
      max: 50,
    },
    notifications: {
      type: NotificationPreferencesSchema,
      default: () => ({}),
    },
    accessibility: {
      type: AccessibilitySchema,
      default: () => ({}),
    },
  },
  { _id: false }
);

const UserStatsSchema = new Schema(
  {
    totalGoals: { type: Number, default: 0 },
    completedGoals: { type: Number, default: 0 },
    totalStudyTime: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    totalTasks: { type: Number, default: 0 },
    completedTasks: { type: Number, default: 0 },
  },
  { _id: false }
);

// Main User Schema
const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    googleId: {
      type: String,
      sparse: true,
      unique: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    profile: {
      type: UserProfileSchema,
      default: () => ({}),
    },
    preferences: {
      type: UserPreferencesSchema,
      default: () => ({}),
    },
    stats: {
      type: UserStatsSchema,
      default: () => ({}),
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
    onboardingStep: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ googleId: 1 }, { sparse: true });
UserSchema.index({ createdAt: -1 });

// Virtual for goals
UserSchema.virtual('goals', {
  ref: 'Goal',
  localField: '_id',
  foreignField: 'userId',
});

// Methods
UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);