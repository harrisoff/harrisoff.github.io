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
function Parent(name) {
  this.name = name
  this.relation = ['grandpa', 'grandma']
}
Parent.prototype.say = function () {/*...*/}

function Child() {}
// 继承
p = new Parent('father')
Child.prototype = p

c1 = new Child()
c2 = new Child()
// 可以调用原型链上的方法
c1.say()
// 也可以获取父类实例的属性
console.log(c1.name, c2.relation)
// 直接修改父类实例属性
p.name = 'mother'
// 或者通过子类实例修改父类上的引用类型
c1.relation.push('grandson')
// 子类实例都会被影响
console.log(c1.name, c2.relation)
```

原型链继承的不足：
- 修改父类实例上的属性时，所有在此原型链上的对象的属性都会受影响
- 当父类实例上有属性为引用类型时，所有在此原型链上的对象修改该属性时其他对象都会受影响
- 调用子类构造函数时，不能向父类的构造函数传递参数

> 虽然这里只是构造函数，不是真正的类 class，不过姑且使用这个叫法

实践中，很少直接用原型链实现继承。

## 借用构造函数继承

> constructor stealing

在子类构造函数中使用 `apply` 或 `call` 调用父类构造函数。

本来，父类构造函数中的 `this` 将会指向父类的实例，但是在子类构造函数中 `call(this)` 把上下文修改为了子类实例，相当于**把父类实例的属性给子类实例复制了一份**。

```js
function Parent(name) {
  this.name = name
}
function Child(name) {
  Parent.call(this, name)
}
c = new Child('child')
// c 本身就有 name 属性
console.log(c)
```

使用原型链继承时，如果访问一个子类实例的属性，但是子类实例并没有这个属性，那么会在子类实例的原型链上寻找，如果发现父类实例有这个属性，那么访问到的值是父类实例的，即原型链上的。同理，如果修改，也是修改的原型链上的。  
而借用构造函数的方式，使得子类实例本身就有了这个属性，不需要再去原型链上找了。

这样一来：
- 可以在 `call()` 中向父类构造函数传递参数
- 仍然可以访问父类实例上的属性，但是这些属性已经复制给了 `c` 自己，不是 `c.__proto__` 上的，所以修改时不会影响其他子类实例
- 因为没有使用原型链，所以子类实例不能访问父类原型对象上的属性和方法

实践中也很少使用。

到这里应该可以发现，当实现继承的时候，主要是针对下面两部分：
  
- **父类实例**上的实例属性和方法
- **父类原型对象**上的属性和方法

> ~~《当我谈继承时，我谈些什么》~~

## 组合继承

就是原型链继承+借用构造函数。

既然原型链继承让子类实例可以访问父类的原型对象；而借用构造函数让子类实例可以访问父类实例，并且修改父类实例属性时不影响其他子类实例，那么把两者结合一下岂不是美滋滋？

组合继承的原理就是这样：
- 使用**借用构造函数**的方法，复制一份父类实例 `p` 的属性到子类实例 `c` 上
- 使用**原型链**的方法，把子类实例添加到原型链上，使得子类实例也能够访问父类原型对象上的属性和方法，当然，这些属性方法仍然是位于 `c.__proto__.__proto__` 上的

实现：

```js
function Father(name) {
  // 父类实例属性
  this.first_name = name
  this.last_name = 'vue'
  this.age = 40
  this.address = {
    country: 'china',
    province: 'shanghai'
  }
}
// 父类原型方法
Father.prototype.say = function () {
  console.log(`I am ${this.last_name} ${this.first_name}`)
}
f = new Father('js')

// 子类
// 1. 借用构造函数
function Child1(name) {
  Father.call(this, name)
  // 注意，要先 call 父构造函数，再定义子类实例自己的属性
  // 否则子类实例属性会被父类实例同名属性覆盖
  this.age = 10
}
// 2. 原型链
// 修改原型对象
Child1.prototype = f
// 修改原型对象的构造函数
Child1.prototype.constructor = Child1

// 同样方法再建一个子类
function Child2(name) {
  Father.call(this, name)
  this.age = 9
}
Child2.prototype = f
Child2.prototype.constructor = Child2

c1 = new Child1('router')
c2 = new Child2('x')

