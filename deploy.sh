#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

# 设置 git user (避免 commit 时因缺少配置而失败)
git config --global user.name "GitHub Actions"
git config --global user.email "actions@github.com"

# 使用 gh-pages 部署到 GitHub Pages gh-pages 分支
npx gh-pages -d dist
