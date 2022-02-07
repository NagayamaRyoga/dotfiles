""" Options """
set fenc=utf-8
set hidden
set autoread
set showcmd
" Indentation
set tabstop=4
set softtabstop=4
set shiftwidth=4
set shiftround
set smarttab
set list
" Views
set title
set number
set relativenumber
set termguicolors
set cursorline
set showmatch
set showtabline=2
set laststatus=2
" Controls
set mouse=a
set whichwrap=b,s,h,l,<,>,[,],~
" Search
set hlsearch
set incsearch
set smartcase
set ignorecase
" Split
set splitbelow
set splitright
" Backspace
set backspace=indent,eol,start
" Menu
set wildmenu
set wildmode=longest:full,full

""" Keymaps """
nnoremap ;      :
nnoremap <silent>j      gj
nnoremap <silent>k      gk
nnoremap <silent><Down> gj
nnoremap <silent><Up>   gk
nnoremap <silent>sh     <C-w>h
nnoremap <silent>sj     <C-w>j
nnoremap <silent>sk     <C-w>k
nnoremap <silent>sl     <C-w>l
nnoremap <silent>sH     <C-w>H
nnoremap <silent>sJ     <C-w>J
nnoremap <silent>sK     <C-w>K
nnoremap <silent>sL     <C-w>L
nnoremap <silent><C-a>  ^
nnoremap <silent><C-e>  $
nnoremap <silent>+      <C-a>
nnoremap <silent>-      <C-x>
nnoremap <silent><C-\>  :vsplit<CR>
nnoremap <silent><C-_>  :split<CR>
nnoremap <silent><C-h>  :bprev<CR>
nnoremap <silent><C-l>  :bnext<CR>
nnoremap <silent><C-w>  :bdelete<CR>
nnoremap <silent><C-k><C-w> :close<CR>
inoremap <silent>jj     <ESC>
inoremap <silent><Down> <C-\><C-o>gj
inoremap <silent><Up>   <C-\><C-o>gk
inoremap <silent><S-Tab> <C-\><C-o><<<C-o>I
inoremap <silent><C-a>  <C-o>I
inoremap <silent><C-e>  <End>
vnoremap <silent><C-a>  ^
vnoremap <silent><C-e>  $
vnoremap <silent>+      <C-a>gv
vnoremap <silent>-      <C-x>gv
" vnoremap <silent><C-i>  g<C-a>gv
" vnoremap <silent>I      g<C-x>gv
tnoremap <silent><ESC>  <C-\><C-n>

function! MyKeyMapsDiff()
    nnoremap <silent>J  /^[+-]<CR>
    nnoremap <silent>K  ?^[+-]<CR>
endfunction

function! MyKeyMapsHtml()
    inoremap <buffer></ </<C-x><C-o>
endfunction

augroup MyKeyMaps
    autocmd!
    autocmd FileType diff call MyKeyMapsDiff()
    autocmd FileType html call MyKeyMapsHtml()
augroup END

""" Terminal """
source $XDG_CONFIG_HOME/nvim/terminal.vim

""" Filetype """
augroup MyFileType
    autocmd!
    autocmd BufNewFile,BufRead .envrc               set filetype=sh
    autocmd BufNewFile,BufRead */git/config*        set filetype=gitconfig
    autocmd BufNewFile,BufRead */git/conf.d/*.conf  set filetype=gitconfig
    autocmd BufNewFile,BufRead .clang-format        set filetype=yaml
    autocmd BufNewFile,BufRead Brewfile             set filetype=ruby
augroup END

""" dein.vim """
set runtimepath+=$XDG_DATA_HOME/dein/repos/github.com/Shougo/dein.vim

if dein#load_state($XDG_DATA_HOME . '/dein')
    call dein#begin($XDG_DATA_HOME . '/dein')

    call dein#load_toml($XDG_CONFIG_HOME . '/nvim/dein.toml')

    call dein#end()
    call dein#save_state()
endif

filetype plugin indent on
syntax enable

if dein#check_install()
    call dein#install()
endif

""" Highlight """
highlight BufferCurrentSign guifg=#5faefe
highlight BufferVisibleSign guifg=#7be4a4
highlight BufferInactive    guifg=#808080 guibg=#262626
highlight BufferTabpageFill guifg=#444444 guibg=#303030
