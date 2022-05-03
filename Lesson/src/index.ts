import express, { Request, Response } from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

const app = express()
const port = 3000
app.use(cors())
app.use(bodyParser.json())

let videos = [
  {id: 1, title: 'About JS - 01', author: 'it-incubator.eu'},
  {id: 2, title: 'About JS - 02', author: 'it-incubator.eu'},
  {id: 3, title: 'About JS - 03', author: 'it-incubator.eu'},
  {id: 4, title: 'About JS - 04', author: 'it-incubator.eu'},
  {id: 5, title: 'About JS - 05', author: 'it-incubator.eu'},
]

app.get('/', (req: Request, res: Response ) => {
    res.send('Hello: World!!!!!!')
})
app.get('/videos', (req: Request, res: Response ) => {
  res.send(videos)
})
app.get('/videos/:videoId', (req: Request, res: Response) => {
  const id = +req.params.videoId;
  // определяем алгоритм поиска с помощью метода Find
  const video = videos.find((v) => {
    if (v.id === id) return true;
    else return false
  })
  // Возврат запрошенного видео
  if (video !== undefined) {
    res.send(video)
  }
  // Возврат ошибки, если Video не найдено (false)
  else {
    res.send(404)
  }
})
// Попытка любой ошибочный URL вывести в ошибку.
app.get('*', function(req, res){
  res.send('You have some troubles');
});
// Позволяет по кнопке "Create" - создать видео где ID = Дата создания IRL, Title - Поле ввода (после перезагрузки сервера данные пропадут)
app.post('/videos', (req: Request, res: Response) => {
  const newVideo = {
      id: +(new Date()),
      title: req.body.title,
      author: 'it-incubator.eu'
  }
  videos.push(newVideo)
  res.status(201).send(newVideo)
})
// Удаляем запрошенный ID видео из массива Videos (фильтруем)
app.delete('/videos/:id',(req: Request, res: Response)=>{
      videos = videos.filter((v) => v.id !== +req.params.id)
      res.send(204)
})
app.put('/videos/:id',(req: Request, res: Response)=>{
  const video = videos.find((v) => {
    const id = +req.params.id;
    if (v.id === id) return true;
    else return false
  })
  // Возврат запрошенного видео
  if (video !== undefined) {
    video.title = req.body.title
    res.send(video)
  }
  // Возврат ошибки, если Video не найдено (false)
  else {
    res.send(404)
  }
})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})