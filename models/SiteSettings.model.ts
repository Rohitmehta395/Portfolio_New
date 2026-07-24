import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISocialLink {
  platform: string;
  url: string;
}

export interface ISeoDefaults {
  title: string;
  description: string;
  ogImage: string;
}

export interface ISiteSettings extends Document {
  resumeUrl?: string;
  socialLinks: ISocialLink[];
  contactEmail?: string;
  seoDefaults?: ISeoDefaults;
  availableForWork: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SocialLinkSchema = new Schema<ISocialLink>(
  {
    platform: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false }
);

const SeoDefaultsSchema = new Schema<ISeoDefaults>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    ogImage: { type: String, required: true },
  },
  { _id: false }
);

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    resumeUrl: { type: String },
    socialLinks: { type: [SocialLinkSchema], default: [] },
    contactEmail: { type: String },
    seoDefaults: { type: SeoDefaultsSchema },
    availableForWork: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings ||
  mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);

export default SiteSettings;
