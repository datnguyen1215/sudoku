# Mobile App Conversion Guide

## Capacitor Native App Conversion 📱

This guide explains how to convert the Sudoku PWA into native iOS and Android applications using Capacitor.

## Prerequisites

### Development Environment
```bash
# Install Capacitor CLI
npm install -g @capacitor/cli

# Install platform dependencies
# iOS: Xcode 12+ (macOS only)
# Android: Android Studio with Android SDK
```

### System Requirements
- **iOS**: macOS with Xcode 12+
- **Android**: Windows/macOS/Linux with Android Studio
- **Node.js**: 16+ LTS version
- **Capacitor**: 4.0+

## Step 1: Initialize Capacitor

```bash
# Navigate to Sudoku project
cd /path/to/sudoku

# Install Capacitor
npm install @capacitor/core @capacitor/cli

# Initialize Capacitor
npx cap init sudoku com.example.sudoku
```

### Configuration
```typescript
// capacitor.config.ts
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.sudoku',
  appName: 'Sudoku',
  webDir: '.svelte-kit/output/client',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#667eea',
      showSpinner: false,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      spinnerColor: '#ffffff'
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#667eea'
    }
  }
};

export default config;
```

## Step 2: Add Mobile Platforms

```bash
# Build the web app first
npm run build

# Add iOS platform (macOS only)
npx cap add ios

# Add Android platform
npx cap add android

# Copy web assets to native projects
npx cap copy

# Update native dependencies
npx cap sync
```

## Step 3: Install Platform Plugins

```bash
# Core plugins for mobile features
npm install @capacitor/splash-screen @capacitor/status-bar @capacitor/haptics @capacitor/device

# Optional plugins for enhanced features
npm install @capacitor/preferences @capacitor/share @capacitor/app @capacitor/keyboard
```

### Update App Configuration
```typescript
// src/lib/capacitor-config.ts
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Haptics } from '@capacitor/haptics';

export async function initializeCapacitor() {
  if (Capacitor.isNativePlatform()) {
    // Configure status bar
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: '#667eea' });
    
    // Hide splash screen
    await SplashScreen.hide();
    
    // Configure haptic feedback
    document.addEventListener('touchstart', async () => {
      if (Capacitor.isNativePlatform()) {
        await Haptics.impact({ style: 'light' });
      }
    });
  }
}
```

## Step 4: Enhance for Mobile

### Update App Layout
```svelte
<!-- src/app.html -->
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <link rel="icon" href="%sveltekit.assets%/favicon.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no" />
  
  <!-- Mobile app meta -->
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  <meta name="mobile-web-app-capable" content="yes" />
  
  <!-- Safe area support -->
  <style>
    :root {
      --safe-area-inset-top: env(safe-area-inset-top);
      --safe-area-inset-bottom: env(safe-area-inset-bottom);
      --safe-area-inset-left: env(safe-area-inset-left);
      --safe-area-inset-right: env(safe-area-inset-right);
    }
  </style>
  
  <title>Sudoku</title>
  %sveltekit.head%
</head>
<body data-sveltekit-preload-data="hover">
  <div style="display: contents">%sveltekit.body%</div>
</body>
</html>
```

### Mobile-Specific Features
```typescript
// src/lib/mobile-features.ts
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Share } from '@capacitor/share';
import { Preferences } from '@capacitor/preferences';

export class MobileFeatures {
  static async hapticFeedback(style: ImpactStyle = ImpactStyle.Light) {
    if (Capacitor.isNativePlatform()) {
      await Haptics.impact({ style });
    }
  }
  
  static async shareScore(time: string, difficulty: string) {
    if (Capacitor.isNativePlatform()) {
      await Share.share({
        title: 'Sudoku Score',
        text: `I solved a ${difficulty} Sudoku in ${time}! 🎉`,
        url: 'https://your-app-url.com',
        dialogTitle: 'Share your Sudoku achievement!'
      });
    }
  }
  
  static async savePreference(key: string, value: string) {
    if (Capacitor.isNativePlatform()) {
      await Preferences.set({ key, value });
    } else {
      localStorage.setItem(key, value);
    }
  }
  
  static async getPreference(key: string): Promise<string | null> {
    if (Capacitor.isNativePlatform()) {
      const { value } = await Preferences.get({ key });
      return value;
    } else {
      return localStorage.getItem(key);
    }
  }
}
```

## Step 5: iOS Configuration

### iOS App Configuration
```xml
<!-- ios/App/App/Info.plist -->
<key>CFBundleDisplayName</key>
<string>Sudoku</string>
<key>CFBundleVersion</key>
<string>1.0.0</string>
<key>CFBundleShortVersionString</key>
<string>1.0.0</string>

<!-- Orientation support -->
<key>UISupportedInterfaceOrientations</key>
<array>
  <string>UIInterfaceOrientationPortrait</string>
  <string>UIInterfaceOrientationLandscapeLeft</string>
  <string>UIInterfaceOrientationLandscapeRight</string>
</array>

<!-- Status bar configuration -->
<key>UIStatusBarStyle</key>
<string>UIStatusBarStyleDefault</string>
<key>UIViewControllerBasedStatusBarAppearance</key>
<true/>
```

### iOS Icons and Launch Screen
```bash
# Create app icons (required sizes)
# 1024x1024 - App Store
# 180x180 - iPhone @3x
# 120x120 - iPhone @2x
# 167x167 - iPad Pro @2x
# 152x152 - iPad @2x
# 76x76 - iPad

# Place in ios/App/App/Assets.xcassets/AppIcon.appiconset/
```

