/**
 * 
 * @param {*} func 
 * @return {最终返回一个函数，并且接收一个参数，最终形成一个管道}
 * [1,2,3,4,5,6,7]
 * 1(2(3(4(5(6(7(...args))))))) 从右到左一次执行并且将上一次结果当作结果传入
 */
export default function compose(...func) {
    // 为空 直接返回输入
    if (!func.length) arg => arg
    // 返回第一个函数
    if (func.length === 1) return func[0]
    // 柯里·化 reduce
    return func.reduce((a, b) => (...args) => a(b(...args)))
}

