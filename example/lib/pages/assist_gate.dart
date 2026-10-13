import 'dart:async';

import 'package:cloud_functions/cloud_functions.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import '../assist_token.dart';
import 'connect.dart';

/// Opens the ThreadX LMS, which shares this site's sign-in.
void openThreadX() => unawaited(launchUrl(Uri.parse('/'), webOnlyWindowName: '_self'));

enum _Access { checking, signedOut, notStaff, failed, allowed }

/// Web entry point at threadx.ai/assist. The LMS session is shared (same site, same Firebase
/// app), so a signed-in moderator or admin goes straight to the connect page. Access is the
/// token function's decision, not the client's: the gate just asks it once per user.
class AssistGate extends StatefulWidget {
  const AssistGate({super.key});

  @override
  State<AssistGate> createState() => _AssistGateState();
}

class _AssistGateState extends State<AssistGate> {
  late final StreamSubscription<User?> _authSub;
  _Access _access = _Access.checking;
  String? _room;
  Object? _error;
  String? _checkedUid;

  @override
  void initState() {
    super.initState();
    // Also fires when the user signs out of the LMS in another tab.
    _authSub = FirebaseAuth.instance.authStateChanges().listen(_onUser);
  }

  @override
  void dispose() {
    unawaited(_authSub.cancel());
    super.dispose();
  }

  void _onUser(User? user) {
    if (user == null) {
      _checkedUid = null;
      setState(() => _access = _Access.signedOut);
    } else if (user.uid != _checkedUid) {
      _checkedUid = user.uid;
      unawaited(_check());
    }
  }

  Future<void> _check() async {
    setState(() => _access = _Access.checking);
    try {
      final grant = await fetchAssistGrant();
      if (!mounted) return;
      setState(() {
        _room = grant.room;
        _access = _Access.allowed;
      });
    } on FirebaseFunctionsException catch (e) {
      if (!mounted) return;
      setState(() {
        _error = e.message ?? e.code;
        _access = e.code == 'unauthenticated'
            ? _Access.signedOut
            : e.code == 'permission-denied'
                ? _Access.notStaff
                : _Access.failed;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _error = e;
        _access = _Access.failed;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    switch (_access) {
      case _Access.checking:
        return const Scaffold(body: Center(child: CircularProgressIndicator()));
      case _Access.allowed:
        return ConnectPage(room: _room);
      case _Access.signedOut:
        return const _Notice(
          title: 'Sign in to ThreadX',
          body: 'Remote Assist uses your ThreadX account. Sign in, then open Remote Assist from the menu.',
          action: 'Go to ThreadX',
        );
      case _Access.notStaff:
        return const _Notice(
          title: 'Remote Assist is for ThreadX staff',
          body: 'Ask a ThreadX admin if you need to take Remote Assist calls.',
          action: 'Back to ThreadX',
        );
      case _Access.failed:
        return _Notice(
          title: 'Remote Assist is unavailable',
          body: 'Could not reach the Remote Assist service: $_error',
          action: 'Back to ThreadX',
          onRetry: _check,
        );
    }
  }
}

class _Notice extends StatelessWidget {
  final String title;
  final String body;
  final String action;
  final VoidCallback? onRetry;
  const _Notice({required this.title, required this.body, required this.action, this.onRetry});

  @override
  Widget build(BuildContext context) => Scaffold(
        body: Center(
          child: Container(
            padding: const EdgeInsets.all(20),
            constraints: const BoxConstraints(maxWidth: 400),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text(
                  title,
                  textAlign: TextAlign.center,
                  style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 16),
                Text(body, textAlign: TextAlign.center),
                const SizedBox(height: 32),
                ElevatedButton(onPressed: openThreadX, child: Text(action)),
                if (onRetry != null) ...[
                  const SizedBox(height: 12),
                  TextButton(onPressed: onRetry, child: const Text('Try again')),
                ],
              ],
            ),
          ),
        ),
      );
}