print()
// 修改一下，不会对其他实例有影响
c1.address.country = 'usa'
f.last_name = 'react'
print()

function print() {
  console.log(c1)
  console.log(c2)
  console.log(f)
  // 子类实例也能访问父类原型对象上的方法
  c1.say()
}
```

不过这里有一点瑕疵：一个子类实例将会持有两份父类实例的数据。

因为使用了原型链。  
一份是 `Father.call(this)` 复制到子类实例 `c` 上的数据，一份是父类实例原本的数据，位于 `c.__proto__` 上。

虽然冗余，不过使用效果上没有太大影响。  
也有处理方案，就是后面的寄生组合式继承。

这是实践中常用的继承方式。

## 原型式继承

下面是[《继8》](https://juejin.im/post/5bcb2e295188255c55472db0#heading-3)中原型式继承的例子，附加了一些注释：

```js
// 为一个对象生成子类实例的函数。其实 Object.create() 就是这样实现的
function object(obj){
  // 传入的参数 obj 就相当于是父类实例
  // F 就相当于子类构造函数，不过是空的，啥也没
  function F(){}
  // 把子类构造函数的原型对象设置为父类实例
  F.prototype = obj
  // 调用子类构造函数，创建一个实例并返回
  return new F()
}
// 相当于父类实例
var person = {
  name: "Nicholas",
  friends: ["Shelby", "Court", "Van"]
}
// 子类实例
var anotherPerson = object(person)
// 为子类实例添加实例属性
anotherPerson.name = "Greg"
// 再创建一个子类实例
var yetAnotherPerson = object(person)
yetAnotherPerson.name = "Linda"
// 修改子类实例的一个引用类型属性
anotherPerson.friends.push("Rob")
yetAnotherPerson.friends.push("Barbie")
// 父类实例上的属性也变了
console.log(person.friends) // "Shelby,Court,Van,Rob,Barbie"
```

> 上面的 `object()` 函数其实就是 `Object.create()`。    
> MDN 提供的 `Object.create()` 的 [polyfill](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create#Polyfill) 的核心代码就是上面 `object()` 的代码。

目前看来，感觉跟原型链继承好像是没多大差别的。尤其是 `object()` 函数内部的代码，完全就是原型链继承的套路。

以上面的代码为例分析一下的话：

- 原型链继承，是先在子类构造函数中定义好了实例属性等等，然后 `new` 一个父类实例，把子类构造函数的原型指向该实例
- 而原型式继承，已经有了一个父类实例，最后也同样是把子类构造函数的原型指向该实例，只不过在中间定义子类构造函数的时候，定义了一个空的函数

实际上，这个“只不过定义了一个空函数”正是跟原型链继承最大的区别。  
后面的寄生组合式继承就会体现出它的作用了。

## 寄生式继承

是原型式继承的增强版。

在通过原型式继承生成了子类实例后，在返回之前处理了一下子类实例，添加了一些属性或方法：

```js
function createAnother(original){
  // 使用前面的 object 函数，生成了一个子类实例
  var clone = object(original)
  // 先在子类实例上添加一点属性或方法
  clone.sayHi = function(){
    console.log("hi")
  }
  // 再返回
  return clone
}
var person = {
  name: "Nicholas",
  friends: ["Shelby", "Court", "Van"]
}
var anotherPerson = createAnother(person)
anotherPerson.sayHi()
```

## 寄生组合式继承

就是寄生式继承+借用构造函数继承。

前面在借用构造函数部分的结尾，总结了一下“**究竟要继承哪些东西**”，得出了两点：  
- **父类实例**上的属性和方法
- **父类原型对象**上的属性和方法

借用构造函数实现了第一点，那么这里寄生式继承只要实现第二点就好了。

不对，不应该是“只要实现第二点就好了”，前面的原型链继承也可以实现第二点。  
寄生式继承需要比原型链继承更优秀，不然就没什么意义了。

怎么才能“优秀”呢？  
组合继承的结尾也提到了，它的一个缺点是会有两份父类实例的数据。  
那么是不是可以把这一点优化掉？

这两份数据中，通过 `Father.call(this)` 复制到子类实例 `c` 上的这一份是真正需要的，而 `c.__proto__` 上的这一份是多余的，是把子类实例放到原型链上时产生的副作用。  

也就是说，需要**让子类实例位于原型链上，但是不能让父类实例的属性位于原型链上**。

可以想到两个方法：
- 一般来说，为了把子类实例挂到原型链上，是需要一个父类实例的，如果能创建一个没有实例属性的父类实例就好了
- 或者让子类实例绕过父类实例，直接继承父类的原型对象

寄生组合式继承使用了第一种方法。

对于一个构造函数 `Test()` 及其原型对象 `Test.prorotype`，使用 `new Test()` 和 `Object.create(Test.prototype)` 都可以生成继承了该原型对象 `Test.prorotype` 的实例。  
但是不同的是，`Object.create()` 生成的实例**可以**没有实例属性：

```js
function Test(name) {
  this.name = name
  this.age = 20
}

