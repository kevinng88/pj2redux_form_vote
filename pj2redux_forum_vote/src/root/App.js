import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { connect } from 'react-redux';
import { addPost } from '../action'
import * as api from '../util/api'

class App extends Component {
  
  state = { categories:"", posts:"", comments:"", response:"" }

  componentDidMount() {
      ////// get post by id (done)////
      // api.getPostByID('8xf0y6ziyjabvozdd253nd').then(
      //     data => this.setState({ posts: data }))

      /////getAllPost (done)/////
      // api.getAllPosts().then(
      //      data => this.setState({ posts: data }))

      ////getAll comment from a post////
      api.getCommentsByPostId('8xf0y6ziyjabvozdd253nd').then(
        data => this.setState({ comments: data }))

  }
  
  addAPost = () =>{
    const id = Math.random().toString(36).slice(2)
      api.addPost(id, 'test1','this is body', 'kev', 'react')
      .then(
        data=>{ this.setState({response: data});
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

  render() {

  
    
    

    const { addingPost } = this.props;

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, see mapStateToProps data: {this.props.posts}
        </p>
        <input type='text' placeholder='title' ref={(input) => this.titleinput = input}/>
        <input type='text' placeholder='body' ref={(input) => this.bodyinput = input}/>
        <button onClick={()=>{addingPost({
          title: this.titleinput.value, 
          body: this.bodyinput.value,
          })}}>add data to store</button>
        
        <h3>test api</h3>
        {/* don't have map function */}
        <button onClick={this.changeCmtData.bind(this)}>Change Data</button>
        <button onClick={this.getAPI.bind(this)}>get API</button>
        <button onClick={this.addAPost.bind(this)}>Add post</button>


        {/* have map function   */}
        {/* {<p>{this.state.posts?this.state.posts.map(i=>(<li key={i['author']}>id: {i.id} title: {i.title} vote: {i.voteScore}</li>)):'not yet fetch...'}</p>} */}
        {<p>{this.state.comments?this.state.comments.map(i=>(<li key={i['author']}>id: {i.id} body: {i.body} vote: {i.voteScore}</li>)):'not yet fetch...'}</p>}
        <p>{this.state.response}</p>
      </div>
    );
  }
}


function mapStateToProps(state){
  return state;
}


function mapDispatchToProps(dispatch){
  return {
    addingPost: (data) => dispatch(addPost(data))

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
