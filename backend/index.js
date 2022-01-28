const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const bearerToken = require('express-bearer-token')

const app = express()
const port = process.env.PORT || 2000

app.use(cors())
app.use(bearerToken())
app.use(bodyParser.json())
app.use(express.static('public'))

const {
    userRouter,
    adminRouter,
} = require('./router')

app.get('/', (req, res) => {
    res.status(200).send('<h2>E-KINERJA API</h2>')
})

app.use('/user', userRouter)
app.use('/admin', adminRouter)


app.listen(port, () => console.log('API aktif di port ' + port))