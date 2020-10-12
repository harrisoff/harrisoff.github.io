---
layout: post
title: "关于 websocket 的 onerror"
date: 2020-10-09 00:00:00
categories: websocket js
---

先贴个 [w3 规范的链接](https://www.w3.org/TR/websockets/)。

exception 和 error event 都会由 `onerror` 抛出。不过在处理 error event 时 `onerror` 回调本身并没有多大用处。

一个重要原因是有这么一个规定，**在某些条件下**不允许 `onerror` 的 `event` 携带说明原因的信息，如图：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e0e874735ef1404ca018d4430172b9a4~tplv-k3u1fbpfcp-watermark.webp)

即发生以上情况时，只能知道出错了，没法知道到底什么错。

虽然是有条件的限制，但是只要不能覆盖所有的情况，就不应该依赖 `onerror`。~~而且条件还这么多~~

不过值得注意的是，error event 只有一种情况下会发生，那就是在 `onclose` 之前。原文是：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/64a039f7e5b84843954d767d1fdbe16f~tplv-k3u1fbpfcp-watermark.webp)

就是第二条里的这个 **simple event named error**。

这时，error event 一定会紧接着 `onclose`，并且由于 `onclose` 的 `event` 允许设置自定义 `code`，可以在这里对 `error` 做比较详细的处理。

话又说回来了，如果只是做一些粗略的判断还是可以的，毕竟至少可以在 `onerror` 中区分发生的是 exception 还是 error event。

但是！规范这种东西...我们知道浏览器经常不会严格按照规范实现，对于 websocket，我也不知道是不是完全按照规范实现的。不过从目前测试来看，应该没啥问题...

> 出了问题别找我...

另外，一些想当然会触发 `onerror` 的情况实际上并不会发生。

比如连接后立即调用 `send()` 时，会在 `onerror` 抛一个 `Still in CONNECTING state` 的 exception。既然这样，那么断开后再调用 `send()` 应该也会吧？

并不会。

对于这个情况，只能提前做处理，阻止 `send()`，或 `send()` 之前判断一下 `readyState`。

