import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { connect } from 'react-redux';
import { addPost } from '../action'

class App extends Component {
  
  render() {

    const { addingPost } = this.props;

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <input type='text' placeholder='title' ref={(input) => this.titleinput = input}/>
        <input type='text' placeholder='body' ref={(input) => this.bodyinput = input}/>
        <button onClick={()=>{addingPost({
          title: this.titleinput.value, 
          body: this.bodyinput.value,
          })}}>add data to store</button>
      </div>
    );
  }
}

// store.dispatch(addPost({
//   title: "first redux",
//   body: "I am happy that the first store is made!"
// }))


function mapDispatchToProps(dispatch){
  return {
    addingPost: (data) => dispatch(addPost(data))

  }
}

export default connect(null, mapDispatchToProps)(App);
