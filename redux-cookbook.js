//all useful code here
////////////import reference/////////////////////
import React, { Component } from 'react';
import logo from '../logo.svg';
import '../App.css';
import { addRecipe, removeFromCalendar } from '../actions';
import { connect } from 'react-redux';
import { capitalize } from '../utils/helpers'
import CalendarIcon from 'react-icons/lib/fa/calendar-plus-o'
import ArrowRightIcon from 'react-icons/lib/fa/arrow-circle-right'
import Modal from 'react-modal'
import Loading from 'react-loading'
import { fetchRecipes } from '../utils/api'
import FoodList from './FoodList'
import ShoppingList from './ShoppingList'
////////////////////////////////////////////////

/////////////use env key////////////////
const API_ID = process.env.REACT_APP_API_ID
const APP_KEY = process.env.REACT_APP_APP_KEY

/////////////////////////////////////////


//////////////////fetch api///////////////////////
//step 0: prepare for authorization

const api = "localhost:3000"


// Generate a unique token for storing your bookshelf data on the backend server.
let token = localStorage.token
if (!token)
  token = localStorage.token = Math.random().toString(36).substr(-8)

const headers = {
  'Accept': 'application/json',
  'Authorization': token
}

export const get = (bookId) =>
  fetch(`${api}/books/${bookId}`, { headers })
    .then(res => res.json())
    .then(data => data.book)

//step 1: prepare fetch api function
export function fetchRecipes (food = '') {
  food = food.trim()

  return fetch(`https://api.edamam.com/search?q=${food}&app_id=${API_ID}&app_key=${APP_KEY}`)
    .then((res) => res.json())
    .then(({ hits }) => hits.map(({ recipe }) => recipe))
}

//step 2: prepare for form function to call api
searchFood = (e) => {
    if (!this.input.value) {
        return
    }
    //needed for submit form
    e.preventDefault()
    this.setState(() => ({ loadingFood: true }))

    fetchRecipes(this.input.value)
        .then((food) => this.setState(() => ({
            food,
            loadingFood: false,
        })))
}
//button
onClick={this.searchFood}>
/////////////////////////////////////////////////////////////

////////////////about modal///////////////////////////////
import Modal from 'react-modal'

openFoodModal = ({ meal, day }) => {
    this.setState(() => ({
        foodModalOpen: true,
        meal,
        day,
    }))
}
closeFoodModal = () => {
    this.setState(() => ({
        foodModalOpen: false,
        meal: null,
        day: null,
        food: null,
    }))
}

openIngredientsModal = () => this.setState(() => ({ ingredientsModalOpen: true }))
closeIngredientsModal = () => this.setState(() => ({ ingredientsModalOpen: false }))

