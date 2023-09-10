#!/usr/bin/env bash
pane_current_path="$(tmux display-message -p -F "#{pane_current_path}")"

branch_icon=""
tag_icon=""
commit_icon=""

added_icon=" "
deleted_icon=" "
renamed_icon=" "
modified_icon=" "
conflicted_icon=" "

ahead_icon=""
behind_icon=""

git_is_inside_repo() {
    command git -C "$pane_current_path" rev-parse 2>/dev/null
}

git_has_unstaged_changes() {
    ! command git -C "$pane_current_path" diff --quiet --exit-code ||
        [[ -n "$(command git ls-files --other --exclude-standard)" ]]
}

git_head() {
    local branch tag commit

    branch="$(command git -C "$pane_current_path" branch --show-current)"
    if [[ -n "$branch" ]]; then
        command echo "$branch_icon $branch"
        return
    fi

    tag="$(command git -C "$pane_current_path" tag --points-at HEAD | head -n1)"
    if [[ -n "$tag" ]]; then
        command echo "$tag_icon $tag"
        return
    fi

    commit="$(command git -C "$pane_current_path" rev-parse --short HEAD)"
    command echo "$commit_icon $commit"
}

git_status() {
    local conflicted=0
    local added=0
    local deleted=0
    local renamed=0
    local modified=0
    local behind=0
    local ahead=0

    while IFS= builtin read -r -d $'\0' line; do
        case "${line::2}" in
            \#\# )
                behind="$(command sed -E 's/^.*[[ ]behind ([0-9]+).*$/\1/' <<<"$line")"
                ahead="$(command sed -E 's/^.*\[ahead ([0-9]+).*$/\1/' <<<"$line")"
            ;;
            *U | U* ) ((conflicted++));;
            \?\? | *A | A* ) ((added++));;
            *D | D* ) ((deleted++));;
            *R | R* ) ((renamed++));;
            * ) ((modified++));;
        esac
    done < <(command git -C "$pane_current_path" status -z --branch --porcelain)

    local icons=""
    [[ "$added" -gt 0 ]] && icons+="$added_icon"
    [[ "$deleted" -gt 0 ]] && icons+="$deleted_icon"
    [[ "$renamed" -gt 0 ]] && icons+="$renamed_icon"
    [[ "$modified" -gt 0 ]] && icons+="$modified_icon"
    [[ "$conflicted" -gt 0 ]] && icons+="$conflicted_icon"
    [[ "$behind" -gt 0 ]] && icons+="$behind_icon$behind"
    [[ "$ahead" -gt 0 ]] && icons+="$ahead_icon$ahead"

    command echo "$icons"
}

main() {
    local format=" "
    format+="#P: #[bold]#{pane_current_command}#[default]"

    if git_is_inside_repo; then
        local head status colour
        head="$(git_head)"
        # status="$(git_status)"
        colour="colour2"

        if git_has_unstaged_changes; then
            colour="colour3"
        fi

        format+=" #[fg=colour246][#[default]"
        format+="#[fg=$colour,bold]${head}${status:+ }${status}#[default]"
        format+="#[fg=colour246]]#[default]"
    fi

    format+=" "
    command echo "$format"
}
main
