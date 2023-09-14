#!/usr/bin/env -S deno run --allow-read --allow-write --allow-env
import {
  Settings,
  Snippet,
  UserCompletionSource,
} from "https://raw.githubusercontent.com/yuki-yano/zeno.zsh/main/src/type/settings.ts";
import { FzfOptions } from "https://raw.githubusercontent.com/yuki-yano/zeno.zsh/main/src/type/fzf.ts";
import { dirname } from "https://deno.land/std/path/mod.ts";

const zenoHome = (() => {
  const zenoHome = Deno.env.get("ZENO_HOME");
  if (zenoHome !== undefined) {
    return zenoHome;
  }

  const xdgConfigHome = Deno.env.get("XDG_CONFIG_HOME");
  if (xdgConfigHome !== undefined) {
    return `${xdgConfigHome}/zeno`;
  }

  const home = Deno.env.get("HOME");
  if (home !== undefined) {
    return `${home}/.config/zeno`;
  }

  return "";
})();

type PackageJSON = {
  scripts?: Record<string, string>;
};

const findPackageJSON = async (
  cwd: string,
): Promise<PackageJSON | undefined> => {
  for (let dir = cwd;;) {
    try {
      const path = `${dir}/package.json`;
      return JSON.parse(await Deno.readTextFile(path));
    } catch (_err) {
      // ignore
    }

    const parent = dirname(dir);
    if (parent === dir) {
      break;
    }
    dir = parent;
  }

  return undefined;
};

// cd
const cdSnippets: ReadonlyArray<Snippet> = [
  {
    name: "--",
    keyword: "--",
    snippet: "popd",
  },
  {
    name: "..",
    keyword: "..",
    snippet: "cd ..",
  },
  {
    name: "../..",
    keyword: "../..",
    snippet: "cd ../..",
  },
  {
    name: "../../..",
    keyword: "../../..",
    snippet: "cd ../../..",
  },
];

