import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:livekit_client/livekit_client.dart';
import 'package:livekit_example/pages/prejoin.dart';
import 'package:livekit_example/theme.dart';
import 'package:livekit_example/widgets/text_field.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:permission_handler/permission_handler.dart';

import 'dart:async';
import '../assist_token.dart';
import '../exts.dart';
import 'assist_gate.dart';

class ConnectPage extends StatefulWidget {
  /// On web, the room the token function joins (shown, not editable).
  final String? room;

  const ConnectPage({
    this.room,
    super.key,
  });

  @override
  State<StatefulWidget> createState() => _ConnectPageState();
}

class _ConnectPageState extends State<ConnectPage> {
  //
  static const _storeKeyUri = 'uri';
  static const _storeKeyToken = 'token';
  static const _storeKeySimulcast = 'simulcast';
  static const _storeKeyAdaptiveStream = 'adaptive-stream';
  static const _storeKeyDynacast = 'dynacast';
  static const _storeKeyE2EE = 'e2ee';
  static const _storeKeySharedKey = 'shared-key';
  static const _storeKeyMultiCodec = 'multi-codec';
  static const _storeKeyPreferredCodec = 'preferred-codec';
  static const _storeKeyRoom = 'room';

  final _uriCtrl = TextEditingController();
  final _tokenCtrl = TextEditingController();
  final _sharedKeyCtrl = TextEditingController();
  final _roomCtrl = TextEditingController();
  bool _simulcast = true;
  bool _adaptiveStream = true;
  bool _dynacast = true;
  bool _busy = false;
  bool _e2ee = false;
  bool _multiCodec = false;
  String _preferredCodec = 'VP8';

  @override
  void initState() {
    super.initState();
    _roomCtrl.text = widget.room ?? '';
    unawaited(_readPrefs());
    if (lkPlatformIs(PlatformType.android)) {
      unawaited(_checkPermissions());
    }
  }

  @override
  void dispose() {
    _uriCtrl.dispose();
    _tokenCtrl.dispose();
    _roomCtrl.dispose();
    super.dispose();
  }

  Future<void> _checkPermissions() async {
    var status = await Permission.bluetooth.request();
    if (status.isPermanentlyDenied) {
      print('Bluetooth Permission disabled');
    }

    status = await Permission.bluetoothConnect.request();
    if (status.isPermanentlyDenied) {
      print('Bluetooth Connect Permission disabled');
    }

    status = await Permission.camera.request();
    if (status.isPermanentlyDenied) {
      print('Camera Permission disabled');
    }

    status = await Permission.microphone.request();
    if (status.isPermanentlyDenied) {
      print('Microphone Permission disabled');
    }
  }

