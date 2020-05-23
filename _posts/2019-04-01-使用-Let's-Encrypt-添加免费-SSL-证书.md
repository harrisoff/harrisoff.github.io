---
layout: post
title: "使用 Let's Encrypt 添加免费 SSL 证书"
date: 2019-04-01 00:00:00
categories: devops linux
---
## 前前言

本文没有提及泛域名证书，内容已经略显过时并且缺乏实用性，仅供学习参考。

实际需求请使用泛域名证书。

## 前言

> “如果能把 SSL 证书附加在域名上，那该多酷啊！” —— 凯丽

Certbot 是 Let's Encrypt 的官方工具。

本文主要介绍如何使用 Let's Encrypt 的 Certbot 工具**免费生成、修改、更新和撤销 SSL 证书**。

简略介绍一点证书的配置。

**本文没有提及泛域名证书的生成。**

要求网站已经正确配置了服务器、DNS 等，已经能够正常访问。

本文操作环境为 Ubuntu。

## 安装

可**部分**参照[官网](https://certbot.eff.org/)。  
在官网首页，选择服务器和操作系统后，会给出相应的安装以及生成证书的命令。

这里只看安装的部分：

```
sudo apt-get update
sudo apt-get install software-properties-common
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
sudo apt-get install certbot
```

查看是否安装成功：

```
certbot --version
```

或

```
letsencrypt --version
```

输出的都是 certbot 的版本号：

```
certbot 0.25.0
```

## 生成证书

**重要：在开始之前，先看一下本文末尾关于[频率限制](#heading-17)的说明。**

在前一节里，官网给出安装命令后，也给出了生成证书的命令，比如：

为 Nginx 服务器生成：

```
sudo certbot --nginx
```

为 Apache 服务器生成：

```
sudo certbot --apache
```

在生成证书后，可以选择让 certbot 自动修改对应服务器软件的配置文件，包括将 `80` 端口的请求重定向至 `443`，启用相应模块，激活配置文件等。  
自动修改后配置文件的写法是值得参考一下的。

**但是**！为了更深入地了解 Let's Encrypt，也为了能够更灵活地操作证书，我们不采用这种快捷方式。而是仅仅生成证书，并手动配置。

方法有 `standalone` 和 `webroot` 两种。

### standalone 与 webroot 的区别

无论哪种方式，certbot 都需要验证域名，但是实现的方式不同，这也是两者有区别的根本原因。

- `standalone` 方法生成和更新证书的时候，certbot [需要使用 443 或者 80 端口来验证域名](https://certbot.eff.org/docs/using.html?highlight=sslcertificatefile#standalone)，因此导致**需要暂时停止服务器**。这种方式不需要给出网站根目录
- `webroot` 方法没有上述问题。不过 `webroot` 方法配置略微复杂，并且需要给出网站根目录

`webroot` 方式之所以不需要 `80` 或 `443` 端口，是因为它的实现方式是，在网站根目录中生成一个临时子目录 `.well-known/acme-challenge`，然后从 certbot 的服务器向这个路径发送请求，如果请求成功，那么验证通过。

[这篇文章](https://bitmingw.com/2017/02/02/letsencrypt-tutorial/#问题与解答)简单介绍了几个 webroot 模式可能会遇到的问题。

### standalone 模式

基本命令为：

```
sudo letsencrypt certonly --standalone
```

需要使用 `80` 或 `443` 端口，可以通过 `--preferred-challenges` 指定要使用的端口，只要其中一个端口空闲就可以。

> 但是说实话，难道存在其中一个端口是空闲的情况吗

使用 `80` 端口：

```
--preferred-challenges http
```

使用 `443` 端口：

```
--preferred-challenges tls-sni
```

使用 `-d` 指定要生成证书的域名。可以添加多个域名，使用逗号分隔，或者使用多个 `-d` 。两种方法效果相同。

多个域名时，同一个主域名下的多个子域名是可以的，没有试过多个不同的主域名是什么效果。

执行生成命令：

```
sudo letsencrypt certonly --standalone -d example.com,www.example.com
```

第一次使用时，会询问邮箱、是否同意服务条款、是否接受推送内容。  
推荐**如实填写邮箱**，因为证书即将过期时会通过邮件通知。  
推送内容不接受就好了。

证书即将过期的通知邮件：

![](https://user-gold-cdn.xitu.io/2019/3/19/16996893b4c8dbe0?w=340&h=138&f=png&s=25507)

> 感觉这个通知不太准，很多次收到邮件，但是登录查看了一下并没有。
>
> 也（很）可能是因为当时没用 `--staging` 导致生成了很多证书...

> 2019年4月26日更新：  
> ~~妈的~~今天面试演示项目的时候证书过期。。  
> 回来一看有过邮件通知，但是没在意。。这是一个狼来了的故事

如果看到以下信息说明证书生成成功：

```
Obtaining a new certificate
Performing the following challenges:
http-01 challenge for example.com
Waiting for verification...
Cleaning up challenges
IMPORTANT NOTES:

 - Congratulations! Your certificate and chain have been saved at:
   /etc/letsencrypt/live/example.com/fullchain.pem
   Your key file has been saved at:
   /etc/letsencrypt/live/example.com/privkey.pem
   Your cert will expire on 2018-09-25. To obtain a new or tweaked
   version of this certificate in the future, simply run certbot
   again. To non-interactively renew *all* of your certificates, run
   "certbot renew"
 - If you like Certbot, please consider supporting our work by:

   Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
   Donating to EFF:                    https://eff.org/donate-le
```

可以使用 `certbot certificates` 命令查看当前证书的信息：

```
Found the following certs:
  Certificate Name: example.com
    Domains: example.com, www.example.com
    Expiry Date: 2018-09-26 00:42:47+00:00 (VALID: 89 days)
    Certificate Path: /etc/letsencrypt/live/example.com/fullchain.pem
    Private Key Path: /etc/letsencrypt/live/example.com/privkey.pem
```

可以看到，生成了**1个**证书，`-d` 后面的第一个域名为证书名和所在目录的目录名，该证书包含了两个域名 `example.com` 和 `www.example.com`。  
这些域名都可以使用该证书。

共生成了四个文件：

- cert.pem
- chain.pem
- fullchain.pem
- privkey.pem

`/etc/letsencrypt/archive/example.com` 目录保存原件。   
`/etc/letsencrypt/live/example.com` 目录保存文件的软链接，可以理解为快捷方式。

> `live/`中的文件貌似不只是原件的软链接那么简单，但是没有仔细研究。

**privkey.pem 为私钥，务必妥善保管。**

### webroot 模式

这种方式需要给出网站根目录作为参数。从这名字 `webroot` 应该也能看出来。

基本命令：

```
certbot certonly --webroot -w /path/to/webroot -d www.example.com -d example.com
```

其中，`-w` 是网站的根目录，`-d` 是要生成证书的域名。  
**注意，`-d` 列出的域名的根路径必须全部与 `-w` 的值相同**。

如果要为根路径不同的多个域名生成证书，那么只需要在后面再添加 `-w` 及其对应的 `-d` 即可：

```
certbot certonly --webroot -w /path/to/webroot1 -d www.example.com -d example.com -w /path/to/webroot2 -d other.example.net -d another.other.example.net
```

其他内容不再赘述，参考前面 `standalone` 部分。

## 泛域名证书

从 `0.22.0` 版本开始，Let's Encrypt [支持生成泛域名证书](https://certbot.eff.org/faq/#does-let-s-encrypt-issue-wildcard-certificates)。

TODO

## 配置服务器

以 Apache 和 Nginx 为例。这里只介绍一下最基本的配置。

首先，这里是官方文档给出的[上面生成的4个文件与服务器配置项的对应关系](https://certbot.eff.org/docs/using.html?highlight=sslcertificatefile#where-are-my-certificates)。

### Apache 配置

```
# apache < 2.4.8
SSLCertificateKeyFile   privkey.pem
SSLCertificateFile      cert.pem
SSLCertificateChainFile chain.pem
```

```
# apache >= 2.4.8
SSLCertificateKeyFile   privkey.pem
SSLCertificateFile      fullchain.pem
```

> 官方文档是这么写的，但是现在最新版本才2.4.3，哪来的2.4.8？

启用 SSL 模块：

```
a2enmod ssl
```

修改配置文件：

```
<VirtualHost *:443>
  ServerName              example.com
  SSLCertificateKeyFile   privkey.pem
  # apache < 2.4.8
  SSLCertificateFile      cert.pem
  SSLCertificateChainFile chain.pem
  # apache >= 2.4.8
  SSLCertificateFile      fullchain.pem
  ...
</VirtualHost>
```

重启 Apache：

```
service apache2 restart
```

### Nginx 配置

```
ssl_certificate_key  privkey.pem;
ssl_certificate      fullchain.pem;
```

修改配置文件：

```
server {
  listen              443 ssl;
  server_name         example.com;
  ssl_certificate     fullchain.pem;
  ssl_certificate_key privkey.pem;
  ...
}
```

重启服务器：

```
service nginx restart
```

更进一步的配置：[《分享一个 HTTPS A+ 的 nginx 配置》](https://www.textarea.com/zhicheng/fenxiang-yige-https-a-di-nginx-peizhi-320/)

## 修改证书

上面使用 `standalone` 方法已经生成了域名 `example.com` 和 `www.example.com` 的证书，证书名为 `example.com`。  
如果现在又要为 `a.example.com` 生成证书，那么可以生成一张新的证书，也可以选择添加到现有的证书 `example.com` 里。

[certbot 官方文档](https://certbot.eff.org/docs/using.html?highlight=sslcertificatefile#re-creating-and-updating-existing-certificates)提供了简单的示例：

```
certbot --expand -d existing.com -d example.com -d newdomain.com
```

虽然示例使用了 `--expand` 选项，但是后面**推荐使用的是 `--cert-name`**，因为 `--expand` 只能用来添加域名，而 `--cert-name` 更灵活，既可以添加也可以删除。

官方文档没有提供 `--cert-name` 的示例，下面介绍一下。

命令的大致结构是：

```
certbot certonly --cert-name certname -d a.domain.com,b.domain.com
```

`--cert-name` 选项的参数是现有证书的证书名，`-d` 选项的参数是证书包含的域名。

**注意，多个域名用逗号分隔，并且中间不能有空格。**
> 即，不能是：`-d a.domain.com, b.domain.com`，而应该是 `-d a.domain.com,b.domain.com`。

### 添加域名

现在开始为证书名为 `example.com`、包含 `example.com` 和 `www.example.com` 两个域名的证书添加一个新的域名 `a.example.com`。

```
certbot certonly --cert-name example.com -d example.com,www.example.com,a.example.com
```

会出现提示：

```
Saving debug log to /var/log/letsencrypt/letsencrypt.log

How would you like to authenticate with the ACME CA?
-------------------------------------------------------------------------------
1: Spin up a temporary webserver (standalone)
2: Place files in webroot directory (webroot)
-------------------------------------------------------------------------------
Select the appropriate number [1-2] then [enter] (press 'c' to cancel):
```

选择 `1`。或者在命令中添加 `--standalone` 选项，可以跳过这一步。

```
Plugins selected: Authenticator standalone, Installer None

-------------------------------------------------------------------------------
You are updating certificate example.com to include new domain(s):
+ a.example.com

You are also removing previously included domain(s):
(None)

Did you intend to make this change?
-------------------------------------------------------------------------------
(U)pdate cert/(C)ancel:
```

选择 `u`，执行更新即可。

### 删除域名

现在证书中包含了三个域名，如果要从中删除域名`www.example.com`，执行的命令为：

```
certbot certonly --cert-name example.com -d example.com,a.example.com
```

想要删除的域名，不在 `-d` 后列出来即可。

### 其他

可以发现，上面在修改由 `standalone` 方式生成的证书时，仍然可以选择 `standalone` 和 `webroot`。   
那么看来证书的生成方式是可以改变的。

但是没有试过，感兴趣的同学可以试一下。

## 更新证书

从证书信息中可以看到，证书有效期为90天。在证书到期前需要进行更新。

可以手动进行更新：

```
certbot renew
```

根据 [certbot 官方文档](https://certbot.eff.org/docs/using.html?highlight=sslcertificatefile#renewing-certificates)，该命令只会更新30天内即将过期的证书。对其他的证书没有影响。

证书更新可以使用 crontab 等设置计划任务实现自动更新，比如每天执行一次 `renew` 命令。

但是注意，由 `standalone` 方法生成的证书，更新时也需要使用 `80` 或 `443` 端口，因此可能需要（不如说一定需要）在执行 `renew` 前先关闭服务器，结束后再重新开启。

## 撤销证书

使用 `revoke` 选项：

```
sudo certbot revoke --cert-path /etc/letsencrypt/live/CERTNAME/cert.pem
```

前面说过，`archive` 目录保存了证书原件，`live` 目录保存了证书的软链接。  
这里的路径只能是 `live`，不能是 `archive`，否则会报错。

撤销成功后，会询问是否删除证书文件和证书所在目录：
```
-------------------------------------------------------------------------------
Would you like to delete the cert(s) you just revoked?
-------------------------------------------------------------------------------
(Y)es (recommended)/(N)o:
```

推荐选择 `Yes` 自动删除。如果选择 `No`，之后需要执行 `certbot delete` 来删除文件。

根据 [certbot 官方文档](https://certbot.eff.org/docs/using.html?highlight=sslcertificatefile#revoking-certificates)，无论自动还是手动，最后都需要把相关文件删掉。

如果没有删除，那么 `archive` 和 `live` 两个目录及其中的文件就仍然存在。执行 `certbot certificates` 仍然能显示该证书的信息，不过后面会注明已经失效 `INVALID`。但是，在执行证书更新的时候，已经撤销的证书还会被更新。

## 其他

### 频率限制

[Staging Environment - Let's Encrypt 官方文档](https://letsencrypt.org/docs/staging-environment/)

Let's Encrypt 为证书申请的频率做了限制，**每个主域名每周不超过20次**。  
如果达到这个 **rate limits**，不能够再继续生成了，会报错。

所以如果只是为了学习和测试，最好使用 Let's Encrypt 提供的 **Staging Environment（模拟环境）**，没有频率限制。  
只要在执行命令时加上 `--staging` 选项就可以了。
 
等会用了再玩真的。

### 关于 HTTPS

百度 LAVAS 项目中关于 HTTPS 的介绍：[使用 HTTPS](https://lavas.baidu.com/pwa/web-security/web-security-https)，写得挺好的。
