const {createStore, combineReducer} = require('../src')

let initialState = {
    ab: 'state ab ',
    cd: 'state cd '
}

function reducerAB (state={}, action){
    switch(action.type){
        case 'a': 
        {
            let copy = state
            copy += ' over reducer with a '
            return copy
        }
        case 'b': 
        {
            let copy = state
            copy += ' over reducer with b '
            return copy
        }
        default: return state
    }
}
function reducerCD (state={}, action){
    switch(action.type){
        case 'c': 
        {
            let copy = state
            copy += ' over reducer with c '
            return copy
        }
        case 'd': 
        {
            let copy = state
            copy += ' over reducer with d '
            return copy
        }
        default: return state
    }
}

let rootReducer = combineReducer({
    ab: reducerAB,
    cd: reducerCD
})
let store = createStore(rootReducer, initialState)

function listener1 () {
    console.log('\n')
    console.log('订阅函数调用：listener1')
    console.log('\n')
}
function listener2 () {
    console.log('\n')
    console.log('订阅函数调用：listener2')
    console.log('\n')
}
function listener3 () {
    console.log('\n')
    console.log('订阅函数调用：listener3')
    console.log('\n')
}

let l1 = store.subscribe(listener1)
let l2 = store.subscribe(listener2)
let l3 = store.subscribe(listener3)

store.dispatch({type: 'a'})
l1()
store.dispatch({type: 'b'})
store.dispatch({type: 'c'})
store.dispatch({type: 'd'})

function reducerRP (state={}, action){
    switch(action.type){
        case 'E': 
        {
            let copy = state
            copy += ' over reducer with E '
            return copy
        }
        case 'F': 
        {
            let copy = state
            copy += ' over reducer with F '
            return copy
        }
        default: return state
    }
}
store.replaceReducer(reducerRP)
