import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    addAllPosts, addPost, updatePost, deletePost, addAllComments, addComment,
    updateComment, deleteComment
} from '../action'
import * as api from '../util/api'
import Modal from 'react-modal'
import sortBy from '../util/sort-by'
import FaThumbUp from 'react-icons/lib/fa/thumbs-up'
import FaThumbDown from 'react-icons/lib/fa/thumbs-down'
import FaSortAmountDesc from 'react-icons/lib/fa/sort-amount-desc'
import FaCheckSquareO from 'react-icons/lib/fa/check-square-o'
import FaClockO from 'react-icons/lib/fa/clock-o'
import { Link } from 'react-router-dom'

class Post extends Component {

    state = { 
        post: null, 
        response: "",   //for testing. show results from API
        addCmtModalOpen: false, 
        editPostModalOpen: false, 
        editCmtModalOpen: false, 
        currentModel: null }

    componentDidMount() {
        //once page load, fetch the current post from API
        this.updateCurrentPost()
        //we also fetch the comment of current post
        this.updateCmt()

    }

    //functions to update/fetch data from api

    updateCurrentPost(){
        api.getPostByID(this.props.singlePost).then(
            data => this.setState({ post: data })
        )
    }

    updateCmt(){
        api.getCommentsByPostId(this.props.singlePost).then(
            data => {
              this.props._addAllComments({ comments: data })
            }
        )
    }

    //functions of comments

    addCmt() {
        const id = Math.random().toString(36).slice(2)
        api.addComments(id, this.cmtBodyInput.value, this.cmtAuthorInput.value, this.props.singlePost)
            .then(
            data => {
                this.setState({ response: JSON.stringify(data) });
                //load the new comment in page
                api.getCommentsByPostId(this.props.singlePost).then(
                    data => {
                        this.props._addComment({ comment: data[data.length-1] })
                    })
                //update the comment count of post
                this.updateCurrentPost()
                this.closeAddCmtModal
                
            })
    }

    editCmt() {
        api.updateCommentById(this.state.currentModel.id, this.cmtBodyInputE.value).then(
            data => {
                this.setState({ response: JSON.stringify(data) });
                api.getCommentsByPostId(this.props.singlePost).then(
                    data => {
                        this.props._updateComment({ id: this.state.currentModel.id, body: this.cmtBodyInputE.value })
                        this.closeEditCmtModal
                })
            }
        )
    }

    delCmt() {
         api.deleteCommentById(this.state.currentModel.id).then(
                data=>{ this.setState({response: JSON.stringify(data)});
                api.getCommentsByPostId(this.props.singlePost).then(
                    data => {this.setState({ comments: data })                    
                        this.props._deleteComment({ id: this.state.currentModel.id })
                        this.closeEditCmtModal
                })
            }
        )
    }

    changeCmtVote(cmtId, selection) {
        
        api.commentVoteByID(cmtId, selection).
            then(data => {
                this.setState({ response: JSON.stringify(data) })
                this.updateCmt()
            })
        
    }

    //functions of post

    editPost() {
       
        api.updatePostById(this.props.singlePost,this.postTitleInput.value, this.postBodyInput.value).then(
            data=>{ this.setState({response: JSON.stringify(data)});
                this.updateCurrentPost()
                this.closeEditPostModal
            })
    }

    delPost() {
          
        api.deletePostById(this.props.singlePost).then(
              data=>{ this.setState({response: JSON.stringify(data)});
                this.updateCurrentPost()
                this.props.toggle(true)
                this.closeEditPostModal
                //should be to category page as post is deleted
                console.log('should back')

              })
    }

    changePostVote(postId, selection) {
        
        api.postVoteByID(postId, selection).
            then(data => {
            this.setState({ response: JSON.stringify(data) })
            this.updateCurrentPost()
        })
        
    }

    sortCmtbyVote = (way) => {
        //can either order by vote or by timestamp
        if (this.props.comment !== null) {
            let showCmt = this.props.comment.comments
            way === 'vote' ? showCmt.sort(sortBy('-voteScore')) : null;
            way === 'time' ? showCmt.sort(sortBy('-timestamp')) : null;
            this.setState({ comments: showCmt })
        }
    }

    //switches

    openAddCmtModal = () => this.setState(() => ({ addCmtModalOpen: true }))
    closeAddCmtModal = () => this.setState(() => ({ addCmtModalOpen: false }))
    openEditPostModal = () => this.setState(() => ({ editPostModalOpen: true }))
    closeEditPostModal = () => this.setState(() => ({ editPostModalOpen: false }))
    openEditCmtModal = (cmt) => this.setState(() => ({ editCmtModalOpen: true, currentModel: cmt }))
    closeEditCmtModal = () => this.setState(() => ({ editCmtModalOpen: false }))


