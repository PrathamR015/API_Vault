require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const API = require('./models/API');
const connectDB = require('./config/db');

const parseMarkdownFile = () => {
  const filePath = path.join(__dirname, '../API_List.md');
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  let currentCategory = 'Other';
  const apis = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check if line represents a category header
    if (line.startsWith('###')) {
      currentCategory = line.replace(/^###\s*/, '').trim();
      continue;
    }
    
    // Check if line is a valid table row containing an API entry
    if (line.startsWith('|') && line.includes('[') && line.includes('](')) {
      const parts = line.split('|').map(p => p.trim());
      
      // Expected markdown columns:
      // | [Name](Link) | Description | Auth | HTTPS | CORS |
      // When split by '|', parts index mapping:
      // Index 0: empty string (before first '|')
      // Index 1: API name and URL -> e.g. [AdoptAPet](https://...)
      // Index 2: Description -> e.g. Resource to help get pets adopted
      // Index 3: Auth -> e.g. `apiKey`
      // Index 4: HTTPS -> e.g. Yes
      // Index 5: CORS -> e.g. Yes
      if (parts.length >= 6) {
        const apiPart = parts[1];
        const match = apiPart.match(/\[([^\]]+)\]\(([^)]+)\)/);
        
        if (match) {
          const title = match[1].trim();
          const websiteUrl = match[2].trim();
          const description = parts[2] || 'No description provided.';
          const authRaw = parts[3] || 'No';
          const httpsRaw = parts[4] || 'Unknown';
          const corsRaw = parts[5] || 'Unknown';

          // Standardize Auth Type
          let authType = 'No Auth';
          const authLower = authRaw.toLowerCase();
          if (authLower.includes('apikey') || authLower.includes('key') || authLower.includes('mashape')) {
            authType = 'API Key';
          } else if (authLower.includes('oauth')) {
            authType = 'OAuth';
          }

          // Clean HTTPS and CORS values
          const cleanHttps = httpsRaw.replace(/`/g, '').trim();
          const cleanCors = corsRaw.replace(/`/g, '').trim();

          // We only list APIs that require an API Key to satisfy:
          // "empty the initial dataset of the project to list down the api keys"
          if (authType === 'API Key') {
            apis.push({
              title,
              description,
              endpointUrl: websiteUrl, // used for health checks ping
              category: currentCategory,
              authType: 'API Key',
              pricing: 'FREE',
              https: cleanHttps,
              cors: cleanCors,
              websiteUrl,
              documentationUrl: websiteUrl, // Fallback to main website url
              upvotes: Math.floor(Math.random() * 350) + 50, // default upvotes
              summaryDoc: `This public API is part of the ${currentCategory} category and requires an API Key for access. It provides features for ${description.toLowerCase()} HTTPS encryption support is marked as "${cleanHttps}" and Cross-Origin Resource Sharing (CORS) is "${cleanCors}".`,
            });
          }
        }
      }
    }
  }

  return apis;
};

const seedDB = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await API.deleteMany();
    console.log('Cleared existing database collection...');

    // Parse and process new data
    const processedAPIs = parseMarkdownFile();
    console.log(`Parsed ${processedAPIs.length} API Key endpoints from API_List.md...`);

    // Insert new data
    if (processedAPIs.length > 0) {
      await API.insertMany(processedAPIs);
      console.log(`Successfully seeded database with ${processedAPIs.length} APIs from API_List.md!`);
    } else {
      console.warn('Warning: No APIs parsed from API_List.md matching "API Key" authType.');
    }
    
    process.exit();
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDB();
