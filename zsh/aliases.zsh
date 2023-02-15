# reload zsh config
alias reload!='source ~/.zshrc'

# Detect which `ls` flavor is in use
if ls --color > /dev/null 2>&1; then # GNU `ls`
    colorflag="--color"
else # OS X `ls`
    colorflag="-G"
fi

# Filesystem aliases
alias ..='cd ..'
alias ...='cd ../..'
alias ....="cd ../../.."
alias .....="cd ../../../.."

# File found will be opened using vim
alias fzfvim='vim $(fzf)'

alias l="ls -lah ${colorflag}"
alias la="ls -AF ${colorflag}"
alias ll="ls -lFh ${colorflag}"
alias lld="ls -l | grep ^d"
alias rmf="rm -rf"

# git aliases
alias ga='git add'
alias gc='git commit -m'
alias gp='git push -u origin master'
alias gd='git diff --color | diff-so-fancy'
alias gs='git status'
alias gmr='git push -u origin HEAD'
alias gpl='git pull --rebase origin master'
alias g-discard-local='git reset --hard origin/master'

# Helpers
alias grep='grep --color=auto'
alias df='df -h' # disk free, in Gigabytes, not bytes
alias du='du -h -c' # calculate disk usage for a folder
alias ic='cd /Users/vmaudgalya/Library/Mobile\ Documents/com\~apple\~CloudDocs/'

# IP addresses
alias ip="dig +short myip.opendns.com @resolver1.opendns.com"
alias localip="ipconfig getifaddr en1"
alias ips="ifconfig -a | perl -nle'/(\d+\.\d+\.\d+\.\d+)/ && print $1'"