## Step 6: Android Configuration

### Android App Configuration
```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<application
    android:allowBackup="true"
    android:icon="@mipmap/ic_launcher"
    android:label="@string/app_name"
    android:theme="@style/AppTheme.NoActionBarLaunch"
    android:usesCleartextTraffic="true">
    
    <activity
        android:name=".MainActivity"
        android:theme="@style/AppTheme.NoActionBarLaunch"
        android:launchMode="singleTask"
        android:screenOrientation="portrait"
        android:exported="true">
        
        <intent-filter>
            <action android:name="android.intent.action.MAIN" />
            <category android:name="android.intent.category.LAUNCHER" />
        </intent-filter>
    </activity>
</application>
```

### Android Icons
```bash
# Create launcher icons (required sizes)
# 192x192 - xxxhdpi
# 144x144 - xxhdpi  
# 96x96 - xhdpi
# 72x72 - hdpi
# 48x48 - mdpi

# Place in android/app/src/main/res/mipmap-*/
```

## Step 7: Build and Test

### iOS Build
```bash
# Build web app
npm run build

# Copy to native
npx cap copy ios

# Open in Xcode
npx cap open ios

# In Xcode:
# 1. Select your development team
# 2. Choose target device/simulator
# 3. Click Run button
```

### Android Build
```bash
# Build web app
npm run build

# Copy to native
npx cap copy android

# Open in Android Studio
npx cap open android

# In Android Studio:
# 1. Wait for Gradle sync
# 2. Select device/emulator
# 3. Click Run button
```

## Step 8: App Store Deployment

### iOS App Store
1. **Prepare Assets**:
   - App icons (all required sizes)
   - Screenshots (all device sizes)
   - App preview videos (optional)

2. **Xcode Configuration**:
   - Set deployment target (iOS 12+)
   - Configure signing & capabilities
   - Archive and upload to App Store Connect

3. **App Store Connect**:
   - Complete app information
   - Set pricing and availability
   - Submit for review

### Google Play Store
1. **Prepare Assets**:
   - App icons and graphics
   - Screenshots (phone, tablet, TV)
   - Feature graphic

2. **Android Studio**:
   - Generate signed APK/AAB
   - Test on multiple devices
   - Upload to Play Console

3. **Play Console**:
   - Complete store listing
   - Set content rating
   - Submit for review

## Step 9: Advanced Features

### Push Notifications (Optional)
```bash
# Install push notifications plugin
npm install @capacitor/push-notifications

# Configure for iOS and Android
# Requires Firebase setup for Android
# Requires APNs certificates for iOS
```

### In-App Purchases (Optional)
```bash
# Install in-app purchase plugin
npm install @capacitor-community/in-app-purchases

# Configure products in app stores
# Implement purchase logic
```

### Analytics Integration
```typescript
// Add analytics
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';

export async function trackEvent(name: string, parameters?: any) {
  if (Capacitor.isNativePlatform()) {
    await FirebaseAnalytics.logEvent({
      name,
      parameters
    });
  }
}
```

## Performance Optimization

### Native Performance
```typescript
// src/lib/performance.ts
import { Capacitor } from '@capacitor/core';

export function optimizeForNative() {
  if (Capacitor.isNativePlatform()) {
    // Disable pull-to-refresh
    document.body.style.overscrollBehavior = 'none';
    
    // Optimize scrolling
    document.body.style.webkitOverflowScrolling = 'touch';
    
    // Prevent zoom
    document.addEventListener('gesturestart', e => e.preventDefault());
    document.addEventListener('gesturechange', e => e.preventDefault());
  }
}
```

### Bundle Size Optimization
```javascript
// vite.config.ts - Add for native builds
export default defineConfig({
  plugins: [sveltekit()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['svelte'],
          game: ['./src/lib/utils/sudoku-engine.ts']
        }
      }
    }
  }
});
```

## Testing Strategy

### Device Testing
- **iOS**: Test on iPhone (various sizes) and iPad
- **Android**: Test on phones and tablets (different screen densities)
- **Performance**: Test on older devices (2-3 years old)

### Feature Testing
- [ ] Touch interactions work smoothly
- [ ] Haptic feedback functions correctly
- [ ] Status bar styling matches app theme
- [ ] Safe area handling on notched devices
- [ ] App launches quickly (<3 seconds)
- [ ] Offline functionality maintained
- [ ] Game state persists across app lifecycle

## Troubleshooting

### Common Issues
```bash
# iOS build fails
npx cap sync ios
cd ios && pod install && cd ..

# Android build fails
npx cap sync android
# Clean and rebuild in Android Studio

# Web assets not updating
npx cap copy
# Force refresh native projects
```

### Platform-Specific Issues
- **iOS**: Check code signing and provisioning profiles
- **Android**: Verify SDK versions and Gradle configuration
- **Both**: Ensure proper plugin installation and configuration

## Maintenance

### Regular Updates
```bash
# Update Capacitor
npm update @capacitor/core @capacitor/cli

# Update platform projects
npx cap sync

# Rebuild and test
npm run build && npx cap copy
```

### Version Management
- **Semantic Versioning**: Follow semver for releases
- **Platform Versions**: Coordinate web and native versions
- **Update Strategy**: Regular monthly updates

---

**Native App Status: ✅ READY FOR CONVERSION**

The Sudoku PWA is fully prepared for native app conversion:
- Mobile-optimized interface
- Touch-friendly interactions
- Performance optimized
- Offline-capable
- Capacitor-ready architecture

Follow this guide to create native iOS and Android apps from the existing PWA!