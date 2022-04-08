### Aliases ###
alias la='ls -a'
alias ll='ls -al'

alias cp='cp -i'
alias mv='mv -i'
alias rm='rm -i'

case "$OSTYPE" in
    linux*)
        (( ${+commands[wslview]} )) && alias open='wslview'

        if (( ${+commands[win32yank.exe]} )); then
            alias pp='win32yank.exe -i'
            alias p='win32yank.exe -o'
        elif (( ${+commands[xsel]} )); then
            alias pp='xsel -bi'
            alias p='xsel -b'
        fi
    ;;
    msys)
        alias cmake='command cmake -G"Unix Makefiles"'
        alias pp='cat >/dev/clipboard'
        alias p='cat /dev/clipboard'
    ;;
    darwin*)
        alias pp='pbcopy'
        alias p='pbpaste'
        alias chrome='open -a "Google Chrome"'
        (( ${+commands[gdate]} )) && alias date='gdate'
        (( ${+commands[gls]} )) && alias ls='gls --color=auto'
        (( ${+commands[gmkdir]} )) && alias mkdir='gmkdir'
        (( ${+commands[gcp]} )) && alias cp='gcp -i'
        (( ${+commands[gmv]} )) && alias mv='gmv -i'
        (( ${+commands[grm]} )) && alias rm='grm -i'
        (( ${+commands[gdu]} )) && alias du='gdu'
        (( ${+commands[ghead]} )) && alias head='ghead'
        (( ${+commands[gtail]} )) && alias tail='gtail'
        (( ${+commands[gsed]} )) && alias sed='gsed'
        (( ${+commands[ggrep]} )) && alias grep='ggrep'
        (( ${+commands[gfind]} )) && alias find='gfind'
        (( ${+commands[gdirname]} )) && alias dirname='gdirname'
        (( ${+commands[gxargs]} )) && alias xargs='gxargs'
    ;;
esac

(( ${+commands[trash]} )) && alias rm='trash'

mkcd() { command mkdir -p -- "$@" && builtin cd "${@[-1]:a}" }

j() {
    local root dir
    root="${$(git rev-parse --show-cdup 2>/dev/null):-.}"
    dir="$(fd --color=always --hidden --type=d . "$root" | fzf --select-1 --query="$*" --preview='fzf-preview-directory {}')"
    if [ -n "$dir" ]; then
        builtin cd "$dir"
        echo "$PWD"
    fi
}

jj() {
    local root
    root="$(git rev-parse --show-toplevel)" || return 1
    builtin cd "$root"
}

### diff ###
diff() { command diff "$@" | bat --paging=never --plain --language=diff }
alias diffall='diff --new-line-format="+%L" --old-line-format="-%L" --unchanged-line-format=" %L"'

### direnv ###
(( ${+commands[direnv]} )) && eval "$(direnv hook zsh)"

### FZF ###
export FZF_DEFAULT_OPTS='--reverse --border --ansi --bind="ctrl-d:print-query,ctrl-p:replace-query"'
export FZF_DEFAULT_COMMAND='fd --hidden --color=always'

### bat ###
export MANPAGER="sh -c 'col -bx | bat --color=always --language=man --plain'"

alias cat='bat --paging=never'
alias batman='bat --language=man --plain'

### ripgrep ###
export RIPGREP_CONFIG_PATH="$XDG_CONFIG_HOME/ripgrep/config"

### zsh-history-substring-search ###
__zsh_history_substring_search_atload() {
    bindkey "${terminfo[kcuu1]}" history-substring-search-up   # arrow-up
    bindkey "${terminfo[kcud1]}" history-substring-search-down # arrow-down
    bindkey "^[[A" history-substring-search-up   # arrow-up
    bindkey "^[[B" history-substring-search-down # arrow-down
}
zinit wait lucid light-mode for \
    atload'__zsh_history_substring_search_atload' \
    @'zsh-users/zsh-history-substring-search'

### zsh-autopair ###
zinit wait'1' lucid light-mode for \
    @'hlissner/zsh-autopair'

### zsh plugins ###
zinit wait lucid blockf light-mode for \
    atload'async_init' @'mafredri/zsh-async' \
    @'zsh-users/zsh-autosuggestions' \
    @'zsh-users/zsh-completions' \
    @'zdharma-continuum/fast-syntax-highlighting'

### programs ###
zinit wait lucid light-mode as'program' from'gh-r' for \
    pick'delta*/delta'  @'dandavison/delta' \
    pick'mmv*/mmv'      @'itchyny/mmv' \
    pick'ripgrep*/rg'   @'BurntSushi/ripgrep'

