import { defineConfig } from "https://raw.githubusercontent.com/NagayamaRyoga/gh-red/main/src/config/types.ts";

async function saveCommandOutput(
  to: string,
  cmd: string,
  ...args: string[]
) {
  const { stdout } = await new Deno.Command(cmd, {
    args,
    stderr: "inherit",
  }).output();

  await Deno.writeFile(to, stdout);
}

async function saveRemoteFile(
  to: string,
  from: string,
) {
  const res = await fetch(new URL(from));
  if (res.body !== null) {
    await Deno.writeFile(to, res.body);
  }
}

export default defineConfig({
  tools: [
    {
      name: "rossmacarthur/sheldon",
      completions: [
        {
          glob: "completions/sheldon.zsh",
          as: "_sheldon",
        },
      ],
    },
    {
      name: "NagayamaRyoga/jargon",
      async onDownload({ packageDir, bin }) {
        await saveCommandOutput(
          `${packageDir}/jargon.zsh`,
          bin.jargon,
          "init",
        );
      },
    },
    {
      name: "direnv/direnv",
      rename: [
        { from: "direnv*", to: "direnv" },
      ],
      async onDownload({ packageDir, bin }) {
        await Deno.chmod(bin.direnv, 0o755);
        await saveCommandOutput(
          `${packageDir}/direnv.zsh`,
          bin.direnv,
          "hook",
          "zsh",
        );
      },
    },
    {
      name: "dandavison/delta",
    },
    {
      name: "itchyny/mmv",
    },
    {
      name: "BurntSushi/ripgrep",
      executables: [
        { glob: "**/rg", as: "rg" },
      ],
    },
    {
      name: "x-motemen/ghq",
    },
    {
      name: "jesseduffield/lazygit",
    },
    {
      name: "cli/cli",
      executables: [
        { glob: "**/gh", as: "gh" },
      ],
      async onDownload({ packageDir, bin }) {
        await saveCommandOutput(
          `${packageDir}/_gh`,
          bin.gh,
          "completion",
          "--shell",
          "zsh",
        );
      },
    },
    {
      name: "eza-community/eza",
      enabled: Deno.build.os !== "darwin",
      async onDownload({ packageDir }) {
        await saveRemoteFile(
          `${packageDir}/_eza`,
          "https://raw.githubusercontent.com/eza-community/eza/main/completions/zsh/_eza",
        );
      },
    },
    {
      name: "mikefarah/yq",
      rename: [
        { from: "yq_*", to: "yq" },
      ],
      async onDownload({ packageDir, bin }) {
        await saveCommandOutput(
          `${packageDir}/_yq`,
          bin.yq,
          "shell-completion",
          "zsh",
        );
      },
    },
    {
      name: "rhysd/hgrep",
      async onDownload({ packageDir, bin }) {
        await saveCommandOutput(
          `${packageDir}/_hgrep`,
          bin.hgrep,
          "--generate-completion-script",
          "zsh",
        );
      },
    },
    {
      name: "denisidoro/navi",
    },
    {
      name: "dbrgn/tealdeer",
      rename: [
        { from: "tealdeer*", to: "tldr" },
      ],
      executables: [
        { glob: "tldr", as: "tldr" },
      ],
      async onDownload({ packageDir }) {
        await saveRemoteFile(
          `${packageDir}/_tldr`,
          "https://github.com/dbrgn/tealdeer/releases/latest/download/completions_zsh",
        );
      },
    },
    {
      name: "junegunn/fzf",
      async onDownload({ packageDir }) {
        await saveRemoteFile(
          `${packageDir}/_fzf`,
          "https://raw.githubusercontent.com/junegunn/fzf/master/shell/completion.zsh",
        );
      },
    },
    {
      name: "sharkdp/bat",
      completions: [
        { glob: "*/autocomplete/bat.zsh", as: "_bat" },
      ],
    },
    {
      name: "sharkdp/fd",
    },
    {
      name: "sharkdp/hexyl",
    },
    {
      name: "XAMPPRocky/tokei",
    },
    {
      name: "neovim/neovim",
      enabled: Deno.build.arch === "x86_64",
      use: (() => {
        switch (Deno.build.os) {
          case "darwin":
            return "nvim-macos.tar.gz";
          case "linux":
            return "nvim-linux64.tar.gz";
          default:
            return undefined;
        }
      })(),
      executables: [
        { glob: "**/nvim", as: "nvim" },
      ],
    },
    {
      name: "equalsraf/win32yank",
      enabled: Deno.env.has("WSLENV") && Deno.build.arch === "x86_64",
      use: `win32yank-x64*`,
      executables: [
        { glob: "**/win32yank.exe", as: "win32yank.exe" },
      ],
    },
  ],
});
