import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:livekit_client/livekit_client.dart';
import 'package:livekit_example/pages/prejoin.dart';
import 'package:livekit_example/widgets/text_field.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:http/http.dart' as http;

import 'dart:async';
import 'dart:convert';
import '../exts.dart';

class ConnectPage extends StatefulWidget {
  //
  const ConnectPage({
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
  bool _showAdvanced = false;
  String _preferredCodec = 'VP8';

  @override
  void initState() {
    super.initState();
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
    _roomCtrl.text = prefs.getString(_storeKeyRoom) ?? '';
    setState(() {
      _simulcast = prefs.getBool(_storeKeySimulcast) ?? true;
      _adaptiveStream = prefs.getBool(_storeKeyAdaptiveStream) ?? true;
      _dynacast = prefs.getBool(_storeKeyDynacast) ?? true;
      _e2ee = prefs.getBool(_storeKeyE2EE) ?? false;
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

  // Fetch a fresh token from the deployed /api/token serverless function
  // (Vercel). Only meaningful on web, where the app is served from the same
  // origin as the API route. Returns whether the fetch succeeded.
  Future<bool> _fetchToken(BuildContext ctx) async {
    final room = _roomCtrl.text.trim();
    if (room.isEmpty) {
      ScaffoldMessenger.of(ctx).showSnackBar(
        const SnackBar(content: Text('Enter a room name first')),
      );
      return false;
    }
    setState(() {
      _busy = true;
    });
    try {
      final endpoint = Uri.base.resolve('/api/token?room=${Uri.encodeQueryComponent(room)}');
      final resp = await http.get(endpoint);
      if (resp.statusCode != 200) {
        throw Exception('Token server returned ${resp.statusCode}: ${resp.body}');
      }
      final data = jsonDecode(resp.body) as Map<String, dynamic>;
      setState(() {
        _uriCtrl.text = data['url'] as String;
        _tokenCtrl.text = data['token'] as String;
      });
      await _writePrefs();
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

  // Web-only entry point for the Connect button: a room name fetches a
  // fresh token (always wins, since it's the more recent explicit input);
  // otherwise falls back to manually-entered advanced fields.
  Future<void> _connectOnWeb(BuildContext ctx) async {
    final room = _roomCtrl.text.trim();
    final hasManual = _uriCtrl.text.trim().isNotEmpty && _tokenCtrl.text.trim().isNotEmpty;
    if (room.isNotEmpty) {
      final ok = await _fetchToken(ctx);
      if (!ok || !ctx.mounted) return;
      await _connect(ctx);
    } else if (hasManual) {
      await _connect(ctx);
    } else {
      ScaffoldMessenger.of(ctx).showSnackBar(
        const SnackBar(content: Text('Enter a room name, or fill in Server URL and Token manually')),
      );
    }
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
              padding: const EdgeInsets.symmetric(
                horizontal: 20,
                vertical: 20,
              ),
              constraints: const BoxConstraints(maxWidth: 400),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const Padding(
                    padding: EdgeInsets.fromLTRB(0, 0, 0, 70),
                    child: Text(
                      'Optic Live Stream',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 32,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  if (kIsWeb) ...[
                    Padding(
                      padding: const EdgeInsets.only(bottom: 10),
                      child: LKTextField(
                        label: 'Room name',
                        ctrl: _roomCtrl,
                      ),
                    ),
                    Align(
                      alignment: Alignment.centerLeft,
                      child: TextButton.icon(
                        onPressed: () => setState(() => _showAdvanced = !_showAdvanced),
                        icon: Icon(_showAdvanced ? Icons.expand_less : Icons.expand_more),
                        label: Text(_showAdvanced ? 'Hide advanced' : 'Advanced (custom server)'),
                      ),
                    ),
                  ],
                  if (!kIsWeb || _showAdvanced) ...[
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
                  ],
                  _switchRow('E2EE', _e2ee, _setE2EE),
                  _switchRow('Simulcast', _simulcast, _setSimulcast),
                  _switchRow('Adaptive Stream', _adaptiveStream, _setAdaptiveStream),
                  _switchRow('Dynacast', _dynacast, _setDynacast),
                  _switchRow('Multi Codec', _multiCodec, _setMultiCodec, bottom: _multiCodec ? 5 : 25),
                  if (_multiCodec)
                    Padding(
                        padding: const EdgeInsets.only(bottom: 5),
                        child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                          const Flexible(child: Text('Preferred Codec:')),
                          DropdownButton<String>(
                            value: _preferredCodec,
                            icon: const Icon(
                              Icons.arrow_drop_down,
                              color: Colors.blue,
                            ),
                            elevation: 16,
                            style: const TextStyle(color: Colors.blue),
                            underline: Container(
                              height: 2,
                              color: Colors.blueAccent,
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
                ],
              ),
            ),
          ),
        ),
      );
}
