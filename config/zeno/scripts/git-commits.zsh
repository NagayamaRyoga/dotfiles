#!/usr/bin/env zsh
args=("$@")

max_count=100
icon=""
header="commit"

hash="%h"
subject="%s"
committer_date="%cr"

git --no-pager log \
    --format="$hash%x09$subject%x09$committer_date" \
    --max-count="$max_count" \
    "${args[@]}" \
    2>/dev/null |
    "${0:a:h}/format.zsh" "$icon" "$header" "yellow" "yellow" "gray" "dark_blue" "6" "13"
