const link = "http://localhost:3001";

let token = localStorage.token
if (!token)
  token = localStorage.token = Math.random().toString(36).substr(-8)

const headers = {
  'Accept': 'application/json',
  'Authorization': token
}

//API: to get all categories
export const getAllcategories = () => fetch(`${link}/categories`, {headers})
    .then(response => {return response.json()})
    .then(data =>{return data.categories})
    .catch(err => console.log(err))