const link = "http://localhost:3001";

let token = localStorage.token
if (!token)
  token = localStorage.token = Math.random().toString(36).substr(-8)

const headers = {
  'Accept': 'application/json',
  'Authorization': token
}

//API: to get all categories
export const getAllCategories = () => fetch(`${link}/categories`, {headers})
    .then(response => {return response.json()})
    .then(data =>{return data.categories})
    .catch(err => console.log(err))

export const getCategoryPosts = (category) => fetch(`${link}/${category}/posts`, {headers})
    .then(response => {return response.json()})
    .then(data =>{return data})
    .catch(err => console.log(err))

export const getAllPosts = () => fetch(`${link}/posts`, {headers})
    .then(response => {return response.json()})
    .then(data =>{return data})
    .catch(err => console.log(err))


