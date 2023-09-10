#!/usr/bin/env bash
set -x
# shellcheck source=./scripts/common.bash
source "$(dirname "$0")/common.bash"

command -v apt-get >/dev/null || exit 0
[ -n "$SKIP_APT" ] && exit

sudo /bin/sh "$REPO_DIR/config/apt/install.sh"

mkdir -p "$HOME/.local/bin"
ln -sfv "/usr/bin/batcat" "$HOME/.local/bin/bat"
ln -sfv "/usr/bin/fdfind" "$HOME/.local/bin/fd"
