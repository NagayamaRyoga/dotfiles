#!/usr/bin/env bash
set -x
# shellcheck source=./scripts/common.bash
source "$(dirname "$0")/common.bash"

[ "$(uname)" != "Darwin" ] && exit

touch "$HOME/.hushlogin"

# GPG
ln -sfv "$REPO_DIR/config/gnupg/gpg-agent.conf.mac" "$HOME/.gnupg/gpg-agent.conf"

# Sublime Text
SUBL_DIR="$HOME/Library/Application Support/Sublime Text"
mkdir -p "$SUBL_DIR"
ln -sfv "$XDG_CONFIG_HOME/sublime-text/Packages" "$SUBL_DIR"

# Finder
defaults write com.apple.finder AppleShowAllFiles -bool true
defaults write com.apple.finder ShowPathbar -bool true
defaults write com.apple.finder ShowTabView -bool true
defaults write com.apple.finder NewWindowTarget -string PfHm

# Keyboard
defaults write NSGlobalDomain AppleKeyboardUIMode -int 3

# Dock
defaults write com.apple.dock orientation right
defaults write com.apple.dock autohide -bool false
defaults write com.apple.dock tilesize -int 50
defaults write com.apple.dock magnification -bool false
defaults write com.apple.dock show-recents -bool false

# Menubar
defaults write com.apple.menuextra.battery ShowPercent -bool true
defaults write com.apple.menuextra.clock DateFormat -string "M\u6708d\u65e5(EEE)  H:mm:ss"

# Mission Control
defaults write com.apple.dock wvous-br-corner -int 4 # Bottom right -> Desktop
defaults write com.apple.dock mru-spaces -bool false # Don't automatically rearrange spaces

# Disable .DS_Store on network disks
defaults write com.apple.desktopservices DSDontWriteNetworkStores -bool true

# Screen capture
defaults write com.apple.screencapture disable-shadow -bool true

# Configure hammerspoon config location
defaults write org.hammerspoon.Hammerspoon MJConfigFile "$XDG_CONFIG_HOME/hammerspoon/init.lua"

killall Dock
killall Finder
killall SystemUIServer
