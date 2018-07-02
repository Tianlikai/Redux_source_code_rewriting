/**
 * 绑定 action 和 dispatch
 * @param {func} actionCreator 
 * @param {func} dispatch 
 */
function bindActionCreator (actionCreator, dispatch) {
    return (...arg) => dispatch(actionCreator(...arg))
}

/**
 * 绑定 action 和 dispatch
 * 并且 以 key value 对象的形式返回
 * @param {func} actionCreators 
 * @param {func} dispatch 
 * @return {用于将dispatch方法传入子组件，并且不让子组件感知到redux的存在}
 */
function bindActionCreators (actionCreators, dispatch) {
    if (typeof actionCreators === 'function') {
        return bindActionCreator(actionCreators, dispatch)
    }

    if (typeof actionCreators !== 'object' || typeof actionCreators ===null) {
        throw new Error('bindActionCreators 期望接收到一个 function 或者 object 参数，不能为空或null')
    }

    let keys = Object.keys(actionCreators)
    let boundActionCreators = {}

    for (let i=0; i<keys.length; ++i) {
        let key = keys[i]
        let actionCreator = actionCreators[key]
        if (typeof actionCreator === 'function') {
            boundActionCreators[key] = bindActionCreator(actionCreator, dispatch)
        }
    }
    return boundActionCreators
}

export default bindActionCreators