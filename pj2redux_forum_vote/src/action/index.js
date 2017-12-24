export const ADD_ALL_POST = 'ADD_ALL_POST'
export const ADD_POST = 'ADD_POST'
export const UPDATE_POST = 'UPDATE_POST'
export const DELETE_POST = 'DELETE_POST'
export const ADD_ALL_COMMENT = 'ADD_ALL_COMMENT'
export const ADD_COMMENT = 'ADD_COMMENT'
export const UPDATE_COMMENT = 'UPDATE_COMMENT'
export const DELETE_COMMENT = 'DELETE_COMMENT'

export function addAllPosts ({posts}){
    return {
        type: ADD_ALL_POST,
        posts,
    }
}

export function addPost ({id, post, title, body, author, category}){
    return {
        type: ADD_POST,
        id,
        post,
        title,
        body,
        author,
        category,
        
    }
}

export function updatePost ({ id, title, body }){
    return {
        type: UPDATE_POST,
        id,
        title,
        body,
    }
}

export function deletePost ({ id }){
    return {
        type: DELETE_POST,
        id,
    }
}

export function addAllComments ({ comments}){
    return {
        type: ADD_ALL_COMMENT,
        comments,
        
        
    }
}

export function addComment ({comment}){
    return {
        type: ADD_COMMENT,
        comment
        
    }
}

export function updateComment ({id, body }){
    return {
        type: UPDATE_COMMENT,
        id,
        body
    }
}

export function deleteComment ({ id }){
    return {
        type: DELETE_COMMENT,
        id,
    }
}