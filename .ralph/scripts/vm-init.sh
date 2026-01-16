#!/bin/bash
# vm-init.sh - Körs automatiskt när VM startar
# Installerar allt som behövs för Ralph

set -e

echo "=== Ralph VM Setup ==="

# Uppdatera system
sudo apt-get update

# Installera grundläggande verktyg
sudo apt-get install -y curl git ripgrep jq tmux

# Installera Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Installera Claude Code CLI
sudo npm install -g @anthropic-ai/claude-code

# Installera GitHub CLI
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
sudo chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt-get update
sudo apt-get install -y gh

# Skapa workspace
mkdir -p ~/workspace
mkdir -p ~/scripts
mkdir -p ~/specs

echo ""
echo "=== Installation klar! ==="
echo ""
echo "Nästa steg (engångskonfiguration):"
echo "1. Logga in på Claude:  claude"
echo "2. Logga in på GitHub:  gh auth login"
echo ""
echo "Sen är VM:en redo för Ralph!"
