import React from 'react'
import FaThumbUp from 'react-icons/lib/fa/thumbs-up'
import FaThumbDown from 'react-icons/lib/fa/thumbs-down'
import { Link } from 'react-router-dom'

export function LoadCatagory ({ catagory, onSelect }){
    //catalog is 'array of object' of all catalog name
    //function to load the catalog in unorder-list, when links are clicked
    //it will load the post for particular catalog
    return (
        <div>
            <h1>Select Topics</h1>
            <ul className = 'catalog-list'>
                {catagory && catagory.map(item =>{
                    //why onSelect can't bind to DOM?
                    return (
                    <Link to={item.name}>
                        <li onClick={()=>onSelect(item.name)} key={item.name}><h4>{item.name}</h4></li>
                    </Link>
                )})}
            </ul>
            
        </div>
    )
}


export function LoadAllPost ({ post, onSelect, onVoteSelect }){
    //post is 'array of object' of all post data
    //function to load the posts in unorder-list
    return (
        <div>
            <h1>Latest Posts</h1>
            <ul className = 'post-list'>
            {post && post.map(item =>(
                    
                    <li key={item.id}>
                    <Link to={`/comment/${item.id}`}>
                        <span onClick={()=>onSelect(item.id)}>{item.title}</span>
                    </Link>
                        <span><b> ({item.category}) </b></span>
                        <span className='App-votes'>  {item.voteScore}</span>
                        <span className='App-vote' onClick={()=>onVoteSelect(item.id, 'upVote')}> <FaThumbUp size={20}/></span>
                        <span className='App-vote' onClick={()=>onVoteSelect(item.id, 'downVote')}> <FaThumbDown size={20}/></span>                  
                    </li>
                    
                ))}
            </ul>
        </div>
    )
}

export function LoadCategoryPost ({ selectedCat, post, onSelect, onVoteSelect }){
    //load filter data after category are clicked
    return (
        <div>
            <h1>Posts of {selectedCat}</h1>
            <ul className = 'post-list'>
            {post && post
                .filter(item =>(item.category === selectedCat))
                .map(item =>(
                    <li key={item.id}>
                    <Link to={`/comment/${item.id}`}>
                        <span onClick={()=>onSelect(item.id)}>{item.title}</span>
                    </Link>
                        <span className='App-votes'>{item.voteScore}</span>
                        <span className='App-vote' onClick={()=>onVoteSelect(item.id, 'upVote')}><FaThumbUp size={20} /></span>
                        <span className='App-vote' onClick={()=>onVoteSelect(item.id, 'downVote')}><FaThumbDown size={20}/></span>                  
                    </li>
                    
                ))}
            </ul>
        </div>
    )
}