  // Read saved settings
  Future<void> _readPrefs() async {
    final prefs = await SharedPreferences.getInstance();
    _uriCtrl.text = const bool.hasEnvironment('URL')
        ? const String.fromEnvironment('URL')
        : (dotenv.env['URL'] ?? prefs.getString(_storeKeyUri) ?? '');
    _tokenCtrl.text =
        const bool.hasEnvironment('TOKEN') ? const String.fromEnvironment('TOKEN') : (dotenv.env['TOKEN'] ?? '');
    _sharedKeyCtrl.text =
        const bool.hasEnvironment('E2EEKEY') ? const String.fromEnvironment('E2EEKEY') : (dotenv.env['E2EEKEY'] ?? '');
    if (!kIsWeb) _roomCtrl.text = prefs.getString(_storeKeyRoom) ?? '';
    setState(() {
      _simulcast = prefs.getBool(_storeKeySimulcast) ?? true;
      _adaptiveStream = prefs.getBool(_storeKeyAdaptiveStream) ?? true;
      _dynacast = prefs.getBool(_storeKeyDynacast) ?? true;
      _e2ee = !kIsWeb && (prefs.getBool(_storeKeyE2EE) ?? false);
      _multiCodec = prefs.getBool(_storeKeyMultiCodec) ?? false;
      _preferredCodec = prefs.getString(_storeKeyPreferredCodec) ?? 'VP8';
    });

    if (dotenv.env.containsKey('URL') &&
        dotenv.env['URL']!.isNotEmpty &&
        dotenv.env.containsKey('TOKEN') &&
        dotenv.env['TOKEN']!.isNotEmpty) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        unawaited(_connect(context));
      });
    }
  }

  // Save settings. Token and shared key are secrets, so they are never stored;
  // copies saved by older builds are removed.
  Future<void> _writePrefs() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_storeKeyUri, _uriCtrl.text);
    await prefs.remove(_storeKeyToken);
    await prefs.remove(_storeKeySharedKey);
    await prefs.setString(_storeKeyRoom, _roomCtrl.text);
    await prefs.setBool(_storeKeySimulcast, _simulcast);
    await prefs.setBool(_storeKeyAdaptiveStream, _adaptiveStream);
    await prefs.setBool(_storeKeyDynacast, _dynacast);
    await prefs.setBool(_storeKeyE2EE, _e2ee);
    await prefs.setBool(_storeKeyMultiCodec, _multiCodec);
    await prefs.setString(_storeKeyPreferredCodec, _preferredCodec);
  }

  // MergeSemantics gives the switch its visible label as its accessible name.
  Widget _switchRow(String label, bool value, ValueChanged<bool> onChanged, {double bottom = 5}) => Padding(
        padding: EdgeInsets.only(bottom: bottom),
        child: MergeSemantics(
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(label),
              Switch(value: value, onChanged: onChanged),
            ],
          ),
        ),
      );

  // Fetch a fresh token from the ThreadX remoteAssistToken function as the signed-in user.
  // Done on every Connect, since a token only lives 10 minutes. Returns whether it succeeded.
  Future<bool> _fetchToken(BuildContext ctx) async {
    setState(() {
      _busy = true;
    });
    try {
      final grant = await fetchAssistGrant();
      setState(() {
        _uriCtrl.text = grant.url;
        _tokenCtrl.text = grant.token;
        _roomCtrl.text = grant.room;
      });
      return true;
    } catch (error) {
      if (!ctx.mounted) return false;
      await ctx.showErrorDialog(error);
      return false;
    } finally {
      setState(() {
        _busy = false;
      });
    }
  }

  Future<void> _connect(BuildContext ctx) async {
    //
    try {
      setState(() {
        _busy = true;
      });

      // Save settings for convenience
      await _writePrefs();

      print('Connecting with url: ${_uriCtrl.text}');

      final url = _uriCtrl.text;
      final token = _tokenCtrl.text;
      final e2eeKey = _sharedKeyCtrl.text;
      if (!ctx.mounted) return;
      await Navigator.push<void>(
        ctx,
        MaterialPageRoute(
            builder: (_) => PreJoinPage(
                  args: JoinArgs(
                    url: url,
                    token: token,
                    e2ee: _e2ee,
                    e2eeKey: e2eeKey,
                    simulcast: _simulcast,
                    adaptiveStream: _adaptiveStream,
                    dynacast: _dynacast,
                    preferredCodec: _preferredCodec,
                    enableBackupVideoCodec: ['VP9', 'AV1'].contains(_preferredCodec),
                  ),
                )),
      );
    } catch (error) {
      print('Could not connect $error');
      if (!ctx.mounted) return;
      await ctx.showErrorDialog(error);
    } finally {
      setState(() {
        _busy = false;
      });
    }
  }

  // Web-only entry point for the Connect button: the server picks the room and the token.
  Future<void> _connectOnWeb(BuildContext ctx) async {
    final ok = await _fetchToken(ctx);
    if (!ok || !ctx.mounted) return;
    await _connect(ctx);
  }

  void _setSimulcast(bool? value) async {
    if (value == null || _simulcast == value) return;
    setState(() {
      _simulcast = value;
    });
  }

  void _setE2EE(bool? value) async {
    if (value == null || _e2ee == value) return;
    setState(() {
      _e2ee = value;
    });
  }

  void _setAdaptiveStream(bool? value) async {
    if (value == null || _adaptiveStream == value) return;
    setState(() {
      _adaptiveStream = value;
    });
  }

  void _setDynacast(bool? value) async {
    if (value == null || _dynacast == value) return;
    setState(() {
      _dynacast = value;
    });
  }

  void _setMultiCodec(bool? value) async {
    if (value == null || _multiCodec == value) return;
    setState(() {
      _multiCodec = value;
    });
  }

  @override
  Widget build(BuildContext context) => Scaffold(
        body: Container(
          alignment: Alignment.center,
          child: SingleChildScrollView(
            child: Container(
              // A white card on the grey page, like the LMS dashboard cards.
              margin: const EdgeInsets.all(20),
              padding: const EdgeInsets.fromLTRB(28, 32, 28, 20),
              constraints: const BoxConstraints(maxWidth: 440),
              decoration: BoxDecoration(
                color: ThreadXColors.card,
                borderRadius: BorderRadius.circular(12),
                boxShadow: const [BoxShadow(color: Color(0x1A2B495E), blurRadius: 12, offset: Offset(0, 4))],
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const Padding(
                    padding: EdgeInsets.fromLTRB(0, 0, 0, 40),
                    child: Text(
                      'ThreadX Remote Assist',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 30,
                        fontWeight: FontWeight.bold,
                        color: ThreadXColors.crimson,
                      ),
                    ),
                  ),
                  if (!kIsWeb) ...[
                    // Dev runs off the web have no ThreadX sign-in, so they take a server and token by hand.
                    Padding(
                      padding: const EdgeInsets.only(bottom: 25),
                      child: LKTextField(
                        label: 'Server URL',
                        ctrl: _uriCtrl,
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.only(bottom: 25),
                      child: LKTextField(
                        label: 'Token',
                        ctrl: _tokenCtrl,
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.only(bottom: 25),
                      child: LKTextField(
                        label: 'Shared Key',
                        ctrl: _sharedKeyCtrl,
                      ),
                    ),
                    // E2EE needs the shared key above, so it is a dev-run option only.
                    _switchRow('E2EE', _e2ee, _setE2EE),
                  ],
                  // Room and the stream options are rarely touched, so they sit behind a collapsed Settings row.
                  Padding(
                    padding: const EdgeInsets.only(bottom: 20),
                    child: ExpansionTile(
                      title: const Text('Settings'),
                      leading: const Icon(Icons.settings_outlined),
                      tilePadding: EdgeInsets.zero,
                      childrenPadding: const EdgeInsets.only(top: 5),
                      shape: const Border(),
                      collapsedShape: const Border(),
                      iconColor: ThreadXColors.crimson,
                      textColor: ThreadXColors.crimson,
                      children: [
                        if (kIsWeb)
                          Padding(
                            padding: const EdgeInsets.only(bottom: 25),
                            child: LKTextField(
                              label: 'Room',
                              ctrl: _roomCtrl,
                              readOnly: true,
                            ),
                          ),
                        _switchRow('Simulcast', _simulcast, _setSimulcast),
                        _switchRow('Adaptive Stream', _adaptiveStream, _setAdaptiveStream),
                        _switchRow('Dynacast', _dynacast, _setDynacast),
                        _switchRow('Multi Codec', _multiCodec, _setMultiCodec),
                        if (_multiCodec)
                          Padding(
                              padding: const EdgeInsets.only(bottom: 5),
                              child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                                const Flexible(child: Text('Preferred Codec:')),
                                DropdownButton<String>(
                                  value: _preferredCodec,
                                  icon: const Icon(
                                    Icons.arrow_drop_down,
                                    color: ThreadXColors.crimson,
                                  ),
                                  elevation: 16,
                                  style: const TextStyle(color: ThreadXColors.crimson),
                                  underline: Container(
                                    height: 2,
                                    color: ThreadXColors.crimson,
                                  ),
                                  onChanged: (String? value) {
                                    if (value == null) return;
                                    setState(() {
                                      _preferredCodec = value;
                                    });
                                    unawaited(_writePrefs());
                                  },
                                  items: ['Preferred Codec', 'AV1', 'VP9', 'VP8', 'H264', 'H265']
                                      .map<DropdownMenuItem<String>>((String value) {
                                    return DropdownMenuItem<String>(
                                      value: value,
                                      child: Text(value),
                                    );
                                  }).toList(),
                                )
                              ])),
                      ],
                    ),
                  ),
                  ElevatedButton(
                    onPressed: _busy ? null : () => kIsWeb ? _connectOnWeb(context) : _connect(context),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        if (_busy)
                          const Padding(
                            padding: EdgeInsets.only(right: 10),
                            child: SizedBox(
                              height: 15,
                              width: 15,
                              child: CircularProgressIndicator(
                                color: Colors.white,
                                strokeWidth: 2,
                              ),
                            ),
                          ),
                        const Text('Connect'),
                      ],
                    ),
                  ),
                  if (kIsWeb)
                    const TextButton(
                      onPressed: openThreadX,
                      child: Text('Back to Dashboard'),
                    ),
                ],
              ),
            ),
          ),
        ),
      );
}