// git
const gitSnippets: ReadonlyArray<Snippet> = [
  {
    name: "g",
    keyword: "g",
    snippet: "git",
  },
  {
    name: "git aa",
    keyword: "aa",
    snippet: "add -vA",
    context: {
      lbuffer: "^git\\s",
    },
  },
  {
    name: "git ai",
    keyword: "ai",
    snippet: "add -i",
    context: {
      lbuffer: "^git\\s",
    },
  },
  {
    name: "git b",
    keyword: "b",
    snippet: "branch",
    context: {
      lbuffer: "^git\\s",
    },
  },
  {
    name: "git c",
    keyword: "c",
    snippet: "commit",
    context: {
      lbuffer: "^git\\s",
    },
  },
  {
    name: "git cam",
    keyword: "cam",
    snippet: "commit --amend --no-edit",
    context: {
      lbuffer: "^git\\s",
    },
  },
  {
    name: "git cm",
    keyword: "cm",
    snippet: "commit -m '{{}}'",
    context: {
      lbuffer: "^git\\s",
    },
  },
  {
    name: "git C",
    keyword: "C",
    snippet: "cz",
    context: {
      lbuffer: "^git\\s",
    },
  },
  {
    name: "git cp",
    keyword: "cp",
    snippet: "cherry-pick",
    context: {
      lbuffer: "^git\\s",
    },
  },
  {
    name: "git st",
    keyword: "st",
    snippet: "diff --stat",
    context: {
      lbuffer: "^git\\s",
    },
  },
  {
    name: "git stat",
    keyword: "stat",
    snippet: "diff --stat",
    context: {
      lbuffer: "^git\\s",
    },
  },
  {
    name: "git stats",
    keyword: "stats",
    snippet: "diff --stat --staged",
    context: {
      lbuffer: "^git\\s",
    },
  },
  {
    name: "git sts",
    keyword: "sts",
    snippet: "diff --stat --staged",
    context: {
      lbuffer: "^git\\s",
    },
  },
  {
    name: "git dfi",
    keyword: "dfi",
    snippet: "df --ignore-all-space",
    context: {
      lbuffer: "^git\\s",
    },
  },
  {
    name: "git dfs",
    keyword: "dfs",
    snippet: "df --staged",
    context: {
      lbuffer: "^git\\s",
    },
  },
  {
    name: "git dfsi",
    keyword: "dfsi",
    snippet: "df --staged --ignore-all-space",
    context: {
      lbuffer: "^git\\s",
    },
  },
  {
    name: "git f",
    keyword: "f",
    snippet: "fetch",
    context: {
      lbuffer: "^git\\s",
    },
  },
  {
    name: "git fu",
    keyword: "fu",
    snippet: "fetch upstream",
    context: {
      lbuffer: "^git\\s",
    },
  },
  {
    name: "git lg",
    keyword: "lg",
    snippet: "graph",
    context: {
      lbuffer: "^git\\s",
    },
  },
  {
    name: "git pl",
    keyword: "pl",
    snippet: "pull",
    context: {
      lbuffer: "^git\\s",
    },
  },
  {
    name: "git ps",
    keyword: "ps",
    snippet: "push",
    context: {
      lbuffer: "^git\\s",
    },
  },
  {
    name: "git psu",
    keyword: "psu",
    snippet: "push -u origin HEAD",
    context: {
      lbuffer: "^git\\s",
    },
  },
  {
    name: "git pst",
    keyword: "pst",
    snippet: "push --tags",
    context: {
      lbuffer: "^git\\s",
    },
  },
  {
    name: "git push -f",
    keyword: "-f",
    snippet: "--force-with-lease",
    context: {
      lbuffer: "^git(\\s+\\S+)*\\s+push\\s",
    },
  },
  {
    name: "git root",
    keyword: "root",
    snippet: "rev-parse --show-toplevel",
    context: {
      lbuffer: "^git\\s",
    },
  },
  {
    name: "git s",
    keyword: "s",
    snippet: "status",
    context: {
      lbuffer: "^git\\s",
    },
  },
  {
    name: "git sw",
    keyword: "sw",
    snippet: "switch",
    context: {
      lbuffer: "^git\\s",
    },
  },
  {
    name: "git tags",
    keyword: "tags",
    snippet: "tag -l --sort=v:refname",
    context: {
      lbuffer: "^git\\s",
    },
  },
  {
    name: "git B",
    keyword: "B",
    snippet: "git symbolic-ref --short HEAD",
    evaluate: true,
    context: {
      lbuffer: "^git\\s",
    },
  },
  {
    name: "git M",
    keyword: "M",
    snippet:
      'zsh -c "git show-ref --verify --quiet refs/heads/main && <<<main || <<<master"',
    evaluate: true,
    context: {
      lbuffer: "^git\\s",
    },
  },
  {
    name: "git OB",
    keyword: "OB",
    snippet: 'zsh -c "echo origin/$(git symbolic-ref --short HEAD)"',
    evaluate: true,
    context: {
      lbuffer: "^git\\s",
    },
  },
  {
    name: "git U",
    keyword: "U",
    snippet: "upstream",
    context: {
      lbuffer: "^git\\s",
    },
  },
];

const dockerSnippets: ReadonlyArray<Snippet> = [
  {
    name: "d",
    keyword: "d",
    snippet: "docker",
  },
  {
    name: "docker c",
    keyword: "c",
    snippet: "compose",
    context: {
      lbuffer: "^docker\\s",
    },
  },
  {
    name: "docker pl",
    keyword: "pl",
    snippet: "pull",
    context: {
      lbuffer: "^docker\\s",
    },
  },
  {
    name: "docker ri",
    keyword: "ri",
    snippet: "run -it",
    context: {
      lbuffer: "^docker\\s",
    },
  },
  {
    name: "docker rrm",
    keyword: "rrm",
    snippet: "run --rm",
    context: {
      lbuffer: "^docker\\s",
    },
  },
  {
    name: "docker rrmi",
    keyword: "rrmi",
    snippet: "run --rm -it",
    context: {
      lbuffer: "^docker\\s",
    },
  },
  {
    name: "docker clean",
    keyword: "clean",
    snippet: "container prune -f",
    context: {
      lbuffer: "^docker\\s",
    },
  },
  {
    name: "docker cleani",
    keyword: "cleani",
    snippet: "image prune -f",
    context: {
      lbuffer: "^docker\\s",
    },
  },
];

