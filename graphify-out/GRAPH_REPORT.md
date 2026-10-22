# Graph Report - RemoteAssist  (2026-10-22)

## Corpus Check
- 305 files · ~280,131 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 84 file(s) not represented in the graph (top: (none) 33, .xml 8, .plist 8)

## Summary
- 7361 nodes · 11125 edges · 241 communities (193 shown, 48 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 57 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0823a780`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- _eval$1
- call$1
- log$4
- SignalClient
- String
- .call$1
- livekit_client.dart
- e2ee.worker.dart
- $indexSet
- LKRemoteAudioTrack
- _removeListeners$0
- caching_token_source_test.dart
- audio_visualizer.cpp
- RTCAudioRenderer
- assist_token.dart
- package.json
- LKLocalAudioTrack
- _shrOtherPositive$1
- copyProperties
- video_track_view_registration.dart
- local/audio.dart
- convert$1
- installInstanceTearOff
- asUint8List$0
- getTag
- get$stackTrace
- _TokenSourceConfiguration
- VideoDimensions
- local/local.dart
- pre_connect_audio_buffer.dart
- TokenSourceFixed
- _
- VideoParameters
- agent.dart
- TestKeyProvider
- build-assist.sh
- package:flutter_webrtc/flutter_webrtc.dart
- livekit_models.pb.dart
- static const
- agent_attributes.dart
- websocket/web.dart
- _audio_analyser.dart
- stream_writer.dart
- audio_frame_capture_web.dart
- dart:async
- livekit_rtc.pb.dart
- native_audio.dart
- theme.dart
- audio_frame_capture_native.dart
- e2ee.worker.dart.js
- platform/web.dart
- websocket.dart
- return
- String
- broadcast_manager.dart
- src/constants.dart
- extensions.dart
- _
- internal/events.dart
- dart:typed_data
- platform/io.dart
- CHANGELOG
- participant_permissions.dart
- audio_session_policy.dart
- @immutable
- package:collection/collection.dart
- AudioTrack
- List
- StatelessWidget
- engine.dart
- audio_session_test.dart
- core/room.dart
- e2ee.nalu_utils.dart
- src/options.dart
- session.dart
- create_version.dart
- rpc_test_sheet.dart
- livekit_metrics.pb.dart
- assist_gate.dart
- Bool
- track/options.dart
- peerconnection_mock.dart
- src/utils.dart
- track_publication.dart
- widgets/participant.dart
- stats.dart
- participant/participant.dart
- @internal
- remote_track_publication_test.dart
- data_stream.dart
- audio_visualizer_web.dart
- e2ee.keyhandler.dart
- lib/src/events.dart
- connect.dart
- Visualizer
- _
- e2ee.data_packet_cryptor.dart
- prejoin.dart
- transcription_stream_receiver.dart
- participant/local.dart
- video_parameters.dart
- AudioRenderer
- e2ee.frame_cryptor.dart
- publication/remote.dart
- lib/src/types/rpc.dart
- audio_manager.dart
- controls.dart
- Float
- math_extras.h
- LiveKitPlugin
- Foundation
- jwt.dart
- video_track_renderer.dart
- room_e2e_test.dart
- video_dimensions.dart
- token_source.dart
- token_source_test.dart
- FlutterResult
- e2ee_manager.dart
- transport.dart
- track.dart
- check_version.dart
- pages/room.dart
- RoomEvent
- local/video.dart
- Any
- key_provider.dart
- participant/remote.dart
- e2ee_fake_manager.dart
- create_change.dart
- AudioVisualizer
- Room
- hardware.dart
- data_packet_buffer.dart
- screen_select_dialog.dart
- Usage
- _
- sound_waveform.dart
- _
- DarwinNotification
- caching.dart
- region_url_provider.dart
- e2e_container.dart
- participant_collection.dart
- SocketConnection
- LKAudioSwitchManager.kt
- signal_client_test.dart
- AVAudioFormat
- InternalEvent
- audio_processing_state.dart
- _
- rpc_client_manager.dart
- lib/src/support/platform.dart
- pffft.c
- FFTProcessor
- audio_frame_capture.dart
- e2ee.logger.dart
- package:meta/meta.dart
- AVAudioPCMBuffer
- my_application.cc
- package:flutter_test/flutter_test.dart
- lib/src/track/web/_audio_html.dart
- transcription_stream_receiver_test.dart
- lib/src/types/audio_encoding.dart
- video_encoding.dart
- SampleUploader
- participant_stats.dart
- FlutterWindow
- T
- e2ee.utils.dart
- AudioRenderer
- Visualizer
- .resample
- exts.dart
- participant_info.dart
- message.dart
- room_configuration.dart
- Float
- pffft_new_setup
- FFTAudioAnalyzer
- e2ee/options.dart
- SampleHandler
- toString$0$
- .CreateAndShow
- int? get
- Float
- index.js
- endpoint.dart
- Audio session management
- package:flutter/material.dart
- LKAudioTrack
- win32_window.cpp
- Subscription
- utils.cpp
- websocket_mock.dart
- e2ee.sfi_guard.dart
- .application
- manifest.json
- package:livekit_client/src/proto/livekit_models.pb.dart
- AudioProcessors
- SampleUploader.swift
- AudioReceiverStats
- NSObject
- lib/src/agent/constants.dart
- lib/src/data_stream/errors.dart
- lib/src/track/web/_audio_context.dart
- LiveKit Flutter Example
- Size
- vercel.json
- MainFlutterWindow
- convertToFastObject
- BroadcastBundleInfo
- vercel-build.sh
- bootstrap.sh
- CLAUDE.md
- LKColors
- LaunchImage.imageset/README.md
- RTCPeerConnection

## God Nodes (most connected - your core abstractions)
1. `_` - 170 edges
2. `CHANGELOG` - 114 edges
3. `InternalEvent` - 61 edges
4. `_` - 55 edges
5. `Engine` - 52 edges
6. `Room` - 40 edges
7. `_` - 40 edges
8. `RoomEvent` - 39 edges
9. `_eval$1()` - 37 edges
10. `LiveKitPlugin` - 34 edges

## Surprising Connections (you probably didn't know these)
- `call$1()` --indirect_call--> `enabled()`  [INFERRED]
  example/web/e2ee.worker.dart.js → functions/tokenGrant.test.js
- `TestE2EEManager` --implements--> `E2EEManager`  [EXTRACTED]
  test/mock/e2ee_fake_manager.dart → lib/src/e2ee/e2ee_manager.dart
- `TestDisposable` --inherits--> `Disposable`  [EXTRACTED]
  test/support/disposable_test.dart → lib/src/support/disposable.dart
- `LKLocalAudioTrack` --references--> `LocalAudioTrack`  [EXTRACTED]
  android/src/main/kotlin/io/livekit/plugin/LKLocalAudioTrack.kt → lib/src/track/local/audio.dart
- `_RoomPageState` --calls--> `TrackE2EEStateEvent`  [EXTRACTED]
  example/lib/pages/room.dart → lib/src/e2ee/events.dart

## Import Cycles
- None detected.

## Communities (241 total, 48 thin omitted)

### Community 0 - "_eval$1"
Cohesion: 0.06
Nodes (53): _addListener$1(), _addPending$1(), _asyncComplete$1(), _asyncCompleteWithValue$1(), _asyncReturn(), _awaitOnObject(), _bind$1(), _BufferingStreamSubscription__registerErrorHandler() (+45 more)

### Community 1 - "call$1"
Cohesion: 0.08
Nodes (41): add$1(), add$1$ax(), addAll$1(), _asJSObject(), call$1(), _checkPosition$3(), _computeKeys$0(), deriveKeys$2() (+33 more)

### Community 2 - "log$4"
Cohesion: 0.09
Nodes (37): _addEventError$0(), contains$1(), decodeFunction$2(), decodeFunction$body$FrameCryptor(), decrypt$2(), decrypt$body$E2EEDataPacketCryptor(), decryptionFailure$0(), encodeFunction$2() (+29 more)

### Community 3 - "SignalClient"
Cohesion: 0.13
Nodes (28): SignalClient, SignalClientInternalMethods, SignalEvent, SignalAnswerEvent, SignalConnectedEvent, SignalConnectingEvent, SignalConnectionQualityUpdateEvent, SignalConnectivityChangedEvent (+20 more)

### Community 5 - ".call$1"
Cohesion: 0.10
Nodes (18): _asyncStartSync(), _callDartFunctionFast1(), _callDartFunctionFast2(), dartify(), initNativeDispatchContinue(), _invokeClosure(), IterableExtension_firstWhereOrNull(), jsify() (+10 more)

### Community 7 - "e2ee.worker.dart"
Cohesion: 0.11
Nodes (11): cryptor, getDataPacketCryptor, getTrackCryptor, handleMessage, keyProviders, main, participantCryptors, participantDataCryptors (+3 more)

### Community 8 - "$indexSet"
Cohesion: 0.13
Nodes (18): _addHashTableEntry$3(), containsKey$1(), fillLiteralMap(), _findBucketIndex$2(), _get$1(), _getBucket$2(), $indexSet(), internalFindBucketIndex$2() (+10 more)

### Community 9 - "LKRemoteAudioTrack"
Cohesion: 0.23
Nodes (3): LKRemoteAudioTrack, LKRemoteAudioTrack, LKRemoteAudioTrack

### Community 10 - "_removeListeners$0"
Cohesion: 0.19
Nodes (14): _asyncCompleteErrorObject$1(), _asyncRethrow(), _cloneResult$1(), completeError$1(), completeError$2(), _completeErrorObject$1(), _completeWithResultOf$1(), _completeWithValue$1() (+6 more)

### Community 11 - "caching_token_source_test.dart"
Cohesion: 0.17
Nodes (9): exp, fetch, _generateExpiredToken, _generateValidToken, jwt, main, now, payload (+1 more)

### Community 12 - "audio_visualizer.cpp"
Cohesion: 0.36
Nodes (4): centerBands(), computeBands(), CurrentTime(), magnitudeIndex()

### Community 13 - "RTCAudioRenderer"
Cohesion: 0.27
Nodes (3): AudioTrack, AudioTrack, AudioTrack

### Community 14 - "assist_token.dart"
Cohesion: 0.22
Nodes (7): AssistGrant, data, fetchAssistGrant, result, room, token, url

### Community 15 - "package.json"
Cohesion: 0.29
Nodes (6): dependencies, livekit-server-sdk, livekit-server-sdk, name, private, type

### Community 17 - "_shrOtherPositive$1"
Cohesion: 0.33
Nodes (6): _Base64Decoder__allocateBuffer(), _Base64Decoder_decodeChunk(), matchTypeError$1(), _shrBothPositive$1(), _shrOtherPositive$1(), _unwrapNonDartException()

### Community 18 - "copyProperties"
Cohesion: 0.33
Nodes (6): copyProperties(), inherit(), inheritMany(), setOrUpdateInterceptorsByTag(), setOrUpdateLeafTags(), updateHolder()

### Community 19 - "video_track_view_registration.dart"
Cohesion: 0.33
Nodes (4): key, pixelDensity, VideoTrackViewRegistration, AdaptiveStreamPixelDensity

### Community 20 - "local/audio.dart"
Cohesion: 0.04
Nodes (39): audioLevel, AudioSourceStats, echoReturnLoss, echoReturnLossEnhancement, fromReport, remoteSource, totalAudioEnergy, totalSamplesDuration (+31 more)

### Community 21 - "convert$1"
Cohesion: 0.40
Nodes (5): convert$1(), decode$3(), encode$4(), _tdivFast$1(), _tdivSlow$1()

### Community 22 - "installInstanceTearOff"
Cohesion: 0.40
Nodes (5): installInstanceTearOff(), installStaticTearOff(), instanceTearOffGetter(), staticTearOffGetter(), tearOffParameters()

### Community 23 - "asUint8List$0"
Cohesion: 0.50
Nodes (4): asUint8List$0(), asUint8List$0$x(), asUint8List$2(), asUint8List$2$x()

### Community 24 - "getTag"
Cohesion: 0.50
Nodes (4): getTag(), getTagFirefox(), getTagFixed(), getTagIE()

### Community 25 - "get$stackTrace"
Cohesion: 0.67
Nodes (3): AsyncError_defaultStackTrace(), get$stackTrace(), _interceptUserError()

### Community 26 - "_TokenSourceConfiguration"
Cohesion: 0.67
Nodes (3): _ConfigurableTokenSourceConfiguration, _FixedTokenSourceConfiguration, _TokenSourceConfiguration

### Community 27 - "VideoDimensions"
Cohesion: 0.67
Nodes (3): VideoDimensions, VideoDimensionsHelpers, VideoDimensionsPresets

### Community 28 - "local/local.dart"
Cohesion: 0.05
Nodes (29): addAudioRenderer, addViewRegistration, _AudioCaptureGroup, _capture, _captureGroups, codec, createStream, currentOptions (+21 more)

### Community 29 - "pre_connect_audio_buffer.dart"
Cohesion: 0.05
Nodes (30): agentReadyFuture, _agentReadyManager, _audioCapture, _buffer, bufferedSize, dataTopic, defaultChunkSize, defaultMaxSize (+22 more)

### Community 31 - "_"
Cohesion: 0.05
Nodes (31): _, ACTIVE, CandidateProtocol, DISCONNECT, DUPLICATE_HANDLE, DUPLICATE_NAME, GZIP, INVALID_HANDLE (+23 more)

### Community 33 - "agent.dart"
Cohesion: 0.08
Nodes (20): AgentFailure, _AgentLifecycle, agentState, audioTrack, avatarVideoTrack, connected, connecting, disconnected (+12 more)

### Community 36 - "package:flutter_webrtc/flutter_webrtc.dart"
Cohesion: 0.07
Nodes (22): destroy, init, kind, name, AudioProcessorOptions, VideoProcessorOptions, onPublish, onUnpublish (+14 more)

### Community 45 - "livekit_models.pb.dart"
Cohesion: 0.00
Nodes (513): active, activeRecording, ActiveSpeakerUpdate, address, afterId, agent, agentProtocol, at (+505 more)

### Community 48 - "static const"
Cohesion: 0.10
Nodes (10): androidAudioSessionConfigurationToMap, configureAndroidAudioSession, setAndroidAudioSessionConfiguration, initialize, LiveKitClient, version, liveKitWebRTCInitializeOptions, NativeAudioManagement (+2 more)

### Community 54 - "agent_attributes.dart"
Cohesion: 0.10
Nodes (19): agentAttributesFromJson, agentAttributesToJson, AgentInput, AgentOutput, AgentState, _boolFromJson, _boolToJson, fromJson (+11 more)

### Community 56 - "websocket/web.dart"
Cohesion: 0.10
Nodes (19): connect, LiveKitWebSocketIO, lkWebSocketConnect, options, send, _subscription, _ws, LiveKitWebSocket (+11 more)

### Community 61 - "_audio_analyser.dart"
Cohesion: 0.10
Nodes (18): analyser, AudioAnalyser, AudioAnalyserOptions, audioContext, calculateVolume, cleanup, cloneTrack, createAudioAnalyser (+10 more)

### Community 62 - "stream_writer.dart"
Cohesion: 0.12
Nodes (14): BaseStreamWriter, ByteStreamWriter, chunkId, close, destinationIdentities, engine, info, splitChunk (+6 more)

### Community 63 - "audio_frame_capture_web.dart"
Cohesion: 0.11
Nodes (13): _audioContext, AudioRendererProcessor, _controller, createAudioFrameCaptureImpl, frameStream, _onWorkletMessage, _sourceNode, start (+5 more)

### Community 64 - "dart:async"
Cohesion: 0.05
Nodes (36): _clearTimer, complete, _completeCurrent, completeError, _completer, _createCompleter, dispose, _hasPendingListener (+28 more)

### Community 66 - "livekit_rtc.pb.dart"
Cohesion: 0.00
Nodes (369): action, adaptiveStream, addTrack, AddTrackRequest, allowed, allParticipants, allTracks, alternativeUrl (+361 more)

### Community 73 - "native_audio.dart"
Cohesion: 0.14
Nodes (13): AppleAudioCategory, AppleAudioCategoryOption, AppleAudioMode, appleAudioCategory, AppleAudioCategoryExt, AppleAudioCategoryOptionExt, appleAudioCategoryOptions, appleAudioMode (+5 more)

### Community 74 - "theme.dart"
Cohesion: 0.01
Nodes (192): accentFgDark, accentFgLight, accentMutedDark, accentMutedLight, amber100, amber200, amber300, amber400 (+184 more)

### Community 77 - "audio_frame_capture_native.dart"
Cohesion: 0.13
Nodes (12): AudioFrameCapture, AudioFrameCaptureNative, _controller, createAudioFrameCaptureImpl, _eventChannel, frameStream, _rendererId, start (+4 more)

### Community 81 - "e2ee.worker.dart.js"
Cohesion: 0.01
Nodes (16): bindCallbackGuarded$1(), call$2(), getUnknownTag(), getUnknownTagGenericBrowser(), mixinEasy(), mixinHard(), mixinPropertiesEasy(), mixinPropertiesHard() (+8 more)

### Community 82 - "platform/web.dart"
Cohesion: 0.14
Nodes (12): appVersion, chromeBased, isInsertableStreamSupported, isScriptTransformSupported, lkBrowserImplementation, lkBrowserVersionImplementation, lkE2EESupportedImplementation, lkPlatformImplementation (+4 more)

### Community 84 - "websocket.dart"
Cohesion: 0.10
Nodes (16): PendingTrackQueue, connect, error, message, onData, onDispose, onError, send (+8 more)

### Community 85 - "return"
Cohesion: 0.18
Nodes (7): sanitized, _sanitizeSandboxId, setSinkId, startAllAudioElement, startAudio, stopAudio, true

### Community 86 - "String"
Cohesion: 0.20
Nodes (8): DarwinNotification, broadcastStarted, broadcastStopped, fetch, participantName, participantToken, roomName, serverUrl

### Community 88 - "broadcast_manager.dart"
Cohesion: 0.17
Nodes (9): RpcTestController, Agent, BroadcastManager, broadcastStateChanged, _instance, _isBroadcasting, requestActivation, requestStop (+1 more)

### Community 94 - "src/constants.dart"
Cohesion: 0.18
Nodes (8): connection, debounce, defaultTimeouts, iceRestart, peerConnection, publish, subscribe, Timeouts

### Community 95 - "extensions.dart"
Cohesion: 0.05
Nodes (39): ConnectionQualityExt, DataPacketKindExt, DisconnectReasonExt, elementAtOrNull, emit, EncryptionTypeExt, fromJson, ICEServerExt (+31 more)

### Community 96 - "_"
Cohesion: 0.01
Nodes (141): _, AAC, AC_MP3, ACTIVE, AGENT, AGENT_ERROR, ANDROID, AUDIO (+133 more)

### Community 97 - "internal/events.dart"
Cohesion: 0.03
Nodes (68): ack, action, allowed, attempt, candidate, canReconnect, chunk, cid (+60 more)

### Community 98 - "dart:typed_data"
Cohesion: 0.21
Nodes (4): float32ToFloat32Bytes, float32ToInt16Bytes, out, main

### Community 99 - "platform/io.dart"
Cohesion: 0.20
Nodes (7): false, lkBrowserImplementation, lkBrowserVersionImplementation, lkE2EESupportedImplementation, lkPlatformImplementation, lkPlatformIsTestImplementation, lkPlatformIsWebMobileImplementation

### Community 100 - "CHANGELOG"
Cohesion: 0.02
Nodes (114): 0.1.0, 0.1.1, 0.2.0, 0.3.0, 0.4.0, 0.4.1, 0.5.0, 0.5.1 (+106 more)

### Community 101 - "participant_permissions.dart"
Cohesion: 0.20
Nodes (9): canPublish, canPublishData, canPublishSources, canSubscribe, canUpdateMetadata, hidden, ParticipantPermissionExt, ParticipantPermissions (+1 more)

### Community 102 - "audio_session_policy.dart"
Cohesion: 0.25
Nodes (6): AudioSessionOptions, automatic, forceSpeakerOutput, options, preferSpeakerOutput, ResolvedAudioSessionPolicy

### Community 103 - "@immutable"
Cohesion: 0.09
Nodes (19): ReceivedMessage, SentMessage, AndroidAudioSessionConfiguration, AppleAudioSessionConfiguration, ParticipantTrackPermissionExt, iceRestart, RTCOfferOptions, toMap (+11 more)

### Community 104 - "package:collection/collection.dart"
Cohesion: 0.11
Nodes (9): agentParticipant, agentParticipants, AgentRoom, agentConnectTimeout, _buildRoom, copyWith, preConnectAudio, room (+1 more)

### Community 105 - "AudioTrack"
Cohesion: 0.18
Nodes (8): TrackProcessorUpdateEvent, LocalAudioManagementMixin, LocalAudioTrack, AudioTrack, LocalTrack, LKLocalAudioTrack, LKLocalAudioTrack, LKLocalAudioTrack

### Community 106 - "List"
Cohesion: 0.11
Nodes (17): BaseStreamReader, _bytesReceived, ByteStreamReader, handleChunkReceived, _info, listen, readAll, reader (+9 more)

### Community 108 - "StatelessWidget"
Cohesion: 0.12
Nodes (13): LiveKitExampleApp, _Notice, ParticipantInfoWidget, RemoteTrackFPSMenuWidget, RemoteTrackPublicationMenuWidget, RemoteTrackQualityMenuWidget, _InvocationRow, _ResultPanel (+5 more)

### Community 109 - "engine.dart"
Cohesion: 0.02
Nodes (82): asDataPacket, asEncryptablePacket, _attemptingReconnect, _buildRtcConfiguration, candidatePairs, candidates, cleanUp, _clearPendingReconnect (+74 more)

### Community 110 - "audio_session_test.dart"
Cohesion: 0.10
Nodes (6): handleMethodCall, LiveKitWebPlugin, registerWith, main, resolveAndroidPolicy, resolveApplePolicy

### Community 111 - "core/room.dart"
Cohesion: 0.02
Nodes (74): activeSpeakers, _applyRoomUpdate, _audioEnabled, _byteStreamControllers, _byteStreamHandlers, _cleanUp, connect, connectionState (+66 more)

### Community 114 - "e2ee.nalu_utils.dart"
Cohesion: 0.03
Nodes (65): AUD, AUD_NUT, BLA_N_LP, BLA_W_LP, BLA_W_RADL, CRA_NUT, detectCodecFromNALUs, detectedCodec (+57 more)

### Community 116 - "src/options.dart"
Cohesion: 0.03
Nodes (58): DegradationPreferenceExt, ProtocolVersionExt, RoomOptionsEx, adaptiveStream, AudioPublishOptions, autoSubscribe, backupCodecs, camera (+50 more)

### Community 118 - "session.dart"
Cohesion: 0.03
Nodes (45): _agent, _agentTimeoutTimer, _cancelReceiverSubscriptions, cause, connection, connectionState, _options, dismissError (+37 more)

### Community 121 - "create_version.dart"
Cohesion: 0.04
Nodes (52): _allowedChangeKinds, _allowedChangeLevels, appendToChangelog, bold, buffer, bumpMajor, bumpMinor, bumpPatch (+44 more)

### Community 122 - "rpc_test_sheet.dart"
Cohesion: 0.04
Nodes (58): RoomPage, _applyPreset, attachRoom, build, _buildHandlersSection, _buildHeader, _buildSendSection, byteLength (+50 more)

### Community 123 - "livekit_metrics.pb.dart"
Cohesion: 0.04
Nodes (47): clearDuration, clearEndTimestampMs, clearLabel, clearMetadata, clearNormalizedEndTimestamp, clearNormalizedStartTimestamp, clearNormalizedTimestamp, clearParticipantIdentity (+39 more)

### Community 124 - "assist_gate.dart"
Cohesion: 0.08
Nodes (19): _Access, action, AssistGate, _AssistGateState, _authSub, body, build, _check (+11 more)

### Community 125 - "Bool"
Cohesion: 0.10
Nodes (6): LKAudioEngineObserver, .isSessionActive, LKAudioEngineObserver, .isSessionActive, LKAudioEngineObserver, .isSessionActive

### Community 126 - "track/options.dart"
Cohesion: 0.04
Nodes (48): AudioCaptureOptions, AudioOutputOptions, AudioProcessingFailureReason, _audioProcessingMessageOrDefault, autoGainControl, autoGainControlMode, CameraCaptureOptions, CameraExposureMode (+40 more)

### Community 127 - "peerconnection_mock.dart"
Cohesion: 0.04
Nodes (40): addCandidate, addStream, addTrack, addTransceiver, _answerType, close, closed, _connectionState (+32 more)

### Community 128 - "src/utils.dart"
Cohesion: 0.04
Nodes (48): buildStreamId, buildUri, _clampSimulcastPreset, _clientInfo, codec, compareVersions, _computeDefaultScreenShareSimulcastParams, _computeDefaultSimulcastParams (+40 more)

### Community 129 - "track_publication.dart"
Cohesion: 0.08
Nodes (22): TrackInfo, _attachTrackListener, dimensions, hashCode, isScreenShare, kind, latestInfo, _metadataMuted (+14 more)

### Community 131 - "widgets/participant.dart"
Cohesion: 0.06
Nodes (29): activeAudioTrack, activeVideoTrack, audioPublication, build, createState, didUpdateWidget, dispose, extraWidgets (+21 more)

### Community 132 - "stats.dart"
Cohesion: 0.04
Nodes (47): audioSourceStats, bytesNow, bytesPrev, bytesReceived, bytesSent, channels, clockRate, computeBitrateForReceiverStats (+39 more)

### Community 133 - "participant/participant.dart"
Cohesion: 0.04
Nodes (43): addTrackPublication, attributes, audioLevel, audioTrackPublications, clientProtocol, _connectionQuality, getTrackPublicationByName, getTrackPublicationBySid (+35 more)

### Community 134 - "@internal"
Cohesion: 0.03
Nodes (86): addTrack, attemptReconnect, createSimulcastTransceiverSender, createTransceiverRTCRtpSender, dataChannelInfo, ensurePublisherConnected, handleReconnect, negotiate (+78 more)

### Community 135 - "remote_track_publication_test.dart"
Cohesion: 0.05
Nodes (41): ParticipantConnectedEvent, active, adaptRes, addTrack, applyConstraints, captureFrame, _CapturingConnector, clone (+33 more)

### Community 136 - "data_stream.dart"
Cohesion: 0.04
Nodes (43): attachedFiles, attachedStreamIds, attachments, attributes, ByteStreamHandler, ChatMessage, close, destinationIdentities (+35 more)

### Community 137 - "audio_visualizer_web.dart"
Cohesion: 0.05
Nodes (38): AudioVisualizerOptions, barCount, centeredBands, createVisualizer, _audioTrack, createVisualizerImpl, _eventChannel, mediaStreamTrack (+30 more)

### Community 138 - "e2ee.keyhandler.dart"
Cohesion: 0.05
Nodes (40): cryptoKeyRing, currentKeyIndex, decryptionFailure, _decryptionFailureCount, decryptionSuccess, deriveKeys, discardFrameWhenCryptorNotReady, encryptionKey (+32 more)

### Community 139 - "lib/src/events.dart"
Cohesion: 0.05
Nodes (38): activeRecording, attempt, attributes, bitrateForLayers, bufferedSize, connectionQuality, currentBitrate, data (+30 more)

### Community 140 - "connect.dart"
Cohesion: 0.04
Nodes (40): _adaptiveStream, build, _busy, _checkPermissions, _connect, _connectOnWeb, ConnectPage, _ConnectPageState (+32 more)

### Community 141 - "Visualizer"
Cohesion: 0.12
Nodes (3): Visualizer, Visualizer, Visualizer

### Community 142 - "_"
Cohesion: 0.05
Nodes (41): ReliabilityExt, RTCIceTransportPolicyExt, _, allowedTrackSids, allTracksAllowed, auto, CancelListenFunc, compareTo (+33 more)

### Community 143 - "e2ee.data_packet_cryptor.dart"
Cohesion: 0.09
Nodes (20): currentKeyIndex, data, dataCryptorId, decrypt, E2EEDataPacketCryptor, encrypt, EncryptedPacket, iv (+12 more)

### Community 144 - "prejoin.dart"
Cohesion: 0.04
Nodes (43): _actionBack, adaptiveStream, args, _audioInputs, _audioTrack, build, _busy, _changeLocalAudioTrack (+35 more)

### Community 145 - "transcription_stream_receiver.dart"
Cohesion: 0.04
Nodes (44): dispose, MessageReceiver, messages, MessageSender, send, _controller, dispose, messages (+36 more)

### Community 146 - "participant/local.dart"
Cohesion: 0.05
Nodes (36): _allParticipantsAllowed, audioTrackPublications, _broadcastStateChanged, createFromInfo, getTrackPublicationByName, getTrackPublicationBySid, getTrackPublicationBySource, handleSignalRequestResponse (+28 more)

### Community 147 - "video_parameters.dart"
Cohesion: 0.05
Nodes (37): all169, all43, allScreenShare, compareTo, defaultSimulcast169, defaultSimulcast43, description, dimensions (+29 more)

### Community 148 - "AudioRenderer"
Cohesion: 0.12
Nodes (6): AudioRenderer, AVAudioPCMBuffer, AudioRenderer, AVAudioPCMBuffer, AudioRenderer, AVAudioPCMBuffer

### Community 149 - "e2ee.frame_cryptor.dart"
Cohesion: 0.05
Nodes (35): buffer, codec, CryptorError, currentKeyIndex, decodeFunction, _enabled, encodeFunction, enqueueFrame (+27 more)

### Community 150 - "publication/remote.dart"
Cohesion: 0.04
Nodes (44): UpdateTrackSettings, _adaptiveStreamActive, _adaptiveStreamDimensions, _adaptiveStreamVisible, _buildTrackSettings, _cancelPendingTrackSettingsUpdateRequest, _computeVideoViewVisibility, disable (+36 more)

### Community 151 - "lib/src/types/rpc.dart"
Cohesion: 0.05
Nodes (36): applicationError, builtIn, callerIdentity, code, connectionTimeout, data, destinationIdentity, errorMessages (+28 more)

### Community 152 - "audio_manager.dart"
Cohesion: 0.05
Nodes (35): _applyCurrentAudioSessionPolicy, applyOptionsForConnect, AudioEngineState, _audioEngineStateController, audioEngineStateStream, AudioManager, canSwitchSpeakerphone, _configureAndroidAudioSession (+27 more)

### Community 153 - "controls.dart"
Cohesion: 0.05
Nodes (35): _audioInputs, _audioOutputs, build, ControlsWidget, _ControlsWidgetState, createState, _disableAudio, _disableScreenShare (+27 more)

### Community 154 - "Float"
Cohesion: 0.09
Nodes (15): AudioLevel, AudioVisualizeProcessor, AVAudioPCMBuffer, RTCAudioBuffer, Sequence, AudioLevel, AudioVisualizeProcessor, AVAudioPCMBuffer (+7 more)

### Community 155 - "math_extras.h"
Cohesion: 0.07
Nodes (14): ClampTo(), ClampToDirectComparison(), ClampToHelper, ClampToHelper<int64_t, uint64_t>, ClampToHelper<int64_t, ValueType>, ClampToHelper<uint64_t, ValueType>, ClampToNonLongLongHelper, ClampToNonLongLongHelper<false, LimitType, ValueType> (+6 more)

### Community 156 - "LiveKitPlugin"
Cohesion: 0.10
Nodes (5): LiveKitPlugin, AudioProcessingComponentState, AudioProcessingState, AudioProcessingMode, AudioProcessingOptions

### Community 157 - "Foundation"
Cohesion: 0.15
Nodes (10): Accelerate, AVFoundation, Cocoa, Combine, Flutter, flutter_webrtc, FlutterMacOS, Foundation (+2 more)

### Community 158 - "jwt.dart"
Cohesion: 0.05
Nodes (34): attributes, canPublish, canPublishData, canPublishSources, canSubscribe, _claims, _dateTimeFor, dispatchesAgent (+26 more)

### Community 159 - "video_track_renderer.dart"
Cohesion: 0.05
Nodes (33): adaptiveStreamPixelDensity, _aspectRatio, _attach, autoCenter, autoDisposeRenderer, build, cachedRenderer, createState (+25 more)

### Community 160 - "room_e2e_test.dart"
Cohesion: 0.05
Nodes (37): active, adaptRes, addTrack, applyConstraints, captureFrame, clone, container, dispose (+29 more)

### Community 161 - "video_dimensions.dart"
Cohesion: 0.06
Nodes (30): area, aspect, aspect169, aspect43, copyWith, h1080_169, h1080_43, h120_43 (+22 more)

### Community 162 - "token_source.dart"
Cohesion: 0.08
Nodes (26): AgentAttributes, TranscriptionAttributes, TokenStoreItem, LiveKitVideoGrant, TokenSourceJwt, RoomAgentDispatch, RoomConfiguration, agentDeployment (+18 more)

### Community 163 - "token_source_test.dart"
Cohesion: 0.11
Nodes (7): main, _generateToken, includeExp, jwt, main, payload, sign

### Community 165 - "e2ee_manager.dart"
Cohesion: 0.09
Nodes (20): _addRtpReceiver, _addRtpSender, _algorithm, _cleanUp, _dataPacketCryptor, _e2eeStateFromFrameCryptoState, _enabled, encryptData (+12 more)

### Community 168 - "transport.dart"
Cohesion: 0.06
Nodes (28): addIceCandidate, _bitrateTrackers, _cancelDebounce, cid, codec, connectOptions, create, createAndSendOffer (+20 more)

### Community 169 - "track.dart"
Cohesion: 0.04
Nodes (46): clear, emitException, enqueue, expiresAt, flush, maxSize, participantSid, _pending (+38 more)

### Community 170 - "check_version.dart"
Cohesion: 0.07
Nodes (27): bold, checkVersionConsistency, checkWebRtcSdkVersions, _Color, content, doc, extractVersionFromPubspec, filesToCheck (+19 more)

### Community 171 - "pages/room.dart"
Cohesion: 0.07
Nodes (33): _askPublish, build, createState, disableInCallFlags, dispose, _disposeRoomAsync, enableInCallFlags, fastConnection (+25 more)

### Community 172 - "RoomEvent"
Cohesion: 0.10
Nodes (34): E2EEState, participant, publication, state, toString, TrackE2EEStateEvent, ActiveSpeakersChangedEvent, DataReceivedEvent (+26 more)

### Community 173 - "local/video.dart"
Cohesion: 0.07
Nodes (26): addSimulcastTrack, _bitrateFoLayers, codec, createCameraTrack, createScreenShareTrack, createScreenShareTracksWithAudio, _currentBitrate, currentOptions (+18 more)

### Community 175 - "key_provider.dart"
Cohesion: 0.07
Nodes (25): create, defaultDiscardFrameWhenCryptorNotReady, defaultFailureTolerance, defaultKeyRingSize, defaultMagicBytes, defaultRatchetSalt, defaultRatchetWindowSize, exportKey (+17 more)

### Community 176 - "participant/remote.dart"
Cohesion: 0.08
Nodes (18): addSubscribedMediaTrack, _addTracks, audioTrackPublications, createFromInfo, getTrackPublicationByName, getTrackPublicationBySid, getTrackPublicationBySource, newPublications (+10 more)

### Community 177 - "e2ee_fake_manager.dart"
Cohesion: 0.07
Nodes (26): _dcEncryptionEnabled, decryptedPayloads, dispose, _enabled, encryptData, encryptedPayloads, exportKey, exportSharedKey (+18 more)

### Community 178 - "create_change.dart"
Cohesion: 0.07
Nodes (27): _bold, changesDir, content, _cyan, description, _dim, _esc, file (+19 more)

### Community 179 - "AudioVisualizer"
Cohesion: 0.11
Nodes (16): AudioVisualizer, bands_, bands_count_, fft_processor_, is_centered_, kDefaultBandsCount, kDefaultMaxDb, kDefaultMaxFrequency (+8 more)

### Community 180 - "Room"
Cohesion: 0.08
Nodes (21): DataStreamRoomMethods, RoomPreConnect, RoomDebugMethods, RoomHardwareManagementMethods, RoomPrivateMethods, RoomRPCMethods, container, main (+13 more)

### Community 181 - "hardware.dart"
Cohesion: 0.07
Nodes (29): setSpeakerOn, audioInputs, audioOutputs, canSwitchSpeakerphone, deviceId, enumerateDevices, forceSpeakerOutput, groupId (+21 more)

### Community 182 - "data_packet_buffer.dart"
Cohesion: 0.07
Nodes (25): DataPacket, alignBufferedAmount, _buffer, BufferedDataPacket, clear, countUtilization, DataPacketBuffer, _enforceBufferLimits (+17 more)

### Community 183 - "screen_select_dialog.dart"
Cohesion: 0.07
Nodes (25): build, _cancel, cancelText, createState, deactivate, _getSources, initState, _name (+17 more)

### Community 184 - "Usage"
Cohesion: 0.07
Nodes (26): Advanced track manipulation, Android, Android, Audio handling, Audio Modes, Connecting to a room, publish video & audio, Desktop support, Desktop(Windows/macOS) (+18 more)

### Community 185 - "_"
Cohesion: 0.08
Nodes (23): _, android, AndroidAudioAttributesContentType, AndroidAudioAttributesUsageType, AndroidAudioFocusMode, AndroidAudioMode, AndroidAudioStreamType, apple (+15 more)

### Community 187 - "sound_waveform.dart"
Cohesion: 0.09
Nodes (21): audioTrack, barCount, build, controller, createState, dispose, durationInMilliseconds, initState (+13 more)

### Community 189 - "_"
Cohesion: 0.08
Nodes (24): _, AGENTS_LLM_TTFT, AGENTS_STT_TTFT, AGENTS_TTS_TTFB, CLIENT_AUDIO_SUBSCRIBER_CONCEALED_SAMPLES, CLIENT_AUDIO_SUBSCRIBER_CONCEALMENT_EVENTS, CLIENT_AUDIO_SUBSCRIBER_INTERRUPTION_COUNT, CLIENT_AUDIO_SUBSCRIBER_SILENT_CONCEALED_SAMPLES (+16 more)

### Community 190 - "DarwinNotification"
Cohesion: 0.12
Nodes (8): DarwinNotificationCenter, BroadcastManager, DarwinNotification, broadcastRequestStop, broadcastStarted, broadcastStopped, Publisher, SubscriptionBase

### Community 191 - "caching.dart"
Cohesion: 0.07
Nodes (26): _cached, cachedResponse, CachedTokenSource, CachingTokenSource, clear, _defaultValidator, fetch, fromJson (+18 more)

### Community 192 - "region_url_provider.dart"
Cohesion: 0.09
Nodes (21): RegionSettings, attemptedRegions, fetchRegionSettings, fromJson, getCloudConfigUrl, getNextBestRegionUrl, getServerUrl, isCloud (+13 more)

### Community 194 - "e2e_container.dart"
Cohesion: 0.08
Nodes (19): _buildJoinResponse, capturedDataPackets, client, connectRoom, deliverInboundDataPacket, dispose, engine, _installOutboundCapture (+11 more)

### Community 195 - "participant_collection.dart"
Cohesion: 0.14
Nodes (8): _byIdentity, _bySid, clear, containsIdentity, containsSid, iterator, ParticipantCollection, removeByIdentity

### Community 198 - "LKAudioSwitchManager.kt"
Cohesion: 0.06
Nodes (17): audioModeForName(), contentTypeForName(), focusModeForName(), LKAudioSwitchManager, SessionConfig, SpeakerRouting, streamTypeForName(), usageTypeForName() (+9 more)

### Community 201 - "signal_client_test.dart"
Cohesion: 0.09
Nodes (17): SignalResponse, activeSpeakerResponse, client, connectionQualityResponse, connectOptions, connector, exampleUri, joinResponse (+9 more)

### Community 202 - "AVAudioFormat"
Cohesion: 0.20
Nodes (4): AVFAudio, AudioConverter, AudioConverter, AudioConverter

### Community 203 - "InternalEvent"
Cohesion: 0.12
Nodes (47): Session, Engine, Room, EngineEvent, InternalEvent, LiveKitEvent, TrackEvent, AudioPlaybackFailed (+39 more)

### Community 204 - "audio_processing_state.dart"
Cohesion: 0.09
Nodes (20): AudioProcessingComponentRequest, AudioProcessingImplementation, autoGainControl, echoCancellation, effective, enabled, fromMap, fromValue (+12 more)

### Community 206 - "_"
Cohesion: 0.14
Nodes (18): _, ConnectException, ConnectionErrorReason, DataPublishException, LiveKitE2EEException, LiveKitException, MediaConnectException, message (+10 more)

### Community 207 - "rpc_client_manager.dart"
Cohesion: 0.04
Nodes (42): BackupVideoCodec, backupVideoCodec, mute, participant, toPBTrackPublishedResponse, unmute, ackTimer, _complete (+34 more)

### Community 208 - "lib/src/support/platform.dart"
Cohesion: 0.10
Nodes (19): BrowserType, BrowserVersion, false, isChrome129OrLater, lkBrowser, lkBrowserVersion, lkPlatform, lkPlatformIs (+11 more)

### Community 209 - "pffft.c"
Cohesion: 0.12
Nodes (32): cfftf1_ps(), ld_ps1(), passf2_ps(), passf3_ps(), passf4_ps(), passf5_ps(), pffft_cplx_finalize(), pffft_cplx_preprocess() (+24 more)

### Community 210 - "FFTProcessor"
Cohesion: 0.08
Nodes (22): ApplyWindow(), EnsureFinite(), FFTProcessor, complex_data_, fft_size_, imag_data_, input_buffer_, kDefaultFFTSize (+14 more)

### Community 211 - "audio_frame_capture.dart"
Cohesion: 0.12
Nodes (15): AudioFormat, AudioFrame, AudioFrameCallback, AudioRendererOptions, channels, createAudioFrameCapture, data, format (+7 more)

### Community 212 - "e2ee.logger.dart"
Cohesion: 0.14
Nodes (11): disableLogging, getLoggingLevel, logger, LoggerLevel, setLoggingLevel, disableLogging, getLoggingLevel, logger (+3 more)

### Community 213 - "package:meta/meta.dart"
Cohesion: 0.06
Nodes (27): cancelAll, createListener, emit, emitQueued, emitter, events, EventsEmitter, EventsListenable (+19 more)

### Community 214 - "AVAudioPCMBuffer"
Cohesion: 0.20
Nodes (3): AVAudioPCMBuffer, AVAudioPCMBuffer, AVAudioPCMBuffer

### Community 215 - "my_application.cc"
Cohesion: 0.10
Nodes (10): main(), my_application_activate(), my_application_class_init(), my_application_dispose(), my_application_init(), my_application_local_command_line(), my_application_new(), _MyApplication (+2 more)

### Community 216 - "package:flutter_test/flutter_test.dart"
Cohesion: 0.06
Nodes (20): _controller, data, emitFrame, float32Bytes, frameStream, int16Bytes, main, readFloat32 (+12 more)

### Community 218 - "lib/src/track/web/_audio_html.dart"
Cohesion: 0.11
Nodes (17): audio, audioContainerId, _audioContext, audioElement, _audioElements, audioPrefix, audioStream, div (+9 more)

### Community 219 - "transcription_stream_receiver_test.dart"
Cohesion: 0.11
Nodes (16): DataStream_Chunk, _chunk, controller, _handlers, identity, info, localParticipant, main (+8 more)

### Community 220 - "lib/src/types/audio_encoding.dart"
Cohesion: 0.12
Nodes (17): AudioEncoding, AudioEncodingExt, bitratePriority, copyWith, hashCode, maxBitrate, networkPriority, operator (+9 more)

### Community 221 - "video_encoding.dart"
Cohesion: 0.12
Nodes (15): ClientProtocolVersionExt, ClientProtocolVersion, bitratePriority, compareTo, copyWith, hashCode, maxBitrate, maxFramerate (+7 more)

### Community 224 - "participant_stats.dart"
Cohesion: 0.11
Nodes (23): build, createState, deactivate, initState, listeners, participant, ParticipantStatsWidget, _ParticipantStatsWidgetState (+15 more)

### Community 225 - "FlutterWindow"
Cohesion: 0.11
Nodes (4): FlutterWindow, flutter_controller_, FlutterWindow::FlutterWindow(), project_

### Community 226 - "T"
Cohesion: 0.20
Nodes (3): RingBuffer, RingBuffer, RingBuffer

### Community 227 - "e2ee.utils.dart"
Cohesion: 0.11
Nodes (15): createKeyMaterialFromString, dataOut, false, fromList, getAlgoOptions, isE2EESupported, isInsertableStreamSupported, isScriptTransformSupported (+7 more)

### Community 229 - "Visualizer"
Cohesion: 0.20
Nodes (5): calculateAmplitudeBarsFromFFT(), centerBands(), easeInOutCubic(), smoothTransition(), Visualizer

### Community 230 - ".resample"
Cohesion: 0.15
Nodes (3): AudioResampler, ResampleResult, AudioResamplerTest

### Community 231 - "exts.dart"
Cohesion: 0.12
Nodes (14): LKExampleExt, showDataReceivedDialog, showDisconnectDialog, showErrorDialog, showPlayAudioManuallyDialog, showPublishDialog, showReconnectDialog, showReconnectSuccessDialog (+6 more)

### Community 232 - "participant_info.dart"
Cohesion: 0.13
Nodes (13): audioAvailable, build, connectionQuality, enabledE2EE, isScreenShare, lkAudioSourceType, lkVideoSourceType, participant (+5 more)

### Community 233 - "message.dart"
Cohesion: 0.17
Nodes (13): AgentTranscript, content, copyWith, hashCode, id, operator, ReceivedMessageContent, SentMessageContent (+5 more)

### Community 234 - "room_configuration.dart"
Cohesion: 0.13
Nodes (13): agentName, agents, departureTimeout, deployment, emptyTimeout, fromJson, maxParticipants, maxPlayoutDelay (+5 more)

### Community 235 - "Float"
Cohesion: 0.22
Nodes (9): FFTComputeBandsResult, FFTProcessor, FFTResult, Float, .nyquistFrequency, WindowType, hamming, hanning (+1 more)

### Community 236 - "pffft_new_setup"
Cohesion: 0.19
Nodes (9): FFTSetup, setup_, cffti1_ps(), decompose(), pffft_aligned_free(), pffft_aligned_malloc(), pffft_destroy_setup(), pffft_new_setup() (+1 more)

### Community 238 - "e2ee/options.dart"
Cohesion: 0.22
Nodes (5): BaseKeyProvider, E2EEOptions, EncryptionType, keyProvider, sharedKey

### Community 240 - "toString$0$"
Cohesion: 0.22
Nodes (9): _Base64Encoder_encodeChunk(), _enumToString$0(), get$_errorExplanation(), get$_errorName(), get$invalidValue(), $mul(), toRadixString$1(), toString() (+1 more)

### Community 241 - ".CreateAndShow"
Cohesion: 0.14
Nodes (8): Point, x, y, Scale(), Win32Window::Win32Window(), WindowClassRegistrar, class_registered_, instance_

### Community 242 - "int? get"
Cohesion: 0.07
Nodes (20): _buffer, ByteRingBuffer, capacity, clear, isEmpty, _length, _start, takeBytes (+12 more)

### Community 244 - "Float"
Cohesion: 0.11
Nodes (18): FFTComputeBandsResult, FFTProcessor, FFTResult, Float, .nyquistFrequency, WindowType, hamming, hanning (+10 more)

### Community 245 - "index.js"
Cohesion: 0.06
Nodes (32): handler(), mockRes(), res, getOperatorName(), LIVEKIT_API_KEY, LIVEKIT_API_SECRET, LIVEKIT_URL, loadAccount() (+24 more)

### Community 246 - "endpoint.dart"
Cohesion: 0.17
Nodes (10): body, client, EndpointTokenSource, fetch, headers, method, statusCode, toString (+2 more)

### Community 247 - "Audio session management"
Cohesion: 0.14
Nodes (13): API reference, Audio processing, Audio session management, Automatic vs manual mode, Configuration timing, Defaults if you do nothing, Migrating from the old APIs, Observing audio engine state (+5 more)

### Community 248 - "package:flutter/material.dart"
Cohesion: 0.08
Nodes (10): DefaultFirebaseOptions, web, build, _devRoom, format, load, main, build (+2 more)

### Community 249 - "LKAudioTrack"
Cohesion: 0.17
Nodes (3): AudioProcessors, LKAudioTrack, LKRemoteAudioTrack

### Community 251 - "win32_window.cpp"
Cohesion: 0.18
Nodes (5): EnableFullDpiSupportIfAvailable(), Win32Window, child_content_, quit_on_close_, window_handle_

### Community 254 - "utils.cpp"
Cohesion: 0.19
Nodes (4): wWinMain(), CreateAndAttachConsole(), GetCommandLineArguments(), Utf8FromUtf16()

### Community 255 - "websocket_mock.dart"
Cohesion: 0.17
Nodes (7): connect, handlers, MockWebSocketConnector, onData, onDispose, onError, send

### Community 256 - "e2ee.sfi_guard.dart"
Cohesion: 0.17
Nodes (11): consecutiveSifCount, isSifAllowed, lastSifReceivedAt, MAX_SIF_COUNT, MAX_SIF_DURATION, recordSif, recordUserFrame, reset (+3 more)

### Community 259 - "manifest.json"
Cohesion: 0.18
Nodes (10): background_color, description, display, icons, name, orientation, prefer_related_applications, short_name (+2 more)

### Community 261 - "package:livekit_client/src/proto/livekit_models.pb.dart"
Cohesion: 0.11
Nodes (9): localAudioTrack, localParticipantData, remoteAudioTrack, remoteParticipantData, remoteSpeakerInfo, main, main, _testLayerDimensions (+1 more)

### Community 263 - "AudioProcessors"
Cohesion: 0.42
Nodes (3): AudioProcessors, AudioProcessors, AudioProcessors

### Community 265 - "SampleUploader.swift"
Cohesion: 0.29
Nodes (4): Constants, Constants, OSLog, ReplayKit

### Community 268 - "AudioReceiverStats"
Cohesion: 0.29
Nodes (7): AudioReceiverStats, AudioSenderStats, CodecStats, ReceiverStats, SenderStats, VideoReceiverStats, VideoSenderStats

### Community 269 - "NSObject"
Cohesion: 0.43
Nodes (3): Track, Track, Track

### Community 270 - "lib/src/agent/constants.dart"
Cohesion: 0.33
Nodes (5): lkAgentInputsAttributeKey, lkAgentNameAttributeKey, lkAgentOutputsAttributeKey, lkAgentStateAttributeKey, lkPublishOnBehalfAttributeKey

### Community 271 - "lib/src/data_stream/errors.dart"
Cohesion: 0.33
Nodes (5): DataStreamError, DataStreamErrorReason, message, reason, toString

### Community 272 - "lib/src/track/web/_audio_context.dart"
Cohesion: 0.40
Nodes (4): AudioContextState, fromValue, fromValues, value

### Community 274 - "LiveKit Flutter Example"
Cohesion: 0.50
Nodes (3): End-to-End Encryption (E2EE), LiveKit Flutter Example, Quickstart

### Community 276 - "Size"
Cohesion: 0.50
Nodes (3): Size, height, width

### Community 278 - "vercel.json"
Cohesion: 0.50
Nodes (3): buildCommand, installCommand, outputDirectory

## Knowledge Gaps
- **4240 isolated node(s):** `bootstrap.sh script`, `broadcastStarted`, `broadcastStopped`, `Constants`, `.socketFilePath` (+4235 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 5225 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **48 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `DarwinNotification` connect `DarwinNotification` to `Subscription`, `String`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Why does `_` connect `_` to `internal/events.dart`, `dart:typed_data`, `signal_client_test.dart`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `Foundation` connect `Foundation` to `SampleUploader.swift`, `T`, `DarwinNotification`, `LKAudioSwitchManager.kt`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **What connects `bootstrap.sh script`, `broadcastStarted`, `broadcastStopped` to the rest of the system?**
  _4240 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `_eval$1` be split into smaller, more focused modules?**
  _Cohesion score 0.06095791001451379 - nodes in this community are weakly interconnected._
- **Should `call$1` be split into smaller, more focused modules?**
  _Cohesion score 0.08048780487804878 - nodes in this community are weakly interconnected._
- **Should `log$4` be split into smaller, more focused modules?**
  _Cohesion score 0.09309309309309309 - nodes in this community are weakly interconnected._