import React from 'react'

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
                    <li onClick={()=>onSelect(item.name)} key={item.name}><h4>{item.name}</h4></li>
                    
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
            <h1>Current Posts</h1>
            <ul className = 'post-list'>
            {post.map(item =>(
                    
                    <li key={item.id}>
                        <span onClick={()=>onSelect(item.id)}>{item.title}</span>
                        <span>  {item.voteScore}</span>
                        <span onClick={()=>onVoteSelect(item.id, 'upVote')}> Like</span>
                        <span onClick={()=>onVoteSelect(item.id, 'downVote')}> Bad</span>                  
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
            {post
                .filter(item =>(item.category === selectedCat))
                .map(item =>(
                    <li key={item.id}>
                        <span onClick={()=>onSelect(item.id)}>{item.title}</span>
                        <span>  {item.voteScore}</span>
                        <span onClick={()=>onVoteSelect(item.id, 'upVote')}> Like</span>
                        <span onClick={()=>onVoteSelect(item.id, 'downVote')}> Bad</span>                  
                    </li>
                    
                ))}
            </ul>
        </div>
    )
}