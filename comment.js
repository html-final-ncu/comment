// comment.js
let comments = JSON.parse(localStorage.getItem('comments')) || [];

function formatTime() {
    const now = new Date();
    return now.getFullYear() + '/' + 
           (now.getMonth() + 1).toString().padStart(2, '0') + '/' +
           now.getDate().toString().padStart(2, '0') + ' ' +
           now.getHours().toString().padStart(2, '0') + ':' +
           now.getMinutes().toString().padStart(2, '0');
}

function renderComments() {
    const commentsList = document.getElementById('commentsList');
    commentsList.innerHTML = '';

    comments.forEach((comment, index) => {
        let repliesHTML = '';
        comment.replies.forEach((reply, replyIndex) => {
            repliesHTML += `
                <div class="card mt-2 ms-4">
                    <div class="card-body p-2">
                        <div class="d-flex justify-content-between">
                            <h6 class="card-subtitle mb-1 text-muted">${reply.username} - ${reply.time}</h6>
                            <button class="btn btn-outline-primary btn-sm like-reply-button" data-index="${index}" data-reply-index="${replyIndex}">
                                <i class="fa fa-thumbs-up"></i> <span class="reply-like-count">${reply.likes}</span> 讚
                            </button>
                        </div>
                        <p class="card-text">${reply.content}</p>
                    </div>
                </div>
            `;
        });

        const commentHTML = `
            <div class="card mb-3">
                <div class="card-body">
                    <div class="d-flex justify-content-between">
                        <div>
                            <h5 class="card-title mb-1">${comment.username}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">${comment.time}</h6>
                        </div>
                        <div class="text-end">
                            <button class="btn btn-primary btn-sm me-2 like-button" data-index="${index}">
                                <i class="fa fa-thumbs-up"></i> <span class="like-count">${comment.likes}</span> 讚
                            </button>
                            <button class="btn btn-outline-secondary btn-sm reply-button" data-index="${index}">
                                <i class="fa fa-reply"></i> 回覆
                            </button>
                        </div>
                    </div>
                    <p class="card-text mt-3">${comment.content}</p>

                    <div class="replies mt-3">
                        ${repliesHTML}
                    </div>
                    <div class="reply-form mt-2" style="display:none;">
                        <input type="text" class="form-control mb-2 reply-username" placeholder="你的名字">
                        <textarea class="form-control mb-2 reply-content" rows="2" placeholder="回覆內容"></textarea>
                        <button class="btn btn-primary btn-sm submit-reply">送出回覆</button>
                    </div>
                </div>
            </div>
        `;
        commentsList.insertAdjacentHTML('beforeend', commentHTML);
    });
}

function saveComments() {
    localStorage.setItem('comments', JSON.stringify(comments));
}

// 新增留言
document.getElementById('commentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const content = document.getElementById('content').value.trim();

    if (username && content) {
        comments.unshift({
            username,
            content,
            time: formatTime(),
            likes: 0,
            replies: []
        });
        saveComments();
        renderComments();
        document.getElementById('commentForm').reset();
    }
});

// 處理按讚、展開回覆框、提交回覆、回覆按讚
document.getElementById('commentsList').addEventListener('click', function(e) {
    const likeBtn = e.target.closest('.like-button');
    const replyBtn = e.target.closest('.reply-button');
    const submitReplyBtn = e.target.closest('.submit-reply');
    const likeReplyBtn = e.target.closest('.like-reply-button');

    if (likeBtn) {
        const index = likeBtn.getAttribute('data-index');
        comments[index].likes++;
        saveComments();
        renderComments();
    }

    if (replyBtn) {
        const index = replyBtn.getAttribute('data-index');
        const replyForm = document.querySelectorAll('.reply-form')[index];
        replyForm.style.display = replyForm.style.display === 'none' ? 'block' : 'none';
    }

    if (submitReplyBtn) {
        const replyForm = submitReplyBtn.closest('.reply-form');
        const replyUsername = replyForm.querySelector('.reply-username').value.trim();
        const replyContent = replyForm.querySelector('.reply-content').value.trim();
        const index = Array.from(document.querySelectorAll('.submit-reply')).indexOf(submitReplyBtn);

        if (replyUsername && replyContent) {
            comments[index].replies.push({
                username: replyUsername,
                content: replyContent,
                time: formatTime(),
                likes: 0  // ← 新增回覆時，初始化讚數為0
            });
            saveComments();
            renderComments();
        }
    }

    if (likeReplyBtn) {
        const index = likeReplyBtn.getAttribute('data-index');
        const replyIndex = likeReplyBtn.getAttribute('data-reply-index');
        comments[index].replies[replyIndex].likes++;
        saveComments();
        renderComments();
    }
});

// 首次載入時渲染留言
renderComments();
