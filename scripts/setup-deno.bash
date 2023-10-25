#!/usr/bin/env bash
set -x
# shellcheck source=./scripts/common.bash
source "$(dirname "$0")/common.bash"

[ -n "$SKIP_DENO" ] && exit

echo "Installing Deno..."
curl -fsSL https://deno.land/x/install/install.sh | /bin/sh

echo "Install Deno completions..."
mkdir -p "$XDG_DATA_HOME/zsh/completions"
"$DENO_INSTALL/bin/deno" completions zsh >"$XDG_DATA_HOME/zsh/completions/_deno"
