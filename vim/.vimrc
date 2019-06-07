
" Color Scheme
colorscheme predawn

" Set relative and absolute numbering
set relativenumber
set number

" Show existing tab with 4 spaces width
set tabstop=4

" When indenting with '>', use 4 spaces width
set shiftwidth=4

" On pressing tab, insert 4 spaces
set expandtab

" Text over 80 column limit is highlighted in red
set colorcolumn=100

let mapleader=' '

let NERDSpaceDelims=1

call plug#begin('~/.vim/plugged')
" Add plugins to &runtimepath

" Syntax checker
Plug 'w0rp/ale'

" Quoting/Parenthesizing made easy
Plug 'tpope/vim-surround'

" Fuzzy file
Plug '/usr/local/opt/fzf' | Plug 'junegunn/fzf.vim'

" Repeatable Plugin commands
Plug 'tpope/vim-repeat'

" Awesome commenting
Plug 'scrooloose/nerdcommenter'

" Autocomplete quotes/parens/brackets
Plug 'raimondi/delimitmate'

call plug#end()
