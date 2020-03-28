---
layout: post
title: "详解 new/bind/apply/call 的模拟实现"
date: 2019-03-29 00:00:00
categories: javascript
---
分步实现 new/bind/apply/call 函数。

## new 的模拟实现

先看一下真正的 `new` 的使用方法：

```js
function MyClass(name, age){
  this.name = name
  this.age = age
}
var obj = new MyClass({name:'asd', age:10})
```

`new` 是关键字，调用方式是没法模仿的，只能以函数的形式实现，比如 `myNew()`。

然后规定一下 `myNew` 接收参数的方式：

```js
var obj2 = mynew(MyClass, 'asd', 10)
```

### 第一阶段：基本实现

创建一个新对象，通过将其 `__proto__` 指向构造函数的 `prototype` 实现继承

```js
function mynew(){
  // 新建空对象
  var obj = {}
  // 第一个参数是构造函数
  var constructor = [].shift.call(arguments)
  // 其余的参数是构造函数的参数
  var args = [].slice.call(arguments)
  // 修改原型
  obj.__proto__ = constructor.prototype
  // 修改构造函数上下文，为 obj 赋值
  constructor.apply(obj, args)
  return obj
}
```

> `[].slice.call()` 就是 `Array.prototype.slice.call()`

### 第二阶段：实现返回值

构造函数也是函数，也可能有返回值。  
而 `new` 有一个特性：构造函数返回值为基本类型值时，不返回；引用类型值时，返回。

只要判断 `constructor.apply()` 的结果即可：

```js
function mynew(){
  var obj = {}
  var constructor = [].shift.call(arguments)
  var args = [].slice.call(arguments)
  obj.__proto__ = constructor.prototype
  var result = constructor.apply(obj, args)
  // 判断结果的类型
  return (typeof result === 'object' || 'function') ? result : obj
}
```

### 第三阶段：细节

1. 返回值的判断

   前面的代码在判断返回值时有问题，因为 `typeof null === "object"`。修改一下：

   ```js
   return (typeof result === 'object' || 'function') ? result||obj : obj
   ```

