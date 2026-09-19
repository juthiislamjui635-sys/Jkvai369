import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';

class RoomManagementScreen extends StatefulWidget {
  final bool isCreateMode;

  const RoomManagementScreen({
    super.key,
    required this.isCreateMode,
  });

  @override
  State<RoomManagementScreen> createState() => _RoomManagementScreenState();
}

class _RoomManagementScreenState extends State<RoomManagementScreen> {
  final TextEditingController _codeController = TextEditingController();
  int _selectedPlayers = 4;
  int _entryFee = 500;

  @override
  void dispose() {
    _codeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          widget.isCreateMode ? 'Create Private Room' : 'Join Game Room',
          style: const TextStyle(fontWeight: FontWeight.w800),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: widget.isCreateMode
            ? _buildCreateView(context, isDark)
            : _buildJoinView(context, isDark),
      ),
    );
  }

  Widget _buildCreateView(BuildContext context, bool isDark) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'TABLE CONFIGURATION',
          style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, letterSpacing: 1.2, color: Colors.grey),
        ),
        const SizedBox(height: 12),
        Card(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Select Player Count', style: TextStyle(fontWeight: FontWeight.w700)),
                const SizedBox(height: 12),
                Row(
                  children: [2, 4].map((count) {
                    final isSelected = _selectedPlayers == count;
                    return Expanded(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 4),
                        child: ChoiceChip(
                          label: Center(
                            child: Text(
                              '$count Players',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                color: isSelected ? Colors.black : (isDark ? Colors.white : Colors.black87),
                              ),
                            ),
                          ),
                          selected: isSelected,
                          selectedColor: AppColors.primaryGold,
                          onSelected: (val) {
                            if (val) setState(() => _selectedPlayers = count);
                          },
                        ),
                      ),
                    );
                  }).toList(),
                ),
                const SizedBox(height: 18),
                const Text('Entry Fee (Coins)', style: TextStyle(fontWeight: FontWeight.w700)),
                const SizedBox(height: 10),
                Wrap(
                  spacing: 8,
                  children: [250, 500, 1000, 2500].map((fee) {
                    final isSel = _entryFee == fee;
                    return FilterChip(
                      label: Text('$fee 🪙'),
                      selected: isSel,
                      selectedColor: AppColors.primaryGold.withOpacity(0.3),
                      checkmarkColor: AppColors.primaryGold,
                      onSelected: (val) {
                        if (val) setState(() => _entryFee = fee);
                      },
                    );
                  }).toList(),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 24),
        SizedBox(
          width: double.infinity,
          height: 52,
          child: ElevatedButton(
            onPressed: () {
              // Proceed to game board table
              Navigator.pushNamed(context, '/game');
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primaryGold,
              foregroundColor: Colors.black,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            ),
            child: const Text('CREATE & ENTER LOBBY', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 15)),
          ),
        ),
      ],
    );
  }

  Widget _buildJoinView(BuildContext context, bool isDark) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'ROOM ACCESS CODE',
          style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, letterSpacing: 1.2, color: Colors.grey),
        ),
        const SizedBox(height: 12),
        Card(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                TextField(
                  controller: _codeController,
                  textCapitalization: TextCapitalization.characters,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 6,
                  ),
                  decoration: InputDecoration(
                    hintText: 'e.g. JK-7829',
                    hintStyle: TextStyle(
                      letterSpacing: 2,
                      fontSize: 18,
                      color: isDark ? Colors.white24 : Colors.black26,
                    ),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                ),
                const SizedBox(height: 12),
                const Text(
                  'Ask your friend or host for their 6-character room code to join their live table.',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 12, color: Colors.grey),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 24),
        SizedBox(
          width: double.infinity,
          height: 52,
          child: ElevatedButton(
            onPressed: () {
              Navigator.pushNamed(context, '/game');
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.playerGreen,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            ),
            child: const Text('JOIN MATCH', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 15)),
          ),
        ),
      ],
    );
  }
}
