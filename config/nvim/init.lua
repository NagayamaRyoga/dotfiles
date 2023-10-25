function set_options(opts)
  for key, value in pairs(opts) do
    vim.opt[key] = value
  end
end

set_options({
  fileencoding = 'utf-8',
  hidden = true,
  autoread = true,
  showcmd = true,
  -- Indentation
  tabstop = 4,
  softtabstop = 4,
  shiftwidth = 4,
  shiftround = true,
  smarttab = true,
  list = true,
  -- Views
  title = true,
  number = true,
  relativenumber = true,
  signcolumn = 'yes',
  termguicolors = true,
  cursorline = true,
  showmatch = true,
  showtabline = 2,
  laststatus = 2,
  -- Controls
  mouse = 'a',
  whichwrap = 'b,s,h,l,<,>,[,],~',
  backspace = 'indent,eol,start',
  -- Search
  hlsearch = true,
  incsearch = true,
  smartcase = true,
  ignorecase = true,
  -- Split
  splitbelow = true,
  splitright = true,
  -- Menu
  wildmenu = true,
  wildmode = 'longest:full,full',
})

function set_keymaps(key_maps)
  local key_modes = {
    normal = 'n',
    insert = 'i',
    visual = 'v',
    terminal = 't',
  }

  for i, key_map in pairs(key_maps) do
    local mode = key_modes[key_map[1]]
    local stroke = key_map[2]
    local action = key_map[3]
    local opts = key_map[4]
    vim.api.nvim_set_keymap(mode, stroke, action, opts)
  end
end

set_keymaps({
  { 'normal', ';',          ':',            { noremap = true } },
  { 'normal', 'j',          'gj',           { noremap = true } },
  { 'normal', 'k',          'gk',           { noremap = true } },
  { 'normal', '<Down>',     'gj',           { noremap = true } },
  { 'normal', '<Up>',       'gk',           { noremap = true } },
  { 'normal', 'sh',         '<C-w>h',       { noremap = true } },
  { 'normal', 'sj',         '<C-w>j',       { noremap = true } },
  { 'normal', 'sk',         '<C-w>k',       { noremap = true } },
  { 'normal', 'sl',         '<C-w>l',       { noremap = true } },
  { 'normal', 'sH',         '<C-w>H',       { noremap = true } },
  { 'normal', 'sJ',         '<C-w>J',       { noremap = true } },
  { 'normal', 'sK',         '<C-w>K',       { noremap = true } },
  { 'normal', 'sL',         '<C-w>L',       { noremap = true } },
  { 'normal', '<C-a>',      '^',            { noremap = true } },
  { 'normal', '<C-e>',      '$',            { noremap = true } },
  { 'normal', '+',          '<C-a>',        { noremap = true } },
  { 'normal', '-',          '<C-x>',        { noremap = true } },
  { 'normal', '<C-\\>',     ':vsplit<CR>',  { noremap = true, silent = true } },
  { 'normal', '<C-_>',      ':split<CR>',   { noremap = true, silent = true } },
  { 'normal', '<C-h>',      ':bprev<CR>',   { noremap = true, silent = true } },
  { 'normal', '<C-l>',      ':bnext<CR>',   { noremap = true, silent = true } },
  { 'normal', '<C-w>',      ':bdelete<CR>', { noremap = true, silent = true } },
  { 'normal', '<C-k><C-w>', ':close<CR>',   { noremap = true, silent = true } },

  { 'insert', 'jj',         '<ESC>',                { noremap = true } },
  { 'insert', '<Down>',     '<C-\\><C-o>gj',        { noremap = true } },
  { 'insert', '<Up>',       '<C-\\><C-o>gk',        { noremap = true } },
  { 'insert', '<S-Tab>',    '<C-\\><C-o><<<C-o>I',  { noremap = true } },
  { 'insert', '<C-a>',      '<C-o>I',               { noremap = true } },
  { 'insert', '<C-e>',      '<End>',                { noremap = true } },

  { 'visual', '<C-a>',      '^',            { noremap = true } },
  { 'visual', '<C-e>',      '$',            { noremap = true } },
  { 'visual', '+',          '<C-a>gv',      { noremap = true } },
  { 'visual', '+',          '<C-a>gv',      { noremap = true } },
  -- { 'visual', '<C-i>',      'g<C-a>gv',     { noremap = true } },
  -- { 'visual', 'I',          'g<C-x>gv',     { noremap = true } },

  -- { 'terminal', '<ESC>',    '<C-\\><C-n>',  { noremap = true } },
})

vim.g.loaded_ruby_provider = 0

vim.cmd [[
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
]]
