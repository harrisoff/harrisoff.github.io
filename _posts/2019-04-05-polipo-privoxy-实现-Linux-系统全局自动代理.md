---
layout: post
title: "polipo/privoxy 实现 Linux 系统全局/自动代理"
date: 2019-04-05 00:00:00
categories: devops linux
---
## 前言

操作系统为 Ubuntu。  
客户端代理软件为 Python 版本 Shadow 和谐 socks 自带的 sslocal。

> SS 安装和配置过程不再赘述。默认本地端口 `1080`，这里改成了 `1081`。

sslocal 是 socks5 代理，需要一个软件进行 socks5 和 HTTP 的转换。  
下面介绍 **polipo** 和 **privoxy** 两种。

polipo 貌似只能全局代理，privoxy 全局/自动两种代理方式都可以实现。

> 全局代理下，访问 `localhost` 时也会走代理，可能导致无法正常访问本地服务。

## polipo 实现全局代理

安装 polipo：

```
apt-get update
apt-get install polipo
```

polipo 的配置文件 `/etc/polipo/config` 初始内容只有 `logSyslog` 和 `logFile` 两项。  
添加以下内容：

```
# SS 的代理地址
socksParentProxy = "127.0.0.1:1081"
# 类型
socksProxyType = socks5
# 转换为 HTTP 之后的端口
proxyPort = 8123
# 下面的就不清楚了
chunkHighMark = 50331648
objectHighMark = 16384
serverMaxSlots = 64
serverSlots = 16
serverSlots1 = 32
proxyAddress = "0.0.0.0"
```

`8123` 就是 HTTP 代理的端口了。

接下来把代理地址添加到环境变量。在 `/etc/profile` 添加以下内容：

```
export http_proxy="http://127.0.0.1:8123"
export https_proxy="http://127.0.0.1:8123"
```

重新载入：

```
source /etc/profile
```

启动 polipo：

```
service polipo start
```

测试一下：

```
curl www.google.com
```

## privoxy 实现全局和自动代理

privoxy 可以配置 .action 格式的代理规则文件。通过控制规则文件实现全局和自动代理。

action 文件可以手动编辑，也可以从 [gfwlist](https://github.com/gfwlist/gfwlist) 生成。  
下面将先介绍 privoxy 的安装配置，再介绍 action 文件的生成。

### 安装配置

安装 privoxy：

```
apt-get update
apt-get install privoxy
```

进入目录 `/etc/privoxy`，可以看到目录结构大致为：

- `config` 配置文件，这个文件很长。。
- `*.action` 代理规则文件
- `*.filter` 过滤规则文件
- `trust` 不造干嘛用
- `templates/` 同上

开始修改配置文件。

privoxy 有 filter （过滤）的功能，可以用来实现广告拦截。不过这里只希望实现自动代理，在配置文件中把 filter 部分注释掉：

 ```
# 大约在435行
# filterfile default.filter
# filterfile user.filter      # User customizations
```

我们将使用自定义的 action 文件，所以把默认的 action 文件注释掉，并添加自定义文件：

 ```
# 386行左右
# 默认的 action 文件
# actionsfile match-all.action # Actions that are applied to all sites and maybe overruled later on.
# actionsfile default.action   # Main actions file
# actionsfile user.action      # User customizations
# 自定义 action 文件
actionsfile my.action
```

可以指定转换后的 HTTP 代理地址，这里直接使用默认端口 `8118`：

 ```
# 785行左右
listen-address  127.0.0.1:8118
listen-address  [::1]:8118
```

如果代理规则直接写在配置文件 `config` 中，那么代理规则和本地 SS 代理地址是写在一起的：

```
# / 代表匹配全部 URL，即全局代理
forward-socks5 / 127.0.0.1:1081 .
```

或

```
# 根据规则自动代理
forward-socks5 .google.com 127.0.0.1:1081 .
```

**注意！每行最后还有一个点。**

实现全局代理就是第一种写法了。

但是如果要自动代理，第二种直接写在配置文件里的做法其实不太合适，更合适的做法是写成 action 文件，配置文件中只管引用。

把上面的注释掉。  
新建 action 文件 `my.action`，内容如下：

```
# 这一行表示本 action 文件中所有条目都使用代理
{+forward-override{forward-socks5 127.0.0.1:1081 .}}
# 添加一条规则
.google.com
```

把 privoxy 转换后的地址 `http://127.0.0.1:8118` 添加到环境变量，可以参照 polipo 部分。

启动 privoxy，这时应该可以正常访问 Google 了：

```
service privoxy start
curl www.google.com
```

下面看一下怎么用 gfwlist 生成 action 文件。

### 生成 action 文件

> 配置文件 `config` 或 action 文件修改后不需要重启 privoxy。

使用的工具是 [gfwlist2privoxy](https://github.com/snachx/gfwlist2privoxy)。这个工具很简单，文档就几行，写得也很清楚。

安装：

```
pip install gfwlist2privoxy
```

gfwlist2privoxy **不支持 python3.x**，安装时注意使用的是 `pip2` 还是 `pip3`。

参数说明：

- `-i`/`--input` 输入，本地 gfwlist 文件或文件 URL。这里使用上面的 [gfwlist](https://raw.githubusercontent.com/gfwlist/gfwlist/master/gfwlist.txt)
- `-f`/ `--file` 输出，即生成的 action 文件的目录。这里输出到 `/etc/privoxy/gfwlist.action`
- `-p`/ `--proxy` SS 代理地址，生成后可以修改。这里是 `127.0.0.1:1081`
- `-t`/ `--type` 代理类型，生成后也可以修改。这里是 `socks5`
- `--user-rule` 用户自定义规则文件，这个文件中的规则会被追加到 gfwlist 生成的规则后面

示例：

```
gfwlist2privoxy -i https://raw.githubusercontent.com/gfwlist/gfwlist/master/gfwlist.txt -f /etc/privoxy/gfwlist.action -p 127.0.0.1:1081 -t socks5
```

得到文件 `/etc/privoxy/gfwlist.action`：

```
# gfwlist.action generated by gfwlist2privoxy, 2018-08-02 07:36:00 +0000
# https://github.com/snachx/gfwlist2privoxy

{+forward-override{forward-socks5 127.0.0.1:1081 .}}

# 规则列表
...
```

最后，把 `/etc/privoxy/config` 中的 `actionsfile my.action` 改为 `actionsfile gfwlist.action` 就完成了。

## 其他

1. 还有一种自动代理的方法使用了 [cow](http://www.nasyun.com/thread-24853-1-1.html)，还没试过。

2. 环境变量的配置
   很多教程都只添加了 `http_proxy` 一项，但是实际使用中发现也需要设置 `https_proxy`。

   另外，关于地址的写法，只写 `127.0.0.1:8123` 时，遇到过有软件不能识别的情况，改为**写完整的地址** `http://127.0.0.1:8123/` 就不会有问题了。