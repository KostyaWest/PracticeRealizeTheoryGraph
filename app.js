const fs = require('fs');
const path = require('path');
const { GraphFactory, Graph } = require('./graphmethods');

function validateAdjacencyList(adjacencyList) {
    // Проверяем, что adjacencyList - это объект
    if (typeof adjacencyList !== 'object' || adjacencyList === null) {
        console.error("Ошибка: Список смежности должен быть объектом.");
        return false;
    }

    // Проверяем каждый узел графа
    for (const vertex in adjacencyList) {
        // Убедимся, что узлы являются строками
        if (typeof vertex !== 'string') {
            console.error(`Ошибка: Узел "${vertex}" не является строкой.`);
            return false;
        }

        const neighbors = adjacencyList[vertex];

        // Проверяем, что список соседей - это массив
        if (!Array.isArray(neighbors)) {
            console.error(`Ошибка: Список соседей для узла "${vertex}" должен быть массивом.`);
            return false;
        }

        // Проверяем каждый соседний узел
        for (const neighbor of neighbors) {
            if (typeof neighbor !== 'object' || !neighbor.node || typeof neighbor.node !== 'string') {
                console.error(`Ошибка: Сосед узла "${vertex}" имеет некорректный формат:`, neighbor);
                return false;
            }
        }
    }

    return true;
}

// Функция для загрузки графа из текстового файла
function loadGraphFromFile(fileName) {
    const filePath = path.join(__dirname, 'createdgraph', fileName);

    return new Promise((resolve, reject) => {
        // Проверяем, существует ли файл
        if (!fs.existsSync(filePath)) {
            return reject(new Error(`Файл ${fileName} не существует.`));
        }

        // Читаем файл
        fs.readFile(filePath, 'utf8', (err, fileContent) => {
            if (err) {
                return reject(new Error('Ошибка при чтении файла.'));
            }

            try {
                const adjacencyList = JSON.parse(fileContent);
                // Проверка на дублирующиеся рёбра
                const edgesSet = new Set(); // Множество для отслеживания рёбер
                for (const vertex in adjacencyList) {
                    adjacencyList[vertex].forEach(edge => {
                        const edgeString = `${vertex}-${edge.node}-${edge.weight || ''}`;
                        if (edgesSet.has(edgeString)) {
                            throw new Error(`Ошибка: Найдено дублирующееся ребро: ${edgeString}`);
                        }
                        edgesSet.add(edgeString);
                    });
                }
                // Добавляем валидацию данных
                if (!validateAdjacencyList(adjacencyList)) { return reject(new Error('Ошибка: Некорректный формат данных в файле.'));  }
                const graph = GraphFactory.createGraphFromData(adjacencyList);
                resolve(graph); // Успешно возвращаем загруженный граф
            } catch (error) {
                reject(new Error(`Ошибка при загрузке графа: ${error.message}`));
            }
        });
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

module.exports = { saveGraphToFile, loadGraphFromFile };