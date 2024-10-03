#!/usr/bin/env -S deno run --check --allow-write
import {
  BasicManipulatorBuilder,
  complexModifications,
  defaultGlobals,
  device,
  FromKeyCode,
  ifDevice,
  ifDeviceExists,
  ifInputSource,
  ifVar,
  KarabinerConfigExt,
  KarabinerProfileExt,
  KeyboardIdentifier,
  map,
  rule,
  saveConfig,
  simpleModifications,
  stroke,
  toRemoveNotificationMessage,
  toSetVar,
  withCondition,
  withMapper,
} from "./utils.ts";

const DEVICES = {
  apple: {
    vendor_id: 1452,
  },
  macBook2018: {
    product_id: 634,
    vendor_id: 1452,
  },
  progresTouchRetroTiny: {
    product_id: 4,
    vendor_id: 11240,
  },
  realforceR2: {
    product_id: 328,
    vendor_id: 2131,
  },
  mint60: {
    product_id: 0,
    vendor_id: 65261,
  },
  akl680: {
    product_id: 591,
    vendor_id: 1452,
  },
} as const satisfies Record<string, KeyboardIdentifier>;

const LAYER_VAR = "layer";

const LAYERS = {
  normal: 0,
  lower: 1,
  raise: 2,
} as const;

type Layer = keyof typeof LAYERS;

function ifLayer(layer: Layer) {
  return ifVar(LAYER_VAR, LAYERS[layer]);
}

function toMOLayer(layer: Layer) {
  return toSetVar(LAYER_VAR, LAYERS[layer], LAYERS.normal);
}

function backspaceRule() {
  return rule(
    "Exchange Command+Backspace/Delete and Option+Backspace/Delete",
  ).manipulators([
    withCondition(ifLayer("normal"))([
      map("⌫", "command", "shift").to("⌫", "option"),
      map("⌫", "option", "shift").to("⌫", "command"),
      map("⌦", "command", "shift").to("⌦", "option"),
      map("⌦", "option", "shift").to("⌦", "command"),
    ]),
    withCondition(ifLayer("lower"))([
      map("⌫", "command", "shift").to("⌦", "option"),
      map("⌫", "option", "shift").to("⌦", "command"),
      map("⌫", null, "any").to("⌦"),
    ]),
    withCondition(ifLayer("raise"))([
      map("⌫", "command", "shift").to("⌦", "option"),
      map("⌫", "option", "shift").to("⌦", "command"),
      map("⌫", null, "any").to("⌦"),
    ]),
  ]);
}

const arrowKeys = ["←", "↓", "↑", "→"] as const;

function modArrowRule() {
  return rule(
    "Exchange command + arrow keys with option + arrow keys",
  ).manipulators(
    arrowKeys.flatMap((key) => [
      map(key, ["command", "option"], "any").to(key, ["command", "option"]),
      map(key, "command", "any").to(key, "option"),
      map(key, "option", "any").to(key, "command"),
    ]),
  );
}

function mapArrows(
  up: FromKeyCode,
  left: FromKeyCode,
  down: FromKeyCode,
  right: FromKeyCode,
) {
  const alt = [left, down, up, right];
  return arrowKeys.flatMap((key, i) => [
    map(alt[i], ["command", "option"], "any").to(key, ["command", "option"]),
    map(alt[i], "command", "any").to(key, "option"),
    map(alt[i], "option", "any").to(key, "command"),
    map(alt[i], null, "any").to(key),
  ]);
}

function capsLockRule() {
  return rule("Change Caps Lock").manipulators([
    map("caps_lock", "shift")
      .to("left_command", "shift")
      .toIfAlone(stroke("->")),
    map("caps_lock", "command")
      .to("left_command", "shift")
      .toIfAlone(stroke("=>")),
    map("caps_lock")
      .condition(ifLayer("lower"))
      .to("left_command", "shift")
      .toIfAlone(stroke("-")),
    map("caps_lock", null, "any")
      .to("left_command", "shift")
      .toIfAlone(stroke("_")),
  ]);
}