const goSnippets: ReadonlyArray<Snippet> = [
  {
    name: "go b",
    keyword: "b",
    snippet: "build -v",
    context: {
      lbuffer: "^go\\s+\\S+$",
    },
  },
  {
    name: "go g",
    keyword: "g",
    snippet: "generate -v ./...",
    context: {
      lbuffer: "^go\\s+\\S+$",
    },
  },
  {
    name: "go r",
    keyword: "r",
    snippet: "run -v .{{}}",
    context: {
      lbuffer: "^go\\s+\\S+$",
    },
  },
  {
    name: "go t",
    keyword: "t",
    snippet: "test -v ./...",
    context: {
      lbuffer: "^go\\s+\\S+$",
    },
  },
];

const npmSnippets: ReadonlyArray<Snippet> = await (async () => {
  const scripts = (await findPackageJSON(Deno.cwd()))?.scripts ?? {};

  const scriptSnippets: ReadonlyArray<Snippet> = Object.keys(scripts).filter(
    (name) => !["start", "test"].includes(name),
  ).map((
    name,
  ) => ({
    "name": `npm ${name}`,
    "keyword": name,
    snippet: `run ${name}`,
    context: {
      lbuffer: "^(npm|pnpm)\\s+\\S+$",
    },
  }));

  return [
    {
      name: "n",
      keyword: "n",
      snippet: 'zsh -c "$ZENO_SCRIPT_DIR/package-manager.ts"',
      evaluate: true,
    },
    {
      name: "npm",
      keyword: "npm",
      snippet: 'zsh -c "$ZENO_SCRIPT_DIR/package-manager.ts"',
      evaluate: true,
    },
    {
      name: "npm i",
      keyword: "i",
      snippet: "install",
      context: {
        lbuffer: "^(npm|pnpm)\\s",
      },
    },
    {
      name: "npm install -D",
      keyword: "-D",
      snippet: "--save-dev",
      context: {
        lbuffer: "^(npm|pnpm)\\s+install\\s",
      },
    },
    {
      name: "npm r",
      keyword: "r",
      snippet: "run",
      context: {
        lbuffer: "^(npm|pnpm)\\s+\\S+$",
      },
    },
    {
      name: "npm b",
      keyword: "b",
      snippet: "run build",
      context: {
        lbuffer: "^(npm|pnpm)\\s+\\S+$",
      },
    },
    {
      name: "npm d",
      keyword: "d",
      snippet: "run dev",
      context: {
        lbuffer: "^(npm|pnpm)\\s+\\S+$",
      },
    },
    {
      name: "npm f",
      keyword: "f",
      snippet: "run fmt",
      context: {
        lbuffer: "^(npm|pnpm)\\s+\\S+$",
      },
    },
    {
      name: "npm s",
      keyword: "s",
      snippet: "start",
      context: {
        lbuffer: "^(npm|pnpm)\\s",
      },
    },
    {
      name: "npm t",
      keyword: "t",
      snippet: "test",
      context: {
        lbuffer: "^(npm|pnpm)\\s",
      },
    },
    ...scriptSnippets,
  ];
})();

// macOS
const macOSSnippets: ReadonlyArray<Snippet> = Deno.build.os === "darwin"
  ? [
    {
      name: "chrome",
      keyword: "chrome",
      snippet: 'open -a "Google Chrome"',
    },
  ]
  : [];