t1 = new Test()
t2 = Object.create(Test.prototype)

console.log(t1) // Test {name: undefined, age: 20}
console.log(t2) // Test {}
```

构造函数只是建立原型链的途径，就算不通过构造函数也可以生成原型链。  
MDN 关于 `Object.create()` 的[介绍](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create)正是“使用现有的对象来提供新创建的对象的 `__proto__`”。

那么，相当于是把原型链继承中使用 `new` 创建父类实例改为使用 `Object.create()`。

实现一下：

```js
function Parent(name) {
  this.name = name
  this.age = 40
  this.relation = ['grandma', 'grandpa']
}
Parent.prototype.say = function () {
  console.log(this.name)
}
function Child(name) {
  Parent.call(this, name)
}

// 开始实现继承
// Object.create 创建没有实例属性的父类实例
p = Object.create(Parent.prototype)
// 修改子类构造函数原型对象
Child.prototype = p
// 这里的 p 只是个普通对象，没有 constructor 属性，手动添加一下
p.constructor = Child

// 测试一下
p1 = new Parent('father')
c1 = new Child('child 1')
c2 = new Child('child 2')
// 可以发现没有两份重复数据了
print()
// 修改父类实例，对子类实例没有影响
p1.age = 50
p1.relation.push('child 3')
// 修改父类原型对象，子类实例能够访问到新方法 speak
Parent.prototype.speak = function () {
  console.log('speak')
}
// 修改子类原型对象，其他子类实例也能够访问到新方法 marry
Child.prototype.marry = function () {
  console.log('married')
}
// 修改一个子类实例，对其他子类实例没有影响
c1.name = 'child 2 plus'
c1.relation.push('grandson')
print()

function print() {
  console.log(p1)
  console.log(Parent)
  console.log(c1)
  console.log(c2)
}
```

**这是最成熟的方法，也是现在库实现的方法。**  
ES6 的 `extends` 实现与寄生组合式继承基本一致。

上面还提到另一种方法，让子类实例绕过父类实例，直接继承父类的原型对象。

首先，这里关于“父类”和“子类”的叫法不够严谨。  
仅仅是在**所谓的子类**的构造函数中执行了一行 `Parent.call(this)` ，并不能让两个函数产生继承关系。而且这里目的只是想把 `Parent()` 实例的属性复制一份到 `Child()` 的实例中，本来跟继承也没有半点关系。

父类和子类的区分是在设置原型对象之后才产生的。

所以，如果把 `Child()` 的原型对象设置为 `Parent.prototype`，当然可以，不过从代码上来说，`Child()` 其实变成了 `Parent()` 的兄弟；而从表现上来说，因为 `Child()` 的实例持有一份 `Parent()` 的实例属性，倒也能算是 `Parent()` 的子类。

说到底，这第二种方法到底可不可行，会有什么问题，期待大家留言。

## ES6 extends

这一部分只讲解一下 `extends` 的原理，至于 class 和 extends 的使用，看阮一峰的[《ES6 入门 - Class 的继承》](http://es6.ruanyifeng.com/#docs/class-extends)就好。

**不过，看过这部分之后，一定会对 class 和 extends 的使用有更深入的认识。**

前面说，ES6 的 `extends` 核心代码与寄生组合式继承基本一致。  
那么先看看下面的代码，是使用 Babel 解析后的 `extends` 的部分实现：

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

但是我寻思这也不像之前的借用构造函数方法的 `Father.call(this)` 啊。

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

> mixin

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