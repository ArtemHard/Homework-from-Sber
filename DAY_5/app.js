const express = require('express')
const { request } = require('http')
const path = require('path')

// const dataFromDBfile = require('./DB')
// const db = dataFromDBfile.db

const { db } = require('./DB.js')

const PORT = 3000

const app = express()

app.set('view engine', 'hbs')

app.set('views', path.join(__dirname, 'src', 'views'))
app.use(express.static(path.join(process.env.PWD, 'public'))) // 02.03 тест подключения css - работает

app.use(express.urlencoded({extended: true}))

app.get('/', function (req, res) { // не работает если reverse=true&limit=1
  const queryFromUser = req.query 
  let postsForRender = db.posts
  console.log(queryFromUser)

  if (queryFromUser.reverse !== 'true') {
    postsForRender = db.posts
  } else {
    let reverseMassive = db.posts.slice(0, postsForRender.length)
      postsForRender = reverseMassive.reverse()
    }

  if (queryFromUser.limit !== undefined && Number.isNaN(+queryFromUser.limit) === false) {
    postsForRender = db.posts.slice(0, queryFromUser.limit)
  }
  
    console.log(postsForRender)
  res.render('main', {listOfPosts: postsForRender})
})

app.post('/addressbook', (req, res) => {
  const dataFromForm = req.body

  // console.log({ dataFromForm })

  db.posts.push(dataFromForm)

  res.redirect('/')
})

// app.get('/new_post', (req, res) => {
//   res.render('addNewPost')
// })

app.get('*', (req, res) => {
  res.send(`<div> 
  <h1>404</h1>
  <a href = '/'>Link to main page </a>
  </div>`)
})

app.listen(PORT, () => {
  console.log(`Server has been started on port: ${PORT}`)
})