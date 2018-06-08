const {combineReducer} = require('../src')

let initialState = {
    a: 1,
    b: 2
}

function A (state = {}, action) {
    switch (action.type) {
        case 'a':{
            // console.log('a')
            return 'tianlikai'
            break
        }
        case 'b':{
            console.log('b')
            return state
            break
        }
        case 'init':{ // 首次添加  
            console.log('init')
            return initialState
            break
        }
        default: {
            return state
            break
        }
    }
}
function B (state = {}, action) {
    switch (action.type) {
        case 'c':{
            console.log('c')
            return state
            break
        }
        case 'd':{
            console.log('d')
            return state
            break
        }
        default: {
            return state
            break
        }
    }
}

let action = {
    type: 'a',
    text: 'im a '
}
let rf = combineReducer({
    a: A,
    b: B
})(initialState, action)