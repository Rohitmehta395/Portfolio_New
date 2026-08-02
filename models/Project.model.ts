import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProject extends Document {
  title: string;
  category: 'website' | 'saas' | 'mobile';
  shortDescription: string;
  coverImage: string;
  gallery: string[];
  techStack: string[];
  liveUrl?: string;
  repoUrl?: string;
  goal?: string;
  contribution?: string;
  outcome?: string;
  featured: boolean;
  order: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    category: {
      type: String,
      enum: ['website', 'saas', 'mobile'],
      required: [true, 'Category is required'],
      index: true,
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
    },
    coverImage: {
      type: String,
      required: [true, 'Cover image is required'],
    },
    gallery: {
      type: [String],
      default: [],
    },
    techStack: {
      type: [String],
      required: [true, 'Tech stack is required'],
    },
    liveUrl: {
      type: String,
    },
    repoUrl: {
      type: String,
    },
    goal: {
      type: String,
    },
    contribution: {
      type: String,
    },
    outcome: {
      type: String,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    published: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

ProjectSchema.index({ category: 1, published: 1, order: 1 });

export const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project;
