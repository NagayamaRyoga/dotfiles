#!/usr/bin/env bash
set -x
# shellcheck source=./scripts/common.bash
source "$(dirname "$0")/common.bash"

export ASDF_DATA_DIR="$XDG_DATA_HOME/asdf"

if [ -d "$ASDF_DATA_DIR" ]; then
    echo "asdf-vm is already installed."
    # shellcheck source=/dev/null
    source "$ASDF_DATA_DIR/asdf.sh"

    echo "Updating asdf-vm plugins..."
    asdf update
    asdf plugin update --all
else
    echo "Installing asdf-vm..."
    git clone "https://github.com/asdf-vm/asdf" "$ASDF_DATA_DIR"
    # shellcheck source=/dev/null
    source "$ASDF_DATA_DIR/asdf.sh"

    echo "Installing asdf-vm plugins..."
    asdf plugin add nodejs
fi
