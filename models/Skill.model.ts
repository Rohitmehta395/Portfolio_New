import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISkill extends Document {
  name: string;
  category: 'language' | 'framework' | 'tool' | 'soft-skill';
  proficiency?: number;
  createdAt: Date;
  updatedAt: Date;
}

const SkillSchema = new Schema<ISkill>(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      unique: true,
      index: true,
    },
    category: {
      type: String,
      enum: ['language', 'framework', 'tool', 'soft-skill'],
      required: [true, 'Category is required'],
    },
    proficiency: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

SkillSchema.index({ name: 1 }, { unique: true });

export const Skill: Model<ISkill> =
  mongoose.models.Skill || mongoose.model<ISkill>('Skill', SkillSchema);

export default Skill;
