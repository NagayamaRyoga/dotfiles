#!/usr/bin/env zsh
icon="\uf425"
header="tool"

for k in "${(k@)commands[(R)*/git-*]}"; do
    printf "%s\t%s\n" "${k#git-}" "${commands[$k]/$HOME/~}"
done |
    sort |
    "${0:a:h}/format.zsh" "$icon" "$header" "green"
