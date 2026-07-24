import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITechnology extends Document {
  name: string;
  icon?: string;
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
      index: true,
    },
    icon: {
      type: String,
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
