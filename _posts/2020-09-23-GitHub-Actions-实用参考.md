---
layout: post
title: "GitHub Actions 实用参考"
date: 2020-09-23 00:00:00
categories: devops
---

假设你对 GitHub Actions 已经有了最基本的了解。

比如你知道，下面这个配置表示当 push 到 master 分支时会触发 action，作用是在 ubuntu 系统中把代码 checkout 出来，然后使用 node 12 先后执行 `npm i` 和 `npm run test`。

```yaml
name: test
on:
  push:
    branches: [ master ]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v1
      with:
        node-version: 12
    - name: install
      run: npm i
    - name: test
      run: npm run test
```

那么接下来~~告诉你们一些人生的经验~~总结一些感觉比较实用的操作。

## 修改文件后推送回仓库

通常使用 [actions/checkout@v2](https://github.com/actions/checkout) 检出代码。

由于环境中已经提供了 git 命令，那么就可以修改、提交并推送回仓库了。

[GitHub Marketplace](https://github.com/marketplace?type=actions) 里肯定有提供了这种功能的 action，不过这里只说一下直接执行命令行的方式。

有这么一些需要注意的地方：

### 可能需要修改 token

可以发现，就算是私有仓库也可以使用 `actions/checkout@v2`，因为这个 action 使用的默认 `token`，有检出本仓库的权限。但是在其他一些情况下，这个 `token` 的权限就不够用了。举个栗子，如果在 action 里添加了一个 `./github/workflows/another.yaml` 配置文件，这时 `push` 的话会报错：

```bash
refusing to allow a GitHub App to create or update workflow `.github/workflows/another.yaml` without `workflows` permission
```

因为这个 token 没有修改 workflows 的权限。需要创建一个具有相应权限的 Personal Access Token，并提供给 `actions/checkout` 使用。

创建 PAT 的过程就不细说了。安全起见 PAT 需要保存到 secrets 里。

### 避免无限循环

很多 action 通常都会通过 push 触发，如果 action 还能继续触发 push，就有可能导致无限循环了。

这个要根据实际需求，看是修改 action 还是修改代码。

### 需要配置 git 用户

就是 `git config --global user.email "name@gmail.com"` 和 `git config --global user.name "name"`。

### 如果文件没有发生变化

或许存在一些情况，导致其实文件没有发生变化。如果这时执行 `git commit`，会提示 `nothing to commit, working tree clean.`。

注意了，这是一个报错，意味着 action 执行失败。

这里提供一个自己写的 bash 脚本作为 workaround，只有文件发生变化时才执行提交：

```bash
#!/bin/bash
status_log=$(git status -sb)
# 这里使用的是 master 分支，根据需求自行修改
if [ "$status_log" == "## master...origin/master" ];then
  echo "nothing to commit, working tree clean"
else
  git add .&&git commit -m "update by github actions"&&git push origin master
fi
```

> 需要执行 `chmod +x` 添加执行权限。

总之，下面是一个可用的 action 配置文件：

```yaml
name: demo
on:
  # 这是一个由定时任务触发的场景，不会导致无限循环
  schedule:
    - cron: '0 */12 * * *'
jobs:
  modify:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [10.x]
    steps:
    - uses: actions/checkout@v2
      with:
        # personal access token
        token: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v1
      with:
        node-version: ${{ matrix.node-version }}
    # 修改文件的操作
    - name: modify files
      run: node ./operations.js
    # 使用上面的 sh 脚本提交和推送
    - name: run script
      run: chmod +x ./update-repo.sh&&./update-repo.sh
    # 或者使用 git 命令
    - name: check for changes
      run: git status
    - name: stage changed files
      run: git add .
    - name: config git
      run: git config --global user.email "name@gmail.com"&&git config --global user.name "name"
    - name: commit changed files
      run: git commit -m "update by github actions"
    - name: push code to master
      run: git push origin master
```

## 操作另一个仓库

除了操作本仓库，当然也可以通过 git 命令行操作其他的仓库。

需要注意的是，如果要 push，或者操作私有仓库，就要考虑权限的问题了，就算私有仓库是自己的也不行。这里只说使用 SSH 的场景。

Marketplace 里肯定有这种 action，不过这里介绍一个简单明了的，[这是原链接](https://www.webfactory.de/blog/use-ssh-key-for-private-repositories-in-github-actions)。

把私钥保存到 `secrets.ID_RSA`，并添加以下配置。然后哪里需要密钥的时候，设置一下 `SSH_AUTH_SOCK` 环境变量就可以了。

```yaml
- name: setup SSH keys and known_hosts
  run: |
    mkdir -p ~/.ssh
    ssh-keyscan github.com >> ~/.ssh/known_hosts
    ssh-agent -a $SSH_AUTH_SOCK > /dev/null
    ssh-add - <<< "${{ secrets.ID_RSA }}"
  env:
    SSH_AUTH_SOCK: /tmp/ssh_agent.sock
- name: clone repository
  # clone 一个私有仓库
  run: git clone git@github.com:private/repo.git
  # 设置一下 env，就可以使用密钥了
  env:
    SSH_AUTH_SOCK: /tmp/ssh_agent.sock
```

## 部署文件到其他服务器

使用 [ssh-deploy](https://github.com/easingthemes/ssh-deploy)，不多说了。

示例：

```yaml
- name: deploy
  uses: easingthemes/ssh-deploy@v2.0.7
  env:
    SSH_PRIVATE_KEY: ${{ secrets.ID_RSA }}
    ARGS: "-avzr --delete"
    SOURCE: "dist/"
    REMOTE_HOST: "server ip"
    REMOTE_USER: "root"
    TARGET: "/home/webroot/dist"
```

## 切换工作目录

如果要执行的操作都是在一个子目录下的，可以直接把默认的工作目录切换到该目录下。

```yaml
name: build
on:
  push:
    branches: [ master ]
defaults:
  run:
    working-directory: client
jobs:
  # 现在默认目录是 ./client 了
```

注意，如果在一个 step 中 cd 到某个目录下，那么后续的 step 是不受影响的，还是在原来的目录中。
