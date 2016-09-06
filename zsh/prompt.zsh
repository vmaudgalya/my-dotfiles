# Set the theme (look in ~/.my-dotfiles/themes
ZSH_THEME="robbyrussell"

# Load and execute colors function
autoload -U colors && colors

# Load the theme
source "$DOTFILES/themes/$ZSH_THEME.zsh-theme"
