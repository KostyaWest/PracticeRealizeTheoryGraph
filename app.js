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

// Пример использования: загрузка всех файлов из папки createdgraph
fs.readdir(path.join(__dirname, 'createdgraph'), (err, files) => {
    if (err) {
        console.log("Ошибка при чтении директории:", err);
        return;
    }

    // Загружаем каждый файл, который имеет расширение .txt
    files.filter(file => file.endsWith('.txt')).forEach(file => {
        console.log(`Загружаем граф из файла: ${file}`);
        loadGraphFromFile(file);
    });
});