### asdf-vm ###
__asdf_atload() {
    export ASDF_DATA_DIR="$XDG_DATA_HOME/asdf"
    export ASDF_CONFIG_FILE="$XDG_CONFIG_HOME/asdf/asdfrc"
}
zinit wait lucid light-mode for \
    atpull'asdf plugin update --all' \
    atload'__asdf_atload' \
    @'asdf-vm/asdf'

### GitHub CLI ###
zinit wait lucid light-mode as'program' from'gh-r' for \
    pick'gh*/bin/gh' \
    atclone'./gh*/bin/gh completion -s zsh >_gh' atpull'%atclone' \
    @'cli/cli'

### exa ###
__exa_atload() {
    alias ls='exa --group-directories-first'
    alias la='exa --group-directories-first -a'
    alias ll='exa --group-directories-first -al --header --color-scale --git --icons --time-style=long-iso'
    alias tree='exa --group-directories-first -T --icons'
}
zinit wait lucid light-mode as'program' from'gh-r' for \
    pick'bin/exa' \
    atclone'cp -f completions/exa.zsh _exa' atpull'%atclone' \
    atload'__exa_atload' \
    @'ogham/exa'

### yq ###
zinit wait lucid light-mode as'program' from'gh-r' for \
    mv'yq* -> yq' \
    atclone'./yq shell-completion zsh >_yq' atpull'%atclone' \
    @'mikefarah/yq'

### hgrep ###
__hgrep_atload() {
    alias hgrep="hgrep --hidden --glob='!.git/'"
}
zinit wait lucid light-mode as'program' from'gh-r' for \
    pick'hgrep*/hgrep' \
    atload'__hgrep_atload' \
    @'rhysd/hgrep'

### navi ###
__navi_search() {
    LBUFFER="$(navi --print --query="$LBUFFER")"
    zle reset-prompt
}
__navi_atload() {
    export NAVI_CONFIG="$XDG_CONFIG_HOME/navi/config.yaml"

    zle -N __navi_search
    bindkey '^N' __navi_search
}
zinit wait lucid light-mode as'program' from'gh-r' for \
    atload'__navi_atload' \
    @'denisidoro/navi'

### zeno.zsh ###
export ZENO_HOME="$XDG_CONFIG_HOME/zeno"
export ZENO_ENABLE_SOCK=1
# export ZENO_DISABLE_BUILTIN_COMPLETION=1
export ZENO_GIT_CAT="bat --color=always"
export ZENO_GIT_TREE="exa --tree"

__zeno_atload() {
    bindkey ' '  zeno-auto-snippet
    bindkey '^M' zeno-auto-snippet-and-accept-line
    bindkey '^P' zeno-completion
}

zinit wait lucid light-mode for \
    atload'__zeno_atload' \
    @'yuki-yano/zeno.zsh'

### Emojify ###
zinit wait lucid light-mode as'program' for \
    atclone'rm -f *.{py,bats}' atpull'%atclone' \
    @'mrowa44/emojify'

### Forgit ###
__forgit_atload() {
    export FORGIT_INSTALL_DIR="$PWD"
    export FORGIT_NO_ALIASES=1
}
zinit wait lucid light-mode as'program' for \
    atload'__forgit_atload' \
    pick'bin/git-forgit' \
    @'wfxr/forgit'

### zsh-replace-multiple-dots ###
__replace_multiple_dots_atload() {
    replace_multiple_dots_exclude_go() {
        if [[ "$LBUFFER" =~ '^go ' ]]; then
            zle self-insert
        else
            zle .replace_multiple_dots
        fi
    }

    zle -N .replace_multiple_dots replace_multiple_dots
    zle -N replace_multiple_dots replace_multiple_dots_exclude_go
}

zinit wait lucid light-mode for \
    atload'__replace_multiple_dots_atload' \
    @'momo-lab/zsh-replace-multiple-dots'

### tealdeer ###
__tealdeer_atclone() {
    curl -sSL 'https://raw.githubusercontent.com/dbrgn/tealdeer/main/completion/zsh_tealdeer' -o _tealdeer
}
__tealdeer_atload() {
    export TEALDEER_CONFIG_DIR="$XDG_CONFIG_HOME/tealdeer"
    export TEALDEER_CACHE_DIR="$XDG_CACHE_HOME/tealdeer"
}
zinit wait lucid light-mode as'program' from'gh-r' for \
    mv'tealdeer* -> tldr' \
    atclone'__tealdeer_atclone' atpull'%atclone' \
    atload'__tealdeer_atload' \
    @'dbrgn/tealdeer'