const wslSnippets: ReadonlyArray<Snippet> =
  Deno.env.get("WSL_DISTRO_NAME") !== undefined
    ? [
      {
        name: "open",
        keyword: "open",
        snippet: "wslview",
      },
    ]
    : [];

const miscSnippets: ReadonlyArray<Snippet> = [
  // lazygit
  {
    name: "lg",
    keyword: "lg",
    snippet: "lazygit",
  },
  // terraform
  {
    name: "tf",
    keyword: "tf",
    snippet: "terraform",
  },
  {
    name: "terraform p",
    keyword: "p",
    snippet: "plan",
    context: {
      lbuffer: "^terraform\\s",
    },
  },
  {
    name: "terraform ap",
    keyword: "ap",
    snippet: "apply",
    context: {
      lbuffer: "^terraform\\s",
    },
  },
  // hgrep
  {
    name: "hg",
    keyword: "hg",
    snippet: "hgrep",
  },
  // awk
  {
    name: ".1",
    keyword: ".1",
    snippet: "awk '{ print $1 }'",
  },
  {
    name: ".2",
    keyword: ".2",
    snippet: "awk '{ print $2 }'",
  },
  {
    name: ".3",
    keyword: ".3",
    snippet: "awk '{ print $3 }'",
  },
  {
    name: ".4",
    keyword: ".4",
    snippet: "awk '{ print $4 }'",
  },
  {
    name: ".5",
    keyword: ".5",
    snippet: "awk '{ print $5 }'",
  },
  // tee
  {
    name: "teep",
    keyword: "teep",
    snippet: "tee >(pp)",
  },
  // date
  {
    name: "yyyymmdd",
    keyword: "yyyymmdd",
    snippet: "date +%Y%m%d",
    evaluate: true,
    context: {
      global: true,
    },
  },
  {
    name: "yyyy-mm-dd",
    keyword: "yyyy-mm-dd",
    snippet: "date +%Y-%m-%d",
    evaluate: true,
    context: {
      global: true,
    },
  },
  {
    name: "yyyy/mm/dd",
    keyword: "yyyy/mm/dd",
    snippet: "date +%Y/%m/%d",
    evaluate: true,
    context: {
      global: true,
    },
  },
  // make
  {
    name: "make",
    keyword: "make",
    snippet: "make -j",
  },
  // bat
  {
    name: "batman",
    keyword: "batman",
    snippet: "bat -p -lman",
  },
  // coreutils
  {
    name: "tailf",
    keyword: "tailf",
    snippet: "tail -f",
  },
  {
    name: "cp",
    keyword: "cp",
    snippet: "cp -ir",
  },
  {
    name: "rm",
    keyword: "rm",
    snippet: "zsh -c \"(( ${+commands[trash]} )) && <<<'trash' || <<<'rm -i'\"",
    evaluate: true,
  },
  {
    name: "mv",
    keyword: "mv",
    snippet: "mv -i",
  },
  // python
  {
    name: "python",
    keyword: "python",
    snippet: "python3",
  },
  {
    name: "pip",
    keyword: "pip",
    snippet: "pip3",
  },
  {
    name: "python -v",
    keyword: "-v",
    snippet: "-V",
    context: {
      lbuffer: "^(python3?|pip3?)\\s",
    },
  },
  // java
  {
    name: "java -v",
    keyword: "-v",
    snippet: "-version",
    context: {
      lbuffer: "^java\\s",
    },
  },
];

const fzfOptionsDefault: FzfOptions = {
  "--exit-0": true,
  "--select-1": true,
  "--tiebreak": "begin,index",
  "--height": "60%",
  "--cycle": true,
  "--preview-window": "right:50%",
};

const fzfOptionsMulti: FzfOptions = {
  ...fzfOptionsDefault,
  "--multi": true,
};

const fzfOptionsFormat: FzfOptions = {
  ...fzfOptionsDefault,
  "--nth": "3",
};

