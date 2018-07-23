import isPlainObject from './utils/isPlainObject'

const ActionTypes = {
    INIT: '@@redux/INIT'
}

/**
 * createStore 
 * @param {function} reducer 传入store的 rootReducers 每次执行会遍历所有的reducer
 * @param {object} initialState 初始化状态
 * @param {function} enhancer 中间件
 */
function createStore(reducer, initialState, enhancer) {
    // 检查你的 state 和 enhance 参数有没有传反
    if (typeof initialState === 'function' && typeof enhancer === 'undefined') {
        enhancer = initialState
        initialState = undefined
    }
    // 如果有传入合法的enhance，则通过 enhancer 再调用一次 createStore
    if (typeof enhancer !== 'undefined'){
        if (typeof enhancer !== 'function'){
            throw new Error('enhancer 应该是一个function')
        }
        return enhancer(createStore)(reducer, initialState)
    }
    // 检测reducer
    if (typeof reducer !== 'function'){
        throw new Error('reducer 应该是一个function')
    }
    // 确保listeners 全部调用

    let currentReducer = reducer
    let currentState = initialState
    let currentListeners = []
    let nextListeners = currentListeners
    let isDispatching =  false

    function ensureCanMutateNextListeners(){
        if (nextListeners === currentListeners){ // 确认nextListeners 是独立的副本
            nextListeners = currentListeners.slice()
        }
    }

    function getState(){
        return this.currentState
    }

    function subscribe(listener){
        if (typeof listener !== 'function') {
            throw new Error('listener 应该是一个函数')
        }
        let isSubscribe = true
        ensureCanMutateNextListeners() // 确保不再currentListeners 上进行操作
        nextListeners.push(listener)

        return function unSubscribe (){
            if (!isSubscribe) return 
            isSubscribe = false
            ensureCanMutateNextListeners()
            let i = nextListeners.indexOf(listener)
            nextListeners.splice(i, 1)
        }
    }

    function dispatch(action){
        if (!isPlainObject(action)) {
            throw new Error('action 应该是一个对象字面量')
        }
        if (typeof action.type === 'undefined'){
            throw new Error('action 不合法 缺少type字段')
        }
        if (isDispatching) throw new Error('一次只能dispatch 一个action')
        try {
            console.log('actionType: ' + action.type)
            isDispatching =  true
            currentState = currentReducer(currentState, action)
        } finally {
            isDispatching = false
        }
        let listeners = currentListeners = nextListeners
        for (let i = 0; i < listeners.length; ++i){ // 每次dispatch 一次调用所有的listener
            currentListeners[i]()
        }
        return action
    }

    function replaceReducer(nextReducer){
        if (typeof nextReducer !== 'function'){
            throw new Error('nextReducer 应该是一个function')
        }
        currentReducer = nextReducer
        dispatch({type: ActionTypes.INIT})
    }
    
    // 初始化时调用
    // 初始化 store 的 state
    dispatch({type: ActionTypes.INIT})
    
    return {
        getState,
        dispatch,
        subscribe,
        replaceReducer
    }
}

export default createStore


