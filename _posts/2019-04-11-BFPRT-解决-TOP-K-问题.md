---
layout: post
title: "BFPRT 解决 TOP-K 问题"
date: 2019-04-11 00:00:00
categories: javascript 算法
---
## 简介

找出数组最小或最大的 K 个数，又称 TOP-K 问题。目前最有效的算法就是 BFPRT算法，又称**中位数的中位数算法**。

一般的快速排序算法，是选取数组**第一个数为基准值**，把数组分区后递归所有分区，对**整个数组执行排序**。   
而 BFPRT 算法，在**快速排序的基础上**，**修改基准值的选取方法**，只**递归部分分区**，降低了在**最坏情况下**的时间复杂度。

最坏时间复杂度 O(n)。

### 流程概括

1. 把数组的元素每5个一组进行分组，多余的算一组
2. 对**每一组使用任意算法排序，并取中位数**，得到中位数组成的数组
3. 对中位数的数组**再次取中位数**，作为快速排序的基数 `pivot`
4. 使用**快速排序**把原数组分区，得到分别小于和大于 `pivot` 的两个数组 `left_arr` 和 `right_arr`
5. 这时，`left_arr` 就是原数组中最小的**前** `left_arr.length` 个元素。或者说，`pivot` 是原数组中最小的**第** `left_arr.length + 1` 个元素
6. 比较 K 与 `left_arr.length` 的大小：
   1. 相等，即刚好取到了 K 个，返回
   2. `left_arr.length` 较小，即还差几个，递归 `right_arr`，再取出 `k - left_arr.length -1` 个
   3. `left_arr.length` 较大，即超过了 K 个，递归 `left_arr`，重新取 K 个

## JavaScript 实现

以寻找**最小的前/第 K 个元素**为例。

```js
// type: 'array' 时输出前 K 个元素，否则输出第 K 个元素
function BFPRT(arr, k, type = 'array') {
  if (k > arr.length) throw new Error('index of out bounds')
  if (arr.length === 1) return type === 'array' ? arr : arr[0]
  // 获取中位数的中位数，作为快排的基数 pivot
  let pivot = getMedianOfMedian(arr)
  // 魔改版快排，返回小于 pivot 的左侧数组，大于 pivot 的右侧数组
  let [left_arr, right_arr] = quickSort(arr, pivot)
  // 这时，left_arr 就是数组 arr 中最小的前 left_arr.length 个元素了
  // 即，pivot 是数组 arr 中第 left_arr.length + 1 小的元素
  // 把 pivot 的位置保存为变量 pivot_index ，比较 pivot_index 与 K 的大小
  let pivot_index = left_arr.length + 1
  // 刚好相等，pivot 就是第 K 小的元素
  if (pivot_index === k) return type === 'array' ? left_arr.concat([pivot]) : pivot
  // pivot_index 小于 K，再从右侧数组中找 k - pivot_index - 1 个
  // 这一大坨主要是在判断 type...
  else if (pivot_index < k) return type === 'array'
    ? left_arr.concat([pivot], BFPRT(right_arr, k - pivot_index, type))
    : Array.isArray(BFPRT(right_arr, k - pivot_index, type))
      ? BFPRT(right_arr, k - pivot_index, type)[0]
      : BFPRT(right_arr, k - pivot_index, type)
  // pivot_index 大于 K，即左侧数组大于 K 个，重新从左侧数组找 K 个
  else return BFPRT(left_arr, k, type)
}

// 快速排序 - 魔改版
function quickSort(arr, pivot) {
  if (arr.length <= 1) return arr
  // 这里分割成三部分：
  // 小于 pivot 的 left，pivot 本身，大于 pivot 的 right
  // 用 Set 去重
  let left = new Set(), right = new Set()
  for (let index = 0; index < arr.length; index++) {
    if (arr[index] < pivot) left.add(arr[index])
    else if (arr[index] > pivot) right.add(arr[index])
  }
  // 原本快排函数需要把左右数组全部递归，但是这里的需求只是找出比 pivot 小和大的部分
  // 转回 Array 类型，并返回这两部分
  return [Array.from(left), Array.from(right)]
}

// 取中位数的中位数
function getMedianOfMedian(arr) {
  // 每5个元素进行分组后，剩下的元素个数
  let rest_num = arr.length % 5
  // 组数，剩下的算作一组
  let group_num = parseInt(arr.length / 5) + (rest_num === 0 ? 0 : 1)
  // 中位数数组
  let median_arr = []
  // 对每个数组取中位数，保存
  for (let i = 0; i < group_num; i++) {
    let sub_group = arr.slice(i * 5, i * 5 + 5)
    median_arr.push(getMedian(sub_group))
  }
  // 得到了由中位数组成的数组，再取中位数
  return getMedian(median_arr)
}

// 取中位数
function getMedian(arr) {
  // 先排序
  insertionSort(arr)
  // 取中位数
  let middle_index = Math.floor(arr.length / 2)
  return arr[middle_index]
}

// 插入排序
function insertionSort(arr) {
  for (let i = 1; i !== arr.length + 1; i++) {
    for (let j = i; j !== 0; j--) {
      if (arr[j - 1] > arr[j]) swap(arr, j - 1, j)
      else break
    }
  }
}

// 交换位置
function swap(arr, n, m) {
  [arr[n], arr[m]] = [arr[m], arr[n]]
}
```

## 关于重复元素

如果是求**第 K 个**元素的情况，那么显然，**相等的元素应该只算一次**。  
而对于求**前 K 个**元素的情况，简单起见，这里也认为相等的元素只算一次。

在这个前提下，在快速排序函数 `quickSort` 中创建 `left_arr` 和 `right_arr` 的时候，比起用 `Array`，`Set` 更合适。因为在其他函数中是使用的数组，所以最后再用 `Array.from()` 把 `Set` 转回 `Array`。  
另外，上面使用 `Set` 是对大于和小于 `pivot` 的元素去重，而对于 `pivot` 相等的情况，只要不进行判断就可以了，相当于舍弃了与 `pivot` 相等的重复元素。

## 参考链接

[BFPRT 算法（TOP-K 问题）](https://segmentfault.com/a/1190000008322873)  
[JavaScript BFPRT 算法](https://www.jianshu.com/p/772a7e82c13a)  
[BFPRT 算法及 Python 实现](https://www.twblogs.net/a/5b80e2bb2b71772165a9f08e/zh-cn)
