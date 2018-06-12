const compose = require('./compose')
const combineReducer = require('./combineReducer')
const createStore = require('./createStore')
const applyMiddleware = require('./applyMiddleware')
const bindActionCreators = require('./bindActionCreators')

module.exports = {
    compose,
    combineReducer,
    createStore,
    applyMiddleware,
    bindActionCreators
}