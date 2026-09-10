import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'default' },
    publicContactEmail: { type: String, trim: true, maxlength: 254, default: 'hello@vignak.solutions' },
    publicPhone: { type: String, trim: true, maxlength: 40, default: '' },
    companyName: { type: String, trim: true, maxlength: 160, default: 'Vignak Solutions' },
  },
  { timestamps: true },
);

export const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
