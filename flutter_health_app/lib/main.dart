import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:health/health.dart';
import 'features/auth/presentation/login_page.dart';
import 'features/auth/presentation/signup_page.dart';
import 'features/dashboard/presentation/dashboard_page.dart';
import 'features/chat/presentation/chat_page.dart';
import 'services/health_service.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Health Monitoring App',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
        appBarTheme: AppBarTheme(
          centerTitle: true,
          elevation: 0,
          backgroundColor: Colors.transparent,
          foregroundColor: Colors.blue.shade700,
        ),
        cardTheme: CardTheme(
          elevation: 2,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            padding: const EdgeInsets.symmetric(vertical: 12),
          ),
        ),
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => const AuthCheckPage(),
        '/login': (context) => const LoginPage(),
        '/signup': (context) => const SignUpPage(),
        '/dashboard': (context) => const DashboardPage(),
        '/chat': (context) => const ChatPage(),
        '/legacy': (context) => const HealthHomePage(),
      },
    );
  }
}

class AuthCheckPage extends StatefulWidget {
  const AuthCheckPage({super.key});

  @override
  State<AuthCheckPage> createState() => _AuthCheckPageState();
}

class _AuthCheckPageState extends State<AuthCheckPage> {
  @override
  void initState() {
    super.initState();
    _checkAuth();
  }

  Future<void> _checkAuth() async {
    await Future.delayed(const Duration(seconds: 1));
    
    if (mounted) {
      Navigator.of(context).pushReplacementNamed('/dashboard');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.health_and_safety,
              size: 80,
              color: Theme.of(context).primaryColor,
            ),
            const SizedBox(height: 24),
            Text(
              'Health Monitor',
              style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            const CircularProgressIndicator(),
          ],
        ),
      ),
    );
  }
}

class HealthHomePage extends StatefulWidget {
  const HealthHomePage({super.key});

  @override
  State<HealthHomePage> createState() => _HealthHomePageState();
}

class _HealthHomePageState extends State<HealthHomePage> {
  final HealthService _healthService = HealthService();
  bool _isLoading = false;
  bool _hasPermissions = false;
  String _status = 'Not initialized';
  
  List<HealthDataPoint> _healthData = [];
  double? _averageHeartRate;
  int? _totalSteps;

  @override
  void initState() {
    super.initState();
    _initializeHealth();
  }

