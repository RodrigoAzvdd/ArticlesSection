// Usando o json-server para simular um DB

const articlesSection = document.querySelector('#articles')
const form = document.querySelector('.form')

document.addEventListener('DOMContentLoaded', () => {
    getArticles()
    isEmpty()
})

async function isEmpty() {
    const message = document.querySelector('.article-message')
    const articles = await fetch(`http://localhost:3000/articles`).then(res => res.json())
    if(articles.length >= 0 && !message.classList.contains('dnone')) {
        message.classList.add('dnone')
    }
    else if (articles.length <= 0 && message.classList.contains('dnone')) {
        message.classList.remove('dnone')
    }
}

async function getArticles() {
    const articles = await fetch(`http://localhost:3000/articles`).then(response => response.json())
    articles.forEach(article => {
        showArticles(article)
    });
    isEmpty()
}

async function deleteArticle(id) {
    const response = await fetch(`http://localhost:3000/articles/${id}`, {
        method: 'DELETE'
    })
    if (response.ok) {
        isEmpty()
        return true
    } 
    else {
        isEmpty()
        return false
    }
}

async function updateArticle(id, updateData) {
    const response = await fetch(`http://localhost:3000/articles/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
    });
}

function showArticles(article) {
    const articleDiv = document.createElement('div')
    const title = document.createElement('h3')
    const content = document.createElement('p')
    const author = document.createElement('p')
    const hr = document.createElement('hr')
    const deleteBtn = document.createElement('button')
    const updateBtn = document.createElement('button')
    const btnDiv = document.createElement('div')
    const id = article.id

    // classes
    articleDiv.classList.add('articleDiv')
    title.classList.add('title')
    content.classList.add('content')
    author.classList.add('author')
    deleteBtn.classList.add('btn')
    updateBtn.classList.add('btn')
    btnDiv.classList.add('btn-div')

    // atribuicao de valores
    title.textContent = `Título: ${article.title}`
    content.textContent = `Conteúdo: ${article.content}`
    author.textContent = `Autor: ${article.author}`
    articleDiv.id = `article-${id}`
    deleteBtn.textContent = 'Deletar'
    updateBtn.textContent = 'Atualizar'

    deleteBtn.addEventListener('click', async () => {
        const response = await deleteArticle(id)
        if (response) articleDiv.remove();
    })

    updateBtn.addEventListener('click', async () => {
        const newTitle = prompt('Titulo')
        const newContent = prompt('Conteudo')
        const newAuthor = prompt('Autor')

        title.textContent = `Título: ${newTitle}`
        content.textContent = `Conteúdo: ${newContent}`
        author.textContent = `Autor: ${newAuthor}`

        const updateData = {
            title: newTitle,
            content: newContent,
            author: newAuthor
        }

        const response = await updateArticle(id, updateData)
    })

    btnDiv.append(updateBtn, deleteBtn)
    articleDiv.append(hr, title, content, author, btnDiv)
    articlesSection.append(articleDiv)

    isEmpty()
}

form.addEventListener('submit', async (ev) => {
    ev.preventDefault()

    const articleData = {
        title: document.querySelector('#title').value,
        author: document.querySelector('#author').value,
        content: document.querySelector('#content').value
    }

    const response = await fetch(`http://localhost:3000/articles`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(articleData)
    })

    const article = await response.json()

    form.reset()
    showArticles(article)
})