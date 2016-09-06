#!/usr/bin/env bash

DOTFILES=$HOME/.my-dotfiles

echo -e "\nCreating symlinks"
echo "=============================="
linkables=$( find -H "$DOTFILES" -maxdepth 3 -name '*.symlink' )
for file in $linkables ; do
    target="$HOME/.$( basename $file '.symlink' )"
    if [ -e $target ]; then
        echo "~${target#$HOME} already exists... Skipping."
    else
        echo "Creating symlink for $file"
        ln -s $file $target
    fi
done

# Because associative arrays don't exist in Bash 3
echo -e "\n\nCreating vim symlinks"
echo "=============================="
ARRAY=( "$HOME/.vim:$DOTFILES/vim/.vim"
        "$HOME/.vimrc:$DOTFILES/vim/.vimrc" )

for file in "${ARRAY[@]}" ; do
    KEY=${file%%:*}
    VALUE=${file#*:}
    if [ -e ${KEY} ]; then
        echo "${KEY} already exists... skipping"
    else
        echo "Creating symlink for $KEY"
        ln -s ${VALUE} ${KEY}
    fi
done
