#!/bin/bash

# Mobile Build Script (Root Level)
# This script orchestrates: frontend build → capacitor sync → android build

set -e  # Exit on any error

echo "🏗️  Starting integrated mobile build..."

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$SCRIPT_DIR/../server/frontend"
MOBILE_DIR="$SCRIPT_DIR"
ANDROID_DIR="$SCRIPT_DIR/android"

echo "📁 Script directory: $SCRIPT_DIR"
echo "📁 Frontend directory: $FRONTEND_DIR"
echo "📁 Mobile directory: $MOBILE_DIR"
echo "📁 Android directory: $ANDROID_DIR"

# Step 1: Build frontend
echo "🔨 Step 1: Building frontend..."
cd "$FRONTEND_DIR"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

echo "🏗️  Building frontend application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed!"
    exit 1
fi

echo "✅ Frontend build completed successfully"

# Step 2: Sync with Capacitor
echo "🔄 Step 2: Syncing with Capacitor..."
cd "$MOBILE_DIR"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing mobile dependencies..."
    npm install
fi

echo "🔄 Running Capacitor sync..."
npx cap sync android

if [ $? -ne 0 ]; then
    echo "❌ Capacitor sync failed!"
    exit 1
fi

echo "✅ Capacitor sync completed successfully"

# Step 3: Build Android
echo "📱 Step 3: Building Android application..."
cd "$ANDROID_DIR"

echo "🔨 Running Android build with Gradle..."
./gradlew assembleDebug

if [ $? -ne 0 ]; then
    echo "❌ Android build failed!"
    exit 1
fi

echo "✅ Android build completed successfully"

echo "🎉 Complete mobile build pipeline finished successfully!"
echo "📱 Android APK should be available in: $ANDROID_DIR/app/build/outputs/apk/"