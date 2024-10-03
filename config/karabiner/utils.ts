export * from "https://deno.land/x/karabinerts/deno.ts";
export { BasicManipulatorBuilder } from "https://deno.land/x/karabinerts/config/manipulator.ts";

import {
  DeviceIdentifier,
  FromEvent,
  KarabinerProfile,
  ToEvent,
  toKey,
} from "https://deno.land/x/karabinerts/deno.ts";
import { BasicManipulatorBuilder } from "https://deno.land/x/karabinerts/config/manipulator.ts";

export interface SimpleManipulator {
  from: FromEvent;
  to?: ToEvent[];
}

export type SimpleModifications = SimpleManipulator[];

export type KarabinerGlobal = Record<string, unknown>;

export interface KarabinerDevice {
  disable_built_in_keyboard_if_exists: boolean;
  fn_function_keys: SimpleModifications;
  identifiers: DeviceIdentifier;
  ignore: boolean;
  manipulate_caps_lock_led: boolean;
  simple_modifications: SimpleModifications;
  treat_as_built_in_keyboard: boolean;
}

export interface KarabinerProfileExt extends KarabinerProfile {
  devices: KarabinerDevice[];
  fn_function_keys: SimpleModifications;
  parameters: Record<string, unknown>;
  simple_modifications: SimpleModifications;
  virtual_hid_keyboard: Record<string, unknown>;
}

export interface KarabinerConfigExt {
  global: KarabinerGlobal;
  profiles: KarabinerProfileExt[];
}

export const defaultGlobals: KarabinerGlobal = {
  ask_for_confirmation_before_quitting: true,
  check_for_updates_on_startup: true,
  show_in_menu_bar: true,
  show_profile_name_in_menu_bar: false,
  unsafe_ui: false,
};

export function simpleModifications(
  builders: BasicManipulatorBuilder[],
): SimpleModifications {
  return builders
    .flatMap((builder) => builder.build())
    .map((m) => ({ ...m, type: undefined }));
}

const keyAliases = {
  "-": toKey("-"),
  _: toKey("-", "shift"),
  "=": toKey("="),
  "+": toKey("=", "shift"),
  ">": toKey(".", "shift"),
  "/": toKey("/"),
  "?": toKey("/", "shift"),
  "!": toKey("1", "shift"),
  "@": toKey("2", "shift"),
  "#": toKey("3", "shift"),
  $: toKey("4", "shift"),
  "%": toKey("5", "shift"),
  "^": toKey("6", "shift"),
  "&": toKey("7", "shift"),
  "*": toKey("8", "shift"),
  "(": toKey("9", "shift"),
  ")": toKey("0", "shift"),
  "{": toKey("[", "shift"),
  "}": toKey("]", "shift"),
  '"': toKey("'", "shift"),
  "`": toKey("`"),
  "~": toKey("`", "shift"),
} as const satisfies Record<string, ToEvent>;

type KeyAlias = keyof typeof keyAliases;

export function stroke(text: string): ToEvent[] {
  return [...text].map(
    (c): ToEvent =>
      keyAliases[c as KeyAlias] ??
        (() => {
          throw new Error(`unknown character '${c}'`);
        })(),
  );
}

export type KeyboardIdentifier = {
  product_id?: number;
  vendor_id: number;
};

export function device(
  keyboard: KeyboardIdentifier,
  settings: Pick<KarabinerDevice, "simple_modifications">,
): KarabinerDevice {
  return {
    identifiers: {
      is_keyboard: true,
      is_pointing_device: false,
      ...keyboard,
    },
    disable_built_in_keyboard_if_exists: false,
    ignore: false,
    manipulate_caps_lock_led: true,
    treat_as_built_in_keyboard: false,
    fn_function_keys: [],
    ...settings,
  };
}

export async function saveConfig(path: URL, config: KarabinerConfigExt) {
  await Deno.writeTextFile(
    path,
    JSON.stringify(
      config,
      (_key, value) => {
        if (
          typeof value === "object" &&
          value !== null &&
          !Array.isArray(value)
        ) {
          return Object.fromEntries(
            Object.entries(value).sort(([ak], [bk]) => ak.localeCompare(bk)),
          );
        }
        return value;
      },
      4,
    ),
  );
}
