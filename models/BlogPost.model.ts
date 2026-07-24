import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  contentMdx: string;
  coverImage?: string;
  tags: string[];
  published: boolean;
  publishedAt?: Date;
  readTimeMinutes?: number;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      index: true,
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
    },
    contentMdx: {
      type: String,
      required: [true, 'MDX Content is required'],
    },
    coverImage: {
      type: String,
    },
    tags: {
      type: [String],
      default: [],
    },
    published: {
      type: Boolean,
      default: false,
      index: true,
    },
    publishedAt: {
      type: Date,
    },
    readTimeMinutes: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

BlogPostSchema.index({ published: 1, publishedAt: -1 });

export const BlogPost: Model<IBlogPost> =
  mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);

export default BlogPost;