const dockerCompletions: ReadonlyArray<UserCompletionSource> = [
  {
    name: "docker-build",
    patterns: [
      "^\\s*(docker)\\s+(build)\\s+(\\S+\\s+)*$",
    ],
    sourceCommand:
      '"$ZENO_SCRIPT_DIR/options.zsh" "docker/build-options" "󰈻" "option" "blue"',
    options: fzfOptionsFormat,
    callback: "awk '{ print $3 }'",
  },
  {
    name: "docker-run",
    patterns: [
      "^\\s*(docker)\\s+(run)\\s+(\\S+\\s+)*$",
    ],
    sourceCommand: `
      (
        "$ZENO_SCRIPT_DIR/docker-images.zsh";
        "$ZENO_SCRIPT_DIR/options.zsh" "docker/run-options" "󰈻" "option" "blue";
      )
    `.replaceAll("\n", " "),
    options: fzfOptionsFormat,
    callback: "awk '{ print $3 }'",
  },
  {
    name: "docker",
    patterns: [
      "^\\s*(docker)\\s+$",
    ],
    sourceCommand: `
      (
        "$ZENO_SCRIPT_DIR/options.zsh" "docker/subcommands" "󰘳" "command" "yellow";
        "$ZENO_SCRIPT_DIR/options.zsh" "docker/aliases" "󰏪" "alias" "red";
        "$ZENO_SCRIPT_DIR/options.zsh" "docker/options" "󰈻" "option" "blue";
      )
    `.replaceAll("\n", " "),
    options: fzfOptionsFormat,
    callback: "awk '{ print $3 }'",
  },
];

