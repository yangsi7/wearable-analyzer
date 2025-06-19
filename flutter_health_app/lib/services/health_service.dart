import 'package:health/health.dart';
import 'package:permission_handler/permission_handler.dart';

class HealthService {
  static final HealthService _instance = HealthService._internal();
  factory HealthService() => _instance;
  HealthService._internal();

  late Health _health;
  bool _isInitialized = false;

  List<HealthDataType> get dataTypes => [
    HealthDataType.HEART_RATE,
    HealthDataType.STEPS,
    HealthDataType.DISTANCE_WALKING_RUNNING,
    HealthDataType.ACTIVE_ENERGY_BURNED,
    HealthDataType.BASAL_ENERGY_BURNED,
    HealthDataType.SLEEP_ASLEEP,
    HealthDataType.SLEEP_AWAKE,
    HealthDataType.SLEEP_IN_BED,
    HealthDataType.BLOOD_PRESSURE_SYSTOLIC,
    HealthDataType.BLOOD_PRESSURE_DIASTOLIC,
    HealthDataType.BLOOD_GLUCOSE,
    HealthDataType.BODY_TEMPERATURE,
    HealthDataType.WEIGHT,
    HealthDataType.HEIGHT,
  ];

  Future<void> initialize() async {
    if (_isInitialized) return;
    
    _health = Health();
    _isInitialized = true;
  }

  Future<bool> requestPermissions() async {
    await initialize();
    
    bool hasPermissions = await _health.hasPermissions(dataTypes, permissions: [
      HealthDataAccess.READ,
    ]) ?? false;

    if (!hasPermissions) {
      hasPermissions = await _health.requestAuthorization(dataTypes, permissions: [
        HealthDataAccess.READ,
      ]);
    }

    return hasPermissions;
  }

  Future<List<HealthDataPoint>> getHealthData({
    required DateTime startDate,
    required DateTime endDate,
    List<HealthDataType>? specificTypes,
  }) async {
    await initialize();
    
    final types = specificTypes ?? dataTypes;
    List<HealthDataPoint> healthData = [];

    try {
      healthData = await _health.getHealthDataFromTypes(
        types: types,
        startTime: startDate,
        endTime: endDate,
      );
    } catch (e) {
      print('Error fetching health data: $e');
    }

    return healthData;
  }

  Future<List<HealthDataPoint>> getHeartRateData({
    required DateTime startDate,
    required DateTime endDate,
  }) async {
    return await getHealthData(
      startDate: startDate,
      endDate: endDate,
      specificTypes: [HealthDataType.HEART_RATE],
    );
  }

  Future<List<HealthDataPoint>> getStepsData({
    required DateTime startDate,
    required DateTime endDate,
  }) async {
    return await getHealthData(
      startDate: startDate,
      endDate: endDate,
      specificTypes: [HealthDataType.STEPS],
    );
  }

  Future<List<HealthDataPoint>> getSleepData({
    required DateTime startDate,
    required DateTime endDate,
  }) async {
    return await getHealthData(
      startDate: startDate,
      endDate: endDate,
      specificTypes: [
        HealthDataType.SLEEP_ASLEEP,
        HealthDataType.SLEEP_AWAKE,
        HealthDataType.SLEEP_IN_BED,
      ],
    );
  }

  Future<double?> getAverageHeartRate({
    required DateTime startDate,
    required DateTime endDate,
  }) async {
    final heartRateData = await getHeartRateData(
      startDate: startDate,
      endDate: endDate,
    );

    if (heartRateData.isEmpty) return null;

    final values = heartRateData
        .map((point) => _convertToDouble(point.value))
        .where((value) => value > 0);

    if (values.isEmpty) return null;

    return values.reduce((a, b) => a + b) / values.length;
  }

  Future<int?> getTotalSteps({
    required DateTime startDate,
    required DateTime endDate,
  }) async {
    final stepsData = await getStepsData(
      startDate: startDate,
      endDate: endDate,
    );

    if (stepsData.isEmpty) return null;

    return stepsData
        .map((point) => _convertToInt(point.value))
        .reduce((a, b) => a + b);
  }

  Future<bool> isHealthConnectAvailable() async {
    await initialize();
    return await _health.isDataTypeAvailable(HealthDataType.STEPS);
  }

  double _convertToDouble(HealthValue value) {
    if (value is NumericHealthValue) {
      return value.numericValue.toDouble();
    }
    return 0.0;
  }

  int _convertToInt(HealthValue value) {
    if (value is NumericHealthValue) {
      return value.numericValue.toInt();
    }
    return 0;
  }
}