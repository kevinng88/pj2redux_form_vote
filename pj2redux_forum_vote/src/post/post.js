import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    addAllPosts, addPost, updatePost, deletePost, addAllComments, addComment,
    updateComment, deleteComment
} from '../action'
import * as api from '../util/api'
import Modal from 'react-modal'
import sortBy from 'sort-by'

class Post extends Component {

    state = { 
        post: null, 
        comments: null, 
        response: "", 
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

    updateCurrentPost(){
        api.getPostByID(this.props.singlePost).then(
            data => this.setState({ post: data })
        )
    }

    updateCmt(){
        api.getCommentsByPostId(this.props.singlePost).then(
            data => {
                this.setState({ comments: data })
                this.loadReduxComment()
            }
        )
    }

    addCmt() {
        const id = Math.random().toString(36).slice(2)
        api.addComments(id, this.cmtBodyInput.value, this.cmtAuthorInput.value, this.props.singlePost)
            .then(
            data => {
                this.setState({ response: JSON.stringify(data) });
                //load the new comment in page
                api.getCommentsByPostId(this.props.singlePost).then(
                    data => {
                        this.setState({ comments: data })
                        //update the redux store
                        this.addReduxComment()
                    })
                //update the comment count of post
                this.updateCurrentPost()
                
            })
    }

    editCmt() {
        api.updateCommentById(this.state.currentModel.id, this.cmtBodyInputE.value).then(
            data => {
                this.setState({ response: JSON.stringify(data) });
                api.getCommentsByPostId(this.props.singlePost).then(
                    data => {this.setState({ comments: data })
                    //update the redux store
                    this.updateReduxComment()
                })
            }
        )
    }

    delCmt() {
         api.deleteCommentById(this.state.currentModel.id).then(
                data=>{ this.setState({response: JSON.stringify(data)});
                api.getCommentsByPostId(this.props.singlePost).then(
                    data => {this.setState({ comments: data })
                    //update the redux store
                    this.deleteReduxComment()
                })
            }
        )
    }

    editPost() {
       
        api.updatePostById(this.props.singlePost,this.postTitleInput.value, this.postBodyInput.value).then(
            data=>{ this.setState({response: JSON.stringify(data)});
                this.updateCurrentPost()
            })
    }

    delPost() {
          
        api.deletePostById(this.props.singlePost).then(
              data=>{ this.setState({response: JSON.stringify(data)});
                this.updateCurrentPost()
                //should be to category page as post is deleted
                this.props.toggle(true);
              })
    }



    changePostData = () => {
       

        /////postVote (done)/////
        //api.postVoteByID('8xf0y6ziyjabvozdd253nd', 'upVote').
        //then(data => {this.setState({post_data: data})})
          
    }


    loadReduxComment() {
        this.props._addAllComments({ comments: this.state.comments })
    }

    addReduxComment() {

        this.props._addComment({ comment: this.state.comments[this.state.comments.length-1] })
    }

    updateReduxComment() {
        this.props._updateComment({ id: this.state.currentModel.id, body: this.cmtBodyInputE.value })
    }

    deleteReduxComment() {
        this.props._deleteComment({ id: this.state.currentModel.id })
    }

    sortCmtbyVote = (way) => {
        //can either order by vote or by timestamp
        if (this.state.comments !== null) {
            let showCmt = this.state.comments
            way === 'vote' ? showCmt.sort(sortBy('-voteScore')) : null;
            way === 'time' ? showCmt.sort(sortBy('-timestamp')) : null;
            this.setState({ comments: showCmt })
        }
    }

    openAddCmtModal = () => this.setState(() => ({ addCmtModalOpen: true }))
    closeAddCmtModal = () => this.setState(() => ({ addCmtModalOpen: false }))
    openEditPostModal = () => this.setState(() => ({ editPostModalOpen: true }))
    closeEditPostModal = () => this.setState(() => ({ editPostModalOpen: false }))
    openEditCmtModal = (cmt) => this.setState(() => ({ editCmtModalOpen: true, currentModel: cmt }))
    closeEditCmtModal = () => this.setState(() => ({ editCmtModalOpen: false }))


    render() {
        const { post, comments, addCmtModalOpen, editPostModalOpen, editCmtModalOpen, currentModel } = this.state;
        const { toggle } = this.props;


        return (
            <div className="Post">
                <header className="Post-header">
                    <h1 className="Post-title">Post Page </h1>
                </header>
                <h3 className="Post-title">
                    This is Post of: {post && post.title}
                </h3>
                <p>
                    {post && post.body}
                </p>
                <p>{post && post.author}
                    <span>vote:  {post && post.voteScore}</span></p>
                <p>count: {post && post.commentCount}</p>
                <button onClick={() => {
                            this.openEditPostModal()
                        }}>Edit or Delete Post</button>
                <br /><br /><hr />
                <button onClick={this.sortCmtbyVote.bind(this, 'vote')}>Sort by vote</button>
                <button onClick={this.sortCmtbyVote.bind(this, 'time')}>Sort by time</button>

                {comments && comments.map(cmt => (
                    <div>
                        <h4>{cmt.author}</h4>
                        <p>{cmt.body}
                            <span>  {cmt.voteScore}</span></p>
                        <button onClick={() => {
                            this.openEditCmtModal(cmt)
                        }}>Edit or Delete</button>
                    </div>
                ))}
                <br /><br />
                <button onClick={this.openAddCmtModal}>Add Comment</button>
                <button onClick={() => (toggle(true))}>back</button>

                temp:{this.state.response}}
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
                        this.closeAddCmtModal
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
                        this.closeEditCmtModal
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
                        this.closeEditCmtModal
                    }}>edit post</button>
                    <button onClick={() => {
                        this.delPost()
                        this.closeEditCmtModal
                    }}>delete post</button>
                    <button onClick={this.closeEditPostModal}>cancel</button>
                </Modal>
            </div>
        )
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

export default connect(mapStateToProps, mapDispatchToProps)(Post);