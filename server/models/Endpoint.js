const mongoose = require('mongoose');

const endpointSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['REST', 'gRPC', 'GraphQL']
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  
  // REST Specific Fields
  restMethod: {
    type: String,
    enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    required: function() { return this.type === 'REST'; }
  },
  
  // GraphQL Specific Fields
  graphqlType: {
    type: String,
    enum: ['Query', 'Mutation', 'Subscription'],
    required: function() { return this.type === 'GraphQL'; }
  },
  
  // gRPC Specific Fields
  grpcService: {
    type: String,
    required: function() { return this.type === 'gRPC'; }
  },
  grpcMethodType: {
    type: String,
    enum: ['Unary', 'Client Streaming', 'Server Streaming', 'Bidirectional Streaming'],
    required: function() { return this.type === 'gRPC'; }
  },

  // Payload specifications
  requestPayload: {
    type: String,
    default: ''
  },
  responsePayload: {
    type: String,
    default: ''
  }
}, { timestamps: true });

endpointSchema.index({ project: 1, type: 1 });

module.exports = mongoose.model('Endpoint', endpointSchema);
