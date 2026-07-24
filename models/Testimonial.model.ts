import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ITestimonial extends Document {
  authorName: string;
  authorRole?: string;
  authorCompany?: string;
  authorImage?: string;
  quote: string;
  projectRef?: Types.ObjectId;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    authorName: {
      type: String,
      required: [true, 'Author name is required'],
    },
    authorRole: { type: String },
    authorCompany: { type: String },
    authorImage: { type: String },
    quote: {
      type: String,
      required: [true, 'Quote is required'],
    },
    projectRef: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
    },
    order: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const Testimonial: Model<ITestimonial> =
  mongoose.models.Testimonial ||
  mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);

export default Testimonial;
