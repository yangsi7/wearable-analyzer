# Flutter Health App

A Flutter application that integrates with Apple Health (HealthKit) and Google Health Connect to retrieve and display health data including heart rate, steps, sleep, and more.

## Features

- 📱 Cross-platform support (iOS and Android)
- ❤️ Heart rate monitoring
- 👟 Step counting
- 😴 Sleep tracking
- 🔥 Energy/calorie tracking
- 🩺 Blood pressure and glucose monitoring
- ⚖️ Weight and height tracking
- 📊 Real-time health data visualization

## Setup Instructions

### Prerequisites

- Flutter SDK (3.10.0 or higher)
- Dart SDK (3.0.0 or higher)
- iOS: Xcode 14+ for iOS development
- Android: Android Studio with API level 26+ (Android 8.0)

### Installation

1. **Clone or download the project**
   ```bash
   cd flutter_health_app
   ```

2. **Install dependencies**
   ```bash
   flutter pub get
   ```

3. **iOS Setup**
   - Open `ios/Runner.xcworkspace` in Xcode
   - Enable HealthKit capability in your app target
   - Ensure your Apple Developer account has HealthKit enabled
   - The Info.plist already includes required health permissions

4. **Android Setup**
   - Ensure your `android/app/build.gradle` has `minSdkVersion 26` or higher
   - Install Google Health Connect app on your test device
   - The AndroidManifest.xml already includes required health permissions

### Running the App

1. **For iOS (requires physical device with HealthKit)**
   ```bash
   flutter run -d ios
   ```

2. **For Android (requires Health Connect app)**
   ```bash
   flutter run -d android
   ```

## Testing Instructions

### iOS Testing
1. Use a physical iOS device (HealthKit doesn't work in simulator)
2. Ensure the device has some health data (use built-in Health app)
3. Run the app and grant health permissions when prompted
4. The app will display health data from the last 7 days

### Android Testing
1. Install Google Health Connect from Play Store
2. Add some sample health data in Health Connect
3. Run the Flutter app and grant permissions
4. The app will display data from Health Connect

## Permissions

### iOS (HealthKit)
- Heart rate reading
- Step counting
- Distance tracking
- Active and basal energy
- Sleep analysis
- Blood pressure and glucose
- Weight and height

### Android (Health Connect)
- All corresponding health data types
- Automatic permission requests through Health Connect

## Code Structure

```
lib/
├── main.dart                 # Main app entry point and UI
├── services/
│   └── health_service.dart   # Health data service layer
```

## Troubleshooting

### iOS Issues
- **No data showing**: Ensure device has health data and permissions are granted
- **Permission denied**: Check app permissions in Settings > Privacy & Security > Health
- **Build errors**: Ensure HealthKit capability is enabled in Xcode

### Android Issues
- **Health Connect not found**: Install from Play Store
- **No permissions**: Check app permissions in Health Connect settings
- **No data**: Add sample data in Health Connect app

## Key Health Data Types Supported

- Heart Rate (BPM)
- Steps (count)
- Walking/Running Distance (meters)
- Active Energy Burned (calories)
- Basal Energy Burned (calories)
- Sleep data (asleep, awake, in bed)
- Blood Pressure (systolic/diastolic)
- Blood Glucose (mg/dL)
- Body Temperature (°F/°C)
- Weight (kg/lbs)
- Height (cm/inches)

## Dependencies

- `health: ^10.2.0` - Main health data integration
- `permission_handler: ^11.3.1` - Permission management
- `flutter: sdk` - Flutter framework
- `cupertino_icons: ^1.0.2` - iOS-style icons