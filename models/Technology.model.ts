import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITechnology extends Document {
  name: string;
  icon?: string;
  order?: number;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'mobile';
  createdAt: Date;
  updatedAt: Date;
}

const TechnologySchema = new Schema<ITechnology>(
  {
    name: {
      type: String,
      required: [true, 'Technology name is required'],
      unique: true,
    },
    icon: {
      type: String,
    },
    order: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      enum: ['frontend', 'backend', 'database', 'devops', 'mobile'],
      required: [true, 'Category is required'],
    },
  },
  {
    timestamps: true,
  }
);


export const Technology: Model<ITechnology> =
  mongoose.models.Technology || mongoose.model<ITechnology>('Technology', TechnologySchema);

export default Technology;
