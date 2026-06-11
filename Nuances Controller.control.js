// Nuances Controller MK2 – Bitwig Studio Controller Script
// Place this file in:
//   macOS : ~/Documents/Bitwig Studio/Controller Scripts/Nuances/
//   Windows: %USERPROFILE%\Documents\Bitwig Studio\Controller Scripts\Nuances\
//
// All 9 fader slots appear in Bitwig's mapping browser.
// Right-click any parameter in Bitwig and choose "Map to controller" to assign.
//
// ── CC MAP ───────────────────────────────────────────────────────────────────
//   Bank 1 (default) : CC 11, CC 1, CC 21
//   Bank 2           : CC 2,  CC 3,  CC 4
//   Bank 3           : CC 5,  CC 6,  CC 7
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

var FADERS = [
   { name: "Bank 1 – Fader 1", cc: 11 },
   { name: "Bank 1 – Fader 2", cc:  1 },
   { name: "Bank 1 – Fader 3", cc: 21 },
   { name: "Bank 2 – Fader 1", cc:  2 },
   { name: "Bank 2 – Fader 2", cc:  3 },
   { name: "Bank 2 – Fader 3", cc:  4 },
   { name: "Bank 3 – Fader 1", cc:  5 },
   { name: "Bank 3 – Fader 2", cc:  6 },
   { name: "Bank 3 – Fader 3", cc:  7 },
];

function init() {
   var hw = host.createHardwareSurface();

   for (var i = 0; i < FADERS.length; i++) {
      var knob = hw.createAbsoluteHardwareKnob(FADERS[i].name);
      knob.setAdjustValueMatcher(
          host.getMidiInPort(0).createAbsoluteCCValueMatcher(
              MIDI_CHANNEL, FADERS[i].cc
          )
      );
   }

   println("Nuances Controller initialized!");
}

function flush() {}

function exit() {}