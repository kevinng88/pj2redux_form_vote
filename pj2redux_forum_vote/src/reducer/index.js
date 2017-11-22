import {ADD_POST } from '../action'

const initialState = {
    posts: [],
    comments: [],
    

}

function post (state = initialState, action){
    switch (action.type) {
        case ADD_POST :
            const { title, body } = action;

            return {
                ...state,
                title: title,
                body: body,
            }
        default :
            return state
    }
}

export default post;