2. 创建空对象以及实现继承的方式

   创建空对象有三种方法：
   - `var obj = new Object()`
   - `var obj = {}`
   - `Object.create()`

   前两种是相同的，但是考虑到这是模拟 `new`，所以第一种不太合适。  

   实现继承有两种方法：
   - `var obj = Object.create(constructor.prototype)`
   - `obj.__proto__ = constructor.prototype`

   第一种在创建对象时直接继承。  
   第二种先创建对象，再设置原型。**要注意：这时不能通过 `Object.create(null)` 来创建对象**，可以参考[这个 ISSUE](https://github.com/mqyqingfeng/Blog/issues/13#issuecomment-326938297)。

   如果使用`Object.create(null)`，访问不到`__proto__`这个**原型属性**，因此在后续赋值时，`__proto__`被当做**普通属性**进行赋值。

### 参考链接

[JavaScript 深入之 new 的模拟实现](https://github.com/mqyqingfeng/Blog/issues/13)  
[面试官问：能否模拟实现 JS的new操作符](https://juejin.im/post/5bde7c926fb9a049f66b8b52)

## bind 的模拟实现

是用 `apply` 或 `call` 来实现的。

> 注意 `apply` 和 `call` 的区别

先大致回顾一下 `bind` 的用法：

```js
name = 'global'
function test(sex, age) {
  console.log(this.name, sex, age)
  return 'return value'
}
obj = {name: 'asd'}
testBinded = test.bind(obj, 'M')
console.log(testBinded(10))
// 输出：
// asd M 10
// return value
```

### 第一阶段：基本实现

```js
Function.prototype.bind2 = function () {
  // this 即将要执行 bind 的函数
  var self = this
  // 传入的第一个参数是新的上下文
  var context = arguments[0]
  // 返回一个闭包，绑定之后的函数
  return function () {
    // 原函数可能有返回值，所以这里返回 apply 之后的结果
    return self.apply(context)
  }
}
```

### 第二阶段：实现参数传递

`bind()` 可以在绑定时给原函数传递参数，绑定之后的函数执行时还可以再次传递参数。  

> 可以顺便学习一下[柯里化](https://juejin.im/post/5c932a556fb9a070cd56998e)

```js
Function.prototype.bind2 = function () {
  var self = this
  // bind 时第一个参数是新的上下文
  var context = [].shift.call(arguments)
  // 其余的参数是传递给原函数的参数
  var args1 = [].slice.call(arguments)
  return function () {
    // bind 后的函数执行时传入的参数
    var args2 = [].slice.call(arguments)
    // 合并参数
    return self.apply(context, args1.concat(args2))
  }
}
```

### 第三阶段：实现构造函数效果

一个函数执行 `bind()` 后，如果使用 `new` 调用，即当做构造函数，那么：
- `bind()` 时传入的上下文 `context` 会失效
- 但是两次传入的参数 `args` 仍然有效

第一次看到这个的时候，想的是，`bind()` 已经执行完了，之后怎么调用跟 `bind()` 的实现有什么关系？

> ~~你们抓的是周树人，跟我鲁迅有什么关系？~~

关系在于，**`bind()` 返回的是闭包，函数并没有执行**。

在前面 `new` 的模拟实现里，需要通过 `apply()` 改变构造函数的上下文，在这里构造函数就是 `bind()` 之后的函数。  
但是看一下上面 `bind2()` 的实现，返回函数时，直接把上下文设置为了执行`bind2()` 时传入的 `context`，根本**没判断这个函数是不是接受了新的上下文**。

所以修改的方法是，在 `bind2()` 中获取 `this`，也就是 `apply()` 传入的上下文（如果有的话），并判断。

```js
Function.prototype.bind2 = function () {
  var self = this
  var context = [].shift.call(arguments)
  var args1 = [].slice.call(arguments)
  var result = function () {
    var args2 = Array.prototype.slice.call(arguments)
    // 如果 this 是 result 这个函数的实例，说明 result 作为构造函数被调用了
    var context = this instanceof result ? this : context
    return self.apply(context, args1.concat(args2))
  }
  return result
}
```

### 第四阶段：继承

`bind` 还有一些关于继承的特性。

举个栗子：

```js
// 声明一个构造函数 F1()
function F1(){}
// bind 生成构造函数 F2()
F2 = F1.bind({})
// f1 和 f2 分别是它们的实例
f1 = new F1()
f2 = new F2()
// 在 F1() 上添加原型属性
F1.prototype.name = 'ads'

console.log(f2.name) // asd
console.log(f2.__proto__ === f1.__proto__) // true
console.log(F1.prototype) // {name: "ads", constructor: ƒ}
console.log(F2.prototype) // undefined
```

即：
- `f1` 与 `f2`，他们的原型对象是相同的，都是原函数的原型 `F1.prototype`
- 但是 `F1` 与 `F2` ，他们的原型却是不相同的，并且 `F2` 压根就没有原型

先不管第2条。  
为了实现第1条，首先想到的就是使 `F2` 与 `F1` 有同样的原型。也就是说 `bind2` 的代码需要加上这么一行：

```js
result.prototype = self.prototype
```

但是存在一个问题，这样一来可以通过 `F2.prototype` 来修改原型上的属性，而真正的 `bind()` 返回的函数是没有 `prototype` 的，更别提通过 `prototype` 去修改原型上的属性了。

怎么办呢？  
不要忘了，现在的目的是让 `bind()` 之后的函数能够访问原函数原型对象上的属性，实现这个目标就可以了。

而想要访问原函数的原型对象，不必非得直接基于原函数进行继承。  
因为在原型链上寻找属性时是一级一级向上寻找的，就算最末端的对象与实际想要继承的原型对象之间隔着 n 层，但是只要它们在同一条原型链上，就可以访问到原型对象。

所以在这里，完全可以新建一个中介函数，并且继承原函数的原型对象，然后去继承这个新的函数。  
这样一来，`bind()` 之后的函数实际上是通过这个中介函数把自己添加到了原函数的原型链上。并且因为 `bind()` 前后的函数原型对象不相同，所以修改时互相没有影响。

下面是最后的代码：

```js
Function.prototype.bind2 = function () {
  var self = this
  var context = [].shift.call(arguments)
  var args1 = [].slice.call(arguments)
  var result = function () {
    var args2 = Array.prototype.slice.call(arguments)
    var context = this instanceof result ? this : context
    return self.apply(context, args1.concat(args2))
  }
  // 新建一个你叔
  var Agent = function () {}
  // 让你叔也继承原函数的原型，或者说你爷爷
  Agent.prototype = self.prototype
  // 然后你不继承你爸了，而是继承你叔
  result.prototype = new Agent()
  return result
}
```

至于 `F2.prototype` 应该为 `undefined` 这一点该怎么搞呢？看下一部分。

### MDN 提供的 Polyfill

MDN 提供了一个 `bind()` 的垫片，这里就不再贴代码了，戳[链接](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#Compatibility)自己看。

后面紧跟着也说明了这个兼容方案的不足之处。  
实际上也就是上面手动实现的方案的不足。

### 参考链接

[JavaScript 深入之 bind 的模拟实现](https://github.com/mqyqingfeng/Blog/issues/12)  
[Polyfill - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#Compatibility)

## apply 和 call 的模拟实现

`apply()` 和 `call()` 只是接收参数的方式不一样。  
这里以 `apply()` 为例实现一下。`call()` 的模拟实现可以参考[《JavaScript 深入之 call 和 apply 的模拟实现》](https://github.com/mqyqingfeng/Blog/issues/11)。

先回顾一下 `apply` 的效果：

```js
name = 'global'
function test(age, sex) {
  console.log(this.name, age, sex)
  return 'return value'
}
console.log(test.apply({name: 'asd'}, [1, 'M']))
// 输出：
// asd 1 M
// return value
```

### 第一阶段：基本实现

首先，`apply()` 在给定的上下文中立即执行了一个函数。

而说到“在给定的上下文中执行”，让人不得不想到把函数作为对象的方法来执行：

```js
obj = {
  name: 'asd',
  showName() {
    console.log(this.name)
  }
}
obj.showName()
```

那么第一步可以这样实现一下：

```js
Function.prototype.apply2 = function () {
  // 新的上下文，是一个对象
  var context = arguments[0]
  // 把原函数添加为这个对象的方法
  context.fn = this
  // 执行，并且函数可能有返回值
  return context.fn()
}
```

但是这样有两个问题：
1. 原对象被修改了，增加了一个叫 `fn` 的方法
2. 如果原对象里本来就有一个键叫 `fn` 呢？

增加了，只要删掉就好了；而重名的情况，可以用 `Symbol` 解决。

> 虽然`Symbol` 是 ES6 的内容，但是不要在意这些细节！  
> `call` 还从 ES3 开始就有了呢，又不是从底层重写，意思意思就行...

```js
Function.prototype.apply2 = function () {
  var context = arguments[0]
  // 生成一个唯一的 key，就不会与原对象中其他的 key 冲突了
  var symbol = Symbol()
  context[symbol] = this
  var result = context[symbol]()
  // 最后删掉
  delete context[symbol]
  return result
}
```

### 第二阶段：实现参数传递

`apply()` 接受两个参数，第一个参数为新的上下文，第二个是由传递给原函数的参数组成的数组。

获取参数很简单，第二个参数就是 `arguments[1]`。  
重点在于，函数接收参数的时候一般是以逗号为分隔符，每个变量挨个放上去的，而不是直接接受一个数组。

可以想到这么两种实现方式：
1. `eval()`
2. 展开运算符

`eval()` 接受一个字符串，并把字符串作为 JS 来运行：

```js
eval("console.log('asd')") // asd
```

> ~~你以为它是字符串，其实是我 JS 哒！~~

那么在这里就改写成了：

```js
Function.prototype.apply2 = function () {
  var context = arguments[0]
  var args_arr = arguments[1]
  var symbol = Symbol()
  context[symbol] = this
  // 1. 使用 eval()
  // 处理参数，字符串需要加上双引号
  var args_string = ''
  args_arr.forEach((val) => {
    if (typeof val === 'string') args_string += '"' + val + '",'
    else args_string += val + ','
  })
  var result = eval('context[symbol](' + args_string + ')')
  // 2. 或者使用展开运算符
  // var result = context.symbol(...args_arr)
  delete context[symbol]
  return result
}
```

其实首先想到的是[柯里化](https://juejin.im/post/5c932a556fb9a070cd56998e)。  
但是回头一想要实现柯里化好像用到了 `apply`，那这里就不合适了。

### 第三阶段：细节

第一个参数也可以是 `null`，浏览器环境下指向 `window`。只要改一行：

```js
var context = arguments[0] || window
```

### 参考链接

[JavaScript 深入之 call 和 apply 的模拟实现](https://github.com/mqyqingfeng/Blog/issues/11)