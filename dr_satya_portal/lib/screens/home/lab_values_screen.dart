import 'package:flutter/material.dart';

class LabValuesScreen extends StatefulWidget {
  const LabValuesScreen({Key? key}) : super(key: key);

  @override
  State<LabValuesScreen> createState() => _LabValuesScreenState();
}

class _LabValuesScreenState extends State<LabValuesScreen>
    with TickerProviderStateMixin {
  late AnimationController _animationController;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Image.asset(
              'assets/logo/KIMS.png',
              width: 40,
              height: 40,
              errorBuilder: (context, error, stackTrace) {
                return Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: const Color(0xFF2E7D32),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: const Icon(
                    Icons.local_hospital,
                    size: 24,
                    color: Colors.white,
                  ),
                );
              },
            ),
            const SizedBox(width: 12),
            const Text(
              'Lab Values',
              style: TextStyle(
                fontStyle: FontStyle.italic,
                fontWeight: FontWeight.bold,
                letterSpacing: 0.5,
              ),
            ),
          ],
        ),
        backgroundColor: const Color(0xFFF5F5F5), // Light background
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'All Tests',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 16),
            // Tacrolimus
            _buildLabTestCard(
              'Tacrolimus (TAC)',
              '8.2',
              'ng/mL',
              'Reference: 5-15 ng/mL',
              'Normal',
              'Jan 15, 2025',
              () => _showTrendModal(context, 'Tacrolimus Level Trend'),
            ),
            const SizedBox(height: 12),
            // C-Reactive Protein
            _buildLabTestCard(
              'C-Reactive Protein',
              '2.1',
              'mg/L',
              'Reference: <3.0 mg/L',
              'Normal',
              'Jan 15, 2025',
              () => _showTrendModal(context, 'C-Reactive Protein Trend'),
            ),
            const SizedBox(height: 12),
            // ALT
            _buildLabTestCard(
              'ALT',
              '28',
              'U/L',
              'Reference: 7-40 U/L',
              'Normal',
              'Jan 15, 2025',
              () => _showTrendModal(context, 'ALT Level Trend'),
            ),
            const SizedBox(height: 12),
            // Bilirubin
            _buildLabTestCard(
              'Bilirubin',
              '0.8',
              'mg/dL',
              'Reference: 0.1-1.2 mg/dL',
              'Normal',
              'Jan 15, 2025',
              () => _showTrendModal(context, 'Bilirubin Level Trend'),
            ),
            const SizedBox(height: 12),
            // Creatinine
            _buildLabTestCard(
              'Creatinine',
              '1.2',
              'mg/dL',
              'Reference: 0.7-1.3 mg/dL',
              'Normal',
              'Jan 15, 2025',
              () => _showTrendModal(context, 'Creatinine Level Trend'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLabTestCard(
    String testName,
    String value,
    String unit,
    String reference,
    String status,
    String date,
    VoidCallback onViewTrend,
  ) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  testName,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color: const Color(0xFF4ECDC4).withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    status,
                    style: const TextStyle(
                      fontSize: 12,
                      color: Color(0xFF4ECDC4),
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              crossAxisAlignment: CrossAxisAlignment.baseline,
              textBaseline: TextBaseline.alphabetic,
              children: [
                Text(
                  value,
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF1B8A8A),
                  ),
                ),
                const SizedBox(width: 4),
                Text(
                  unit,
                  style: const TextStyle(
                    fontSize: 14,
                    color: Colors.grey,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              reference,
              style: const TextStyle(
                fontSize: 12,
                color: Colors.grey,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              date,
              style: const TextStyle(
                fontSize: 12,
                color: Colors.grey,
              ),
            ),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: onViewTrend,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF1B8A8A),
                  padding: const EdgeInsets.symmetric(vertical: 10),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: const Text(
                  'View Trend',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: Colors.white,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showTrendModal(BuildContext context, String testName) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => TrendModalWidget(
        testName: testName,
        onClose: () => Navigator.pop(context),
      ),
    );
  }

  Widget _buildChartBar(int value, int maxValue) {
    final height = (value / maxValue) * 150;
    return Column(
      mainAxisAlignment: MainAxisAlignment.end,
      children: [
        Text(value.toString(), style: const TextStyle(fontSize: 10)),
        const SizedBox(height: 4),
        Container(
          width: 20,
          height: height,
          decoration: BoxDecoration(
            color: const Color(0xFF4ECDC4),
            borderRadius: BorderRadius.circular(4),
          ),
        ),
      ],
    );
  }

  Widget _buildHistoricalRow(
    String date,
    String value,
    String reference,
    String status,
  ) {
    return Container(
      decoration: BoxDecoration(
        border: Border(
          top: BorderSide(color: Colors.grey.shade300),
        ),
      ),
      padding: const EdgeInsets.all(12),
      child: Row(
        children: [
          Expanded(
            child: Text(
              date,
              style: const TextStyle(fontSize: 12, color: Color(0xFF1B8A8A)),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600),
            ),
          ),
          Expanded(
            child: Text(
              reference,
              style: const TextStyle(fontSize: 11, color: Colors.grey),
            ),
          ),
          Expanded(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: status == 'normal'
                    ? const Color(0xFF51CF66).withValues(alpha: 0.2)
                    : const Color(0xFFFF6B6B).withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                status,
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                  color: status == 'normal'
                      ? const Color(0xFF51CF66)
                      : const Color(0xFFFF6B6B),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class TrendModalWidget extends StatefulWidget {
  final String testName;
  final VoidCallback onClose;

  const TrendModalWidget({
    Key? key,
    required this.testName,
    required this.onClose,
  }) : super(key: key);

  @override
  State<TrendModalWidget> createState() => _TrendModalWidgetState();
}

class _TrendModalWidgetState extends State<TrendModalWidget>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _slideAnimation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 500),
      vsync: this,
    );
    _slideAnimation = Tween<double>(begin: 1.0, end: 0.0).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeOut),
    );
    _animationController.forward();
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SlideTransition(
      position: Tween<Offset>(
        begin: const Offset(0, 1),
        end: Offset.zero,
      ).animate(CurvedAnimation(
        parent: _animationController,
        curve: Curves.easeOut,
      )),
      child: Container(
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.only(
            topLeft: Radius.circular(20),
            topRight: Radius.circular(20),
          ),
        ),
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '${widget.testName} Level Trend',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF1B8A8A),
                      ),
                    ),
                    IconButton(
                      onPressed: widget.onClose,
                      icon: const Icon(Icons.close),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                // Animated Chart
                ScaleTransition(
                  scale: Tween<double>(begin: 0.8, end: 1.0).animate(
                    CurvedAnimation(
                      parent: _animationController,
                      curve: const Interval(0.3, 1.0, curve: Curves.easeOut),
                    ),
                  ),
                  child: Container(
                    height: 250,
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.grey.shade300),
                      borderRadius: BorderRadius.circular(8),
                      color: Colors.grey.shade50,
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.end,
                              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                              children: [
                                _buildAnimatedBar(11, 17, 0),
                                _buildAnimatedBar(14, 17, 1),
                                _buildAnimatedBar(16, 17, 2),
                                _buildAnimatedBar(17, 17, 3),
                                _buildAnimatedBar(15, 17, 4),
                                _buildAnimatedBar(12, 17, 5),
                                _buildAnimatedBar(8, 17, 6),
                              ],
                            ),
                          ),
                          const SizedBox(height: 12),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                            children: const [
                              Text('2024-12-18',
                                  style: TextStyle(fontSize: 10)),
                              Text('2024-12-25',
                                  style: TextStyle(fontSize: 10)),
                              Text('2025-01-01',
                                  style: TextStyle(fontSize: 10)),
                              Text('2025-01-08',
                                  style: TextStyle(fontSize: 10)),
                              Text('2025-01-15',
                                  style: TextStyle(fontSize: 10)),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                const Text(
                  'Historical Data',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 12),
                Container(
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.grey.shade300),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Column(
                    children: [
                      Container(
                        color: Colors.grey.shade100,
                        padding: const EdgeInsets.all(12),
                        child: const Row(
                          children: [
                            Expanded(
                              child: Text(
                                'Date',
                                style: TextStyle(fontWeight: FontWeight.bold),
                              ),
                            ),
                            Expanded(
                              child: Text(
                                'Value',
                                style: TextStyle(fontWeight: FontWeight.bold),
                              ),
                            ),
                            Expanded(
                              child: Text(
                                'Reference Range',
                                style: TextStyle(fontWeight: FontWeight.bold),
                              ),
                            ),
                            Expanded(
                              child: Text(
                                'Status',
                                style: TextStyle(fontWeight: FontWeight.bold),
                              ),
                            ),
                          ],
                        ),
                      ),
                      _buildHistoricalRow(
                          '2025-01-15', '8.2', '5-15 ng/mL', 'normal'),
                      _buildHistoricalRow(
                          '2025-01-08', '12.1', '5-15 ng/mL', 'normal'),
                      _buildHistoricalRow(
                          '2025-01-01', '16.8', '5-15 ng/mL', 'high'),
                      _buildHistoricalRow(
                          '2024-12-25', '14.5', '5-15 ng/mL', 'normal'),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildAnimatedBar(int value, int maxValue, int index) {
    final height = (value / maxValue) * 150;
    return ScaleTransition(
      scale: Tween<double>(begin: 0.0, end: 1.0).animate(
        CurvedAnimation(
          parent: _animationController,
          curve: Interval(
            0.1 + (index * 0.1),
            0.5 + (index * 0.1),
            curve: Curves.easeOut,
          ),
        ),
      ),
      alignment: Alignment.bottomCenter,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          Text(value.toString(), style: const TextStyle(fontSize: 10)),
          const SizedBox(height: 4),
          Container(
            width: 20,
            height: height,
            decoration: BoxDecoration(
              color: const Color(0xFF4ECDC4),
              borderRadius: BorderRadius.circular(4),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHistoricalRow(
    String date,
    String value,
    String reference,
    String status,
  ) {
    final isHigh = status.toLowerCase() == 'high';
    return Container(
      decoration: BoxDecoration(
        border: Border(
          bottom: BorderSide(color: Colors.grey.shade200),
        ),
      ),
      padding: const EdgeInsets.all(12),
      child: Row(
        children: [
          Expanded(
            child: Text(
              date,
              style: const TextStyle(fontSize: 12),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          Expanded(
            child: Text(
              reference,
              style: const TextStyle(fontSize: 12),
            ),
          ),
          Expanded(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: isHigh
                    ? const Color(0xFFFF6B6B).withValues(alpha: 0.2)
                    : const Color(0xFF51CF66).withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(4),
              ),
              child: Text(
                status,
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                  color: isHigh
                      ? const Color(0xFFFF6B6B)
                      : const Color(0xFF51CF66),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
