import {ADD_ALL_POST, ADD_POST, UPDATE_POST, DELETE_POST,
    ADD_ALL_COMMENT,ADD_COMMENT,UPDATE_COMMENT,DELETE_COMMENT } from '../action'
import { combineReducers } from 'redux'
//review: 1 added for react-router-redux
import { routerReducer } from 'react-router-redux'

const initialPostState = {
    posts: [],
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
    comments : []
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
       
        return {
            ...state,
            comments: state.comments.map(c=>
                c.id === id? {...c, body : body}: c
            )
        }
    case DELETE_COMMENT:
        return {
            
            comments: state.comments.filter(c=>c.id != id)
        }
    default :
        return state
    }
}

//review: 1 added for react-router-redux
export default combineReducers({post, comment, routing: routerReducer});
