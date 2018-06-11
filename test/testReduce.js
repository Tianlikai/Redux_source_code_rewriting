
/**
 * @param {传入的值} prev
 * @param {当前指向的值} cur
 * @param {当前的下标} index
 * @param {整个数组} arr
 */

 /**
  * reduce 接受两个参数
  * @param {func: 迭代执行的函数} first
  * @param {*: 传入的默认参数} second
  */

// let a = [1,2,3]

// let res = a.reduce((prev, cur, index, arr) => {
//     console.log(prev, cur, index);
//     return prev + cur;
// }, 1)
// console.log(res)

function a (){

}
function b (){

}
function c (){

}
function d (){

}
function e (){

}
let array = [a,b,c,d,e]
       
let result = array.reduce((prev,cur) => (...args) => {
    debugger
    console.log('prev', prev)
    console.log('cur', cur)
    console.log('-------------')
    return prev(cur(...args))
})

// console.log(Object.toString(result))
result(1)
