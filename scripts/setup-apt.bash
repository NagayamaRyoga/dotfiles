#!/usr/bin/env bash
set -x
# shellcheck source=./scripts/common.bash
source "$(dirname "$0")/common.bash"

type apt-get >/dev/null || exit
[ -n "$SKIP_APT" ] && exit

sudo /bin/sh "$REPO_DIR/config/apt/install.sh"
