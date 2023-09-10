#!/usr/bin/env bash
set -x
# shellcheck source=./scripts/common.bash
source "$(dirname "$0")/common.bash"

readonly repo="github.com/Shougo/dein.vim"
readonly install_dir="$XDG_DATA_HOME/dein/repos/$repo"

if [ -d "$install_dir" ]; then
    echo "dein.vim is already installed."
    git -C "$install_dir" pull

    echo "Updating dein.vim plugins..."
    nvim \
        -c ":call dein#update()" \
        -c ":call clap#installer#download_binary()" \
        -c ":q"
else
    echo "Installing dein.vim..."
    git clone "https://$repo" "$install_dir"

    echo "Installing dein.vim plugins..."
    nvim \
        -c ":call clap#installer#download_binary()" \
        -c ":q"
fi
