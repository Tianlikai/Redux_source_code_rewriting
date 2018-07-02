/**
 * redux-thunk
 * thunkMiddleware 中间件
 * @param {*} param
 * @return {*如果为一个合法的action对象字面量则通过，如果为function 则派发改action}
 */
function thunkMiddleware ({dispatch, getState}) { // 接受store的 dispatch 和 getState
    return function(next) { // 返回一个函数 result(next)(action) 调用
        return function(action) { // 返回一个函数 result(action) 调用
            if (typeof action === 'function'){ // 如果action 是一个函数就直接执行该action
                return action(dispatch, getState) // 传入为一个function 可在action 中再次 dispatch 一个action
            }
            return next(action) // 是action 字面量 通过
        }
    }
}

export default thunkMiddleware