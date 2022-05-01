// 1. Примитивы (string, number, boolean, undefined, null)
// 1.1 NaN, Symbol, Infinity, BigInt - с этими работать не будем.
// 2. Объекты (array, object, function)
// - Сложная структура
// - Могуть иметь методы и функции
// - Ссылочный тип данных
// Для большого объема вложенности массивов/объектов - можно использовать библиотеки Lodash или CloneDeep
let user = {
    name: 'Bob',
    age: 22,
    isStudent: true,
    isMarried: false,
    friends: ['Fred', 'Donald', 'Ann']
}
// Сделали копию объекта USER который теперь можно изменить, изменения не затронут основной объект USER
let copyUser =  {...user} // Spread оператор (позволяет забрать все свойства из объекта)
copyUser.friends.push('Helga')
let deepCopy = {...user, friends: [...user.friends]} // Создается новый массив внутри объекта (НЕ является ссылкой на прошлый массив)


// Создаем дефолтный массив
const students = [
    {name: 'Alex'},
    {name: 'Bob'},
    {name: 'Donald'},
    {name: 'Ann'}
]
let copeSt = [...students] // Поверхностная копия объекта
let deepCopySt = students.map((y) => ({...y})) // Возвращает новый массив (глубокая копия)
