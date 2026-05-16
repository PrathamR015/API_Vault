const mongoose = require('mongoose');

const apiSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  endpointUrl: { type: String, required: true },
  category: { 
    type: String, 
    required: true
  },
  authType: { 
    type: String, 
    required: true,
    enum: ['OAuth', 'API Key', 'No Auth'] 
  },
  pricing: { 
    type: String, 
    default: 'FREE'
  },
  lastChecked: { type: Date, default: Date.now },
  websiteUrl: { type: String },
  documentationUrl: { type: String },
  rapidApiUrl: { type: String },
  summaryDoc: { type: String },
  githubRepo: { type: String }, // Optional link to source code
  upvotes: { type: Number, default: 0 },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

// Compound index for rapid filtering
apiSchema.index({ category: 1, authType: 1, pricing: 1 });
apiSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('API', apiSchema);
