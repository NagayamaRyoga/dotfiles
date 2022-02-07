#!/usr/bin/env zsh
if [ "$#" -ne 1 ]; then
    echo "$0 <directory>"
    return 1
elif (( ${+commands[exa]} )); then
    exa -T -L3 --icons --color=always "$@"
elif (( ${+commands[tree]} )); then
    tree -L3 "$@"
else
    ls "$@"
fi
