# redux source-code rewrite

redux源码学习，redux架构思路

## 目录
1. [说在前面](#说在前面)
1. [设计思路](#设计思路)
1. [redux简介](#redux简介)
1. [源码结构](#源码结构)
1. [参考](#参考)

## redux整体思路结构
* 前提: 在交互复杂的web应用程序中，有大量的跨层级层级，多个层次的共同操作的状态。
       这些状态的维护及其困难，例如状态不同步，状态冗余，状态传入层次太深调用复杂，极端
       bug难以定位复现，状态分布太广很难定位，对整体状态不能直观理解....

* 赋能: redux库提供了非常可靠的状态管理方案，可以为react / vue / angular 甚至更多的库提供项目状态管理功能
       个人觉得redux 的设计哲学和 react 不谋而合

## 设计思路
react 和 redux 都有一个非常好的整体思想而且及其相似

```
# react 由状态驱动 一个页面所维护的状态发生变化页面就会相应的发生变化
# 一个公式展现 react 简单的整体思路

UI = render(state) 

# redux 的 精髓之一就是只维护一个store
# store 中保存所有的state
# 改变项目中的state 只需要派发一个动作通知store改变相应的状态就行
# store 对应着整个项目的state

UI = render(store)

```
* 按照组件化的思想 可以想象一个web应用由 n个 ui = render(state) 组成 
* 如果每一个ui 的state都需要单独维护 复杂度会增加
* 如果只维护一个 顶层的state（store） 所有的子 ui状态 通过 key: state 的形式获取
* 这样 整个应用的状态 就一目了然 化繁为简 （所以需要 reducer 这样的纯函数取处理指定的 state 而且没有任何副作用）
* 提示: v8 引擎 store 的状态树 处理非常块 不用考虑 遍历reducer 会带来性能问题

## redux简介
核心概念
* redux 单项数据流
* redux 只有一个store
* reducer 为纯函数，没有任何副作用

api
* createStore(reducer, initialState, enhancer)
* compose(...func)
* applyMiddleware(...middleware)
* combineReducer(reducers)
* bindActionCreators()

如果你了解过redux，我有几个疑问，弄明白有助与你了解 redux 的来龙去脉
* redux 中大量使用柯里化函数。什么是柯里化？柯里化的作用？
* combineReducer({key: reducer}) 中key中作用是什么?
* dispatch(action) 都发生了什么？最终怎么改变store的？又是怎么最终改变页面中的state的？
* 异步请求处理的切入点？可以怎么简单自定义洋葱模型做一些自定义处理？
* 原生 react 如何配合 redux？什么地方可以做优化？
## 项目结构

本项目目录结构综合了按功能组织和mvc结构.

```
.
├── src                      # 源码文件
│   ├── util                 # 几个工具函数
│   └── index                # 主入口
├── test                     # 测试src
└── README.md                # 文档
```

## 参考

* [redux](https://github.com/ecmadao/Coding-Guide/blob/master/Notes/React/Redux/Redux%E5%85%A5%E5%9D%91%E8%BF%9B%E9%98%B6-%E6%BA%90%E7%A0%81%E8%A7%A3%E6%9E%90.md)

