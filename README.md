my-dotfiles
===========
> This is a script which will set up your entire development environment on a new machine.
> The purpose is to accelerate development time with the same look, feel and tools needed
> to be extremely productive, as quickly as possible.

### Instructions
```sh
# From within your home directory (/Users/$username/), clone the project
git clone git@github.com:vmaudgalya/my-dotfiles.git .my-dotfiles

# Run the install script
bash install.sh

# Open vim with the following command
vim +PlugInstall

# If you shell isn't automatically changed, run the following:
chsh -s $(which zsh)
```
----------------------------------------------

### Issues?
Make sure that zsh is added to /etc/shells. If not, run:
`sudo bash -c "echo /usr/local/bin/zsh >> /etc/shells"`

Make sure to add files in `resources` to the TERM database
```sh
tic xterm-256color-italic.terminfo
tic tmux-256color-italic.terminfo
```

----------------------------------------------

### Manual Assembly Required

#### iTerm
Set terminal colors in iTerm:
1. Preferences
2. Profiles
3. Click Terminal
4. Report Terminal Type: xterm-256color-italic

#### Git
Set global username and email using Git:
```sh
git config --global user.name "John Doe"
git config --global user.email johndoe@example.com
```
Generate SSH keys for machine [GitHub Instructions](https://help.github.com/articles/connecting-to-github-with-ssh/)

You may need to source all dotfiles (you can do this using `reload!`) and restart iTerm for changes to take effect.

#### Jupyter
> If you use Jupyter and would like my custom configuration, copy everything in the `jupyter` folder inside /Users/$username/.jupyter/custom/

----------------------------------------------

#### TODO
- [ ] Automatically set up Git (SSH keygen, name, username)
- [ ] Move change shell command to end of script
- [ ] Add terminal colors to term database after change shell cmd

----------------------------------------------

#### Testing
The `install.sh` script was last tested on macOS Mojave on Jan 14, 2019.

----------------------------------------------

#### Productivity
[iTerm macOS Terminal Replacement](https://www.iterm2.com/downloads.html)
[Make Your Address Bar Default to I'm Feeling Lucky](https://productforums.google.com/forum/#!topic/chrome/8FS4pYxfxj0)
[Momentum](https://chrome.google.com/webstore/detail/momentum/laookkfknpbbblfpciffpaejjkokdgca?hl=en)
[Aerial Screensavers](https://github.com/JohnCoates/Aerial)

----------------------------------------------

#### Thank You
Special thanks to [@nicknisi](https://github.com/nicknisi/dotfiles) for inspiring me to supercharge my development environment!
