import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import '../../../common/widgets/metric_card.dart';
import '../../../services/health_service.dart';

class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  final HealthService _healthService = HealthService();
  DateTime _selectedDate = DateTime.now();
  bool _isLoading = false;
  String _dataQuality = "Good";
  
  final Map<String, dynamic> _mockData = {
    'heartRate': {'value': 72, 'status': 'Normal', 'trend': 2.3},
    'afib': {'burden': 0.2, 'episodes': 3, 'status': 'Low'},
    'pauses': {'count': 12, 'longest': 2.3, 'status': 'Normal'},
    'avBlocks': {'count': 0, 'status': 'None'},
    'steps': {'count': 8420, 'goal': 10000},
    'sleep': {'duration': 7.5, 'quality': 'Good'},
  };

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);
    
    try {
      if (kIsWeb) {
        await Future.delayed(const Duration(milliseconds: 500));
      } else {
        await _healthService.initialize();
      }
    } catch (e) {
      debugPrint('Error loading data: $e');
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  Future<void> _selectDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime.now().subtract(const Duration(days: 365)),
      lastDate: DateTime.now(),
    );
    
    if (picked != null && picked != _selectedDate) {
      setState(() => _selectedDate = picked);
      _loadData();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Health Dashboard'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        actions: [
          IconButton(
            icon: const Icon(Icons.person),
            onPressed: () => Navigator.of(context).pushNamed('/profile'),
          ),
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () => Navigator.of(context).pushNamed('/settings'),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadData,
        child: _isLoading
            ? const Center(child: CircularProgressIndicator())
            : CustomScrollView(
                slivers: [
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          _buildDateSelector(),
                          const SizedBox(height: 16),
                          _buildDataQualityCard(),
                          const SizedBox(height: 24),
                          Text(
                            'Health Metrics',
                            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                        ],
                      ),
                    ),
                  ),
                  SliverPadding(
                    padding: const EdgeInsets.symmetric(horizontal: 16.0),
                    sliver: SliverGrid(
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        childAspectRatio: 1.2,
                        crossAxisSpacing: 12,
                        mainAxisSpacing: 12,
                      ),
                      delegate: SliverChildListDelegate([
                        _buildHeartRateCard(),
                        _buildAfibCard(),
                        _buildPausesCard(),
                        _buildAVBlocksCard(),
                      ]),
                    ),
                  ),
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const SizedBox(height: 16),
                          Text(
                            'Activity & Wellness',
                            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          Row(
                            children: [
                              Expanded(child: _buildStepsCard()),
                              const SizedBox(width: 12),
                              Expanded(child: _buildSleepCard()),
                            ],
                          ),
                          const SizedBox(height: 24),
                          _buildInsightsCard(),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => Navigator.of(context).pushNamed('/chat'),
        icon: const Icon(Icons.chat),
        label: const Text('Ask AI'),
      ),
    );
  }

  Widget _buildDateSelector() {
    return Card(
      child: InkWell(
        onTap: _selectDate,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Row(
            children: [
              const Icon(Icons.calendar_today, color: Colors.blue),
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Selected Date',
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: Colors.grey[600],
                    ),
                  ),
                  Text(
                    '${_selectedDate.day}/${_selectedDate.month}/${_selectedDate.year}',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
              const Spacer(),
              const Icon(Icons.arrow_forward_ios, size: 16),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDataQualityCard() {
    return Card(
      color: Colors.green.shade50,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          children: [
            Icon(Icons.check_circle, color: Colors.green.shade600),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Data Quality: $_dataQuality',
                    style: Theme.of(context).textTheme.titleSmall?.copyWith(
                      fontWeight: FontWeight.w600,
                      color: Colors.green.shade800,
                    ),
                  ),
                  Text(
                    'All sensors are working properly',
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: Colors.green.shade700,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeartRateCard() {
    final data = _mockData['heartRate'] as Map<String, dynamic>;
    return MetricCard(
      title: 'Heart Rate',
      value: '${data['value']}',
      unit: 'bpm',
      subtitle: 'Average today',
      icon: Icons.favorite,
      iconColor: Colors.red,
      status: MetricStatus.normal,
      statusText: data['status'],
      trend: TrendIndicator(value: data['trend'], isPositiveGood: false),
      onTap: () => Navigator.of(context).pushNamed('/heart-rate-details'),
    );
  }

  Widget _buildAfibCard() {
    final data = _mockData['afib'] as Map<String, dynamic>;
    return MetricCard(
      title: 'AFib Burden',
      value: '${data['burden']}%',
      subtitle: '${data['episodes']} episodes',
      icon: Icons.monitor_heart,
      iconColor: Colors.orange,
      status: MetricStatus.normal,
      statusText: data['status'],
      onTap: () => Navigator.of(context).pushNamed('/afib-details'),
    );
  }

  Widget _buildPausesCard() {
    final data = _mockData['pauses'] as Map<String, dynamic>;
    return MetricCard(
      title: 'Heart Pauses',
      value: '${data['count']}',
      subtitle: 'Longest: ${data['longest']}s',
      icon: Icons.pause_circle,
      iconColor: Colors.blue,
      status: MetricStatus.normal,
      statusText: data['status'],
      onTap: () => Navigator.of(context).pushNamed('/pauses-details'),
    );
  }

  Widget _buildAVBlocksCard() {
    final data = _mockData['avBlocks'] as Map<String, dynamic>;
    return MetricCard(
      title: 'AV Blocks',
      value: '${data['count']}',
      subtitle: 'Today',
      icon: Icons.block,
      iconColor: Colors.purple,
      status: MetricStatus.normal,
      statusText: data['status'],
      onTap: () => Navigator.of(context).pushNamed('/av-blocks-details'),
    );
  }

  Widget _buildStepsCard() {
    final data = _mockData['steps'] as Map<String, dynamic>;
    final progress = (data['count'] as int) / (data['goal'] as int);
    
    return MetricCard(
      title: 'Steps',
      value: '${data['count']}',
      subtitle: '${(progress * 100).round()}% of goal',
      icon: Icons.directions_walk,
      iconColor: Colors.green,
      status: progress >= 0.8 ? MetricStatus.normal : MetricStatus.warning,
    );
  }

  Widget _buildSleepCard() {
    final data = _mockData['sleep'] as Map<String, dynamic>;
    return MetricCard(
      title: 'Sleep',
      value: '${data['duration']}h',
      subtitle: data['quality'],
      icon: Icons.bedtime,
      iconColor: Colors.indigo,
      status: MetricStatus.normal,
    );
  }

  Widget _buildInsightsCard() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.lightbulb, color: Colors.amber.shade600),
                const SizedBox(width: 8),
                Text(
                  'Today\'s Insights',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            _buildInsightItem(
              'Your heart rate shows normal variation today',
              Icons.check_circle,
              Colors.green,
            ),
            _buildInsightItem(
              'Consider increasing your step count by 15%',
              Icons.trending_up,
              Colors.blue,
            ),
            _buildInsightItem(
              'Sleep quality is excellent - keep it up!',
              Icons.star,
              Colors.amber,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInsightItem(String text, IconData icon, Color color) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        children: [
          Icon(icon, size: 16, color: color),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              text,
              style: Theme.of(context).textTheme.bodyMedium,
            ),
          ),
        ],
      ),
    );
  }
}