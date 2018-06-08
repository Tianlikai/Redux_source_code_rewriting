/**
 * redux-thunk
 * thunkMiddleware 中间件
 * @param {*} param
 * @return {*如果为一个合法的action对象字面量则通过，如果为function 则派发改action}
 */
function thunkMiddleware ({dispatch, getState}) { // 接受store的 dispatch 和 getState
    return function(next) { // 返回一个函数 接受next 函数
        return function(action) { // 返回一个函数 接受一个 action 对象
            if (typeof action === 'function'){ // 如果action 是一个函数就直接执行该action
                return action(dispatch, getState) // 传入为一个function 可在action 中再次 dispatch 一个action
            }
            return next(action) // 不是function 是action对象 进入下一个中间件
        }
    }
}