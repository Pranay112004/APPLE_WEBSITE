#!/bin/bash

echo "🔧 Starting build process..."

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

# Build frontend
echo "🏗️ Building React frontend..."
npm run build

# Verify build
if [ -d "build" ]; then
    echo "✅ Frontend build successful!"
    echo "📁 Build directory contents:"
    ls -la build/
else
    echo "❌ Frontend build failed!"
    exit 1
fi

echo "🎉 Build process complete!"
