---
layout: post
title: "深入 JavaScript 常用的8种继承方案"
date: 2019-04-03 00:00:00
categories: javascript
---

本文基于[《JavaScript 常用八种继承方案》](https://juejin.im/post/5bcb2e295188255c55472db0)，细化了原理分析和代码注释，从原型链开始逐渐深入至 ES6 的 `extends`。

## 原型链继承

这个是大家都知道的：

```js
// 父类有两个实例属性
function Parent(name) {
  this.name = name
  this.relation = ['grandpa', 'grandma']
}
// 一个原型方法
Parent.prototype.say = function () {/*...*/}
// 子类没有实例属性、方法
function Child() {
}

// 继承
p = new Parent('father')
Child.prototype = p

c1 = new Child()
c2 = new Child()
// 调用子类实例上的属性、方法时，如果子类实例上没有定义
// 会通过原型链从父类实例和原型上寻找
// 下面调用的是父类的原型方法 say() 和实例属性 name、relation
c1.say()
console.log(c1.name, c2.relation)
// 那么这时
// 当直接修改父类的实例属性
// 或者通过子类实例修改父类实例的属性时
p.name = 'mother'
c1.relation.push('grandson')
// 所有继承了该父类的子类的实例都会受影响
console.log(c1.name, c2.relation)
```

原型链继承的不足：
- 修改父类实例上的属性时，所有在此原型链上的对象的属性都可能受影响
- 子类实例可以直接修改它继承的父类实例
- 调用子类构造函数时，不能向父类的构造函数传递参数

> 虽然这里只是构造函数，不是真正的类 class，不过姑且使用这个叫法

实践中，很少直接用原型链实现继承。

## 借用构造函数继承

> constructor stealing

简单来说，就是在子类构造函数中使用 `apply` 或 `call` 调用父类构造函数。

本来，父类构造函数中的 `this` 是父类的实例，但是这里，在子类构造函数中通过 `call(this)` 调用父类构造函数，把上下文修改为了子类实例，相当于**把父类实例的属性给子类实例复制了一份**。

```js
// 父类有一个实例属性
function Parent(name) {
  this.name = name
}
// 子类本身没有实例属性，但是借用了父类实例的
function Child(name) {
  Parent.call(this, name)
}
c = new Child('child')
// 子类实例 c 就有了自己的 name 属性
console.log(c)
```

使用原型链继承时，如果访问一个子类实例的属性，而子类实例并没有这个属性，那么会在子类实例的原型链上寻找，如果发现父类有这个属性，那么访问到的值是父类的，或者说原型链上的。同理，如果修改，也是修改的原型链上的。

而借用构造函数的方式，使得子类实例本身就有了这个属性，不需要再去原型链上找了。

这样一来：
- 可以向父类构造函数传递参数
- 可以访问到与**父类实例**上同名的属性、方法，不过这些都已经复制给 `c` 自己了，不是 `c.__proto__` 上的，所以修改时不会影响其他子类实例
- 因为没有使用原型链，所以子类实例**不能访问父类原型对象**上的属性和方法

实践中也很少使用。

到这里应该可以发现，当实现继承的时候，主要是针对下面两部分：
  
- **父类实例**上的实例属性和方法
- **父类原型对象**上的属性和方法

> ~~《当我谈继承时，我谈些什么》~~

## 组合继承

就是原型链继承+借用构造函数。

上面说到，借用构造函数的继承方式，因为没有使用原型链，所以子类实例不能访问父类原型对象上的属性和方法，那么只要把原型链加上去就好了。

这就是组合继承的原理：
- 使用**借用构造函数**的方法，复制一份父类实例 `p` 的属性到子类实例 `c` 上
- 使用**原型链**的方法，把子类实例挂到原型链上，使得子类实例也能够访问父类原型对象上的属性和方法

实现：

```js
// 父类有几个实例属性
function Parent(name) {
  // 父类实例属性
  this.first_name = name
  this.last_name = 'vue'
  this.version = '2.x'
}
// 一个原型方法
Parent.prototype.say = function () {
  console.log(`I am ${this.last_name} ${this.first_name}, version:${this.version}`)
}
f = new Parent('core')

// 子类
// 1. 借用构造函数
function Child(name, version) {
  Parent.call(this, name)
  // 注意，要先调用父构造函数，再定义子类实例自己的属性
  // 否则子类实例属性会被父类实例同名属性覆盖
  this.version = version
}
// 2. 原型链
Child.prototype = f
// 修改原型对象的构造函数
Child.prototype.constructor = Child

// 新建两个实例
c1 = new Child('router', '3.x')
c2 = new Child('x', '4.x')
print()
// 修改父类实例，对子类实例没有影响
f.last_name = 'react'
print()
// 修改一个子类实例，对其他子类实例也没有影响
c1.version = '5.x'
print()

function print() {
  console.log(f)
  console.log(c1)
  console.log(c2)
  c1.say()
}
```

这是实践中常用的继承方式。

不过这里有一点瑕疵：一个子类实例将会持有两份父类实例的数据。因为使用了原型链。

> ~~是原型链，我加了原型链。~~

一份是 `Parent.call(this)` 复制到子类实例 `c` 上的数据，一份是父类实例原本的数据，位于 `c.__proto__` 上。   
虽然冗余，不过使用效果上没有太大影响。也有处理方案，就是后面的寄生组合式继承。

## 原型式继承

创建一个继承了父类的子类实例，只是这个子类实例是空的，什么属性方法都没有。

或者说，**创建一个空对象，并把它挂到另一个对象的原型链上。**

我们把这一继承的逻辑封装到 `createObject` 这个函数中，代码如下：

```js
function createObject(p){
  // 相当于子类构造函数，空的
  function F() {}
  // 挂到父类实例的原型链上，实际就是原型链继承
  F.prototype = p
  return new F()
}

function Parent() {
  this.name = 'Nicholas'
  this.friends = ["Shelby", "Court", "Van"]
}
var p = new Parent()

// 得到一个继承了 p 的空对象 c
var c = createObject(p)
```

首先，上面的 `createObject()` 函数其实就是 `Object.create()`，或者说 `Object.create()` 就是一种比较规范的原型式继承的实现。

> [这里](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create#Polyfill)是 MDN 提供的 `Object.create()` 的 polyfill。

目前看来，感觉跟原型链继承好像是没多大差别的。确实，不过等到后面的寄生组合式继承就能体现出它的作用了。

## 寄生式继承

是原型式继承的增强版。

在原型式继承的函数 `createObjectPlus()` 外面再封装一层，生成了子类实例后，添加一些属性或方法再返回：

```js
function createObjectPlus(p){
  // 使用前面的 createObject 函数，生成了一个子类实例
  var c = createObject(p)
  // 先在子类实例上添加一点属性或方法
  c.sayHi = function(){
    console.log("hi")
  }
  // 再返回
  return c
}
```

> 枯燥

## 寄生组合式继承

就是借用构造函数继承+寄生式继承。

在借用构造函数部分的结尾，总结了一下“**究竟要继承哪些东西**”，得出了两点：  
- **父类实例**上的属性和方法
- **父类原型对象**上的属性和方法

组合继承实际上已经实现了这两点，不过也提到了这种方式的一个缺点，就是会有两份父类实例的数据。

这两份数据中，通过 `Parent.call(this)` 复制到子类实例 `c` 上的这一份是真正需要的，而 `c.__proto__` 上的这一份是多余的，是把子类实例放到原型链上时产生的副作用。

想要优化这一点，说到底，就是想要**把子类实例添加到父类实例的原型链上，同时又不让父类实例的属性和方法也在原型链上**。

可以想到两个方法：
- 让子类实例绕过父类实例，直接继承父类的原型对象
- 创建一个没有实例属性的父类实例

嗯？回想一下原型式继承/寄生式继承的效果是什么，不就是创建一个空对象（父类实例），并且把它挂到另一个对象（父类的原型对象）的原型链上吗？

也就是说，只需要改进一下组合继承中的原型链继承部分，把使用 `new` 关键字创建父类实例改为使用 `createObject()`（或者 `Object.create()`）:

```js
function Parent(name) {
  this.name = name
  this.age = 40
  this.relation = ['grandma', 'grandpa']
}
Parent.prototype.say = function () {
  console.log(this.name)
}

// 继承
// 借用构造函数
function Child(name) {
  Parent.call(this, name)
}
// 创建没有实例属性的父类实例
p = Object.create(Parent.prototype)
// 建立子类构造函数 Child 及其原型对象（父类实例）的关系
p.constructor = Child
Child.prototype = p
```

这是最成熟的方法，ES6 的 `extends` 实现与寄生组合式继承基本一致。

上面还提到另一种方法，让子类实例绕过父类实例，直接继承父类的原型对象。这种做法的问题是，子类实例 `c` 实际上成了父类实例 `p` 的兄弟，而并不是继承的关系。

## ES6 extends

前面说，ES6 的 `extends` 核心代码与寄生组合式继承基本一致。  
那么先看看下面的代码，是使用 Babel 把 `extends` 编译成 ES5 语法后的部分实现：

> 可以去 [Babel 的在线编辑器](https://babeljs.io/repl)上自己试一下

```js
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function")
  }
  // 这里其实就是寄生式继承，使得子类实例能够访问父类原型对象上的属性和方法
  // 创建了一个没有实例属性的父类实例，添加一个 constructor 属性，然后赋值给子类的原型对象
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  })
  // 如果是寄生组合式继承，还需要使得父类的实例属性在子类上也有一份
  // 这里应该需要借用构造函数了，但是好像跟前面的借用构造函数不太像？
  if (superClass) _setPrototypeOf(subClass, superClass)
}
function _setPrototypeOf(subClass, superClass) {
  // 判断当前环境是不是有 Object.setPrototypeOf 方法，没有的话就实现一个
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(subClass, superClass) {
    // 把子类的 __proto__ 设置为父类
    subClass.__proto__ = superClass
    return subClass
  }
  return _setPrototypeOf(subClass, superClass)
}
```

还是像前面说的一样，要继承的内容有**两部分：父类原型对象上的和父类实例上的**。  
寄生式继承已经实现了前者，那么这个 `_setPrototypeOf()` 函数按道理应该就是实现了后者了。

但是我寻思这也不像之前的借用构造函数方法的 `Parent.call(this)` 啊。

继续看 Babel 解析的 `extends` 的其他部分，还有这么一段：

```js
// ...
_inherits(subClass, superClass); // 这一步执行完时，subClass.__proto__ = superClass
function subClass() {
  _classCallCheck(this, subClass);
  // 有了
  // 在这里通过 _getPrototypeOf 取出了 superClass，然后执行了 apply
  return _possibleConstructorReturn(this, _getPrototypeOf(subClass).apply(this, arguments));
}
// ...
```

看到这里就足够了，说明 `extends` 的实现确实跟寄生组合式继承基本一致。

## 混入式继承

说白了就是把一个对象的属性复制到另一个对象上去。

比如使用 `Object.assign(target, source)`。这个方法将所有可枚举的属性的值从一个或多个源对象复制到目标对象，并返回目标对象。

是浅拷贝。

[《继8》里的例子](https://juejin.im/post/5bcb2e295188255c55472db0#heading-6)通过借用构造函数的方式为子类实例添加父类实例的属性，通过混入的方式为子类实例添加父类原型对象的属性：

```js
function Mother() {
  this.a = 'mom'
}
Mother.prototype.comfort = function () {
  console.log("that's ok")
}
function Father() {
  this.b = 'dad'
}
Father.prototype.hit = function () {
  console.log("you bastard!")
}
function Me() {
  // 借用构造函数，获得了 a 和 b 两个实例属性
  Mother.call(this)
  Father.call(this)
}

// 创建一个没有实例属性的 Mother 的实例
m = Object.create(Mother.prototype)
// 修改 Me 的原型对象，现在 Me 位于 Mother 实例的原型链上了
Me.prototype = m
// 修改构造函数
Me.prototype.constructor = Me
// 再把 Father 原型对象上的属性方法复制到 Me 的原型对象 m 上
// 现在，虽然 Me 的实例并不在 Father 实例的原型链上
// 但是也可以访问 Father.prototype 上的属性方法
Object.assign(Me.prototype, Father.prototype)

me = new Me()
console.log(me)
```

实际上，考虑到父类的实例和父类的原型对象都是对象，所以在为子类实例添加父类实例的属性的时候，也可以直接使用混入。上面的代码可以修改为：

```js
/**
 * Father Mother Me 的构造函数
 */
// 跳过 Object.create，直接放在 Object.assign 里
m = Object.assign({}, Mother.prototype, Father.prototype)
Me.prototype = m

me = new Me()
console.log(me)
```
