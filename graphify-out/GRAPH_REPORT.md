# Graph Report - RemoteAssist  (2026-11-05)

## Corpus Check
- 47 files · ~9,601 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 3, .css 1)

## Summary
- 300 nodes · 514 edges · 17 communities (12 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c3bd03ef`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Call.tsx
- PreJoin.tsx
- with
- compilerOptions
- compilerOptions
- Gate.test.tsx
- dependencies
- scripts
- tsconfig.json
- vite-env.d.ts
- package.json
- build-assist.sh
- dev-room.sh
- updates
- ThreadX Remote Assist
- index.js
- CLAUDE.md

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 18 edges
2. `react` - 16 edges
3. `compilerOptions` - 16 edges
4. `livekit-client` - 12 edges
5. `Gate()` - 10 edges
6. `PreJoin()` - 10 edges
7. `vitest` - 9 edges
8. `Session()` - 9 edges
9. `RoomView()` - 9 edges
10. `@livekit/components-react` - 8 edges

## Surprising Connections (you probably didn't know these)
- `Session()` --calls--> `Call()`  [EXTRACTED]
  src/Session.tsx → src/room/Call.tsx
- `DeviceMenu()` --calls--> `deviceName()`  [EXTRACTED]
  src/room/Controls.tsx → src/devices.ts
- `renderCall()` --calls--> `Call()`  [EXTRACTED]
  src/room/Call.test.tsx → src/room/Call.tsx
- `order()` --indirect_call--> `trackKey()`  [INFERRED]
  src/room/order.test.ts → src/room/order.ts
- `remoteAssistToken` --calls--> `authorize()`  [EXTRACTED]
  functions/index.js → functions/tokenGrant.js

## Import Cycles
- None detected.

## Communities (17 total, 5 thin omitted)

### Community 0 - "Call.tsx"
Cohesion: 0.08
Nodes (43): @livekit/components-react@^2.9.25, lucide-react@^1.69.0, livekit-client, @livekit/components-react, lucide-react, Call(), DEVICE_ERRORS, DEVICE_FAILURE_TEXT (+35 more)

### Community 1 - "PreJoin.tsx"
Cohesion: 0.10
Nodes (34): jose@^6.2.15, firebase, jose, react, App(), devAssistGrant(), deviceName(), useDeviceList() (+26 more)

### Community 2 - "with"
Cohesion: 0.09
Nodes (23): run, defaults, runs-on, steps, jobs, functions, web, name (+15 more)

### Community 3 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection, moduleResolution (+11 more)

### Community 4 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, moduleResolution, noEmit (+9 more)

### Community 5 - "Gate.test.tsx"
Cohesion: 0.22
Nodes (5): AuthListener, callableError(), fail(), grant, grantResults

### Community 6 - "dependencies"
Cohesion: 0.25
Nodes (8): dependencies, firebase@^13.2.0, livekit-client@^2.23.0, react@^19.3.1, react-dom@^19.3.1, tslib@^2.8.1, react-dom, tslib

### Community 7 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, preview, test

### Community 15 - "package.json"
Cohesion: 0.07
Nodes (43): devDependencies, eslint@^10.14.0, @eslint/js@^10.0.1, eslint-plugin-react-hooks@^7.1.1, eslint-plugin-react-refresh@^0.5.7, globals@^17.14.0, jsdom@^31.0.0, tailwindcss@^4.3.4 (+35 more)

### Community 72 - "updates"
Cohesion: 0.25
Nodes (7): interval, updates, directory, open-pull-requests-limit, package-ecosystem, schedule, version

### Community 184 - "ThreadX Remote Assist"
Cohesion: 0.40
Nodes (4): Deploy, Develop, How it works, ThreadX Remote Assist

### Community 245 - "index.js"
Cohesion: 0.08
Nodes (28): getOperatorName(), LIVEKIT_API_KEY, LIVEKIT_API_SECRET, LIVEKIT_URL, loadAccount(), remoteAssistToken, ROOM, dependencies (+20 more)

## Knowledge Gaps
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `PreJoin.tsx` to `Call.tsx`, `dependencies`, `package.json`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **Should `Call.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07532467532467532 - nodes in this community are weakly interconnected._
- **Why does `livekit-client` connect `Call.tsx` to `PreJoin.tsx`, `dependencies`, `package.json`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Should `PreJoin.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09714285714285714 - nodes in this community are weakly interconnected._
- **Why does `devDependencies` connect `package.json` to `PreJoin.tsx`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Should `with` be split into smaller, more focused modules?**
  _Cohesion score 0.09420289855072464 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._