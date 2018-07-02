import ActionTypes from './utils/actionTypes'
import isPlainObject from './utils/isPlainObject'
import warning from './utils/warning'

/**
 * assertReducerSanity函数主要是对 reducer 合法性进行验证。
 * 主要验证初始化返回的 state是否为 undefined 和传入未知 action 时是否默认返回原 state。
 * @param {*} reducers 
 */
function assertReducerSanity (reducers) {
    Object.keys(reducers).forEach(key => {
        let reducer = reducers[key]
        let initialState = reducer(undefined, {type: ActionTypes.INIT})
        if (typeof initialState === 'undefined') { // 验证初始化reducer类型
            throw new Error(`reducer "${key}" 初始化类型，没有指定默认返回参数，所以返回值为undefined reducer 不允许不指定默认参数`)
        }
        if (typeof reducer(undefined, {type: ActionTypes.PROBE_UNKNOWN_ACTION}) === 'undefined'){ // 验证未定义的reducer类型
            throw new Error(`reducer "${key}": 对于未命名的reducer处理 应该返回默认参数，由于没有指定默认参数，所以返回值undefined reducer 不允许不指定默认参数`)
        }
    })
}

/**
 * getUndefinedStateErrorMessage函数主要作用将用于提示
 * 当返回的 state 为 undefined 的时候
 * 将调用该函数给开发者错误提示。
 * @param {*} key 
 * @param {*} action 
 */
function getUndefinedStateErrorMessage (key, action) {
    const actionType = action && action.type
    const actionDescription =
      (actionType && `action "${String(actionType)}"`) || '一个 action'
  
    return (
      `由于action ${actionDescription} 的"${key}"reducer. 返回undefined. 所有抛出该警告`+
      `reducer执行如果没有更改 state 必须返回传入的上一个state.`+
      `如果你想忽略该reducer. 请返回 null 替代 undefined`
    )
}

/**
 * getUnexpectedStateShapeWarningMessage函数主要作用
 * 就是检测 inputState 当中和 reducer 异常的地方
 * 同时作出错误提示。
 * @param {*} inputState 
 * @param {*} reducers 
 * @param {*} action 
 * @param {*} unexpectedKeyCache 
 */
function getUnexpectedStateShapeWarningMessage (
    inputState,
    reducers,
    action,
    unexpectedKeyCache
) {
    let reducerKeys = Object.keys(reducers)
    if (!reducerKeys.length) {
        return 'store 不存在任何reducer，'
    }
    if (!isPlainObject(inputState)) {
        return '传入的state 应该是一个普通对象类型'
    }
    // 错误位置提示
}

function combineReducer (reducers) {
    //类型检测 筛选出有效的reducer
    // 获取最终有效的reducer
    let reducerKeys = Object.keys(reducers)
    let finallyReducer = {}
    for (let i = 0; i < reducerKeys.length; ++i) {
        let key = reducerKeys[i]
        if (typeof reducers[key] === 'function') finallyReducer[key] = reducers[key]
    }

    // reducer合法性检测
    let sanityError
    try {
        assertReducerSanity(finallyReducer)
    } catch (error) {
        sanityError = error
    }

    return function combineReducer (state = {}, action) {
        let copy = Object.assign({}, state)
        if (sanityError) {
            throw sanityError
        }

        if (process.env.NODE_ENV !== 'production') {
            const warningMessage = getUnexpectedStateShapeWarningMessage(
              state,
              finallyReducer,
              action
            //   unexpectedKeyCache
            )
            if (warningMessage) {
              warning(warningMessage)
            }
        }

        let nextState = {}
        let hasChanged = false
        let finallyReducerKeys = Object.keys(finallyReducer)
        for (let i =0; i<finallyReducerKeys.length; ++i) {
            let key = finallyReducerKeys[i]
            let reducer = finallyReducer[key]
            let previousStateForKey = state[key]
            let nextStateForKey = reducer(previousStateForKey, action)
            console.log(key + '-pre: ' + previousStateForKey)
            console.log(key + '-next: ' + nextStateForKey)
            if (typeof nextStateForKey === 'undefined') { // 提示错误警告
                let errorMessage = getUndefinedStateErrorMessage(key, action)
                throw new Error(errorMessage)
            }
            nextState[key] = nextStateForKey
            hasChanged = hasChanged || previousStateForKey !== nextStateForKey
        }
        console.log('finally state:')
        console.log(nextState)
        console.log('------------------')
        console.log('\n')
        return hasChanged ? nextState : state
    }
}

export default combineReducer