### chpwd-recent-dirs ###
add-zsh-hook chpwd chpwd_recent_dirs
zstyle ':chpwd:*' recent-dirs-file "$XDG_STATE_HOME/chpwd-recent-dirs"

### ls-colors ###
export LS_COLORS="di=01;34:ln=01;36:pi=40;33:so=01;35:do=01;35:bd=40;33;01:cd=40;33;01:or=01;05;37;41:mi=01;05;37;41:su=37;41:sg=30;43:tw=30;42:ow=34;42:st=37;44:ex=01;32"

### less ###
export LESSHISTFILE='-'

### completion styles ###
zstyle ':completion:*:default' menu select=1
zstyle ':completion:*' list-colors "${(s.:.)LS_COLORS}"

### GPG ###
export GPG_TTY="$(tty)"

### wget ###
alias wget='wget --hsts-file="$XDG_STATE_HOME/wget-hsts"'

### Make ###
alias make='make -j$(($(nproc)+1))'

### CMake ###
alias cmaked='cmake -DCMAKE_BUILD_TYPE=Debug -B "$(git rev-parse --show-toplevel)/build"'
alias cmakerel='cmake -DCMAKE_BUILD_TYPE=Release -B "$(git rev-parse --show-toplevel)/build"'
cmakeb() { cmake --build "${1:-$(git rev-parse --show-toplevel)/build}" -j"$(($(nproc)+1))" "${@:2}" }
cmaket() { ctest --verbose --test-dir "${1:-$(git rev-parse --show-toplevel)/build}" "${@:2}" }

### Docker ###
docker() {
    if [ "$#" -eq 0 ] || [ "$1" = "compose" ] || ! command -v "docker-$1" >/dev/null; then
        command docker "${@:1}"
    else
        "docker-$1" "${@:2}"
    fi
}

docker-clean() {
    command docker ps -aqf status=exited | xargs -r docker rm --
}
docker-cleani() {
    command docker images -qf dangling=true | xargs -r docker rmi --
}
docker-rm() {
    if [ "$#" -eq 0 ]; then
        command docker ps -a | fzf --exit-0 --multi --header-lines=1 | awk '{ print $1 }' | xargs -r docker rm --
    else
        command docker rm "$@"
    fi
}
docker-rmi() {
    if [ "$#" -eq 0 ]; then
        command docker images | fzf --exit-0 --multi --header-lines=1 | awk '{ print $3 }' | xargs -r docker rmi --
    else
        command docker rmi "$@"
    fi
}

### Editor ###
export EDITOR="vi"
(( ${+commands[vim]} )) && EDITOR="vim"
(( ${+commands[nvim]} )) && EDITOR="nvim"

export GIT_EDITOR="$EDITOR"

e() {
    if [ $# -eq 0 ]; then
        local selected="$(fd --hidden --color=always --type=f  | fzf --exit-0 --multi --preview="fzf-preview-file {}" --preview-window="right:60%")"
        [ -n "$selected" ] && "$EDITOR" -- ${(f)selected}
    else
        command "$EDITOR" "$@"
    fi
}

### Suffix alias ###
alias -s {bz2,gz,tar,xz}='tar xvf'
alias -s zip=unzip
alias -s d=rdmd

### Node.js ###
export NODE_REPL_HISTORY="$XDG_STATE_HOME/node_history"

### npm ###
export NPM_CONFIG_DIR="$XDG_CONFIG_HOME/npm"
export NPM_DATA_DIR="$XDG_DATA_HOME/npm"
export NPM_CACHE_DIR="$XDG_CACHE_HOME/npm"
export NPM_CONFIG_USERCONFIG="$NPM_CONFIG_DIR/npmrc"

### irb ###
export IRBRC="$XDG_CONFIG_HOME/irb/irbrc"

### Python ###
alias python="python3"
alias pip="pip3"
export PYTHONSTARTUP="$XDG_CONFIG_HOME/python/startup.py"

### pylint ###
export PYLINTHOME="$XDG_CACHE_HOME/pylint"

### SQLite3 ###
export SQLITE_HISTORY="$XDG_STATE_HOME/sqlite_history"

### MySQL ###
export MYSQL_HISTFILE="$XDG_STATE_HOME/mysql_history"

### PostgreSQL ###
export PSQL_HISTORY="$XDG_STATE_HOME/psql_history"

### local ###
if [ -f "$ZDOTDIR/.zshrc.local" ]; then
    source "$ZDOTDIR/.zshrc.local"
fi

### autoloads ###
autoload -Uz cdr
autoload -Uz chpwd_recent_dirs
autoload -Uz _zinit
zpcompinit
