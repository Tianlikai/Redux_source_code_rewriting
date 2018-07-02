(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(factory((global.Redux = {})));
}(this, (function (exports) { 'use strict';

/**
 * 
 * @param {*} func 
 * @return {最终返回一个函数，并且接收一个参数，最终形成一个管道}
 * [1,2,3,4,5,6,7]
 * 1(2(3(4(5(6(7(...args))))))) 从右到左一次执行并且将上一次结果当作结果传入
 */
function compose() {
  for (var _len = arguments.length, func = Array(_len), _key = 0; _key < _len; _key++) {
    func[_key] = arguments[_key];
  }

  // 为空 直接返回输入
  if (!func.length) ;
  // 返回第一个函数
  if (func.length === 1) return func[0];
  // 柯里·化 reduce
  return func.reduce(function (a, b) {
    return function () {
      return a(b.apply(undefined, arguments));
    };
  });
}

var randomString = function randomString() {
  return Math.random().toString(36).substring(7).split('').join('.');
};

var ActionTypes = {
  INIT: '@@redux/INIT' + randomString(),
  REPLACE: '@@redux/REPLACE' + randomString(),
  PROBE_UNKNOWN_ACTION: function PROBE_UNKNOWN_ACTION() {
    return '@@redux/PROBE_UNKNOWN_ACTION' + randomString();
  }
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/**
 * @param {any} obj The object to inspect.
 * @returns {boolean} True if the argument appears to be a plain object.
 */
function isPlainObject(obj) {
  if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object' || obj === null) return false;

  var proto = obj;
  while (Object.getPrototypeOf(proto) !== null) {
    // 应为typeof null === 'object' 为true 使用Object.getPrototypeOf() 函数排除
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(obj) === proto;
}

/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */
function warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
  /* eslint-enable no-console */
  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message);
  } catch (e) {} // eslint-disable-line no-empty
}

/**
 * assertReducerSanity函数主要是对 reducer 合法性进行验证。
 * 主要验证初始化返回的 state是否为 undefined 和传入未知 action 时是否默认返回原 state。
 * @param {*} reducers 
 */
function assertReducerSanity(reducers) {
    Object.keys(reducers).forEach(function (key) {
        var reducer = reducers[key];
        var initialState = reducer(undefined, { type: ActionTypes.INIT });
        if (typeof initialState === 'undefined') {
            // 验证初始化reducer类型
            throw new Error('reducer "' + key + '" \u521D\u59CB\u5316\u7C7B\u578B\uFF0C\u6CA1\u6709\u6307\u5B9A\u9ED8\u8BA4\u8FD4\u56DE\u53C2\u6570\uFF0C\u6240\u4EE5\u8FD4\u56DE\u503C\u4E3Aundefined reducer \u4E0D\u5141\u8BB8\u4E0D\u6307\u5B9A\u9ED8\u8BA4\u53C2\u6570');
        }
        if (typeof reducer(undefined, { type: ActionTypes.PROBE_UNKNOWN_ACTION }) === 'undefined') {
            // 验证未定义的reducer类型
            throw new Error('reducer "' + key + '": \u5BF9\u4E8E\u672A\u547D\u540D\u7684reducer\u5904\u7406 \u5E94\u8BE5\u8FD4\u56DE\u9ED8\u8BA4\u53C2\u6570\uFF0C\u7531\u4E8E\u6CA1\u6709\u6307\u5B9A\u9ED8\u8BA4\u53C2\u6570\uFF0C\u6240\u4EE5\u8FD4\u56DE\u503Cundefined reducer \u4E0D\u5141\u8BB8\u4E0D\u6307\u5B9A\u9ED8\u8BA4\u53C2\u6570');
        }
    });
}

/**
 * getUndefinedStateErrorMessage函数主要作用将用于提示
 * 当返回的 state 为 undefined 的时候
 * 将调用该函数给开发者错误提示。
 * @param {*} key 
 * @param {*} action 
 */
function getUndefinedStateErrorMessage(key, action) {
    var actionType = action && action.type;
    var actionDescription = actionType && 'action "' + String(actionType) + '"' || '一个 action';

    return '\u7531\u4E8Eaction ' + actionDescription + ' \u7684"' + key + '"reducer. \u8FD4\u56DEundefined. \u6240\u6709\u629B\u51FA\u8BE5\u8B66\u544A' + 'reducer\u6267\u884C\u5982\u679C\u6CA1\u6709\u66F4\u6539 state \u5FC5\u987B\u8FD4\u56DE\u4F20\u5165\u7684\u4E0A\u4E00\u4E2Astate.' + '\u5982\u679C\u4F60\u60F3\u5FFD\u7565\u8BE5reducer. \u8BF7\u8FD4\u56DE null \u66FF\u4EE3 undefined';
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
function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
    var reducerKeys = Object.keys(reducers);
    if (!reducerKeys.length) {
        return 'store 不存在任何reducer，';
    }
    if (!isPlainObject(inputState)) {
        return '传入的state 应该是一个普通对象类型';
    }
    // 错误位置提示
}

function combineReducer(reducers) {
    //类型检测 筛选出有效的reducer
    // 获取最终有效的reducer
    var reducerKeys = Object.keys(reducers);
    var finallyReducer = {};
    for (var i = 0; i < reducerKeys.length; ++i) {
        var key = reducerKeys[i];
        if (typeof reducers[key] === 'function') finallyReducer[key] = reducers[key];
    }

    // reducer合法性检测
    var sanityError = void 0;
    try {
        assertReducerSanity(finallyReducer);
    } catch (error) {
        sanityError = error;
    }

    return function combineReducer() {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var action = arguments[1];

        var copy = Object.assign({}, state);
        if (sanityError) {
            throw sanityError;
        }

        {
            var warningMessage = getUnexpectedStateShapeWarningMessage(state, finallyReducer, action
            //   unexpectedKeyCache
            );
            if (warningMessage) {
                warning(warningMessage);
            }
        }

        var nextState = {};
        var hasChanged = false;
        var finallyReducerKeys = Object.keys(finallyReducer);
        for (var _i = 0; _i < finallyReducerKeys.length; ++_i) {
            var _key = finallyReducerKeys[_i];
            var reducer = finallyReducer[_key];
            var previousStateForKey = state[_key];
            var nextStateForKey = reducer(previousStateForKey, action);
            console.log(_key + '-pre: ' + previousStateForKey);
            console.log(_key + '-next: ' + nextStateForKey);
            if (typeof nextStateForKey === 'undefined') {
                // 提示错误警告
                var errorMessage = getUndefinedStateErrorMessage(_key, action);
                throw new Error(errorMessage);
            }
            nextState[_key] = nextStateForKey;
            hasChanged = hasChanged || previousStateForKey !== nextStateForKey;
        }
        console.log('finally state:');
        console.log(nextState);
        console.log('------------------');
        console.log('\n');
        return hasChanged ? nextState : state;
    };
}

var ActionTypes$1 = {
    INIT: '@@redux/INIT'

    /**
     * createStore 
     * @param {function} reducer 传入store的 rootReducers 每次执行会遍历所有的reducer
     * @param {object} initialState 初始化状态
     * @param {function} enhancer 中间件
     */
};function createStore(reducer, initialState, enhancer) {
    var _ref;

    // 检查你的 state 和 enhance 参数有没有传反
    if (typeof initialState === 'function' && typeof enhancer === 'undefined') {
        enhancer = initialState;
        initialState = undefined;
    }
    // 如果有传入合法的enhance，则通过 enhancer 再调用一次 createStore
    if (typeof enhancer !== 'undefined') {
        if (typeof enhancer !== 'function') {
            throw new Error('enhancer 应该是一个function');
        }
        return enhancer(createStore)(reducer, initialState);
    }
    // 检测reducer
    if (typeof reducer !== 'function') {
        throw new Error('reducer 应该是一个function');
    }
    // 确保listeners 全部调用

    var currentReducer = reducer;
    var currentState = initialState;
    var currentListeners = [];
    var nextListeners = currentListeners;
    var isDispatching = false;

    function ensureCanMutateNextListeners() {
        if (nextListeners === currentListeners) {
            // 确认nextListeners 是独立的副本
            nextListeners = currentListeners.slice();
        }
    }

    function getState() {
        return this.currentState;
    }

    function subscribe(listener) {
        if (typeof listener !== 'function') {
            throw new Error('listener 应该是一个函数');
        }
        var isSubscribe = true;
        ensureCanMutateNextListeners(); // 确保不再currentListeners 上进行操作
        nextListeners.push(listener);

        return function unSubscribe() {
            if (!isSubscribe) return;
            isSubscribe = false;
            ensureCanMutateNextListeners();
            var i = nextListeners.indexOf(listener);
            nextListeners.splice(i, 1);
        };
    }

    function dispatch(action) {
        if (!isPlainObject(action)) {
            throw new Error('action 应该是一个对象字面量');
        }
        if (typeof action.type === 'undefined') {
            throw new Error('action 不合法 缺少type字段');
        }
        if (isDispatching) throw new Error('一次只能dispatch 一个action');
        try {
            console.log('actionType: ' + action.type);
            isDispatching = true;
            currentState = currentReducer(currentState, action);
        } finally {
            isDispatching = false;
        }
        var listeners = currentListeners = nextListeners;
        for (var i = 0; i < listeners.length; ++i) {
            // 每次dispatch 一次调用所有的listener
            currentListeners[i]();
        }
        return action;
    }

    function replaceReducer(nextReducer) {
        if (typeof nextReducer !== 'function') {
            throw new Error('nextReducer 应该是一个function');
        }
        currentReducer = nextReducer;
        dispatch({ type: ActionTypes$1.INIT });
    }

    // 初始化时调用
    // 初始化 store 的 state
    dispatch({ type: ActionTypes$1.INIT });

    return _ref = {
        getState: getState,
        dispatch: dispatch,
        subscribe: subscribe
    }, _ref['dispatch'] = dispatch, _ref.replaceReducer = replaceReducer, _ref;
}

/**
 * applyMiddleware
 * @param {*} middlewares 
 */
function applyMiddleware() {
    for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
        middlewares[_key] = arguments[_key];
    }

    return function (createStore) {
        return function (reducer, initialState, enhancer) {
            var store = createStore(reducer, initialState, enhancer);
            var _dispatch = void 0;
            var chain = [];
            var middlewareAPI = {
                getState: store.getState,
                dispatch: function dispatch(action) {
                    return _dispatch(action);
                }
            };

            chain = middlewares.map(function (middleware) {
                return middleware(middlewareAPI);
            });
            _dispatch = compose.apply(undefined, chain)(store.dispatch);

            return _extends({}, store, {
                dispatch: _dispatch
            });
        };
    };
}

/**
 * 绑定 action 和 dispatch
 * @param {func} actionCreator 
 * @param {func} dispatch 
 */
function bindActionCreator(actionCreator, dispatch) {
    return function () {
        return dispatch(actionCreator.apply(undefined, arguments));
    };
}

/**
 * 绑定 action 和 dispatch
 * 并且 以 key value 对象的形式返回
 * @param {func} actionCreators 
 * @param {func} dispatch 
 * @return {用于将dispatch方法传入子组件，并且不让子组件感知到redux的存在}
 */
function bindActionCreators(actionCreators, dispatch) {
    if (typeof actionCreators === 'function') {
        return bindActionCreator(actionCreators, dispatch);
    }

    if ((typeof actionCreators === 'undefined' ? 'undefined' : _typeof(actionCreators)) !== 'object' || typeof actionCreators === null) {
        throw new Error('bindActionCreators 期望接收到一个 function 或者 object 参数，不能为空或null');
    }

    var keys = Object.keys(actionCreators);
    var boundActionCreators = {};

    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var actionCreator = actionCreators[key];
        if (typeof actionCreator === 'function') {
            boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
        }
    }
    return boundActionCreators;
}

exports.compose = compose;
exports.combineReducer = combineReducer;
exports.createStore = createStore;
exports.applyMiddleware = applyMiddleware;
exports.bindActionCreators = bindActionCreators;

Object.defineProperty(exports, '__esModule', { value: true });

})));
