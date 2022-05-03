import express, { Request, Response } from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

const app = express()
const port = 5000
app.use(cors())
app.use(bodyParser.json())



app.get('/', (req: Request, res: Response ) => {
    res.send('Hello: World!')
})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})