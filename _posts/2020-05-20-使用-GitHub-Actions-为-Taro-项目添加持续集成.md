---
layout: post
title: "使用 GitHub Actions 为 Taro 项目添加持续集成"
date: 2020-05-20 00:00:00
categories: devops 小程序
---

## 准备

首先安装 `miniprogram-ci`：

```bash
npm install miniprogram-ci -D
```

这是微信官方提供的上传工具，文档戳[这里](https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html)，感觉写得不够详细。

根据文档，下载小程序的**上传密钥**，把密钥内容保存到项目的 GitHub Secrets 里，命名为 `MINI_UPLOAD_PRIVATE_KEY`。

注意，需要**关闭 IP 白名单**，因为上传将从 GitHub 的服务器发起，IP 是会变的。

另外，把小程序的 APPID 也保存到 Secrets，命名为 `MINI_APPID`。

## GitHub Actions 配置

新建 `.github/workflows/build.yaml`，内容如下：

```yaml
name: build

on:
  push:
    branches: [ master ]
  pull_request:
    branches: [ master ]

jobs:
  build:

    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [10.x]

    steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v1
      with:
        node-version: ${{ matrix.node-version }}
    # 安装依赖
    - name: install
      run: npm i
    # 构建
    - name: build
      run: npm run build:weapp
    # 我们把上传密钥保存到了 secrets.MINI_UPLOAD_PRIVATE_KEY
    # 但是 miniprogram-ci 只接受密钥文件路径作为参数
    # 所以这里创建一个临时的密钥文件 private.key
    - name: create private key file
      run: echo "$MINI_UPLOAD_PRIVATE_KEY" > private.key
      env:
        MINI_UPLOAD_PRIVATE_KEY: ${{ secrets.MINI_UPLOAD_PRIVATE_KEY }}
    # 获取 package.json 里的 version 字段，上传时用作小程序的版本号
    - name: get package version
      id: package-version
      uses: martinbeentjes/npm-get-version-action@master
    # 上传
    - name: upload
      run: npx miniprogram-ci upload --pp ./ --pkp ./private.key --appid ${{ secrets.MINI_APPID }} --uv ${{ steps.package-version.outputs.current-version}}
```

这样就完成了。代码 `push` 到 `master` 分支时，会触发构建和上传流程。上传完成后，在小程序后台的版本管理中可以看到，开发者为*ci机器人*。

另外，可以把 [badge](https://help.github.com/en/actions/configuring-and-managing-workflows/configuring-a-workflow#adding-a-workflow-status-badge-to-your-repository) 添加到 README.md 里。

## 其他

### IP 白名单

关于 GitHub Actions 服务器的 IP 范围，这里是[官方文档](https://help.github.com/en/actions/reference/virtual-environments-for-github-hosted-runners#ip-addresses-of-github-hosted-runners)。

### 小程序版本号

在微信开发者工具中上传的时候，版本号只能使用字母/数字/点，但使用 `miniprogram-ci` 时没有这个限制。