function lowerRule() {
  return rule("Lower Layer").manipulators([
    withCondition(ifLayer("lower"))([
      map("1").to(stroke("!")),
      map("2").to(stroke("@")),
      map("3").to(stroke("#")),
      map("4").to(stroke("$")),
      map("5").to(stroke("%")),

      map("6").to(stroke("^")),
      map("7").to(stroke("&")),
      map("8").to(stroke("*")),
      map("9").to(stroke("(")),
      map("0").to(stroke(")")),
      map("-").to(stroke("_")),
      map("=").to(stroke("+")),

      map("q").to(stroke("!")),
      map("w").to(stroke("@")),
      map("e").to(stroke("#")),
      map("r").to(stroke("$")),
      map("t").to(stroke("%")),

      map("a").to(stroke("^")),
      map("s").to(stroke("&")),
      map("d").to(stroke("*")),
      map("f").to(stroke("=")),
      map("g").to(stroke("+")),

      ...mapArrows("i", "j", "k", "l"),
      map("u", null, "any").to("home"),
      map("o", null, "any").to("end"),
      map("p", null, "any").to("page_up"),
      map(";", null, "any").to("page_down"),

      map("z").to(stroke("(")),
      map("x").to(stroke(")")),
      map("c").to(stroke("/")),
      map("v").to(stroke("?")),

      map("[").to(stroke("{")),
      map("]").to(stroke("}")),
    ]),
    map("right_option", null, "any")
      .condition(ifLayer("normal"))
      .to(toMOLayer("lower"))
      .toIfAlone("escape"),
  ]);
}

function raiseRule() {
  return rule("Raise Layer").manipulators([
    withCondition(ifLayer("raise"))([
      ...mapArrows("w", "a", "s", "d"),
      map("q", null, "any").to("home"),
      map("e", null, "any").to("end"),
      map("r", null, "any").to("page_up"),
      map("f", null, "any").to("page_down"),

      map("z").to(stroke("`")),
      map("x").to(stroke("~")),
    ]),
    map("right_control", null, "any")
      .condition(ifLayer("normal"))
      .to(toMOLayer("raise")),
  ]);
}

function macRule() {
  return rule("MacBook Internal Keyboard")
    .condition(ifDevice(DEVICES.apple))
    .manipulators([
      map("right_command", null, "any")
        .condition(ifLayer("normal"))
        .to(toMOLayer("lower"))
        .toIfAlone("escape"),
    ]);
}

function realforceRule() {
  return rule("REALFORCE")
    .condition(ifDevice(DEVICES.realforceR2))
    .manipulators([
      withCondition(ifDeviceExists(DEVICES.progresTouchRetroTiny))([
        map("spacebar", null, "any")
          .condition(ifLayer("normal"))
          .to(toMOLayer("lower"))
          .toIfAlone("return_or_enter"),
        map("b", null, "any")
          .to("delete_or_backspace"),
      ]),
    ]);
}

const tsrngnMap = {
  q: "q",
  w: "w",
  e: "e",
  r: "d",
  t: "l",
  y: "v",
  u: "y",
  i: "r",
  o: "j",
  p: "p",
  "[": "[",
  "]": "]",
  "\\": "\\",

  a: "a",
  s: "u",
  d: "o",
  f: "i",
  g: "g",
  h: "h",
  j: "t",
  k: "s",
  l: "k",
  ";": ",",
  "'": ".",

  z: "z",
  x: "x",
  c: "c",
  v: "f",
  b: "b",
  n: "n",
  m: "m",
  ",": "-",
  ".": ";",
  "/": "/",
  "-": "'",
} as const;

