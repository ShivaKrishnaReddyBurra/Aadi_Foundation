document.getElementById('fetch-posts').addEventListener('click', fetchPosts);

/* below funtions displayLoader and hideLoader are loding animation */

const loader= document.getElementById('loader');
function displayLoader(){
    loader.classList.add('show');
}
function hideLoader(){
    loader.classList.remove('show');
}

/* below function get the data from api*/

function fetchPosts() {
   displayLoader();
   const r1= fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json());
   const r2= fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => response.json());
    
        Promise.all([r1,r2])
        .then(([posts, users]) => {
            hideLoader();
            const postContainer= document.getElementById('posts-container');
            postContainer.innerHTML= "";
            for(let i=0; i<posts.length; i++){
                let post= posts[i];
                let user= users.find(user => user.id === post.userId);
                let postElement= document.createElement('div');
                postElement.classList.add('post');
                postElement.innerHTML= `
                    <h2>${post.title}</h2>
                    <p>${post.body}</p>
                    <p>Username: ${user.name}</p>
                    <p>Email: ${user.email}</p>
                `;
                postContainer.appendChild(postElement);

                /* below event listener is for showing the comments of the respective post user clicks */ 

                postElement.addEventListener('click',function(){
                    postElement.classList.toggle('post-selected');
                    if(postElement.classList.contains('post-selected')){
                        fetch(`https://jsonplaceholder.typicode.com/comments?postId=${post.id}`)
                        .then(response => response.json())
                        .then(comments => {
                            const commentContainer= document.createElement('div');
                            commentContainer.innerHTML= `<h3>Comments</h3>`;
                            commentContainer.classList.add('comment-container');
                            for(let i=0; i<comments.length; i++){
                                let comment= comments[i];
                                let commentElement= document.createElement('div');
                                commentElement.classList.add('comment');
                                commentElement.classList.add('animate');
                                commentElement.innerHTML= `
                                    <h3>${comment.name}</h3>
                                    <p>${comment.body}</p>
                                    <p>Email: ${comment.email}</p>
                                `;
                                commentContainer.appendChild(commentElement);
                            }
                            postElement.appendChild(commentContainer);
                        });
                    }
                    else{
                        postElement.querySelector('.comment-container').remove();
                    }
                });
            }
        })
        
        .catch(error => {
                    hideLoader()
                    const errorelement= document.getElementById('posts-container');
                    errorelement.classList.add("error");
                    errorelement.innerHTML= `
                            <h2>Error: ${error.message}</h2>
                            <p>Check your Internet Connection</p>
                            `;
                     });

   
}

