import mongoose, { Schema, Document, Model } from 'mongoose';

// TypeScript Interfaces
export interface ISubjectTopic {
  name: string;
  description?: string;
  estimatedHours: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  order: number;
}

export interface ISubjectResource {
  type: 'book' | 'video' | 'article' | 'pdf' | 'website';
  title: string;
  url?: string;
  author?: string;
}

export interface ISubject extends Document {
  _id: mongoose.Types.ObjectId;
  code: string;
  name: string;
  department: string;
  credits: number;
  description?: string;
  semester?: string;
  academicYear?: string;
  instructor?: string;
  
  // Pre-defined topics (syllabus)
  topics: ISubjectTopic[];
  
  // Official resources
  resources: ISubjectResource[];
  
  // Prerequisites
  prerequisites: string[]; // Array of subject codes
  
  // Metadata
  difficulty: 1 | 2 | 3 | 4 | 5;
  estimatedTotalHours: number;
  isActive: boolean;
  
  createdAt: Date;
  updatedAt: Date;

  getTopicByName(topicName: string): ISubjectTopic | undefined;
}

export interface ISubjectModel extends Model<ISubject> {
  findByCode(code: string): Promise<ISubject | null>;
  findByDepartment(department: string): Promise<ISubject[]>;
  searchSubjects(query: string): Promise<ISubject[]>;
}

// Subdocument Schemas
const SubjectTopicSchema = new Schema<ISubjectTopic>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    estimatedHours: {
      type: Number,
      required: true,
      min: 0.5,
      max: 100,
    },
    difficulty: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      required: true,
    },
    order: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

const SubjectResourceSchema = new Schema<ISubjectResource>(
  {
    type: {
      type: String,
      enum: ['book', 'video', 'article', 'pdf', 'website'],
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
    author: {
      type: String,
      trim: true,
      maxlength: 100,
    },
  },
  { _id: false }
);

// Main Subject Schema
const SubjectSchema = new Schema<ISubject>(
  {
    code: {
      type: String,
      required: [true, 'Subject code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      minlength: [3, 'Code must be at least 3 characters'],
      maxlength: [20, 'Code cannot exceed 20 characters'],
      // Example: CS304, MATH201
    },
    name: {
      type: String,
      required: [true, 'Subject name is required'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters'],
      maxlength: [150, 'Name cannot exceed 150 characters'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
      maxlength: 100,
      // Example: Computer Science, Mathematics
    },
    credits: {
      type: Number,
      required: [true, 'Credits are required'],
      min: 1,
      max: 10,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    semester: {
      type: String,
      trim: true,
      // Example: Fall 2024, Spring 2025
    },
    academicYear: {
      type: String,
      trim: true,
      // Example: 2024-2025
    },
    instructor: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    topics: {
      type: [SubjectTopicSchema],
      default: [],
      validate: {
        validator: function (topics: ISubjectTopic[] | undefined) {
          if (!Array.isArray(topics)) return false;
          return topics.length >= 1 && topics.length <= 50;
        },
        message: 'Subject must have between 1 and 50 topics',
      },
    },
    resources: {
      type: [SubjectResourceSchema],
      default: [],
    },
    prerequisites: {
      type: [String],
      default: [],
      // Array of subject codes that must be completed first
    },
    difficulty: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      default: 3,
    },
    estimatedTotalHours: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
SubjectSchema.index({ code: 1 }); // Unique
SubjectSchema.index({ department: 1 });
SubjectSchema.index({ isActive: 1 });
SubjectSchema.index({ semester: 1 });
SubjectSchema.index({ name: 'text', description: 'text' }); // Text search

// Pre-save hook to calculate total hours
SubjectSchema.pre('save', function (this: ISubject) {
  if (this.isModified('topics')) {
    this.estimatedTotalHours = this.topics.reduce(
      (sum, topic) => sum + topic.estimatedHours,
      0
    );
  }
});

// Static methods
SubjectSchema.statics.findByCode = async function (code: string) {
  return this.findOne({ code: code.toUpperCase(), isActive: true });
};

SubjectSchema.statics.findByDepartment = async function (department: string) {
  return this.find({ department, isActive: true }).sort({ code: 1 });
};

SubjectSchema.statics.searchSubjects = async function (query: string) {
  return this.find(
    {
      $text: { $search: query },
      isActive: true,
    },
    { score: { $meta: 'textScore' } }
  ).sort({ score: { $meta: 'textScore' } });
};

// Instance methods
SubjectSchema.methods.getTopicByName = function (this: ISubject, topicName: string) {
  return this.topics.find((t: ISubjectTopic) => t.name === topicName);
};

export const Subject: ISubjectModel =
  (mongoose.models.Subject as ISubjectModel) ||
  mongoose.model<ISubject, ISubjectModel>('Subject', SubjectSchema);