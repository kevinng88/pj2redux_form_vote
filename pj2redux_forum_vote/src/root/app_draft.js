import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { connect } from 'react-redux';
import { addAllPosts, addPost, updatePost, deletePost, addAllComments, addComment, 
  updateComment, deleteComment } from '../action'
import * as api from '../util/api'
import { LoadCatagory, LoadAllPost, LoadCategoryPost } from '../util/loadListData'
import Modal from 'react-modal'
import sortBy from 'sort-by'
import Post from '../post/post' 

class App extends Component {
  
  state = { categories:null, posts:null, comments:null, response:"", addPostModalOpen: false, clickedCat:null, togglePostPage:false, postToOpen:null }

  componentDidMount() {
      ////// get post by id (done)////
      // api.getPostByID('8xf0y6ziyjabvozdd253nd').then(
      //     data => this.setState({ posts: data }))

      ////getAllCategories////
      api.getAllCategories().then(data=>{
        this.setState({categories: data})
      })
      
      /////getAllPost (done)/////
      api.getAllPosts().then(
           data => {
           //this.props.addingPost({ posts: data, title:"", body:"" })
           this.setState({ posts: data })
           this.addRedux();
          })

      ////getAll comment from a post////
      api.getCommentsByPostId('8xf0y6ziyjabvozdd253nd').then(
        data => {
          //this.props.addingPost({ comments: data, title:"", body:"" });
          this.setState({ comments: data })})

  }
  
  // addAPost = (title, body, author, category) =>{
  addAPost = () =>{
    const id = Math.random().toString(36).slice(2)
      // api.addPost(id, title, body, author, category)
      api.addPost(id, this.postTitleInput.value, this.postBodyInput.value, this.postAuthorInput.value, this.postCatSelect.value )
      .then(
        data=>{ this.setState({response: JSON.stringify(data)});
        api.getAllPosts().then(
          data => this.setState({ posts: data }))
        }
    )
  }

  changePostData = () => {
    //////addPost & getallpost again (done) /////
  //   const id = Math.random().toString(36)
  //   api.addPost(id, 'test1','this is body', 'kev', 'react')
  //   .then(
  //     data=>{ this.setState({response: data});
  //     api.getAllPosts().then(
  //       data => this.setState({ posts: data }))
  //     }
  // )
    
    /////postVote (done)/////
    //api.postVoteByID('8xf0y6ziyjabvozdd253nd', 'upVote').
    //then(data => {this.setState({post_data: data})})

  /////delete post (done)//////
  // api.deletePostById('zdpmgeh9ysg').then(
  //       data=>{ this.setState({response: JSON.stringify(data)});
  //       api.getAllPosts().then(
  //         data => this.setState({ posts: data }))
  //       })

  ////update Post ///////
  // api.updatePostById('6ni6ok3ym7mf1p33lnez','change to this', 'body body body').then(
  //       data=>{ this.setState({response: JSON.stringify(data)});
  //       api.getAllPosts().then(
  //         data => this.setState({ posts: data }))
  //       })
}

changeCmtData = () => {
    //////addcmd & getallcmd again (done) /////
  //   const id = Math.random().toString(36).slice(2)
  //   api.addComments(id, 'I think this post is good', 'kev', '8xf0y6ziyjabvozdd253nd')
  //   .then(
  //     data=>{ this.setState({response: JSON.stringify(data)});
  //     api.getCommentsByPostId('8xf0y6ziyjabvozdd253nd').then(
  //       data => this.setState({ comments: data }))}
  // )

 /////update comment (done)///////
  // api.updateCommentById('8tu4bsun805n8un48ve89','I should say this comment').then(
  //       data=>{ this.setState({response: JSON.stringify(data)});
  //       api.getCommentsByPostId('8xf0y6ziyjabvozdd253nd').then(
  //          data => this.setState({ comments: data }))}
  //       )


 ////update comment vote (done) ///////
  // api.commentVoteByID('8tu4bsun805n8un48ve89','upVote').then(
  //       data=>{ this.setState({response: JSON.stringify(data)});
  //       api.getCommentsByPostId('8xf0y6ziyjabvozdd253nd').then(
  //           data => this.setState({ comments: data }))}
  //       )

///delete comment (done)//////
//  api.deleteCommentById('8tu4bsun805n8un48ve89').then(
//         data=>{ this.setState({response: JSON.stringify(data)});
//         api.getCommentsByPostId('8xf0y6ziyjabvozdd253nd').then(
//             data => this.setState({ comments: data }))}
//         )


}

getAPI = () => {
  //   api.getPostByID('8xf0y6ziyjabvozdd253nd').then(
  //     data => this.setState({ categories: data }))
    // api.getAllPosts().then(data=>{this.setState({post_data: data})
//  })


 ////get comment by id (done)///////
  // api.getCommentById('8tu4bsun805n8un48ve89').then(
  //       data=>{ this.setState({response: JSON.stringify(data)});
  // })
}

addRedux(){
 
  this.props._addAllPosts({posts : this.state.posts})
}

addReduxPost(){
  this.props._addPost({post: this.state.posts[2]})
}

updateReduxPost(){
  this.props._updatePost({id: this.state.posts[3].id, title:'other title', body:'body is good'})
}

deleteReduxPost(){
  this.props._deletePost({id: this.state.posts[3].id})
}

addReduxComment(){
  
  this.props._addComment({comment: this.state.comments[0]})
}

updateReduxComment(){
  this.props._updateComment({id: this.state.comments[1].id, body:'NEW comment is good'})
}

deleteReduxComment(){
  this.props._deleteComment({id: this.state.comments[1].id})
}

sortPostbyVote = (way) => {
  //can either order by vote or by timestamp
  if (this.state.posts !== null) {
    let showPost = this.state.posts
    way === 'vote' ? showPost.sort(sortBy('-voteScore')) : null;
    way === 'time' ? showPost.sort(sortBy('-timestamp')) : null;
    this.setState({ posts: showPost })
  }
}

openAddPostModal = () => this.setState(()=> ({addPostModalOpen: true}))
closeAddPostModal = () => this.setState(()=> ({addPostModalOpen: false}))

changeClickedCat(category){
  this.setState({ clickedCat: category})
}

switchToPostPage(selectedPost){
  this.setState({
    togglePostPage : true,
    postToOpen : selectedPost
  })
}

switchToMainPage(){
  //have to call api again for case of post is deleted
  this.setState({
    togglePostPage: false
  })
  api.getAllPosts().then(
    data => {
    this.setState({ posts: data })
    this.addRedux();
   })
}

