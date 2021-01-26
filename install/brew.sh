#!/bin/sh

if test ! $(which brew); then
    echo "Installing homebrew"
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
fi

echo -e "\n\nInstalling homebrew packages..."
echo "=============================="

# cli tools
brew install ack
brew install tree

# development tools
brew install fzf
brew install macvim
brew install reattach-to-user-namespace
brew install tmux
brew install zsh
brew install z
brew install diff-so-fancy
brew install zsh-syntax-highlighting
brew install zsh-autosuggestions

exit 0
