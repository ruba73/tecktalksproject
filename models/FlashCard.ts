import mongoose, { Schema, Document, Model } from 'mongoose';

// TypeScript Interfaces
export interface IFlashcard extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  goalId: mongoose.Types.ObjectId;
  topicId?: mongoose.Types.ObjectId;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  easeFactor: number;
  interval: number;
  repetitions: number;
  lastReviewed?: Date;
  nextReview: Date;
  reviewCount: number;
  correctCount: number;
  incorrectCount: number;
  averageResponseTime?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Main Flashcard Schema
const FlashcardSchema = new Schema<IFlashcard>(
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
    topicId: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    front: {
      type: String,
      required: [true, 'Front of card is required'],
      trim: true,
      minlength: [3, 'Question must be at least 3 characters'],
      maxlength: [500, 'Question cannot exceed 500 characters'],
    },
    back: {
      type: String,
      required: [true, 'Back of card is required'],
      trim: true,
      minlength: [3, 'Answer must be at least 3 characters'],
      maxlength: [1000, 'Answer cannot exceed 1000 characters'],
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (tags: string[]) {
          return tags.length <= 10;
        },
        message: 'Cannot have more than 10 tags',
      },
    },
    // SM-2 Algorithm fields
    easeFactor: {
      type: Number,
      default: 2.5,
      min: 1.3,
      max: 3.0,
    },
    interval: {
      type: Number,
      default: 1,
      min: 1,
    },
    repetitions: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastReviewed: {
      type: Date,
      default: null,
    },
    nextReview: {
      type: Date,
      required: true,
      index: true,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    correctCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    incorrectCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    averageResponseTime: {
      type: Number,
      default: null,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
FlashcardSchema.index({ userId: 1, goalId: 1 });
FlashcardSchema.index({ nextReview: 1 });
FlashcardSchema.index({ userId: 1, nextReview: 1 });
FlashcardSchema.index({ tags: 1 });
FlashcardSchema.index({ difficulty: 1 });

// Methods - SM-2 Algorithm Implementation
FlashcardSchema.methods.review = function (
  quality: number,
  responseTime?: number
): void {
  // quality: 0-5 (0=total blackout, 5=perfect response)
  
  this.reviewCount += 1;
  this.lastReviewed = new Date();
  
  if (quality >= 3) {
    this.correctCount += 1;
  } else {
    this.incorrectCount += 1;
  }
  
  // Update average response time
  if (responseTime) {
    if (this.averageResponseTime) {
      this.averageResponseTime =
        (this.averageResponseTime * (this.reviewCount - 1) + responseTime) /
        this.reviewCount;
    } else {
      this.averageResponseTime = responseTime;
    }
  }
  
  // SM-2 Algorithm
  if (quality >= 3) {
    if (this.repetitions === 0) {
      this.interval = 1;
    } else if (this.repetitions === 1) {
      this.interval = 6;
    } else {
      this.interval = Math.round(this.interval * this.easeFactor);
    }
    this.repetitions += 1;
  } else {
    this.repetitions = 0;
    this.interval = 1;
  }
  
  // Update ease factor
  this.easeFactor = Math.max(
    1.3,
    this.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );
  
  // Set next review date
  this.nextReview = new Date(Date.now() + this.interval * 24 * 60 * 60 * 1000);
};

FlashcardSchema.methods.getDueStatus = function (): 'overdue' | 'due' | 'upcoming' {
  const now = new Date();
  const diffHours = (this.nextReview.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  if (diffHours < 0) return 'overdue';
  if (diffHours < 24) return 'due';
  return 'upcoming';
};

// Static methods
FlashcardSchema.statics.getDueCards = async function (
  userId: mongoose.Types.ObjectId,
  goalId?: mongoose.Types.ObjectId
) {
  const query: {
    userId: mongoose.Types.ObjectId;
    nextReview: { $lte: Date };
    goalId?: mongoose.Types.ObjectId;
  } = {
    userId,
    nextReview: { $lte: new Date() },
  };

  if (goalId) {
    query.goalId = goalId;
  }

  return this.find(query).sort({ nextReview: 1 });
};

FlashcardSchema.statics.getCardsByDifficulty = async function (
  userId: mongoose.Types.ObjectId,
  difficulty: string
) {
  return this.find({ userId, difficulty });
};

export const Flashcard: Model<IFlashcard> =
  mongoose.models.Flashcard ||
  mongoose.model<IFlashcard>('Flashcard', FlashcardSchema);