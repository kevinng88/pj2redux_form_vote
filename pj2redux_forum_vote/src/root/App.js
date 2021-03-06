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
//review: 1 added for react-router-redux
import { push } from 'react-router-redux'
import { Route, Link, Redirect } from 'react-router-dom'


//review: 1 take out from App and create functional component for reuse
const Header = () => (
  <header>
    <Link to="/">
          <button>home</button>               
    </Link>
    <img src={logo} className="App-logo" alt="logo" />
    <h1 className="App-title">Kev Overflow</h1>
    
    <p className="App-intro">
      
      {/* To get started {this.state.response} */}
    </p>
  </header>
)

//review: 1 take out from App and create functional component for reuse
const Container = (data) => {
  const { categories, changeClickedCat, openAddPostModal } = data

  return (
    <div>
      <div className="App-add-post">
        <button onClick={openAddPostModal}>show Add post modal</button>
      </div>

      {categories !== null ? (
        <LoadCatagory
          className="App-catagory"
          catagory={categories}
          onSelect={(selectedCat) => {
            //load P2 filered post 
            changeClickedCat(selectedCat);
          }} />) : <Loading delay={200} type='spinningBubbles' color='#222' className='loading' />}


    </div>
  )
}

//review: 1 take out from App and create functional component for reuse
const SortPost = (data) => {
  const { sortPostbyVote } = data

  return (
    <div>
      {/* button of sort post by votes and time (sort the posts state) */}
      <p className="App-sort"><FaSortAmountDesc size={30} />
        <span onClick={sortPostbyVote.bind(this, 'vote')}>Sort by vote<FaCheckSquareO size={25} /></span>
        <span onClick={sortPostbyVote.bind(this, 'time')}>Sort by time<FaClockO size={25} /></span>
      </p>
    </div>
  )
}



class App extends Component {

  state = {
    categories: null,
    posts: null,
    comments: null,
    response: "",
    addPostModalOpen: false, 
    editPostModalOpen: false,
    clickedCat: null,
    togglePostPage: false,
    postToOpen: null
  }


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

  //edit/delete post method
  //functions of post

  editPost() {
    
     api.updatePostById(this.state.postToOpen.id,this.postTitleInput.value, this.postBodyInput.value).then(
         data=>{ this.setState({response: JSON.stringify(data)});
             this.updateAllPost()
             this.closeEditPostModal
         })
 }

 delPost() {
       
     api.deletePostById(this.state.postToOpen.id).then(
           data=>{ this.setState({response: JSON.stringify(data)});            
             this.updateAllPost()
             this.closeEditPostModal

           })
 }


  //switches

  openAddPostModal = () => this.setState(() => ({ addPostModalOpen: true }))
  closeAddPostModal = () => this.setState(() => ({ addPostModalOpen: false }))
  openEditPostModal = (selectedPost) => this.setState(() => ({ editPostModalOpen: true, postToOpen: selectedPost }))
  closeEditPostModal = () => this.setState(() => ({ editPostModalOpen: false }))

  changeClickedCat(category) {
    //this.setState({ clickedCat: category })
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
    const { categories, addPostModalOpen, posts, comments, clickedCat, togglePostPage, postToOpen, editPostModalOpen } = this.state;

    return (

      <div>

        {/* have map function   */}
        {/* {<p>{this.state.posts?this.state.posts.map(i=>(<li key={i['author']}>id: {i.id} title: {i.title} vote: {i.voteScore}</li>)):'not yet fetch...'}</p>} */}


        <Route exact path='/:comment/:id' render={( { match } ) => (
          // review 3.3 check whether the path exist before route
          // rewiew 4.2 fix the problem of always redirect even post exist
          <div>
            {/* {posts && console.log(posts.some(item=>{return item.id === match.params.id}))} */}
            {posts?
              posts.some(item=>{return item.id === match.params.id})
              ?<Post singlePost={match.params.id} toggle={() => this.switchToMainPage()}></Post>
              :<Redirect to='/'/>
            :null
            }
          </div>
        )} />
          

        <Route exact path='/:routeCat' render={({ match }) => (
          <div className="App">
            <div className="App-header">
              <Header />
            </div>
            <div className="App-left">
              <Container categories={categories} changeClickedCat={this.changeClickedCat} openAddPostModal={this.openAddPostModal} />
            </div>
            <div className="App-right">
              <SortPost sortPostbyVote={this.sortPostbyVote} />
              {/* {console.log(`route: ${match.params.routeCat}`)} */}

              <LoadCategoryPost
                // use path as optional route
                selectedCat={match.params.routeCat}
                post={posts}
                onSelect={(selectedPost) => {

                  this.switchToPostPage(selectedPost)
                }}
                onVoteSelect={(selectedPost, vote) => {
                  this.changePostVote(selectedPost, vote)
                }}
                onEditSelect={(selectedPost) => {
                  //load edit modal
                  this.openEditPostModal(selectedPost)
                }}
              />
            </div>
          </div>)} />
        <Route exact path='/' render={() => (
          <div className="App">
            <div className="App-header">
              <Header />
            </div>
            <div className="App-left">
              <Container categories={categories} changeClickedCat={this.changeClickedCat} openAddPostModal={this.openAddPostModal} />
            </div>
            <div className="App-right">
              <SortPost sortPostbyVote={this.sortPostbyVote} />
              {this.state.posts !== null && (
                // show all post if categories not clicked. Also the first loading posts
                <LoadAllPost
                  post={posts}
                  onSelect={(selectedPost) => {
                    //load P3
                    this.switchToPostPage(selectedPost)
                  }}
                  onVoteSelect={(selectedPost, vote) => {
                    this.changePostVote(selectedPost, vote)
                  }}
                  onEditSelect={(selectedPost) => {
                    //load edit modal
                    this.openEditPostModal(selectedPost)
                  }}
                />)}
            </div>
          </div>)}
        />

        {/* </div> */}
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
        <Modal
            //this is the modal of add a edit/delete Post
            className='modal'
            overlayClassName='overlay'
            isOpen={editPostModalOpen}
            onRequestClose={this.closeEditPostModal}
            contentLabel='Post Modal'
        >
            <h2>Edit Post here </h2>
            <p>Post by: {postToOpen && postToOpen.author}</p>
            <input type='text' placeholder='body' defaultValue={postToOpen && postToOpen.title} ref={(input) => this.postTitleInput = input} />
            <input type='text' placeholder='body' defaultValue={postToOpen && postToOpen.body} ref={(input) => this.postBodyInput = input} />


            <button onClick={() => {
                this.editPost()
                
            }}>edit post</button>
           
            <button onClick={() => {
                this.delPost()
                
            }}>delete post</button>
            
            <button onClick={this.closeEditPostModal}>cancel</button>
        </Modal>
      </div>


      // </div>
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
