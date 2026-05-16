const cron = require('node-cron');
const axios = require('axios');
const API = require('../models/API');

const startHealthCheckJob = () => {
  // Run every hour
  cron.schedule('0 * * * *', async () => {
    console.log('[CRON] Starting API Health Check Job...');
    
    try {
      const apis = await API.find({});
      
      const healthChecks = apis.map(async (api) => {
        try {
          const startTime = Date.now();
          // Use GET request as many public APIs reject HEAD requests with 403 or 405
          await axios.get(api.endpointUrl, { timeout: 5000 });
          const latency = Date.now() - startTime;
          
          let status = 'Healthy';
          if (latency > 2000) status = 'Degraded';
          
          return API.findByIdAndUpdate(api._id, { 
            healthStatus: status,
            lastChecked: new Date()
          });
        } catch (error) {
          return API.findByIdAndUpdate(api._id, { 
            healthStatus: 'Down',
            lastChecked: new Date()
          });
        }
      });

      await Promise.all(healthChecks);
      console.log('[CRON] Health Check Job Completed Successfully.');
    } catch (err) {
      console.error('[CRON] Failed to run health checks:', err);
    }
  });
};

module.exports = startHealthCheckJob;
