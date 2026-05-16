require('dotenv').config();
const mongoose = require('mongoose');
const API = require('./models/API');
const connectDB = require('./config/db');
const rawData = require('../dataset_rapidAPI-scraper_2026-05-02_19-13-47-972 (1).json');

const processData = (data) => {
  return data.map(item => ({
    title: item.title || item.name || 'Untitled API',
    description: item.description || 'No description provided.',
    endpointUrl: `https://${item.name}.p.rapidapi.com`,
    category: (item.categories && item.categories.length > 0 && item.categories[0]) ? item.categories[0] : 'Other',
    authType: 'API Key', // Default for RapidAPI
    pricing: item.currentPricingInfo?.pricingModel || 'FREE',
    upvotes: Math.floor(Math.random() * 500),
    websiteUrl: `https://${(item.name || 'api').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}.com`,
    documentationUrl: `https://${(item.name || 'api').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}.com/docs`,
    rapidApiUrl: `https://rapidapi.com/${item.username}/api/${item.name}`,
    summaryDoc: `This API provides endpoints for ${item.title || item.name}. It follows a ${item.currentPricingInfo?.pricingModel || 'FREEMIUM'} pricing model. It allows integration into your applications efficiently.`,
  }));
};

const seedDB = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await API.deleteMany();
    console.log('Cleared existing APIs...');

    const processedAPIs = processData(rawData);
    
    // Insert sample data
    await API.insertMany(processedAPIs);
    console.log(`Successfully seeded database with ${processedAPIs.length} APIs from dataset!`);
    
    process.exit();
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDB();
