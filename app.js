const express = require('express')
const session = require('express-session')
global.__basedir = __dirname;
const { home, formPost, createPost, login, actionLogin, actionLogout, editPost, updatePost, deletePost } = require('./controllers');
const uploadMulter = require('./middleware/multer');
const isAuthenticated = require('./middleware/session');
const app = express()
const port = 3000

app.use(session({
    secret: 'kocheng',
    resave: false,
    saveUninitialized: true
}))

app.use('/uploads', express.static('uploads'))
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))

app.get('/', isAuthenticated, home)
app.get('/login', login)
app.post('/login', actionLogin)
app.get('/logout', actionLogout)
app.get('/formPost', isAuthenticated, formPost)
app.post('/formPost', isAuthenticated, uploadMulter.single('imgUrl') ,createPost)
app.get('/editPost/:id', isAuthenticated, editPost)
app.post('/editPost/:id', isAuthenticated, uploadMulter.single('imgUrl'), updatePost)
app.get('/deletePost/:id', isAuthenticated, deletePost)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})