#!/usr/bin/env zsh
icon="\uf8e9"
header="alias"

git --no-pager config --get-regexp '^alias\.' |
    sed -E $'s/^alias\\.//; s/ /\t/' |
    "${0:a:h}/format.zsh" "$icon" "$header" "red"
