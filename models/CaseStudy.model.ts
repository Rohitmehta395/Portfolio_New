import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ICaseStudyImage {
  url: string;
  caption: string;
}

export interface ICaseStudyMetric {
  label: string;
  value: string;
}

export interface ICaseStudy extends Document {
  projectRef: Types.ObjectId;
  problem?: string;
  approach?: string;
  solution?: string;
  results?: string;
  images: ICaseStudyImage[];
  metrics: ICaseStudyMetric[];
  createdAt: Date;
  updatedAt: Date;
}

const ImageSchema = new Schema<ICaseStudyImage>(
  {
    url: { type: String, required: true },
    caption: { type: String, required: true },
  },
  { _id: false }
);

const MetricSchema = new Schema<ICaseStudyMetric>(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

const CaseStudySchema = new Schema<ICaseStudy>(
  {
    projectRef: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project reference is required'],
      unique: true,
    },
    problem: { type: String },
    approach: { type: String },
    solution: { type: String },
    results: { type: String },
    images: { type: [ImageSchema], default: [] },
    metrics: { type: [MetricSchema], default: [] },
  },
  {
    timestamps: true,
  }
);


export const CaseStudy: Model<ICaseStudy> =
  mongoose.models.CaseStudy || mongoose.model<ICaseStudy>('CaseStudy', CaseStudySchema);

export default CaseStudy;