const gitCompletions: ReadonlyArray<UserCompletionSource> = [
  {
    name: "git-branch",
    patterns: [
      "^\\s*(git)(\\s+-\\S+)*\\s+(branch)(\\s+\\S+)*\\s+$",
    ],
    sourceCommand: "$ZENO_SCRIPT_DIR/git-local-branches.zsh",
    options: fzfOptionsFormat,
    callback: "awk '{ print $3 }'",
  },
  {
    name: "git-cherry-pick",
    patterns: [
      "^\\s*(git)(\\s+-\\S+)*\\s+(cherry-pick)(\\s+\\S+)*\\s+$",
    ],
    sourceCommand: `
      (
        "$ZENO_SCRIPT_DIR/git-commits.zsh" --all;
        "$ZENO_SCRIPT_DIR/options.zsh" "git/cherry-pick-options" "󰈻" "option" "blue";
      )
    `.replaceAll("\n", " "),
    options: {
      ...fzfOptionsFormat,
      "--multi": true,
    },
    callback: "awk '{ print $3 }'",
  },
  {
    name: "git-diff",
    patterns: [
      "^\\s*(git)(\\s+-\\S+)*\\s+(df|diff)(\\s+\\S+)*\\s+$",
    ],
    sourceCommand: `
      (
        "$ZENO_SCRIPT_DIR/git-local-branches.zsh";
        "$ZENO_SCRIPT_DIR/git-remote-branches.zsh";
        "$ZENO_SCRIPT_DIR/git-tags.zsh";
        "$ZENO_SCRIPT_DIR/git-commits.zsh";
        "$ZENO_SCRIPT_DIR/options.zsh" "git/diff-options" "󰈻" "option" "blue";
      )
    `.replaceAll("\n", " "),
    options: fzfOptionsFormat,
    callback: "awk '{ print $3 }'",
  },
  {
    name: "git-fetch",
    patterns: [
      "^\\s*(git)(\\s+-\\S+)*\\s+(fetch)(\\s+\\S+)*\\s+$",
    ],
    sourceCommand: "git remote",
    options: {
      ...fzfOptionsFormat,
      "--preview": "git remote get-url {}",
    },
    callback: "awk '{ print $1 }'",
  },
  {
    name: "git-log",
    patterns: [
      "^\\s*(git)(\\s+-\\S+)*\\s+(graph|log)(\\s+\\S+)*\\s+$",
    ],
    sourceCommand: `
      (
        "$ZENO_SCRIPT_DIR/git-local-branches.zsh";
        "$ZENO_SCRIPT_DIR/git-remote-branches.zsh";
        "$ZENO_SCRIPT_DIR/git-tags.zsh";
        "$ZENO_SCRIPT_DIR/git-commits.zsh";
      )
    `.replaceAll("\n", " "),
    options: fzfOptionsFormat,
    callback: "awk '{ print $3 }'",
  },
  {
    name: "git-rebase",
    patterns: [
      "^\\s*(git)(\\s+-\\S+)*\\s+(rebase)(\\s+\\S+)*\\s+$",
    ],
    sourceCommand: `
      (
        "$ZENO_SCRIPT_DIR/git-local-branches.zsh";
        "$ZENO_SCRIPT_DIR/git-remote-branches.zsh";
        "$ZENO_SCRIPT_DIR/git-tags.zsh";
        "$ZENO_SCRIPT_DIR/git-commits.zsh";
      )
    `.replaceAll("\n", " "),
    options: fzfOptionsFormat,
    callback: "awk '{ print $3 }'",
  },
  {
    name: "git-reset",
    patterns: [
      "^\\s*(git)(\\s+-\\S+)*\\s+(reset)(\\s+\\S+)*\\s+$",
    ],
    sourceCommand: `
      (
        "$ZENO_SCRIPT_DIR/git-local-branches.zsh";
        "$ZENO_SCRIPT_DIR/git-remote-branches.zsh";
        "$ZENO_SCRIPT_DIR/git-tags.zsh";
        "$ZENO_SCRIPT_DIR/git-commits.zsh";
      )
    `.replaceAll("\n", " "),
    options: fzfOptionsFormat,
    callback: "awk '{ print $3 }'",
  },
  {
    name: "git-switch",
    patterns: [
      "^\\s*(git)(\\s+-\\S+)*\\s+(merge|rebase|switch)(\\s+\\S+)*\\s+$",
    ],
    sourceCommand: `
      (
        "$ZENO_SCRIPT_DIR/git-local-branches.zsh";
        "$ZENO_SCRIPT_DIR/git-remote-branches.zsh";
        "$ZENO_SCRIPT_DIR/git-tags.zsh";
        "$ZENO_SCRIPT_DIR/git-commits.zsh";
      )
    `.replaceAll("\n", " "),
    options: {
      ...fzfOptionsFormat,
      "--preview":
        "echo {} | awk '{ print $3 }' | xargs -r git show --color | delta",
    },
    callback: "awk '{ print $3 }' | sed 's|^origin/||'",
  },
  {
    name: "git-user",
    patterns: [
      "^\\s*(git)(\\s+-\\S+)*\\s+(user)\\s+$",
    ],
    sourceCommand: "git users | sed -E 's/:\\s*/\\t/'",
    options: fzfOptionsFormat,
    callback: "awk '{ print $1 }'",
  },
  {
    name: "git",
    patterns: [
      "^\\s*(git)(\\s+-\\S+)*\\s+$",
    ],
    sourceCommand: `
      (
        "$ZENO_SCRIPT_DIR/options.zsh" "git/subcommands" "󰘳" "command" "yellow";
        "$ZENO_SCRIPT_DIR/git-aliases.zsh";
        "$ZENO_SCRIPT_DIR/git-tools.zsh";
        "$ZENO_SCRIPT_DIR/options.zsh" "git/options" "󰈻" "option" "blue";
      )
    `.replaceAll("\n", " "),
    options: fzfOptionsFormat,
    callback: "awk '{ print $3 }'",
  },
];

