#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 MoodLift AI Backend Startup Script');
console.log('=====================================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('⚠️  No .env file found. Creating from template...');
  
  const envExample = fs.readFileSync(path.join(__dirname, 'env.example'), 'utf8');
  fs.writeFileSync(envPath, envExample);
  
  console.log('✅ .env file created from template');
  console.log('📝 Please edit .env file with your actual configuration values\n');
}

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 Installing dependencies...');
  
  const install = spawn('npm', ['install'], { 
    stdio: 'inherit',
    shell: true 
  });
  
  install.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Dependencies installed successfully\n');
      startServer();
    } else {
      console.log('❌ Failed to install dependencies');
      process.exit(1);
    }
  });
} else {
  console.log('✅ Dependencies already installed\n');
  startServer();
}

function startServer() {
  console.log('🌐 Starting MoodLift AI Backend...');
  console.log('📱 Server will be available at: http://localhost:5000');
  console.log('🔗 Health check: http://localhost:5000/health');
  console.log('📚 API documentation: Check backend/README.md\n');
  
  const server = spawn('npm', ['run', 'dev'], { 
    stdio: 'inherit',
    shell: true 
  });
  
  server.on('close', (code) => {
    console.log(`\n🛑 Server stopped with code ${code}`);
  });
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    server.kill('SIGINT');
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down server...');
    server.kill('SIGTERM');
    process.exit(0);
  });
} 