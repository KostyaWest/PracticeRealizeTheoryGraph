const fs = require('fs');
const path = require('path');
const { GraphFactory, Graph } = require('./graphmethods');

// Функция для загрузки графа из текстового файла
function loadGraphFromFile(fileName) {
    const filePath = path.join(__dirname, 'createdgraph', fileName);

    // Проверяем, существует ли файл
    if (!fs.existsSync(filePath)) {
        console.log(`Файл ${fileName} не существует.`);
        return;
    }

    // Читаем содержимое файла
    fs.readFile(filePath, 'utf8', (err, fileContent) => {
        if (err) {
            console.log('Ошибка при чтении файла:', err);
            return;
        }

        try {
            const adjacencyList = JSON.parse(fileContent);
            const graph = GraphFactory.createGraphFromData(adjacencyList);

            console.log(`Тип графа: ${graph.constructor.name}`);
            graph.printGraph();
        } catch (error) {
            console.error("Ошибка при загрузке графа:", error.message);
        }
    });
}

const saveGraphToFile = (graph, fileName) => {
    const fs = require('fs');
    const path = require('path');

    const folderPath = path.join(__dirname, 'createdgraph'); // Путь к папке
    const filePath = path.join(folderPath, fileName);       // Полный путь к файлу

    try {
        // Преобразуем adjacencyList в JSON-строку с отступами для читаемости
        const graphData = JSON.stringify(graph.adjacencyList, null, 2);

        // Записываем данные в файл с расширением .txt
        fs.writeFileSync(filePath, graphData, 'utf8');
        console.log(`Граф успешно сохранён в файл: ${filePath}`);
    } catch (error) {
        console.error(`Ошибка при сохранении графа в файл: ${error.message}`);
    }
};

// const adjacencyList = {
//     "A": [{ "node": "B", "weight": 5 }, { "node": "C", "weight": 12 }],
//     "B": [{ "node": "A", "weight": 5 }],
//     "C": [{ "node": "A", "weight": 12 }]
// };

// // Создаём граф с использованием фабрики
// const myGraph = GraphFactory.createGraphFromData(adjacencyList);

// // Сохраняем граф в файл
// saveGraphToFile(myGraph, 'exampleGraph.txt');

// // Для проверки выводим граф
// console.log("Граф успешно создан и сохранён");
// console.log("Загрузка и определение созданного графа:");
// loadGraphFromFile('exampleGraph.txt');

module.exports = { saveGraphToFile, loadGraphFromFile };