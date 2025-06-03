import 'package:flutter/material.dart';
import 'package:health/health.dart';
import 'services/health_service.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Health App',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const HealthHomePage(),
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
              onPressed: _fetchHealthData,
              tooltip: 'Refresh Data',
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