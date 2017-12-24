import {ADD_ALL_POST, ADD_POST, UPDATE_POST, DELETE_POST,
    ADD_ALL_COMMENT,ADD_COMMENT,UPDATE_COMMENT,DELETE_COMMENT } from '../action'
import { combineReducers } from 'redux'

const initialPostState = {
    posts: [],
    post: {},
    id: null,
    title: null,
    body: null,
    author: null,
    category: null,

}

function post (state = initialPostState, action){
    const { id, title, body, posts, post, author, category } = action;   
    switch (action.type) {
        case ADD_ALL_POST:

            return {
                ...state,
                posts: posts,
                
            }
        case ADD_POST:
            
            return {
                ...state,
                posts: state.posts.concat(post),
                
            }
        case UPDATE_POST :
            const thisPost = state.posts.filter(p=>p.id === id)[0]
            thisPost.title = title
            thisPost.body = body
            return {
                ...state,
                thisPost
            }
        case DELETE_POST :
            return {
                
                posts: state.posts.filter(p=>p.id != id)
            }
        default :
            return state
    }
}

const intialCommentState = {
    comments : [],
    comment: {},
    id: null,
    body:null
}

function comment (state = intialCommentState, action) {
    const { comments, id, body, comment } = action;
    switch (action.type){
    case ADD_ALL_COMMENT:
        
        return {
            ...state,
            comments: comments
        }
    case ADD_COMMENT:
        return {
            ...state,
            comments: state.comments.concat(comment),
            
        }
    case UPDATE_COMMENT:
        const thisCmt = state.comments.filter(c=>c.id === id)[0]
        thisCmt.body = body
        return {
            ...state,
            thisCmt
        }
    case DELETE_COMMENT:
        return {
            
            comments: state.comments.filter(c=>c.id != id)
        }
    default :
        return state
    }
}

export default combineReducers({post, comment});
