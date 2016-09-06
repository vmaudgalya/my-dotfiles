my-dotfiles
===========
> Scripted dev environment setup


### Instructions
`bash install.sh` to set up

`vim +PlugInstall` the first time you open vim


#### Issues
You may need to add zsh to /etc/shells

`echo /usr/local/bin/zsh >> /etc/shells`

Make sure to add files in `resources` to the TERM database

`tic xterm-256color-italic.terminfo`

`tic tmux-256color-italic.terminfo`

This needs to be set in iTerm:

1. Preferences
2. Profiles
3. Click Terminal
4. Report Terminal Type: xterm-256color-italic



#### Productivity
[Make Your Address Bar Default to I'm Feeling Lucky](https://productforums.google.com/forum/#!topic/chrome/8FS4pYxfxj0)

[Momentum](https://chrome.google.com/webstore/detail/momentum/laookkfknpbbblfpciffpaejjkokdgca?hl=en)

[uBlock Origin](https://chrome.google.com/webstore/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm?hl=en)

[Newsfeed Eradicator](https://chrome.google.com/webstore/detail/news-feed-eradicator-for/fjcldmjmjhkklehbacihaiopjklihlgg?hl=en)


#### Thank You
Heavily inspired by [@nicknisi](https://github.com/nicknisi/dotfiles)
