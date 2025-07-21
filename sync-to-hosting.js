#!/usr/bin/env node

// Auto-sync service cho mamnonthaonguyenxanh.com
const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.SYNC_PORT || 8080;

app.use(express.json());

// Webhook endpoint để nhận tín hiệu update từ Replit
app.post('/sync-webhook', async (req, res) => {
  const { secret, action } = req.body;
  
  // Verify webhook secret
  if (secret !== process.env.SYNC_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  console.log(`📡 Received sync request: ${action}`);
  
  try {
    switch (action) {
      case 'deploy':
        await deployFromReplit();
        break;
      case 'restart':
        await restartService();
        break;
      default:
        return res.status(400).json({ error: 'Unknown action' });
    }
    
    res.json({ success: true, message: `${action} completed` });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ error: error.message });
  }
});

async function deployFromReplit() {
  return new Promise((resolve, reject) => {
    console.log('🚀 Starting deployment from Replit...');
    
    exec('./deploy-from-replit.sh', (error, stdout, stderr) => {
      if (error) {
        console.error('Deploy error:', error);
        reject(error);
      } else {
        console.log('Deploy output:', stdout);
        resolve();
      }
    });
  });
}

async function restartService() {
  return new Promise((resolve, reject) => {
    console.log('🔄 Restarting application...');
    
    exec('pm2 restart mamnonthaonguyenxanh', (error, stdout, stderr) => {
      if (error) {
        console.error('Restart error:', error);
        reject(error);
      } else {
        console.log('Restart output:', stdout);
        resolve();
      }
    });
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'running', 
    timestamp: new Date().toISOString(),
    service: 'mamnonthaonguyenxanh-sync'
  });
});

app.listen(PORT, () => {
  console.log(`🔄 Sync service running on port ${PORT}`);
  console.log(`📡 Webhook: http://localhost:${PORT}/sync-webhook`);
});