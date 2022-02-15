### zinit ###
typeset -gAH ZINIT
export ZINIT[HOME_DIR]="$XDG_DATA_HOME/zinit"
source "${ZINIT[HOME_DIR]}/bin/zinit.zsh"
(( ${+_comps} )) && _comps[zinit]=_zinit

### paths ###
typeset -U path
typeset -U fpath

path=(
    "$HOME/.local/bin"(N-/)
    "$CARGO_HOME/bin"(N-/)
    "$GOPATH/bin"(N-/)
    "$DENO_INSTALL/bin"(N-/)
    "$GEM_HOME/bin"(N-/)
    "$XDG_CONFIG_HOME/scripts/bin"(N-/)
    "$path[@]"
)

fpath=(
    "$XDG_DATA_HOME/zsh/completions"(N-/)
    "$fpath[@]"
)

### history ###
export HISTFILE="$XDG_STATE_HOME/zsh_history"
export HISTSIZE=1000
export SAVEHIST=1000

setopt AUTO_PUSHD
setopt PUSHD_IGNORE_DUPS
setopt GLOBDOTS
setopt APPEND_HISTORY
setopt EXTENDED_HISTORY
setopt HIST_IGNORE_ALL_DUPS
setopt HIST_IGNORE_SPACE
setopt HIST_REDUCE_BLANKS
setopt HIST_SAVE_NO_DUPS
setopt INTERACTIVE_COMMENTS
setopt NO_SHARE_HISTORY
setopt MAGIC_EQUAL_SUBST
setopt PRINT_EIGHT_BIT

### theme ###
zinit light-mode from'gh-r' as'program' \
    mv'almel* -> almel' \
    for 'Ryooooooga/almel'

almel_preexec() {
    unset ALMEL_STATUS
    ALMEL_START="$EPOCHREALTIME"
}

almel_precmd() {
    local s="${ALMEL_STATUS:-$?}"
    local j="$#jobstates"
    local end="$EPOCHREALTIME"
    local dur="$(($end - ${ALMEL_START:-$end}))"
    PROMPT="$(almel prompt zsh -s"$s" -j"$j" -d"$dur")"
    unset ALMEL_START
}

autoload -Uz add-zsh-hook
add-zsh-hook precmd almel_precmd
add-zsh-hook preexec almel_preexec

### key bindings ###
clear-screen-and-update-prompt() {
    ALMEL_STATUS=0
    almel_precmd
    zle .clear-screen
}
zle -N clear-screen clear-screen-and-update-prompt

select-history() {
    local selected="$(history -nr 1 | awk '!a[$0]++' | fzf --exit-0 --query "$LBUFFER" | sed 's/\\n/\n/g')"
    if [ -n "$selected" ]; then
        BUFFER="$selected"
        CURSOR=$#BUFFER
    fi
    zle -R -c # refresh screen
}

select-cdr() {
    local selected="$(cdr -l | awk '{ $1=""; print }' | sed 's/^ //' | fzf --exit-0 --preview="fzf-preview-directory '{}'" --preview-window="right:50%")"
    if [ -n "$selected" ]; then
        BUFFER="cd $selected"
        zle accept-line
    fi
    zle -R -c # refresh screen
}

select-ghq() {
    function __ghq-source() {
        ghq list | sort
    }
    local root="$(ghq root)"
    local selected="$(__ghq-source | fzf --exit-0 --preview="fzf-preview-git ${(q)root}/{}" --preview-window="right:60%")"
    unfunction __ghq-source

    if [ -n "$selected" ]; then
        local repo_dir="$(ghq list --exact --full-path "$selected")"
        BUFFER="cd ${(q)repo_dir}"
        zle accept-line
    fi
    zle -R -c # refresh screen
}

select-ghq-session() {
    function __ghq-source() {
        local session color icon reset="\e[m"
        local sessions=($(tmux list-sessions -F "#S" 2>/dev/null))
        ghq list | sort | while read -r repo; do
            session="$(sed -E 's/[:. ]/-/g' <<<"$repo")"
            color="\e[34m"
            icon="\uf630"
            if (( ${+sessions[(r)$session]} )); then
                color="\e[32m"
                icon="\uf631"
            fi
            printf "$color$icon %s$reset\n" "$repo"
        done
    }
    local root="$(ghq root)"
    local selected="$(__ghq-source | fzf --exit-0 --preview="fzf-preview-git ${(q)root}/{+2}" --preview-window="right:60%" | cut -d' ' -f2)"
    unfunction __ghq-source

    if [ -z "$selected" ]; then
        return
    fi

    local repo_dir="$(ghq list --exact --full-path "$selected")"
    local session_name="$(sed -E 's/[:. ]/-/g' <<<"$selected")"

    if [ -z "$TMUX" ]; then
        BUFFER="tmux new-session -A -s ${(q)session_name} -c ${(q)repo_dir}"
        zle accept-line
    elif [ "$(tmux display-message -p "#S")" = "$session_name" ] && [ "$PWD" != "$repo_dir" ]; then
        BUFFER="cd ${(q)repo_dir}"
        zle accept-line
    else
        tmux new-session -d -s "$session_name" -c "$repo_dir" 2>/dev/null
        tmux switch-client -t "$session_name"
    fi
    zle -R -c # refresh screen
}

select-dir() {
    local selected="$(fd --hidden --color=always --exclude='.git' --type=d . $(git rev-parse --show-cdup 2>/dev/null) | fzf --exit-0 --preview="fzf-preview-directory {}" --preview-window="right:50%")"
    if [ -n "$selected" ]; then
        BUFFER="cd $selected"
        zle accept-line
    fi
    zle -R -c # refresh screen
}

forward-kill-word() {
    zle vi-forward-word
    zle vi-backward-kill-word
}

zle -N select-history
zle -N select-cdr
zle -N select-ghq
zle -N select-ghq-session
zle -N select-dir
zle -N forward-kill-word

bindkey -v
bindkey "^R"        select-history                  # C-r
bindkey "^F"        select-cdr                      # C-f
bindkey "^G"        select-ghq-session              # C-g
bindkey "^[g"       select-ghq                      # Alt-g
bindkey "^O"        select-dir                      # C-o
bindkey "^A"        beginning-of-line               # C-a
bindkey "^E"        end-of-line                     # C-e
bindkey "^W"        vi-backward-kill-word           # C-w
bindkey "^X^W"      forward-kill-word               # C-x C-w
bindkey "^?"        backward-delete-char            # backspace
bindkey "^[[3~"     delete-char                     # delete
bindkey "^[[1;3D"   backward-word                   # Alt + arrow-left
bindkey "^[[1;3C"   forward-word                    # Alt + arrow-right
bindkey "^[^?"      vi-backward-kill-word           # Alt + backspace
bindkey "^[[1;33~"  kill-word                       # Alt + delete
bindkey -M vicmd "^A" beginning-of-line             # vi: C-a
bindkey -M vicmd "^E" end-of-line                   # vi: C-e

# Change the cursor between 'Line' and 'Block' shape
function zle-keymap-select zle-line-init zle-line-finish {
    case "${KEYMAP}" in
        main|viins)
            printf '\033[6 q' # line cursor
            ;;
        vicmd)
            printf '\033[2 q' # block cursor
            ;;
    esac
}
zle -N zle-line-init
zle -N zle-line-finish
zle -N zle-keymap-select

### plugins ###
zinit wait lucid light-mode as'null' for \
    atinit'source "$ZDOTDIR/.zshrc.lazy"' \
    @'zdharma-continuum/null'