function tsrngnRule() {
  const modeVar = "tsrngn";

  function remapKeys() {
    const keyMap = Object.fromEntries(
      Object.entries(tsrngnMap).filter(([from, to]) => from !== to),
    ) as Partial<typeof tsrngnRule>;

    return withMapper(keyMap)((from, to) => map(from, null, "shift").to(to));
  }

  enum Mode {
    off,
    ja,
    full,
  }

  function switchMode(mode: Mode, message: string, m: BasicManipulatorBuilder) {
    return m
      .toVar(modeVar, mode)
      .parameters({ "basic.to_delayed_action_delay_milliseconds": 2000 })
      .toNotificationMessage(modeVar, message)
      .toDelayedAction(
        toRemoveNotificationMessage(modeVar),
        toRemoveNotificationMessage(modeVar),
      );
  }

  return rule("JA tsrngn").manipulators([
    withCondition(
      ifVar(modeVar, 1),
      ifInputSource({ language: "ja" }),
    )([remapKeys()]),
    withCondition(ifVar(modeVar, 2))([remapKeys()]),
    switchMode(
      Mode.off,
      "QWERTY MODE",
      map("page_up").condition(ifLayer("raise")),
    ),
    switchMode(
      Mode.off,
      "QWERTY MODE",
      map("page_down").condition(ifLayer("raise"), ifVar(modeVar, Mode.full)),
    ),
    switchMode(
      Mode.ja,
      "TSRNGN MODE",
      map("page_down").condition(ifLayer("raise"), ifVar(modeVar, Mode.off)),
    ),
    switchMode(
      Mode.full,
      "FULL TSRNGN MODE",
      map("page_down").condition(ifLayer("raise"), ifVar(modeVar, Mode.ja)),
    ),
  ]);
}

const profile: KarabinerProfileExt = {
  complex_modifications: complexModifications(
    [
      backspaceRule(),
      modArrowRule(),
      capsLockRule(),
      lowerRule(),
      raiseRule(),
      macRule(),
      realforceRule(),
      tsrngnRule(),
    ],
    {
      "basic.to_if_alone_timeout_milliseconds": 250,
      "basic.to_if_held_down_threshold_milliseconds": 250,
    },
  ),
  devices: [
    device(DEVICES.macBook2018, {
      simple_modifications: simpleModifications([
        map("fn").to("left_command"),
        map("left_command").to("escape"),
        map("right_option").to("fn"),
      ]),
    }),
    device(DEVICES.progresTouchRetroTiny, {
      simple_modifications: simpleModifications([
        map("escape").to("grave_accent_and_tilde"),
        map("left_command").to("left_control"),
        map("left_control").to("left_command"),
        map("right_control").to("japanese_eisuu"),
      ]),
    }),
    device(DEVICES.realforceR2, {
      simple_modifications: simpleModifications([
        map("keypad_num_lock").toNone(),
        map("left_command").to("left_control"),
        map("left_control").to("left_command"),
        map("right_command").to("right_control"),
      ]),
    }),
    device(DEVICES.mint60, {
      simple_modifications: simpleModifications([
        map("left_command").to("left_control"),
        map("left_control").to("left_command"),
      ]),
    }),
    device(DEVICES.akl680, {
      simple_modifications: simpleModifications([
        map("escape").to("grave_accent_and_tilde"),
        map("left_command").to("left_control"),
        map("left_control").to("left_command"),
        map("right_option").to("right_command"),
      ]),
    }),
  ],
  fn_function_keys: simpleModifications([
    map("f1").toConsumerKey("display_brightness_decrement"),
    map("f2").toConsumerKey("display_brightness_increment"),
    map("f3").to("mission_control"),
    map("f4").to("launchpad"),
    map("f5").to("illumination_decrement"),
    map("f6").to("illumination_increment"),
    map("f7").toConsumerKey("rewind"),
    map("f8").toConsumerKey("play_or_pause"),
    map("f9").toConsumerKey("fastforward"),
    map("f10").toConsumerKey("mute"),
    map("f11").toConsumerKey("volume_decrement"),
    map("f12").toConsumerKey("volume_increment"),
  ]),
  name: "Default profile",
  parameters: {
    delay_milliseconds_before_open_device: 1000,
  },
  selected: true,
  simple_modifications: [],
  virtual_hid_keyboard: {
    country_code: 0,
    indicate_sticky_modifier_keys_state: true,
    mouse_key_xy_scale: 100,
  },
};

const config: KarabinerConfigExt = {
  global: defaultGlobals,
  profiles: [profile],
};

await saveConfig(new URL("karabiner.json", import.meta.url), config);
