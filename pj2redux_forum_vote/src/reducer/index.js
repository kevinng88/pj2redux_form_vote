import {ADD_POST } from '../action'

function post (state = {}, action){
    switch (action.type) {
        case ADD_POST :
            const { title, body } = action;

            return {
                ...state,
                [title]: title,
                title: title,
                body: body,
            }
        default :
            return state
    }
}

export default post;