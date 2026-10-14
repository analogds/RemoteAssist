import 'package:flutter/material.dart';

import '../theme.dart';

class LKTextField extends StatelessWidget {
  final String label;
  final TextEditingController? ctrl;
  final bool readOnly;
  const LKTextField({
    required this.label,
    this.ctrl,
    this.readOnly = false,
    super.key,
  });

  @override
  Widget build(BuildContext context) => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // The label is announced on the field itself (see Semantics below).
          ExcludeSemantics(
            child: Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Text(
                label,
                style: const TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w500,
                  color: ThreadXColors.text,
                ),
              ),
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
            decoration: BoxDecoration(
              color: readOnly ? ThreadXColors.surface : ThreadXColors.card,
              border: Border.all(width: 1, color: ThreadXColors.border),
              borderRadius: BorderRadius.circular(6),
            ),
            child: Semantics(
              label: label,
              child: TextField(
                controller: ctrl,
                readOnly: readOnly,
                style: const TextStyle(
                  fontSize: 15,
                  color: ThreadXColors.text,
                ),
                cursorColor: ThreadXColors.crimson,
                decoration: const InputDecoration.collapsed(hintText: ''),
                keyboardType: TextInputType.url,
                autocorrect: false,
              ),
            ),
          ),
        ],
      );
}
