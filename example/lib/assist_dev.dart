import 'dart:math';

import 'package:dart_jsonwebtoken/dart_jsonwebtoken.dart';
import 'package:flutter/foundation.dart' show kReleaseMode;

import 'assist_token.dart';

/// Local UI work only: `flutter run -d chrome --dart-define=ASSIST_DEV_ROOM=msc-support` skips the
/// sign-in gate, which can never pass on localhost, and joins that room on the local LiveKit server
/// started by scripts/dev-room.sh. Always empty in release builds.
const assistDevRoom = kReleaseMode ? '' : String.fromEnvironment('ASSIST_DEV_ROOM');

/// A grant for [assistDevRoom] on `livekit-server --dev`, signed here with its public dev
/// credentials (devkey / secret). Each call is a new identity, so every tab is its own participant.
AssistGrant devAssistGrant() {
  final identity = 'dev-expert-${Random().nextInt(1 << 16).toRadixString(16)}';
  final token = JWT(
    {
      'name': 'Dev Expert',
      'video': {'room': assistDevRoom, 'roomJoin': true, 'canPublish': true, 'canSubscribe': true},
    },
    issuer: 'devkey',
    subject: identity,
  ).sign(SecretKey('secret'), expiresIn: const Duration(hours: 6));
  return AssistGrant(url: 'ws://localhost:7880', token: token, room: assistDevRoom);
}
