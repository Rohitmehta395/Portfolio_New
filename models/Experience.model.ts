import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IExperienceRole {
  title: string;
  startDate: Date;
  endDate?: Date | null;
  description: string;
}

export interface IExperience extends Document {
  company: string;
  companyUrl?: string;
  companyLogo?: string;
  roles: IExperienceRole[];
  tags: string[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ExperienceRoleSchema = new Schema<IExperienceRole>(
  {
    title: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, default: null },
    description: { type: String, required: true },
  },
  { _id: false }
);

const ExperienceSchema = new Schema<IExperience>(
  {
    company: {
      type: String,
      required: [true, 'Company name is required'],
    },
    companyUrl: { type: String },
    companyLogo: { type: String },
    roles: {
      type: [ExperienceRoleSchema],
      required: [true, 'At least one role is required'],
    },
    tags: { type: [String], default: [] },
    order: { type: Number, default: 0, index: true },
  },
  {
    timestamps: true,
  }
);

ExperienceSchema.index({ order: 1 });

export const Experience: Model<IExperience> =
  mongoose.models.Experience || mongoose.model<IExperience>('Experience', ExperienceSchema);

export default Experience;