  Future<void> _initializeHealth() async {
    setState(() {
      _isLoading = true;
      _status = 'Initializing...';
    });

    try {
      if (kIsWeb) {
        setState(() {
          _status = 'Web platform detected. Health data not available on web. Use mobile app for real health data.';
          _hasPermissions = false;
        });
        _showMockData();
        return;
      }

      await _healthService.initialize();
      setState(() {
        _status = 'Initialized. Requesting permissions...';
      });

      final hasPermissions = await _healthService.requestPermissions();
      setState(() {
        _hasPermissions = hasPermissions;
        _status = hasPermissions 
            ? 'Permissions granted. Ready to fetch data.'
            : 'Permissions denied. Please grant health permissions in settings.';
      });

      if (hasPermissions) {
        await _fetchHealthData();
      }
    } catch (e) {
      setState(() {
        _status = 'Error: $e';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _fetchHealthData() async {
    setState(() {
      _isLoading = true;
      _status = 'Fetching health data...';
    });

    try {
      final endDate = DateTime.now();
      final startDate = endDate.subtract(const Duration(days: 7));

      final healthData = await _healthService.getHealthData(
        startDate: startDate,
        endDate: endDate,
      );

      final averageHeartRate = await _healthService.getAverageHeartRate(
        startDate: startDate,
        endDate: endDate,
      );

      final totalSteps = await _healthService.getTotalSteps(
        startDate: startDate,
        endDate: endDate,
      );

      setState(() {
        _healthData = healthData;
        _averageHeartRate = averageHeartRate;
        _totalSteps = totalSteps;
        _status = 'Data loaded successfully (${healthData.length} data points)';
      });
    } catch (e) {
      setState(() {
        _status = 'Error fetching data: $e';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _showMockData() {
    setState(() {
      _hasPermissions = true;
      _averageHeartRate = 72.5;
      _totalSteps = 8420;
      _healthData = _generateMockHealthData();
    });
  }

  List<HealthDataPoint> _generateMockHealthData() {
    final now = DateTime.now();
    return [
      HealthDataPoint(
        value: NumericHealthValue(numericValue: 72),
        type: HealthDataType.HEART_RATE,
        unit: HealthDataUnit.BEATS_PER_MINUTE,
        dateFrom: now.subtract(const Duration(hours: 1)),
        dateTo: now.subtract(const Duration(hours: 1)),
        sourcePlatform: HealthPlatformType.appleHealth,
        sourceDeviceId: 'mock-device',
        sourceId: 'mock-source',
        sourceName: 'Mock Health Data',
      ),
      HealthDataPoint(
        value: NumericHealthValue(numericValue: 1500),
        type: HealthDataType.STEPS,
        unit: HealthDataUnit.COUNT,
        dateFrom: now.subtract(const Duration(hours: 2)),
        dateTo: now.subtract(const Duration(hours: 1)),
        sourcePlatform: HealthPlatformType.googleFit,
        sourceDeviceId: 'mock-device',
        sourceId: 'mock-source',
        sourceName: 'Mock Health Data',
      ),
    ];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: const Text('Flutter Health App'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Status',
                      style: Theme.of(context).textTheme.headlineSmall,
                    ),
                    const SizedBox(height: 8),
                    Text(_status),
                    const SizedBox(height: 8),
                    if (_isLoading)
                      const Center(child: CircularProgressIndicator()),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            if (_hasPermissions) ...[
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Health Summary (Last 7 Days)',
                        style: Theme.of(context).textTheme.headlineSmall,
                      ),
                      const SizedBox(height: 16),
                      Row(
                        children: [
                          Expanded(
                            child: _buildMetricCard(
                              'Average Heart Rate',
                              _averageHeartRate != null 
                                  ? '${_averageHeartRate!.toStringAsFixed(1)} bpm'
                                  : 'No data',
                              Icons.favorite,
                              Colors.red,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: _buildMetricCard(
                              'Total Steps',
                              _totalSteps != null 
                                  ? _totalSteps!.toString()
                                  : 'No data',
                              Icons.directions_walk,
                              Colors.blue,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      _buildMetricCard(
                        'Total Data Points',
                        _healthData.length.toString(),
                        Icons.data_usage,
                        Colors.green,
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Expanded(
                child: Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Recent Health Data',
                          style: Theme.of(context).textTheme.headlineSmall,
                        ),
                        const SizedBox(height: 8),
                        Expanded(
                          child: _healthData.isEmpty
                              ? const Center(
                                  child: Text('No health data available'),
                                )
                              : ListView.builder(
                                  itemCount: _healthData.length > 50 ? 50 : _healthData.length,
                                  itemBuilder: (context, index) {
                                    final dataPoint = _healthData[index];
                                    return ListTile(
                                      title: Text(dataPoint.type.name),
                                      subtitle: Text(
                                        '${dataPoint.value} ${dataPoint.unit.name}\n${dataPoint.dateFrom.toString().split('.')[0]}',
                                      ),
                                      leading: _getIconForDataType(dataPoint.type),
                                    );
                                  },
                                ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
      floatingActionButton: _hasPermissions
          ? FloatingActionButton(
              onPressed: kIsWeb ? _showMockData : _fetchHealthData,
              tooltip: kIsWeb ? 'Refresh Mock Data' : 'Refresh Data',
              child: const Icon(Icons.refresh),
            )
          : FloatingActionButton(
              onPressed: _initializeHealth,
              tooltip: 'Request Permissions',
              child: const Icon(Icons.health_and_safety),
            ),
    );
  }

  Widget _buildMetricCard(String title, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 32),
          const SizedBox(height: 8),
          Text(
            title,
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w500,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Icon _getIconForDataType(HealthDataType type) {
    switch (type) {
      case HealthDataType.HEART_RATE:
        return const Icon(Icons.favorite, color: Colors.red);
      case HealthDataType.STEPS:
        return const Icon(Icons.directions_walk, color: Colors.blue);
      case HealthDataType.DISTANCE_WALKING_RUNNING:
        return const Icon(Icons.straighten, color: Colors.orange);
      case HealthDataType.ACTIVE_ENERGY_BURNED:
      case HealthDataType.BASAL_ENERGY_BURNED:
        return const Icon(Icons.local_fire_department, color: Colors.orange);
      case HealthDataType.SLEEP_ASLEEP:
      case HealthDataType.SLEEP_AWAKE:
      case HealthDataType.SLEEP_IN_BED:
        return const Icon(Icons.bedtime, color: Colors.purple);
      case HealthDataType.WEIGHT:
        return const Icon(Icons.monitor_weight, color: Colors.green);
      case HealthDataType.HEIGHT:
        return const Icon(Icons.height, color: Colors.teal);
      default:
        return const Icon(Icons.health_and_safety, color: Colors.grey);
    }
  }
}