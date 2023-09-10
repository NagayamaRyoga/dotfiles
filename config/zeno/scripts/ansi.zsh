#!/usr/bin/env zsh
typeset -A ansi
ansi[reset]=$'\x1b[m'
ansi[bold]=$'\x1b[1m'
ansi[dim]=$'\x1b[2m'

ansi[red]=$'\x1b[31m'
ansi[green]=$'\x1b[32m'
ansi[yellow]=$'\x1b[33m'
ansi[blue]=$'\x1b[34m'
ansi[magenta]=$'\x1b[35m'
ansi[cyan]=$'\x1b[36m'

ansi[gray]=$'\x1b[38;5;250m'
ansi[dark_green]=$'\x1b[38;5;65m'
ansi[dark_blue]="$ansi[dim]$ansi[blue]"
