import 'package:cloud_functions/cloud_functions.dart';

/// A LiveKit join grant from the `remoteAssistToken` callable (RemoteAssist/functions).
/// The server picks the room; the caller only learns which one it is.
class AssistGrant {
  final String url;
  final String token;
  final String room;
  const AssistGrant({required this.url, required this.token, required this.room});
}

/// Asks the ThreadX token function for a fresh grant as the signed-in user.
/// Throws [FirebaseFunctionsException]: `unauthenticated` when signed out,
/// `permission-denied` for a learner or a disabled account.
Future<AssistGrant> fetchAssistGrant() async {
  final result =
      await FirebaseFunctions.instanceFor(region: 'us-east1').httpsCallable('remoteAssistToken').call<Object?>();
  final data = Map<String, dynamic>.from(result.data as Map);
  return AssistGrant(
    url: data['url'] as String,
    token: data['token'] as String,
    room: data['room'] as String,
  );
}