    render() {
        const { post, addCmtModalOpen, editPostModalOpen, editCmtModalOpen, currentModel } = this.state;
        const { toggle, comment } = this.props;


        return (
            <div className="Post">
              <header className="App-header">
                {/* {comment && console.log(comment.comments)} */}
                
                <h1 className="App-title">Post Page</h1>
                <Link to="/">
                    <button>home</button>               
                </Link>
                <p className="App-intro">
                {/* To get started {this.state.response} */}
                </p>
              </header>
              <div className="App-Post">  
                <h3 className="Post-title">
                    This is Post of: {post && post.title}
                </h3>
                <p>
                    {post && post.body}
                </p>
                <p>{post && post.author}
                    <span className="App-votes"> vote:  {post && post.voteScore}</span>
                    <span className="App-vote" onClick={()=>this.changePostVote(post.id, 'upVote')}><FaThumbUp size ={20}/></span>
                    <span className="App-vote" onClick={()=>this.changePostVote(post.id, 'downVote')}><FaThumbDown size ={20}/></span>    
                </p>
                <p>count: {post && post.commentCount}</p>
                <button onClick={() => {
                            
                            this.openEditPostModal()
                            
                        }}>Edit or Delete Post</button>
            </div>
            <div className="App-space"></div>
            <div className="App-Comment">
                <p className="App-sort"><FaSortAmountDesc size={30}/>
                    <span onClick={this.sortCmtbyVote.bind(this, 'vote')}>Sort by vote<FaCheckSquareO size={25}/></span>
                    <span onClick={this.sortCmtbyVote.bind(this, 'time')}>Sort by time<FaClockO size={25}/></span>
                </p>
                {comment.comments && comment.comments.map(cmt => (
                    <div>
                        <h4>{cmt.author}</h4>
                        <p>{cmt.body}
                            <span className="App-votes"> {cmt.voteScore}</span>
                            <span className="App-vote" onClick={()=>this.changeCmtVote(cmt.id, 'upVote')}><FaThumbUp size ={20}/></span>
                            <span className="App-vote" onClick={()=>this.changeCmtVote(cmt.id, 'downVote')}><FaThumbDown size ={20}/></span>          
                        </p>
                        <button onClick={() => {
                            this.openEditCmtModal(cmt)
                        }}>Edit or Delete</button>
                    </div>
                ))}
            </div>
            <div className="App-comment-button">
                
                <button onClick={this.openAddCmtModal}>Add Comment</button>
            {post &&
            <Link to={`/${post.category}`}>
                <button onClick={() => (toggle(true))}>back</button>
                {/* temp:{this.state.response}} */}
            </Link>}
            </div>
                <Modal
                    //this is the modal of add a new comment
                    className='modal'
                    overlayClassName='overlay'
                    isOpen={addCmtModalOpen}
                    onRequestClose={this.closeAddCmtModal}
                    contentLabel='Comment Modal'
                >
                    <h2>Add new Comment here </h2>
                    <input type='text' placeholder='body' ref={(input) => this.cmtBodyInput = input} />
                    <input type='text' placeholder='author' ref={(input) => this.cmtAuthorInput = input} />


                    <button onClick={() => {
                        this.addCmt()
                        
                    }}>add comment</button>
                    <button onClick={this.closeAddCmtModal}>cancel</button>
                </Modal>
                <Modal
                    //this is the modal of add a edit/delete commment
                    className='modal'
                    overlayClassName='overlay'
                    isOpen={editCmtModalOpen}
                    onRequestClose={this.closeEditCmtModal}
                    contentLabel='Comment Modal'
                >
                    <h2>Edit Comment here </h2>
                    <p>Comment by: {currentModel && currentModel.author}</p>
                    <input type='text' placeholder='body' defaultValue={currentModel && currentModel.body} ref={(input) => this.cmtBodyInputE = input} />


                    <button onClick={() => {
                        this.editCmt()
                        
                    }}>edit comment</button>
                    <button onClick={() => {
                        this.delCmt()
                        this.closeEditCmtModal
                    }}>delete comment</button>
                    <button onClick={this.closeEditCmtModal}>cancel</button>
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
                    <p>Post by: {post && post.author}</p>
                    <input type='text' placeholder='body' defaultValue={post && post.title} ref={(input) => this.postTitleInput = input} />
                    <input type='text' placeholder='body' defaultValue={post && post.body} ref={(input) => this.postBodyInput = input} />


                    <button onClick={() => {
                        this.editPost()
                        
                    }}>edit post</button>
                    {post && <Link 
                        to={`/${post.category}`}
                        >
                        <button onClick={() => {
                            this.delPost()
                            
                        }}>delete post</button>
                    </Link>}
                    <button onClick={this.closeEditPostModal}>cancel</button>
                </Modal>
            </div>
        )
    }



}


function mapStateToProps(state) {
    return {comment: state.comment};
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

export default connect(mapStateToProps, mapDispatchToProps)(Post);