const npmCompletions: ReadonlyArray<UserCompletionSource> = [
  {
    name: "npm-run",
    patterns: [
      "^\\s*(npm)\\s+(run)\\s+$",
    ],
    sourceCommand: "$ZENO_SCRIPT_DIR/npm-scripts.zsh",
    options: fzfOptionsFormat,
    callback: "awk '{ print $3 }'",
  },
  {
    name: "npm",
    patterns: [
      "^\\s*(npm)\\s+$",
    ],
    sourceCommand:
      '"$ZENO_SCRIPT_DIR/options.zsh" "npm/subcommands" "󰘳" "command" "yellow"',
    options: fzfOptionsFormat,
    callback: "awk '{ print $3 }'",
  },
];

const miscCompletions: ReadonlyArray<UserCompletionSource> = [
  // basic command
  {
    name: "file",
    patterns: [
      "^\\s*(bat|cat|delta|diff|e|grep|head|hexdump|hexyl|less|nvim|sed|tail|vim|vi)(\\s+\\S+)*\\s+$",
    ],
    sourceCommand: "fd --color=always --hidden --type=f",
    options: {
      ...fzfOptionsMulti,
      "--preview": "fzf-preview-file {}",
    },
    callback: "",
  },
  {
    name: "file or directory",
    patterns: [
      "^\\s*(code|cp|ln|mmv|mv|rm|subl|trash)(\\s+\\S+)*\\s+$",
    ],
    sourceCommand: "fd --color=always --hidden",
    options: {
      ...fzfOptionsMulti,
      "--preview": "fzf-preview-file {}",
    },
    callback: "",
  },
  {
    name: "directory",
    patterns: [
      "^\\s*(cd|la|ll|ls|tree)(\\s+\\S+)*\\s+$",
    ],
    sourceCommand: "fd --color=always --hidden --type=d",
    options: {
      ...fzfOptionsMulti,
      "--preview": "fzf-preview-directory {}",
    },
    callback: "sed -E 's,/?$,/,'",
  },
  // asdf
  {
    name: "asdf",
    patterns: [
      "^\\s*(asdf)\\s+$",
    ],
    sourceCommand: `
      (
        "$ZENO_SCRIPT_DIR/options.zsh" "asdf/subcommands" "󰘳" "command" "yellow";
        "$ZENO_SCRIPT_DIR/options.zsh" "asdf/options" "󰈻" "option" "blue";
      )
    `.replaceAll("\n", " "),
    options: fzfOptionsFormat,
    callback: "awk '{ print $3 }'",
  },
  // curl
  {
    name: "curl",
    patterns: [
      "^\\s*(curl)(\\s+\\S+)*\\s+$",
    ],
    sourceCommand: 'cat "$ZENO_CONFIG_HOME/snippets/curl/snippet.txt"',
    options: {
      ...fzfOptionsMulti,
    },
    callback: "sed 's/ /\\n/'",
  },
  // tmux
  {
    name: "tmux",
    patterns: [
      "^\\s*(tmux)\\s+$",
    ],
    sourceCommand: `
      (
        "$ZENO_SCRIPT_DIR/options.zsh" "tmux/subcommands" "󰘳" "command" "yellow";
        "$ZENO_SCRIPT_DIR/options.zsh" "tmux/options" "󰈻" "option" "blue";
      )
    `.replaceAll("\n", " "),
    options: fzfOptionsFormat,
    callback: "awk '{ print $3 }'",
  },
];

const settings: Settings = {
  snippets: [
    ...cdSnippets,
    ...gitSnippets,
    ...dockerSnippets,
    ...goSnippets,
    ...npmSnippets,
    ...macOSSnippets,
    ...wslSnippets,
    ...miscSnippets,
  ],
  completions: [
    ...dockerCompletions,
    ...gitCompletions,
    ...npmCompletions,
    ...miscCompletions,
  ],
};

await Deno.writeTextFile(
  `${zenoHome}/config.yml`,
  JSON.stringify(settings, null, 2),
);
