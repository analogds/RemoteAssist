import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:livekit_example/main.dart';

void main() {
  setUp(() {
    GoogleFonts.config.allowRuntimeFetching = false;
    SharedPreferences.setMockInitialValues({'token': 'old-token', 'shared-key': 'old-key'});
    dotenv.loadFromString(isOptional: true);
  });

  testWidgets('Connect page renders with labeled controls', (tester) async {
    final semantics = tester.ensureSemantics();
    await tester.pumpWidget(const LiveKitExampleApp());
    await tester.pumpAndSettle();

    expect(find.text('Optic Live Stream'), findsOneWidget);
    expect(find.text('Connect'), findsOneWidget);
    for (final label in ['Server URL', 'Token', 'Shared Key']) {
      expect(tester.getSemantics(find.bySemanticsLabel(label)), containsSemantics(label: label, isTextField: true));
    }
    for (final label in ['E2EE', 'Simulcast', 'Adaptive Stream', 'Dynacast', 'Multi Codec']) {
      expect(tester.getSemantics(find.bySemanticsLabel(label)), containsSemantics(label: label, hasToggledState: true));
    }
    semantics.dispose();
  });

  testWidgets('Saving settings never stores the token or shared key', (tester) async {
    await tester.binding.setSurfaceSize(const Size(800, 1400));
    addTearDown(() => tester.binding.setSurfaceSize(null));
    await tester.pumpWidget(const LiveKitExampleApp());
    await tester.pumpAndSettle();

    // Picking a codec is one path that saves settings.
    await tester.enterText(find.byType(TextField).at(1), 'new-token');
    await tester.tap(find.byType(Switch).last);
    await tester.pumpAndSettle();
    await tester.tap(find.text('VP8'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('VP9').last);
    await tester.pumpAndSettle();

    final prefs = await SharedPreferences.getInstance();
    expect(prefs.getString('preferred-codec'), 'VP9');
    expect(prefs.containsKey('token'), isFalse);
    expect(prefs.containsKey('shared-key'), isFalse);
  });
}
