import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/foundation.dart' show kIsWeb, kReleaseMode;
import 'package:flutter/material.dart';
import 'package:livekit_example/theme.dart';
import 'package:logging/logging.dart';
import 'package:intl/intl.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'firebase_options_threadx.dart';
import 'pages/assist_gate.dart';
import 'pages/connect.dart';

void main() async {
  final format = DateFormat('HH:mm:ss');
  // Verbose logs only in debug builds: FINE-level SDK logs include the access token.
  Logger.root.level = kReleaseMode ? Level.INFO : Level.FINEST;
  Logger.root.onRecord.listen((record) {
    print('${format.format(record.time)} [${record.level.name}]: ${record.message}');
  });

  WidgetsFlutterBinding.ensureInitialized();
  await dotenv.load(fileName: '.env', isOptional: true);
  // The web app is ThreadX Remote Assist at threadx.ai/assist, signed in through the LMS's
  // Firebase app. Other platforms are dev runs that connect with a hand-entered token.
  if (kIsWeb) await Firebase.initializeApp(options: DefaultFirebaseOptions.web);
  /*if (lkPlatformIsDesktop()) {
    await FlutterWindowClose.setWindowShouldCloseHandler(() async {
      await onWindowShouldClose?.call();
      return true;
    });
  }*/

  /// for livestreaming app, you can initialize the bypassVoiceProcessing = true
  /// here to get better audio quality
  ///
  /// await LiveKitClient.initialize(
  ///  bypassVoiceProcessing: lkPlatformIsMobile(),
  /// );
  runApp(const LiveKitExampleApp());
}

class LiveKitExampleApp extends StatelessWidget {
  //
  const LiveKitExampleApp({
    super.key,
  });

  @override
  Widget build(BuildContext context) => MaterialApp(
        title: 'ThreadX Remote Assist',
        theme: ThreadXTheme.light(context),
        debugShowCheckedModeBanner: false,
        home: kIsWeb ? const AssistGate() : const ConnectPage(),
      );
}
