---
layout: post
title: "使用 uWSGI 和 Nginx 部署 Django 项目"
date: 2019-04-19 00:00:00
categories: devops python nginx
---
## 前言

本文只介绍**部署**。  
首先需要有一个已经可用的 Django 项目。

操作环境 Ubuntu。

## uWSGI 的安装配置

### 安装

```
pip install uwsgi
```

> Debian 及衍生系统，如 Ubuntu，需要先安装 `python-dev` 或 `python3-dev`。否则不能正常安装 uwsgi。

使用 uWSGI 在 `8000` 端口运行 Django 项目：

```
uwsgi --http 127.0.0.1:8000 --chdir /path/to/project/ --wsgi-file /path/to/wsgi.py
```

根据 [uWSGI 文档](http://uwsgi-docs-cn.readthedocs.io/zh_CN/latest/WSGIquickstart.html#django)，为了**正确加载模块**，必须添加 `chdir` 选项。

而实际上，`chdir` 选项的作用是切换到该目录，见[《uwsgi 常用参数说明》](https://blog.csdn.net/djskl/article/details/46654291)。  
所以如果所有的配置都**使用完整路径**的话，就不需要 `chdir` 了。

### 配置项

- `--processes` 启用的进程数，默认1
- `--threads` 每个进程的线程数，默认1
- `--stats` 设置一个地址，可以通过该地址监控运行状态，输出 JSON 格式的数据

关于 `--stats`：  
- 因为是一个地址，所以可以使用 `telnet` 或 `curl` 查看。或者使用官方提供的工具 uwsgitop，最后一部分会简单介绍一下。


示例：
```
uwsgi --http 127.0.0.1:8000 --chdir /path/to/project/ --wsgi-file /path/to/wsgi.py --processes 4 --threads 2 --stats 127.0.0.1:8080
```

上面的命令在 `8000` 端口启动了一个 uWSGI 实例，产生4个进程，每个进程2个线程，并可以在 `127.0.0.1:8080` 查看运行状态。

### 命令行参数写为配置文件

显然上面的命令有点长了。可以把配置写在配置文件里，执行时只需要一个配置文件做参数：

```
# conf.ini
[uwsgi]
http = 127.0.0.1:8000
chdir = /path/to/project/
wsgi-file = /path/to/wsgi.py
processes = 4
threads = 2
stats = 127.0.0.1:8080
```

> 考虑到安全性，[uWSGI 文档](http://uwsgi-docs-cn.readthedocs.io/zh_CN/latest/WSGIquickstart.html#id2)中提到，**不要使用 root 权限来运行 uWSGI**，添加 `uid` 和 `gid` 选项指定用户和组。

使用配置文件运行：

```
uwsgi conf.ini
```

现在项目已经通过 uWSGI 运行在 `8000` 端口了。

**注意：**  
`http` 选项的参数可以只是一个端口，比如 `:8000`，不过效果等于 `0.0.0.0:8000`。  
所以最好完整地写为 `127.0.0.1:8000`，让项目只运行在本地，然后反向代理出去。

### 停止和重启

一般会设置多个进程，那么可以在配置文件中添加 `master` 选项：

```
master = true
```
 
这样一来，除了配置中设置的进程数，还将**另外启动一个 master 进程**，用来管理其他进程。

这时，

- `kill` master 进程的 pid，master 将自动重启
- `kill` uWSGI 的其他进程，master 将自动重新启动一个进程

可以使用 `killall` 退出 uWSGI，参考 [StackOverflow 上的这个问题](https://serverfault.com/questions/565903/how-to-stop-uwsgi-when-no-pidfile-in-config)。  
可以，但是没有必要。

为了更优雅地操作 uWSGI，再添加 `safe-pidfile` 选项，使用 pidfile 来操作 uWSGI：

```
safe-pidfile = /path/to/uwsgi-master.pid
```
 
`safe-pidfile` 会在指定的位置生成一个 pid 文件。
 
这时，

- 停止 uWSGI：`uwsgi --stop /path/to/uwsgi-master.pid`
- 重启 uWSGI：`uwsgi --reload /path/to/uwsgi-master.pid`

详细内容见[管理 uWSGI 服务器 - uWSGI 文档](http://uwsgi-docs-zh.readthedocs.io/zh_CN/latest/Management.html)。

> 个人感觉 `--reload` 经常没效果，很多时候 `--stop` 后再启动才行。

## 配置 Nginx

这里只给出一个最简单的配置：

```
server{
  listen 80;
  # 如果有域名
  server_name example.com;

  location / {
    proxy_pass http://127.0.0.1:8000;
    include uwsgi_params;
  }
  ...
}
```

`uwsgi_params` 文件在 `/etc/nginx/` 目录中。如果没有，可以从 [GitHub](https://github.com/nginx/nginx/blob/master/conf/uwsgi_params) 获取。

## 使用 Unix Sockets

### 简介

应该叫 Unix Domain Socket，不过 uWSGI 官方文档写的就是 Unix Sockets。

上面 uWSGI 通过 `http` 配置项使 Django 项目运行在 `http://127.0.0.1:8000`，因此 Nginx 中需要使用 `proxy_pass` 对这个地址进行反向代理。这是使用 TCP Socket 的运行方式。

下面将修改为使用 Unix Sockets 的方式，好处是开销低，效率高。

关于 TCP Socket 和 Unix Sockets 更具体一些的区别，可以看一下这篇文章：[《Node.js HTTP Server 监听 Unix Socket 套接字》](https://itbilu.com/nodejs/core/EJd85BikZ.html)。

一个比较直观的表现是：  
- 使用 `http` 选项运行 uWSGI 时，如果使用 uWSGI 的 pid 来查看它所占用的端口，是可以查到的
- 使用 `socket` 选项运行，并且值设置为 sock 文件时（见下文），使用 uWSGI 的 pid 来查看它所占用的端口，是查不到的，因为不走 TCP

下面看一下怎么改。

### 修改 uWSGI 配置

删除 `http`选项，添加 `socket` 选项，并设置一个 sock 文件的路径，运行 uWSGI 后会生成该 sock 文件。  
生成的 sock 文件可能会缺少执行权限，可以通过设置 `chmod-socket = 666` 解决。

> 关于 Linux 中的权限，可以看这篇文章：[《檔案權限》](http://s2.naes.tn.edu.tw/~kv/file.htm)。

`socket` 选项可以设置两种类型的值：
- sock 文件
- IP 地址，即原来 `http` 选项的值

例如下面的配置：

```
[uwsgi]
socket = /path/to/sock.sock
chmod-socket = 666
...
```

### 修改 Nginx 配置

uWSGI 改为使用 `socket` 后：  
当 `socket` 设置为 IP 时，只要把原 Nginx 配置中的 `proxy_pass` 改成 `uwsgi_pass` 即可。  
当 `socket` 设置为 sock 文件时，需要把 `proxy_pass` 改为：

```
location / {
  uwsgi_pass unix:///path/to/sock.sock;
  ...
}
...
```

注意，有三条斜线，由 `unix://` 和 `/path/to/sock.sock` 两部分组成

### 使用 upstream

[uWSGI 文档](http://uwsgi-docs-zh.readthedocs.io/zh_CN/latest/tutorials/Django_and_nginx.html#id12)中，Nginx 配置中使用了 `uwsgi_pass` 和 `upstream`：

```
upstream django{
  server ...;
}
server{
  location /{
    uwsgi_pass django;
  }
  ...
}
```

相当于本来直接设置 `uwsgi_pass` 的值，现在改成了先把值赋给变量 `django`，再把变量 `django` 设置到 `uwsgi_pass` 上。

使用 IP 地址时，下面两个例子效果是一样的：

```
# 使用upstream
upstream django{
  server 127.0.0.1:8000;
}
server {
  location / {
    uwsgi_pass django;
    ...
  }
}

# 不使用upstream
server {
  location / {
    uwsgi_pass 127.0.0.1:8000;
    ...
  }
}
```

使用 sock 文件时，下面两个例子效果也是一样的：

```
# 使用upstream
upstream django{
  server unix:///path/to/sock.sock;
}
server {
  location / {
    uwsgi_pass django;
    ...
  }
}

# 不使用upstream
server {
  location / {
    uwsgi_pass unix:///path/to/sock.sock;
    ...
  }
}
```

upstream 常用于需要做负载均衡的场景，一个 upstream 里可以配置多个 server。  
就不再详细介绍了。

## 配置 SSL 证书

如果要配置 SSL 证书，只要修改 Nginx 的配置即可：

```
server{
  ssl_certificate      crt;
  ssl_certificate_key  key;
  ...
}
```

更详细的配置可以参考 [StackOverflow 上的这个问题](https://stackoverflow.com/questions/29827299/django-uwsgi-nginx-ssl-request-for-working-configuration-emphasis-on-ss)。

可以使用 Let's Encrypt 生成**免费的 SSL 证书**。  
欲知使用方法，请疯狂点击这篇文章：[《你的网站还没用上 HTTPS 吗》](https://juejin.im/post/5c910884f265da60f771bdfa)。

## 其他

### 使用域名时

如果使用域名，记得把域名添加到 `settings.py` 的 `ALLOWED_HOSTS` 中。


### uWSGI 监控工具 uwsgitop

安装：
 
```
pip install uwsgi
```
 
启动：

```
uwsgi :port
```

退出：
- `Ctrl + C` 主动退出
- 当 uWSGI 进程结束时自动退出

## 参考链接

参考链接较多，不再一一列出。

## 打个广告

我的其他文章：

[《你的网站还没用上 HTTPS 吗》](https://juejin.im/post/5c910884f265da60f771bdfa)  
[《polipo/privoxy 实现 Linux 系统全局/自动代理》](https://juejin.im/post/5c91ff5ee51d4534446edb9a)