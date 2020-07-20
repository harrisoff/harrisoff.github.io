---
layout: post
title: "postMessage 和 MessageChannel 简介"
date: 2020-07-20 00:00:00
categories: javascript
---

傻逼 MDN，写得一点也不全，例子还写错了。

## MessageChannel

MessageChannel 主要是通过其实例的 port1 和 port2 两个只读属性进行通信。在其中一个 port 上调用 `postMessage()` 方法，在另一个 port 的 onmessage 回调上就能获取到数据。

```js
const { port1, port2 } = new MessageChannel()
port1.onmessage = e => {
  console.log('port1 received:', e.data)
}
port2.postMessage(
  'data from port2',
  // []
)
```

这里的 `postMessage()` 方法有一个可选参数 transfer，这个后面再说。

## postMessage

`postMessage()` 方法至少存在于以下几个对象上：

- MessageChannel 实例的 port1/port2 属性上
- window 对象，对 iframe 来说就是 contentWindow 属性
- Web Worker 实例上
- Service Worker 的 client 对象上

还有其他一些对象也提供了 `postMessage()` 方法，这里就不详细列举了。

下面以 iframe 为例简单介绍一下。

## 以 iframe 为例

方便起见，把主动发起通信的一方，或者说第一次发消息的一方称作发送方，另一方称为接收方。

在当前的场景下，因为是跨页面的，所以发送方发送消息时只能用 window 的 `postMessage()` 方法，接收方需要通过监听 window 上的 message 事件获取消息。

假设现在有两个页面，主页面地址为 `http://localhost:8080/index.html`，iframe 页面地址为 `http://localhost:8080/iframe.html`。

下面示例演示的是，主页面向 iframe 发送消息，iframe 收到消息后回复主页面：

```js
// index.html
const { contentWindow } = document.querySelector('iframe')
contentWindow.addEventListener('load', e => {
  contentWindow.postMessage(
    'data from index.html',
    '*',
    // []
  )
})
window.addEventListener("message", e => {
  console.log(e.data)
})

// iframe.html
window.addEventListener("message", e => {
  window.parent.postMessage(
    'response from iframe.html',
    '*'
  )
})
```

可以看到，这里的 `postMessage()` 参数比 MessageChannel 上的多了一个。现在该说一下 `postMessage()` 的参数了。

`postMessage()` 接受三个参数：

- 第二个参数 targetOrigin 规定了目标窗口的 origin，`*` 表示不限制。如果做了限制，那么目标页面必须与 targetOrigin 同源，否则数据不能正常发送。  
  如果把上面主页面发送时候的 `*` 改成 `http://localhost:8081/iframe.html` 就会报错了，因为端口不同。
- 第三个参数 transfer 是搭配 MessageChannel 使用的，简单来说就是用来发送 port 的。

既然 `window.postMessage()` 能够向接收方发送 port，再加上前面我们知道了 MessageChannel 的 port 也可以用来收发消息，这样一来，接收方回复消息的时候就多一种选择了。见示例：

```js
// index.html
const { port1, port2 } = new MessageChannel()
const { contentWindow } = document.querySelector('iframe')
contentWindow.addEventListener('load', e => {
  contentWindow.postMessage(
    'data from index.html',
    '*',
    [port1] // 把 port1 发送给 iframe
  )
  // port1.postMessage('another data from index.html')
})
// 然后在 port2 上监听消息
port2.onmessage = e => {
  console.log('port2 received:', e.data)
}

// iframe.html
window.addEventListener("message", e => {
  const [port1] = e.ports
  // 通过 index.html 提供的 port1 回复消息
  port1.postMessage('response from iframe.html')
})
```

transfer 的一个注意事项是，把一个 port 发送出去之后，本页面就不再拥有这个 port 的操作权了。比如上面示例代码里注释掉的 `port1.postMessage('another data from index.html')` 这一行，因为 port1 已经发送出去了，所以这一行执行了是没有效果的。

另外，MessageChannel 上的 `portMessage()` 没有 targetOrigin 参数，只有 transfer。