  render() {


    const {_addPost, _updatePost } = this.props;
    const { categories, addPostModalOpen, posts, comments, clickedCat, togglePostPage, postToOpen } = this.state;

    return (
      
      <div>
        {togglePostPage === true
        ? <Post singlePost={postToOpen} toggle={()=>this.switchToMainPage()}></Post>
        :<div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <p className="App-intro">
            To get started, see mapStateToProps data: {this.props.posts?this.props.posts[0].title:"" }
          </p>
          <input type='text' placeholder='title' ref={(input) => this.titleinput = input}/>
          <input type='text' placeholder='body' ref={(input) => this.bodyinput = input}/>
          <button onClick={()=>{_addPost({
            title: this.titleinput.value, 
            body: this.bodyinput.value,
            })}}>add data to store</button>
          
          
          <h3>test api</h3>
          {/* don't have map function */}
          <button onClick={this.changeCmtData.bind(this)}>Change Data</button>
          <button onClick={this.getAPI.bind(this)}>get API</button>
          <button onClick={this.openAddPostModal}>show Add post modal</button>
          <button onClick={this.addRedux.bind(this)}>Redux store</button>
          <br />
          <button onClick={this.addReduxPost.bind(this)}>add post</button>
          <button onClick={this.updateReduxPost.bind(this)}>update post</button>
          <button onClick={this.deleteReduxPost.bind(this)}>delete post</button>
          <br />
          <button onClick={this.addReduxComment.bind(this)}>add Comment</button>
          <button onClick={this.updateReduxComment.bind(this)}>update Comment</button>
          <button onClick={this.deleteReduxComment.bind(this)}>delete Comment</button>


          {/* have map function   */}
          {/* {<p>{this.state.posts?this.state.posts.map(i=>(<li key={i['author']}>id: {i.id} title: {i.title} vote: {i.voteScore}</li>)):'not yet fetch...'}</p>} */}
          {<p>{this.state.comments?this.state.comments.map(i=>(<li key={i['author']}>id: {i.id} body: {i.body} vote: {i.voteScore}</li>)):'not yet fetch...'}</p>}
          <p>{this.state.response}</p>
          
          {/*-------------------------------- page 1 functions------------------------- */}

          {/* P1: loading the catagories and all the posts */}
          {this.state.categories !== null && (
            <LoadCatagory 
              catagory={this.state.categories} 
              onSelect={(selectedCat) => {
                //load P2 filered post 
                this.changeClickedCat(selectedCat);
              }}/>)}
          {/* {this.state.posts !== null && (<LoadAllPost post={this.state.posts} onSelect={(selectedPost)=>{this.switchToPostPage(selectedPost)}/>)} */}

          {/* button of sort post by votes and time (sort the posts state) */}
          <button onClick={this.sortPostbyVote.bind(this, 'vote')}>Sort by vote</button>
          <button onClick={this.sortPostbyVote.bind(this,'time')}>Sort by time</button>
          
          {/*-------------------------------- page 2 functions------------------------- */}
          {/* show filter post by catagories */}
          {/* {this.state.posts !== null && (<LoadAllPost catagory= post={this.state.posts}/>)} */}
          {clickedCat? 
            <LoadCategoryPost 
              selectedCat={clickedCat} 
              post={posts}
              onSelect={(selectedPost)=>{
                //load P3
                this.switchToPostPage(selectedPost)
              }}
            />:null}

          <Modal
          //this is the modal of add a new post
          className='modal'
          overlayClassName='overlay'
          isOpen={addPostModalOpen}
          onRequestClose={this.closeAddPostModal}
          contentLabel='Post Modal'
          >
            <h2>Add new Post here </h2>
            <input type='text' placeholder='title' ref={(input) => this.postTitleInput = input}/>
            {/* <input type='text' placeholder='title' value ={this.props.postTitle}/> */}
            <input type='text' placeholder='body' ref={(input) => this.postBodyInput = input}/>
            <input type='text' placeholder='author' ref={(input) => this.postAuthorInput = input}/>
            <select name='categoryinput' ref = {(input) => this.postCatSelect = input}>
              {(categories && categories.map(cat=>(
                  <option value={cat.name}>{cat.name}</option>
              )))}
            </select>
          
            <button onClick={()=>{
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


function mapStateToProps(state){
  return state;
}


function mapDispatchToProps(dispatch){
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
