const link = "http://localhost:3001";

let token = localStorage.token
if (!token)
    token = localStorage.token = Math.random().toString(36).substr(-8)

const headers = {
    'Content-Type': 'application/json',
    'Authorization': token
}

//API: `GET /categories`
export const getAllCategories = () => fetch(`${link}/categories`, { headers })
    .then(response => { return response.json() })
    .then(data => { return data.categories })
    .catch(err => console.log(err))

//API: `GET /:category/posts`
export const getCategoryPosts = (category) => fetch(`${link}/${category}/posts`, { headers })
    .then(response => { return response.json() })
    .then(data => { return data })
    .catch(err => console.log(err))

//API: `GET /posts`
export const getAllPosts = () => fetch(`${link}/posts`, { headers })
    .then(response => { return response.json() })
    .then(data => { return data })
    .catch(err => console.log(err))

//API: `POST /posts`
export const addPost = (id, title, body, author, category) =>
    fetch(`${link}/posts`, {
        headers,
        method: 'POST',
        body: JSON.stringify({
            'id': id,
            'timestamp': Date.now(),
            'title': title,
            'body': body,
            'author': author,
            'category': category,
        })
    })
        .then(response => { return response.json() })
        .then(data => { return data })
        .catch(err => console.log(err))



//API: `GET /posts/:id`
export const getPostByID = (id) => fetch(`${link}/posts/${id}`, { headers })
    .then(response => { return response.json() })
    .then(data => { return data })
    .catch(err => console.log(err))

//API: `POST /posts/:id` (for voting) value `"upVote"` or `"downVote"`
export const postVoteByID = (id, vote) => fetch(`${link}/posts/${id}`, {
    headers,
    method: 'POST',
    body: JSON.stringify({ "option": vote })
})
    .then(response => { return response.json() })
    .then(data => { return data })
    .catch(err => console.log(err))


//API: `PUT /posts/:id`
export const updatePostById = (id, title, body) =>
    fetch(`${link}/posts/${id}`, {
        headers,
        method: 'PUT',
        body: JSON.stringify({
            'title': title,
            'body': body,
        })
    })
        .then(response => { return response.json() })
        .then(data => { return data })
        .catch(err => console.log(err))

//API: DELETE /posts/:id`
export const deletePostById = (post_id) => fetch(`${link}/posts/${post_id}`, {
    headers,
    method: 'DELETE',
})
    .then(response => { return response.json() })
    .then(data => { return data })
    .catch(err => console.log(err))


//API: `GET /posts/:id/comments`
export const getCommentsByPostId = (post_id) => fetch(`${link}/posts/${post_id}/comments`, { headers })
    .then(response => { return response.json() })
    .then(data => { return data })
    .catch(err => console.log(err))


//API: `POST /comments`
export const addComments = (id, body, author, post_id) =>
    fetch(`${link}/comments`, {
        headers,
        method: 'POST',
        body: JSON.stringify({
            'id': id,
            'timestamp': Date.now(),
            'body': body,
            'author': author,
            'parentId': post_id,
        })
    })
        .then(response => { return response.json() })
        .then(data => { return data })
        .catch(err => console.log(err))


//API: `GET /comments/:id`
export const getCommentById = (cmt_id) => fetch(`${link}/comments/${cmt_id}`, { headers })
    .then(response => { return response.json() })
    .then(data => { return data })
    .catch(err => console.log(err))

//API: `POST /comments/:id`
export const commentVoteByID = (cmt_id, vote) => fetch(`${link}/comments/${cmt_id}`, {
    headers,
    method: 'POST',
    body: JSON.stringify({ "option": vote })
})
    .then(response => { return response.json() })
    .then(data => { return data })
    .catch(err => console.log(err))

//API: `PUT /comments/:id`
export const updateCommentById = (cmt_id, body) =>
    fetch(`${link}/comments/${cmt_id}`, {
        headers,
        method: 'PUT',
        body: JSON.stringify({
            'timestamp': Date.now(),
            'body': body
        })
    })
        .then(response => { return response.json() })
        .then(data => { return data })
        .catch(err => console.log(err))

//API: `DELETE /comments/:id`
export const deleteCommentById = (cmt_id) => fetch(`${link}/comments/${cmt_id}`, {
    headers,
    method: 'DELETE'
})
    .then(response => { return response.json() })
    .then(data => { return data })
    .catch(err => console.log(err))