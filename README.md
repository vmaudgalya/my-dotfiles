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

### Manual Assembly Required

#### iTerm
Set terminal colors in iTerm:
1. Preferences
2. Profiles
3. Click Terminal
4. Change the "Report Terminal Type" to: xterm-256color-italic

----------------------------------------------

### Debugging Issues
Make sure that zsh is added to /etc/shells. If not, run:
`sudo bash -c "echo /usr/local/bin/zsh >> /etc/shells"`

If you get an error related to the terminal being unable to find xterm/tmux color themes, make sure to add files in `resources` to the TERM database by running:
```sh
tic xterm-256color-italic.terminfo
tic tmux-256color-italic.terminfo
```

There may be errors during Homebrew package installation. This is expected, and each error will display an accompanying fix.

----------------------------------------------

#### Git
Set global username and email using Git:
```sh
git config --global user.name "John Doe"
git config --global user.email johndoe@example.com
```
Generate SSH keys for machine [GitHub Instructions](https://help.github.com/articles/connecting-to-github-with-ssh/)

You may need to source all dotfiles (you can do this using `reload!`) and restart iTerm for changes to take effect.

----------------------------------------------

#### Jupyter
If you use Jupyter Notebooks and would like my custom configuration:
```
#  Create ~/.jupyter/ config if you don't already have one
jupyter notebook --generate-config 

######################
# Set up Jupyter vim-binding
# Note: Last tested with version https://github.com/lambdalisue/jupyter-vim-binding/tree/c9822c753b6acad8b1084086d218eb4ce69950e9
######################
## Create required directory in case (optional)
mkdir -p $(jupyter --data-dir)/nbextensions
## Clone the repository
cd $(jupyter --data-dir)/nbextensions
git clone https://github.com/lambdalisue/jupyter-vim-binding vim_binding
## Activate the extension
jupyter nbextension enable vim_binding/vim_binding

# Copy configuration from jupyter folder inside generated jupyter dotfiles
cp -R ~/.my-dotfiles/jupyter/* ~/.jupyter/
```

----------------------------------------------

#### TODO
- [ ] Automatically set up Git (SSH keygen, name, username)
- [ ] Add terminal colors to term database after change shell cmd

----------------------------------------------

#### Testing
The `install.sh` script was last tested on macOS Big Sur on Jan 26, 2021.

----------------------------------------------

#### Productivity & Aesthetics
* For macOS, in System Preferences:
  * Keyboard -> Set Key Repeat to "Fast", Set Delay Until Repeat to "Short"
  * Trackpad -> Increase Tracking Speed
  * Desktop & Screensaver -> Hot Corners -> Set top left to "Put Display to Sleep"
  * Security & Privacy -> General -> Require password immediately after sleep or screensaver begins
* [iTerm macOS Terminal Replacement](https://www.iterm2.com/downloads.html)
* [Make Your Address Bar Default to I'm Feeling Lucky](https://productforums.google.com/forum/#!topic/chrome/8FS4pYxfxj0)
* [Momentum](https://chrome.google.com/webstore/detail/momentum/laookkfknpbbblfpciffpaejjkokdgca?hl=en)
* [Aerial Screensavers](https://github.com/JohnCoates/Aerial)

----------------------------------------------

#### Thank You
Special thanks to [@nicknisi](https://github.com/nicknisi/dotfiles) for inspiring me to supercharge my development environment!
