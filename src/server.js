const express = require('express')
const server = express()

const { pageLanding, pageStudy, pageGiveClasses, saveClasses } = require('./pages')

// Configura nunjucks
const nunjucks = require('nunjucks')
nunjucks.configure('src/views', {
    express: server,
    noCache: true,
})

server
// Recebe os dados da req.body
.use(express.urlencoded({extended: true}))
// Configura arquivos estaticos (css, scrips, images)
.use(express.static("public"))
// Rotas de aplicação, paginas
.get("/", pageLanding)
.get("/study", pageStudy)
.get("/give-classes", pageGiveClasses)
.post("/save-classes", saveClasses)
.listen(5500)