"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
let videos = [
    { id: 1, title: 'About JS - 01', author: 'it-incubator.eu' },
    { id: 2, title: 'About JS - 02', author: 'it-incubator.eu' },
    { id: 3, title: 'About JS - 03', author: 'it-incubator.eu' },
    { id: 4, title: 'About JS - 04', author: 'it-incubator.eu' },
    { id: 5, title: 'About JS - 05', author: 'it-incubator.eu' },
];
app.get('/', (req, res) => {
    res.send('Проект с пройденными тестами :D ');
});
app.get('/videos', (req, res) => {
    res.send(videos);
});
app.get('/videos/:videoId', (req, res) => {
    const id = +req.params.videoId;
    // определяем алгоритм поиска с помощью метода Find
    const video = videos.find((v) => {
        if (v.id === id)
            return true;
        else
            return false;
    });
    // Возврат запрошенного видео
    if (video !== undefined) {
        res.send(video);
    }
    // Возврат ошибки, если Video не найдено (false)
    else {
        res.send(404);
    }
});
// Позволяет по кнопке "Create" - создать видео где ID = Дата создания IRL, Title - Поле ввода (после перезагрузки сервера данные пропадут)
app.post('/videos', (req, res) => {
    // Проверяем, является ли Title 
    const el = req.body.title;
    if ((typeof el) !== "string" || req.body.title.length >= 40) {
        return res.status(400).send({ errorsMessages: [{ message: "string", field: "title" }], resultCode: 1 });
    }
    const newVideo = {
        id: +(new Date()),
        title: req.body.title,
        author: 'it-incubator.eu'
    };
    videos.push(newVideo);
    res.status(201).send(newVideo);
});
// Удаляем запрошенный ID видео из массива Videos (фильтруем)
app.delete('/videos/:id', (req, res) => {
    const beforeFilter = [...videos].length;
    videos = videos.filter((v) => v.id !== +req.params.id);
    if (beforeFilter === videos.length) {
        res.send(404);
    }
    else {
        res.send(204);
    }
});
app.put('/videos/:id', (req, res) => {
    const el = req.body.title;
    const video = videos.find((v) => {
        const id = +req.params.id;
        if (v.id === id)
            return true;
        else
            return false;
    });
    // Возврат запрошенного видео
    if (video !== undefined && (typeof el) == "string" && req.body.title.length <= 40) {
        video.title = req.body.title;
        res.status(204).send(video);
    }
    else if ((typeof el) !== "string" || req.body.title.length >= 40) {
        res.status(400).send({ errorsMessages: [{ message: "string", field: "title" }], resultCode: 1 });
    }
    // Возврат ошибки, если Video не найдено (false)
    else {
        res.status(404).send();
    }
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
//# sourceMappingURL=index.js.map