import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { connect } from 'react-redux';
import {
  addAllPosts, addPost, updatePost, deletePost, addAllComments, addComment,
  updateComment, deleteComment
} from '../action'
import * as api from '../util/api'
import { LoadCatagory, LoadAllPost, LoadCategoryPost } from '../util/loadListData'
import Modal from 'react-modal'
import sortBy from '../util/sort-by'
import Post from '../post/post'
import Loading from 'react-loading'
import FaSortAmountDesc from 'react-icons/lib/fa/sort-amount-desc'
import FaCheckSquareO from 'react-icons/lib/fa/check-square-o'
import FaClockO from 'react-icons/lib/fa/clock-o'

class App extends Component {

  state = { 
    categories: null, 
    posts: null, 
    comments: null, 
    response: "", 
    addPostModalOpen: false, //for testing. show results from API
    clickedCat: null, 
    togglePostPage: false, 
    postToOpen: null }

  
  componentDidMount() {
    //When program start, we get all the categories and post thu API first.
    //Post data will store in Redux store.

    ////getAllCategories////
    api.getAllCategories().then(data => {
      this.setState({ categories: data })
    })

    /////getAllPost/////
    // api.getAllPosts().then(
    //      data => {
    //      this.setState({ posts: data })
    //      this.addRedux();
    //     })
    this.updateAllPost()

  }

  updateAllPost = () => {
    api.getAllPosts().then(
      data => {
        this.setState({ posts: data })
        this.addRedux();
      })

  }


  addAPost = () => {
    //simple way to generate random key for post id
    const id = Math.random().toString(36).slice(2)

    api.addPost(id, this.postTitleInput.value, this.postBodyInput.value, this.postAuthorInput.value, this.postCatSelect.value)
      .then(
      data => {
        this.setState({ response: JSON.stringify(data) });
        api.getAllPosts().then(
          data => this.setState({ posts: data }))
      }
      )
  }

  changePostVote(postId, selection) {

    api.postVoteByID(postId, selection).
      then(data => {
        this.setState({ response: JSON.stringify(data) })
        this.updateAllPost()
      })

  }


  //functions to run action for redux store

  addRedux() {

    this.props._addAllPosts({ posts: this.state.posts })
  }

  deleteReduxPost() {
    this.props._deletePost({ id: this.state.posts[3].id })
  }


  //sorting method for posts

  sortPostbyVote = (way) => {
    //can either order by vote or by timestamp
    if (this.state.posts !== null) {
      let showPost = this.state.posts
      way === 'vote' ? showPost.sort(sortBy('-voteScore')) : null;
      way === 'time' ? showPost.sort(sortBy('-timestamp')) : null;
      this.setState({ posts: showPost })
    }
  }


  //switches

  openAddPostModal = () => this.setState(() => ({ addPostModalOpen: true }))
  closeAddPostModal = () => this.setState(() => ({ addPostModalOpen: false }))

  changeClickedCat(category) {
    this.setState({ clickedCat: category })
  }

  switchToPostPage(selectedPost) {
    this.setState({
      togglePostPage: true,
      postToOpen: selectedPost
    })
  }

  switchToMainPage() {
    //have to call api again for case of post is deleted
    this.setState({
      togglePostPage: false
    })
    this.updateAllPost()
  }

  render() {


    const { _addPost, _updatePost } = this.props;
    const { categories, addPostModalOpen, posts, comments, clickedCat, togglePostPage, postToOpen } = this.state;

    return (

      <div>
        {togglePostPage === true
          ? <Post singlePost={postToOpen} toggle={() => this.switchToMainPage()}></Post>
          : <div className="App">
              <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h1 className="App-title">Kev Overflow</h1>
                <p className="App-intro">
                {/* To get started {this.state.response} */}
                </p>
              </header>
              
              <div className="App-add-post">
                <button onClick={this.openAddPostModal}>show Add post modal</button>
              </div>
            {/* have map function   */}
            {/* {<p>{this.state.posts?this.state.posts.map(i=>(<li key={i['author']}>id: {i.id} title: {i.title} vote: {i.voteScore}</li>)):'not yet fetch...'}</p>} */}
            

            {/*-------------------------------- page 1 functions------------------------- */}

            {/* P1: loading the catagories and all the posts */}
            {categories !== null ? (
              <LoadCatagory
                className="App-catagory"
                catagory={categories}
                onSelect={(selectedCat) => {
                  //load P2 filered post 
                  this.changeClickedCat(selectedCat);
                }} />): <Loading delay={200} type='spinningBubbles' color='#222' className='loading' />}
            
            {/* button of sort post by votes and time (sort the posts state) */}
            <div>
              <p className="App-sort"><FaSortAmountDesc size={30}/>
                <span onClick={this.sortPostbyVote.bind(this, 'vote')}>Sort by vote<FaCheckSquareO size={25}/></span>
                <span onClick={this.sortPostbyVote.bind(this, 'time')}>Sort by time<FaClockO size={25}/></span>
              </p>
               {/*-------------------------------- right-side functions------------------------- */}
               {/* {if category is selected. right side will show category post. Otherwise, it will show all lastest post} */}
              {clickedCat ?
              /* show filter post by catagories */
              <LoadCategoryPost
                selectedCat={clickedCat}
                post={posts}
                onSelect={(selectedPost) => {
                  //load P3
                  this.switchToPostPage(selectedPost)
                }}
                onVoteSelect={(selectedPost, vote) => {
                  this.changePostVote(selectedPost, vote)
                }}
              /> : 
              <div>{this.state.posts !== null && (
                // show all post if categories not clicked. Also the first loading posts
                <LoadAllPost 
                  post={posts}
                  onSelect={(selectedPost)=>{
                    //load P3
                    this.switchToPostPage(selectedPost)
                  }}
                  onVoteSelect={(selectedPost, vote)=>{
                    this.changePostVote(selectedPost, vote)   
                  }}          
                />)}
              </div>
              }
            </div>
            <Modal
              //this is the modal of add a new post
              className='modal'
              overlayClassName='overlay'
              isOpen={addPostModalOpen}
              onRequestClose={this.closeAddPostModal}
              contentLabel='Post Modal'
            >
              <h2>Add new Post here </h2>
              <input type='text' placeholder='title' ref={(input) => this.postTitleInput = input} />
              {/* <input type='text' placeholder='title' value ={this.props.postTitle}/> */}
              <input type='text' placeholder='body' ref={(input) => this.postBodyInput = input} />
              <input type='text' placeholder='author' ref={(input) => this.postAuthorInput = input} />
              <select name='categoryinput' ref={(input) => this.postCatSelect = input}>
                {(categories && categories.map(cat => (
                  <option value={cat.name}>{cat.name}</option>
                )))}
              </select>

              <button onClick={() => {
                this.addAPost()
                this.closeAddPostModal
              }}>add Post</button>
              <button onClick={this.closeAddPostModal}>cancel</button>
            </Modal>
          </div>}
      </div>
    );
  }


}


function mapStateToProps(state) {
  return state;
}


function mapDispatchToProps(dispatch) {
  return {
    _addAllPosts: (data) => dispatch(addAllPosts(data)),
    _addPost: (data) => dispatch(addPost(data)),
    _updatePost: (data) => dispatch(updatePost(data)),
    _deletePost: (data) => dispatch(deletePost(data)),
    _addAllComments: (data) => dispatch(addAllComments(data)),
    _addComment: (data) => dispatch(addComment(data)),
    _updateComment: (data) => dispatch(updateComment(data)),
    _deleteComment: (data) => dispatch(deleteComment(data)),

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
