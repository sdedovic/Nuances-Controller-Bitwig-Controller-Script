// Nuances Controller MK2 – Bitwig Studio Controller Script
// Place this file in:
//   macOS : ~/Documents/Bitwig Studio/Controller Scripts/Nuances/
//   Windows: %USERPROFILE%\Documents\Bitwig Studio\Controller Scripts\Nuances\
//
// Bank 1 (CC 11, 1, 21) drives Remote Controls slots 0-2 of the currently
// selected device, directly via .set(). Since Remote Controls page
// assignments are saved with device presets, any preset with parameters
// assigned to slots 0-2 will respond to Bank 1 automatically, in any project.
//
// Banks 2/3 remain available as standard hardware knobs in Bitwig's
// mapping browser for manual per-project mapping.
//
// ── CC MAP ───────────────────────────────────────────────────────────────────
//   Bank 1 : CC 11, CC 1, CC 21  → Remote Controls slots 0, 1, 2
//   Bank 2 : CC 2,  CC 3,  CC 4  → mapping browser only
//   Bank 3 : CC 5,  CC 6,  CC 7  → mapping browser only
// ─────────────────────────────────────────────────────────────────────────────

loadAPI(17);
host.setShouldFailOnDeprecatedUse(true);
host.defineController("Nuances", "Nuances Controller", "0.1", "53bdbafc-881e-4a62-aa3b-935f047c6f64", "sdedovic");
host.defineMidiPorts(1, 0);

if (host.platformIsWindows()) {
   host.addDeviceNameBasedDiscoveryPair(["Nuances Controller MK2"], []);
} else if (host.platformIsMac()) {
   host.addDeviceNameBasedDiscoveryPair(["Nuances Controller MK2"], []);
} else if (host.platformIsLinux()) {
   host.addDeviceNameBasedDiscoveryPair(["Nuances Controller MK2"], []);
}

var MIDI_CHANNEL = 0; // Channel 1 → zero-indexed = 0
var REMOTE_CONTROL_COUNT = 3;

// CCs handled by Bank 1 -> Remote Controls slot index
var REMOTE_CC_MAP = {
   11: 0,
   1:  1,
   21: 2
};

// Banks 2/3 exposed as plain hardware knobs for manual mapping
var BROWSER_FADERS = [
   { name: "Bank 2 – Fader 1", cc: 2 },
   { name: "Bank 2 – Fader 2", cc: 3 },
   { name: "Bank 2 – Fader 3", cc: 4 },
   { name: "Bank 3 – Fader 1", cc: 5 },
   { name: "Bank 3 – Fader 2", cc: 6 },
   { name: "Bank 3 – Fader 3", cc: 7 },
];

var cursorTrack;
var cursorDevice;
var remoteControls;

function init() {
   var hw = host.createHardwareSurface();

   // Cursor that follows the currently selected device, with a
   // Remote Controls page of REMOTE_CONTROL_COUNT parameters.
   cursorTrack = host.createCursorTrack("NuancesCursorTrack", "Nuances Cursor Track", 0, 0, true);
   cursorDevice = cursorTrack.createCursorDevice("NuancesCursorDevice", "Nuances Cursor Device", 0, CursorDeviceFollowMode.FOLLOW_SELECTION);
   remoteControls = cursorDevice.createCursorRemoteControlsPage(REMOTE_CONTROL_COUNT);

   for (var p = 0; p < REMOTE_CONTROL_COUNT; p++) {
      remoteControls.getParameter(p).setIndication(true);
   }

   // Bank 1: direct CC -> Remote Controls slot via MIDI callback
   host.getMidiInPort(0).setMidiCallback(onMidi);

   // Banks 2/3: regular hardware knobs for manual mapping
   for (var i = 0; i < BROWSER_FADERS.length; i++) {
      var knob = hw.createAbsoluteHardwareKnob(BROWSER_FADERS[i].name);
      knob.setAdjustValueMatcher(
          host.getMidiInPort(0).createAbsoluteCCValueMatcher(
              MIDI_CHANNEL, BROWSER_FADERS[i].cc
          )
      );
   }

   println("Nuances Controller initialized!");
}

function onMidi(status, data1, data2) {
   var isCC = (status & 0xF0) === 0xB0;
   var channel = status & 0x0F;
   if (!isCC || channel !== MIDI_CHANNEL) return;

   var cc = data1;
   var value = data2; // 0-127

   if (REMOTE_CC_MAP.hasOwnProperty(cc)) {
      var slot = REMOTE_CC_MAP[cc];
      remoteControls.getParameter(slot).set(value, 128);
   }
}

function flush() {}

function exit() {}
