// document.addEventListener("DOMContentLoaded", onLoad);

let saveButton = document.getElementById("save");
const addButton = document.getElementById("add");
let cancelButton = document.getElementById("cancel");
const body = document.getElementById('body');
const main = document.getElementById('main');
const title = document.getElementById('title');
const tag = document.getElementById('tag');
const author = document.getElementById('fauthor');
const date = document.getElementById('date');
const imgUrl = document.getElementById('imgUrl');
const saying = document.getElementById('saying');
const summary = document.getElementById('summary');
const content = document.getElementById('content');


addButton.addEventListener('click', openAddModal);

cancelButton.addEventListener('click', closeModal);

function getArticlesFromServer() {
    fetch('http://localhost:3000/articles')
        .then(function (response) {
            response.json().then(function (articles) {
                showArticle(articles);
            });
        });
};

function openAddModal() {
    clearSave();
    saveButton.addEventListener('click', function () {
        addArticleToServer()
    });
    body.className = 'show-modal';
}

function closeModal() {
    body.className = '';
} 

function clearSave() {
    let newUpdateButton = saveButton.cloneNode(true);
    saveButton.parentNode.replaceChild(newUpdateButton, saveButton);
    saveButton = document.getElementById('save');
}

function addArticleToServer() {
    const postObject = {
        title: formTitle.value,
        tag: formTag.value,
        author: formAuthor.value,
        date: formDate.value,
        imgUrl: formImgUrl.value,
        saying: formSaying.value,
        summary: formSummary.value,
        content: formContent.value
    }
    fetch('http://localhost:3000/articles', {
        method: 'post',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(postObject)
    }).then(function () {
        getArticlesFromServer();

        resetForm();
        closeModal();
    });
}

function deleteArticleFromServer(id) {
    fetch(`http://localhost:3000/articles/${id}`, {
        method: 'DELETE',
    }).then(function () {
        getArticlesFromServer();
    });
}

function updateArticleToServer(id) {
    const putObject = {
        title: title.value,
        tag: tag.value,
        author: author.value,
        date: date.value,
        imgUrl: imgUrl.value,
        saying: saying.value,
        summary: summary.value,
        content: content.value
    }
    fetch(`http://localhost:3000/articles/${id}`, {
        method: 'PUT',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(putObject)
    }).then(function () {
        getArticlesFromServer();
        resetForm();
        closeModal();
    });
}

function openEditModal(article) {
    title.value = article.title;
    tag.value = article.tag;
    author.value = article.author;
    date.value = article.date;
    imgUrl.value = article.imgUrl;
    saying.value = article.saying;
    summary.value = article.summary;
    content.value = article.content;

    clearSave();
    saveButton.addEventListener('click', function () {
        updateArticleToServer(article.id)
    });
    body.className = 'show-modal';
}

function removeArticle() {
    while (main.firstChild) {
        main.removeChild(main.firstChild);
    }
}

function createArticle(article) {
    let title = document.createElement('h2');
    title.className = "title";
    title.textContent = article.title;

    let tag = document.createElement('li');
    tag.className = "info__item";
    tag.textContent = article.tag;

    let author = document.createElement('span');
    author.className = "info__mark";
    author.textContent = article.author;

    let authorContainer = document.createElement('li');
    authorContainer.className = "info__item";
    authorContainer.textContent = 'Added By ';
    authorContainer.appendChild(author)

    let date = document.createElement('li');
    date.className = "info__item";
    date.textContent = article.date;

    let infoContainer = document.createElement('ul');
    infoContainer.className = "article-info";
    infoContainer.appendChild(tag);
    infoContainer.appendChild(authorContainer);
    infoContainer.appendChild(date);

    let editButton = document.createElement('button');
    editButton.className = "button2";

    editButton.addEventListener('click', function () {
        openEditModal(article);
    });
    editButton.textContent = 'Edit';

    let deleteButton = document.createElement('button');
    deleteButton.className = "button2";

    deleteButton.addEventListener('click', function () {
        deleteArticleFromServer(article.id);
    });
    deleteButton.textContent = 'Delete';

    let buttonsContainer = document.createElement('div');
    buttonsContainer.className = "btn-group";
    buttonsContainer.appendChild(editButton);
    buttonsContainer.appendChild(deleteButton);

    let img = document.createElement('img');
    img.src = article.imgUrl;

    let paragraph = document.createElement('p');
    paragraph.textContent = article.content;

    let paragraphContainer = document.createElement('div');
    paragraphContainer.className = "article-content";
    paragraphContainer.appendChild(paragraph);

    let newArticle = document.createElement('article');
    newArticle.appendChild(title);
    newArticle.appendChild(infoContainer);
    newArticle.appendChild(buttonsContainer);
    newArticle.appendChild(img);
    newArticle.appendChild(paragraphContainer);

    return newArticle;
}

function showArticle(articles) {
    removeArticle()
    for (let i = 0; i < articles.length; i++) {
        let articleDOMNode = createArticle(articles[i]);
        main.appendChild(articleDOMNode);
    }
}

function resetForm() {
    formTitle.value = '';
    formTag.value = '';
    formAuthor.value = '';
    formDate.value = '';
    formImgUrl.value = '';
    formSaying.value = '';
    formSummary.value = '';
    formContent.value = '';
}

getArticlesFromServer();