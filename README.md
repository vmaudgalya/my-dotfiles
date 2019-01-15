my-dotfiles
===========
> This is a script which will set up your entire development environment on a new machine.
> The purpose is to accelerate development time with the same look, feel and tools needed
> to be extremely productive, as quickly as possible.


### Instructions
```sh
git clone git@github.com:vmaudgalya/my-dotfiles.git .my-dotfiles
bash install.sh  # Run install script
vim +PlugInstall # First time you open vim
```

#### Any issues?
Make sure that zsh is added to /etc/shells. If not, run:
`sudo bash -c "echo /usr/local/bin/zsh >> /etc/shells"`

Make sure to add files in `resources` to the TERM database
`tic xterm-256color-italic.terminfo`
`tic tmux-256color-italic.terminfo # This may need to be done in tmux`

#### Manual Assembly Required

This needs to be set in iTerm:
1. Preferences
2. Profiles
3. Click Terminal
4. Report Terminal Type: xterm-256color-italic

Set up Git:
```bash
git config --global user.name "John Doe"
git config --global user.email johndoe@example.com
```

You may need to source all dotfiles (you can do this using `reload!`) and restart iTerm for changes to take effect.

#### TODO
- [ ] Automatically set up Git (SSH keygen, name, username)



#### Productivity
[iTerm macOS Terminal Replacement](https://www.iterm2.com/downloads.html)

[Make Your Address Bar Default to I'm Feeling Lucky](https://productforums.google.com/forum/#!topic/chrome/8FS4pYxfxj0)

[Momentum](https://chrome.google.com/webstore/detail/momentum/laookkfknpbbblfpciffpaejjkokdgca?hl=en)

[Aerial Screensavers](https://github.com/JohnCoates/Aerial)


#### Thank You
Heavily inspired by [@nicknisi](https://github.com/nicknisi/dotfiles)
