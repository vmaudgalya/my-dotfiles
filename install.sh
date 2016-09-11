#!/usr/bin/env bash

echo "Installing dotfiles"

source install/link.sh

if [ "$(uname)" == "Darwin" ]; then
    echo -e "\n\nRunning on OSX"

    source install/brew.sh

    source install/nvm.sh

fi

# echo "creating vim directories"
# mkdir -p ~/.vim-tmp

echo "Adding terminfo files to TERM database"
tic resources/xterm-256color-italic.terminfo
tic resources/tmux-256color-italic.terminfo

echo "Adding zsh to list of valid login shells"
sudo bash -c "echo /usr/local/bin/zsh >> /etc/shells"

echo "Configuring zsh as default shell"
chsh -s $(which zsh)

echo "Done."
