---
layout: post
title: "关于 websocket 的 onerror"
date: 2020-10-09 00:00:00
categories: websocket js
---

看规范可以发现，exception 和 error event 都会由 `onerror` 抛出。

不过在处理 error event 时 `onerror` 回调本身并没有多大用处。一个重要原因是规范里有这么一个规定，**在某些条件下**不允许 `onerror` 的 `event` 携带说明原因的信息。虽然是有条件的，但是条件实在太多了，大部分情况都覆盖了。

即从 `onerror` 获取到 error event 时，虽然知道出错了，却没法知道到底什么错。

值得注意的是，error event 只有一种情况下会发生，那就是在 `onclose` 之前。原文是：

> When the WebSocket connection is closed, possibly cleanly, the user agent must queue a task to run the following substeps:
>
> 1. Change the readyState attribute's value to CLOSED (3).
>
> 2. If the user agent was required to fail the WebSocket connection or the WebSocket connection is closed with prejudice, fire a simple event named error at the WebSocket object. [WSP]
>
> 3. Create an event that uses the CloseEvent interface, with the event type close, ...

就是第二条里的这个 **simple event named error**。

这时，`onerror` 一定会紧接着 `onclose`，并且由于 `onclose` 的 `event` 允许设置自定义 `code`，可以在这里对 `error` 做比较详细的处理。

不过话又说回来了，如果只是做一些粗略的判断还是可以的，毕竟至少可以在 `onerror` 中区分发生的是 exception 还是 error event。

但是！规范这种东西...我们知道浏览器经常不会严格按照规范实现，对于 websocket，我也不知道是不是完全按照规范实现的。不过从目前测试来看，应该没啥问题...

> 出了问题别找我...

另外，一些想当然会触发 `onerror` 的情况实际上并不会发生。

比如连接后立即调用 `send()` 会在 `onerror` 抛一个 `Still in CONNECTING state` 的 exception，既然这样，那么断开后再调用 `send()` 是不是也会呢？

并不会。

对于这个情况，只能提前在 `onclose` 中做处理，阻止 `send()`，或 `send()` 之前判断一下 `readyState`。

## 参考

- [How to read status code from rejected WebSocket opening handshake with JavaScript? - StackOverflow](https://stackoverflow.com/questions/21762596/how-to-read-status-code-from-rejected-websocket-opening-handshake-with-javascrip/50685387)
- [w3 规范](https://www.w3.org/TR/websockets)
