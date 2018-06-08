function compose(...func) {
    // 为空 直接返回输入
    if (!func.length) arg => arg
    // 返回第一个函数
    if (func.length === 1) return func[0]
    // 柯里·化 reduce
    return func.reduce((a, b) => (...args) => a(b(...args)))
}

module.exports = compose