render() {
    const { foodModalOpen, loadingFood, food, ingredientsModalOpen } = this.state

onClick={this.openIngredientsModal}>

<Modal
className='modal'
overlayClassName='overlay'
isOpen={foodModalOpen}
onRequestClose={this.closeFoodModal}
contentLabel='Modal'
>
<div>
    {loadingFood === true
        ? <Loading delay={200} type='spin' color='#222' className='loading' />
        : <div className='search-container'>
            <h3 className='subheader'>
                Find a meal for {capitalize(this.state.day)} {this.state.meal}.
            </h3>
            <div className='search'>
                <input
                    className='food-input'
                    type='text'
                    placeholder='Search Foods'
                    ref={(input) => this.input = input}
                />
                <button
                    className='icon-btn'
                    onClick={this.searchFood}>
                    <ArrowRightIcon size={30} />
                </button>
            </div>
            {food !== null && (
                <FoodList
                    food={food}
                    onSelect={(recipe) => {
                        selectRecipe({ recipe, day: this.state.day, meal: this.state.meal })
                        this.closeFoodModal()
                    }}
                />)}
        </div>}
</div>
</Modal>

<Modal
className='modal'
overlayClassName='overlay'
isOpen={ingredientsModalOpen}
onRequestClose={this.closeIngredientsModal}
contentLabel='Modal'
>
{ingredientsModalOpen && <ShoppingList list={this.generateShoppingList()} />}
</Modal>

////////////////////////////////////////////////////////////////////////

/////////////////////load spinner///////////////////////////////////
///////load spinner or load the ready page
{loadingFood === true
    ? <Loading delay={200} type='spin' color='#222' className='loading' />
    : <div className='search-container'></div>
}

/////////////////////////////////////////////////////////////////////


///////////////////connect()////////////////////////////////////

function mapStateToProps({ food, calendar }) {
    const dayOrder = [
        'sunday']

    return {
        calendar: dayOrder.map((day) => ({
            day,
            meals: Object.keys(calendar[day]).reduce((meals, meal) => {
                meals[meal] = calendar[day][meal]
                    ? food[calendar[day][meal]]
                    : null

                return meals
            }, {})
        })),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        selectRecipe: (data) => dispatch(addRecipe(data)),
        remove: (data) => dispatch(removeFromCalendar(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

/////////////////////////////////////////////////////////////

////////////////nav bar with modal button////////////////////
//in render()
<div className='nav'>
<h1 className='header'>UdaciMeals</h1>
<button
    className='shopping-list'
    onClick={this.openIngredientsModal}>
    Shopping List
</button>
</div>
//////////////////////////////////////////////////////

//////////////loading list of const header//////////////////////
//in render()
const mealOrder = ['breakfast', 'lunch', 'dinner']

<ul className='meal-types'>
{mealOrder.map((mealType) => (
    <li key={mealType} className='subheader'>
        {capitalize(mealType)}
    </li>
))}
</ul>


///////////////////////////////////////////////////////////////////

/////////////redux action/////////////////////
export const ADD_RECIPE = 'ADD_RECIPE'
export const REMOVE_FROM_CALENDAR = 'REMOVE_FROM_CALENDAR'

export function addRecipe ({ day, recipe, meal }) {
    return {
        type: ADD_RECIPE,
        recipe,
        day,
        meal,
    }
}

export function removeFromCalendar ({ day, meal }) {
    return {
        type: REMOVE_FROM_CALENDAR,
        day,
        meal,
    }
}
////////////////////////////////////////////////////////////////

///////////redux reducer///////////////////////////////////////
import {ADD_RECIPE, REMOVE_FROM_CALENDAR} from '../actions'
import { combineReducers } from 'redux'

//Added in Lesson 4 combine Reducers (add one more sub-reducer)
function food (state = {}, action) {
    switch (action.type) {
      case ADD_RECIPE :
        const { recipe } = action
  
        return {
          ...state,
          [recipe.label]: recipe,
        }
      default :
        return state
    }
  }

const initialCalendarState = {
    sunday: {
      breakfast: null,
      lunch: null,
      dinner: null,
    },
    monday: {
      breakfast: null,
      lunch: null,
      dinner: null,
    },
    tuesday: {
      breakfast: null,
      lunch: null,
      dinner: null,
    },
    wednesday: {
      breakfast: null,
      lunch: null,
      dinner: null,
    },
    thursday: {
      breakfast: null,
      lunch: null,
      dinner: null,
    },
    friday: {
      breakfast: null,
      lunch: null,
      dinner: null,
    },
    saturday: {
      breakfast: null,
      lunch: null,
      dinner: null,
    },
}

function calendar (state = initialCalendarState, action) {
    const { day, recipe, meal } = action
    switch (action.type) {
      case ADD_RECIPE :
        return {
          ...state,
          [day]: {
            ...state[day],
            [meal]: recipe.label,
          }
        }
      case REMOVE_FROM_CALENDAR :
        return {
          ...state,
          [day]: {
            ...state[day],
            [meal]: null,
          }
        }
      default :
        return state
    }
}

export default combineReducers({food, calendar});

//////////////////////////////////////////////////////////////////////

///////index.js////////////////
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import { createStore } from 'redux';    //add for redux  Lesson 2
import reducer from './reducer';        //add for redux  Lesson 2
import { Provider } from 'react-redux'  //add for react-redux Lesson 3

let store = createStore(
    reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );

// console.log(store);

// console.log(store.getState())

ReactDOM.render(<Provider store={ store } ><App/></Provider>, document.getElementById('root'));
registerServiceWorker();
/////////////////////////////////////////////////////////