import posts from './newPosts.json' assert { type: 'json' };

const postsList = document.querySelector('.posts-list');
const postItemTemplate = document.querySelector('.post-template');

const paginationList = document.querySelector('.pagination-list');
const paginationTemplate = document.querySelector('.pagination-template');

const postsPerPage = 24;
const pagesQuantity = Math.ceil(posts.length / postsPerPage);

loadPosts(1);
createPagination();

function loadPosts(page) {
  clearPosts();
  const firstPostIndex = +page * postsPerPage;
  const lastPostIndex = (+page + 1) * postsPerPage;
  const newPosts = posts.slice(firstPostIndex, lastPostIndex);

  newPosts.forEach(post => {
    const postItemClone = postItemTemplate.content.cloneNode(true);
    postItemClone.querySelector('.post-link').href = post.url;
    postItemClone.querySelector('.post-title').innerText = post.title;
    postItemClone.querySelector('.post-description').innerText = post.description;
    postItemClone.querySelector('img').src = post.thumbnail;
    // postItemClone.querySelector('time').innerText = post.date;
    postItemClone.querySelector('.post-owner').innerText = post.owner;
    postsList.appendChild(postItemClone);
  });
}

function createPagination() {
  const paginationButtons = [];

  for (let currentPage = 1; currentPage < pagesQuantity; currentPage++) {
    const paginationItemClone = paginationTemplate.content.cloneNode(true);
    const paginationItem = paginationItemClone.querySelector('.pagination-item');
    const paginationButton = paginationItem.children[0]
    paginationButton.innerText = currentPage;
    paginationButton.dataset.page = currentPage;
    paginationList.appendChild(paginationItem);
    paginationButtons.push(paginationButton);
  }

  paginationButtons.forEach(button => {
    button.onclick = () => {
      if (button.classList.contains('active')) return;
      removeActiveButton(paginationButtons);
      button.classList.add('active');
      loadPosts(button.dataset.page);
    };
  });

}

function removeActiveButton(paginationButtons) {
  paginationButtons.forEach(
    button => button.classList.remove('active')
  );
}

function clearPosts() {
  [ ...postsList.children ].forEach(element => element.remove());
}
