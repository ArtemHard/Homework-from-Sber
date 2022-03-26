const express = require('express')
const bcrypt = require('bcrypt'); 
const { v4: uuidv4 } = require('uuid');
const { request, Server } = require('http')
const path = require('path')
const hbs = require('hbs')
const sessions = require('express-session')
const { db } = require('./DB.js')

const WebSocket = require('ws')

const http = require('http'); // 2.22

const res = require('express/lib/response')
const { checkAuth } = require('./src/middlewares/checkAuth.js');
const async = require('hbs/lib/async');
const exp = require('constants');

const PORT = process.env.PORT || 3000

const saltRounds = 10;


const app = express()
const server = http.createServer(app)
const map = new Map()

const wss = new WebSocket.Server({ clientTracking: false, noServer: true });

server.on('upgrade', function (request, socket, head) {
  
    wss.handleUpgrade(request, socket, head, function (ws) {
      wss.emit('connection', ws, request);
    });
});

wss.on('connection', function (ws, request) {
  const userId = request.session.userId;

  map.set(userId, ws);

  ws.on('message', function (message) {
    //
    // Here we can now use session parameters.
    //
    console.log(`Received message ${message} from user ${userId}`);
  });

  ws.on('close', function () {
    map.delete(userId);
  });
});


app.set('view engine', 'hbs')
app.set('views', path.join(process.env.PWD, 'src', 'views'))

app.set('cookieName', 'sid')

hbs.registerPartials(path.join(process.env.PWD, 'src', 'views', 'partials'))
const secretKey = 'skurbgdfgsmjdsfkjsdfg'

app.use(express.static(path.join(process.env.PWD, 'public'))) // 02.03 тест подключения css - работает

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static('public'))
app.use(sessions({
  name: app.get('cookieName'),
  secret: secretKey,
  resave: false, // Не сохранять сессию, если мы ее не изменим
  saveUninitialized: false, // не сохранять пустую сессию
  // store: new FileStore({ // выбираем в качестве хранилища файловую систему
  //   secret: secretKey,
  // }),
  cookie: { // настройки, необходимые для корректного работы cookie
    // secure: true, 
    httpOnly: true, // не разрещаем модифицировать данную cookie через javascript
    maxAge: 86400 * 1e3, // устанавливаем время жизни cookie
  },
}))


app.use((req, res, next) => {
  const currentuserId = req.session?.user?.userId
// 1.42
  if (currentuserId) {
    const currentUser = db.users.find((user) => user.id === currentuserId)
   
    res.locals.nickname = currentUser.nickname // доступен внутри hbs без его передачи, доступ по названию nickname
    
  }

next()
})

app.get('/', function (req, res) { // не работает если reverse=true&limit=1
  const queryFromUser = req.query 
  let postsForRender = db.posts

  if (queryFromUser.reverse !== 'true') {
    postsForRender = db.posts
  } else {
    let reverseMassive = db.posts.slice(0, postsForRender.length)
      postsForRender = reverseMassive.reverse()
    }

  if (queryFromUser.limit !== undefined && Number.isNaN(+queryFromUser.limit) === false) {
    postsForRender = db.posts.slice(0, queryFromUser.limit)
  }
  
  res.render('main', {listOfPosts: postsForRender})
})

app.delete('/fetch', (req, res) => {
  console.log('>>>>', req.body, req.session)
  res.sendStatus(200)
})


app.get('/secret', checkAuth,(req, res) => {
  res.render('secret', )
})

app.get('/auth/signup', (req, res) => {
  res.render('signUp')
})

app.post('/auth/signup', async (req, res) => {
  const { nickname, email, password } = req.body

  const hashPass = await bcrypt.hash(password, saltRounds)
  const userId = uuidv4()


  db.users.push({
    nickname,
    email,
    password: hashPass,
    id: userId,
  })
  
  req.session.user = {
    email,
    nickname,
    userId:userId
  }
  // console.log(req.session.user)
  // console.log(db.users)

  res.redirect('/')
})

app.get('/auth/signin', async (req, res) => {
  res.render('signIn')
})

app.post('/auth/signin', async (req, res) => {
  const { email, password } = req.body
  
  const currentUser = db.users.find((user) => user.email === email)
 
  const currentName = currentUser.nickname
  const currentIdUser = currentUser.id

  if (currentUser) {
    if (await bcrypt.compare(password, currentUser.password)) {
      req.session.user = {
        nickname: currentName,
        userId:currentIdUser,
      }
      return res.redirect('/')
    }

  }

  return res.redirect('/auth/signin')

})

app.get('/auth/signout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.redirect('/')

    res.clearCookie(req.app.get('cookieName'))
    return res.redirect('/')
  })
})

app.post('/addressbook', (req, res) => {
  const dataFromForm = req.body
  dataFromForm.nickname = req.session.user.nickname
  // dataFromForm.email = req.session.user.email
  dataFromForm.authorId = req.session.user.userId
  dataFromForm.postId = Date.now()
 
  console.log({ dataFromForm })

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

