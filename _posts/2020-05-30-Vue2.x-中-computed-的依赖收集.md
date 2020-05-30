---
layout: post
title: "Vue2.x 中 computed 的依赖收集"
date: 2020-05-30 20:30:00
categories: javascript vue.js
---

`props` 和 `data` 一样都是被订阅者，因此要维护一个订阅列表 `subs` 保存 `watcher`。

`computed` 也是被订阅的，按道理说也应该维护一个订阅列表，同时，由于 `computed` 是依赖 `data` 的，它又是一个订阅者，并且 `computed` 是有缓存的，需要保存计算结果，因此还需要维护一个自己的 `watcher`，用来在 `data` 变化时更新自己的值。

但是，考虑到 `computed` 变化的本质是它依赖的 `data` 的变化，所以 `computed` 并不需要（实际上也确实没有）维护订阅列表，只要把依赖它的视图的 `watcher` 添加到它依赖的 `data` 的 `subs` 里，这样通知视图更新这一步就可以交给 `data` 来做了。

这里有很重要的两点：
- 不需要视图和 `data` 有依赖关系，只要视图依赖了 `computed`，在依赖收集的过程中，它的 `watcher` 就会被加到 `data` 的 `subs` 里
- `computed` 的 `watcher` 和视图的 `watcher`，这两个 `watcher` 在 `data` 的 `subs` 中的先后顺序能够保证先更新 `computed` 的值再更新视图

下面是 `src/core/instance/state.js` 里 `createComputedGetter()` 的定义。

```js
function createComputedGetter (key) {
  return function computedGetter () {
    const watcher = this._computedWatchers && this._computedWatchers[key]
    if (watcher) {
      // 当 computed 依赖的 data 没有变化，即缓存仍然 clean 时
      // 不会进入 if，不会重新求值
      // 当依赖的 data 变化时，被依赖的数据会派发更新
      // 但是在派发更新之前，会先把 dirty 设为 true
      // 这时才会进入 if 语句重新求值
      if (watcher.dirty) {
        // evaluate() 定义在 /src/core/observer/watcher.js
        // 会触发 data 的 get()，把新值缓存
        // 然后 dirty 设为 false
        watcher.evaluate()
      }
      // 下面是依赖收集时发生的
      // 视图渲染时，Dep.target 是组件的 watcher
      // 渲染途中遇到了 computed，组件的 watcher 保存到 targetStack
      // 然后 computed 的 watcher 成为了新的 Dep.target
      // computed 触发 data 的 get()，computed 的 watcher 被收集
      // 收集完成后，Dep.target 从 targetStack 恢复为组件的 watcher
      // 然后关键来了
      // 下面这行代码又手动收集了一次依赖
      // 使得 computed 依赖的 data 能够收集到视图的 watcher
      // 并且
      // computed 的 watcher 在前，组件的 watcher 在后
      if (Dep.target) {
        watcher.depend()
      }
      return watcher.value
    }
  }
}
```

源码里对这里做了两次修改：
- [commit#531cea](https://github.com/vuejs/vue/pull/7824/commits/531cea5814a37c598b08bac0227ebc9e3544ca86)
- [commit#6b1d43](https://github.com/vuejs/vue/commit/6b1d431a89f3f7438d01d8cc98546397f0983287)
