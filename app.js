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

function testgraph(graph){
    console.log("=======================================");
    console.log("    Тестирование операций с графом    ");
    console.log("=======================================\n");
    // 1. Добавление узла
    try {
        const testNode = "testuzel";
        graph.addVertex(testNode);
        console.log(`Узел "${testNode}" успешно добавлен.`);
    } catch (error) {
        console.log(`Ошибка при добавлении узла: ${error.message}`);
    }
    try {
        const testNode = "testuzel2";
        graph.addVertex(testNode);
        console.log(`Узел "${testNode}" успешно добавлен.`);
    } catch (error) {
        console.log(`Ошибка при добавлении узла: ${error.message}`);
    }
    try {
        const testNode = "testuzel3";
        graph.addVertex(testNode);
        console.log(`Узел "${testNode}" успешно добавлен.`);
    } catch (error) {
        console.log(`Ошибка при добавлении узла: ${error.message}`);
    }
    try {
        const testNode = "testuzel4";
        graph.addVertex(testNode);
        console.log(`Узел "${testNode}" успешно добавлен.`);
    } catch (error) {
        console.log(`Ошибка при добавлении узла: ${error.message}`);
    }
    // 2. Добавление петли
    try {
        graph.addUndirectedEdge("testuzel", "testuzel", 12);
        console.log("Петля addUndirectedEdge для узла 'testuzel' успешно добавлена.");
    } catch (error) {
        console.log(`Ошибка addUndirectedEdge при добавлении петли: ${error.message}`);
    }
    try {
        graph.addDirectedEdgeNonWeight("testuzel", "testuzel");
        console.log("Петля addDirectedEdgeNonWeight для узла 'testuzel' успешно добавлена.");
    } catch (error) {
        console.log(`Ошибка addUndirectedEdge при добавлении петли: ${error.message}`);
    }
    try {
        graph.addDirectedEdge("testuzel", "testuzel", 12);
        console.log("Петля addDirectedEdge для узла 'testuzel' успешно добавлена.");
    } catch (error) {
        console.log(`Ошибка addUndirectedEdge при добавлении петли: ${error.message}`);
    }
    try {
        graph.addUndirectedEdgeNonWeight("testuzel", "testuzel");
        console.log("Петля addDirectedEdge для узла 'testuzel' успешно добавлена.");
    } catch (error) {
        console.log(`Ошибка addUndirectedEdge при добавлении петли: ${error.message}`);
    }
    // 3. Добавление одних и тех же ребер рёбер без веса
    try {
        graph.addUndirectedEdgeNonWeight("testuzel", "testuzel2");
        //console.log("Неориентированое невзвешенное ребро между узлами testuzel и testuzel2 успешно добавлено.");
    } catch (error) {
        console.log(`Ошибка при добавлении рёбер без веса: ${error.message}`);
    }
    try {
        graph.addDirectedEdgeNonWeight("testuzel", "testuzel2");
       // console.log("Ориентированое невзвешенное Ребро без веса между testuzel и testuzel2 успешно добавлено.");
    } catch (error) {
        console.log(`Ошибка при добавлении рёбер без веса: ${error.message}`);
    }
    // 4. Добавление рёбер с весом
    try {
        graph.addUndirectedEdge("testuzel2", "testuzel3", 5);
       // console.log("Ребро с весом между testuzel2 и testuzel3 успешно добавлено.");
    } catch (error) {
        console.log(`Ошибка при добавлении рёбер с весом: ${error.message}`);
    }
    try {
        graph.addDirectedEdge("testuzel2", "testuzel3", 5);
      //  console.log("Ребро с весом между testuzel2 и testuzel3 успешно добавлено.");
    } catch (error) {
        console.log(`Ошибка при добавлении рёбер с весом: ${error.message}`);
    }
    // 5. Удаление ребра
    try {
        graph.deleteUndirectedEdge("testuzel2", "testuzel3");
        console.log("Петля для узла 'testuzel' успешно удалена.");
    } catch (error) {
        console.log(`Ошибка при удалении петли: ${error.message}`);
    }
    // 6. Удаление петли
    try {
        graph.deleteUndirectedEdge("testuzel", "testuzel");
        console.log("Петля для узла 'testuzel' успешно удалена.");
    } catch (error) {
        console.log(`Ошибка при удалении петли: ${error.message}`);
    }
     //7. Удаление узла
     try {
        graph.deleteVertex("testuzel");
        console.log("Узел 'testuzel' успешно удалён.");
    } catch (error) {
        console.log(`Ошибка при удалении узла: ${error.message}`);
    }
    //8. Принт графа
    try {
        graph.printGraph();
        console.log("принт графа.");
    } catch (error) {
        console.log(`Ошибка при выводе графа: ${error.message}`);
    }
    //2-е задание
    try {
        graph.printGraph();
        console.log("принт графа.");
    } catch (error) {
        console.log(`Ошибка при выводе графа: ${error.message}`);
    }
    try {
        if ((graph.constructor.name === "DirectedUnweightedGraph") || (graph.constructor.name === "DirectedWeightedGraph")) {
            const vertices = graph.findVerticesWithHigherOutDegree();
            if (vertices.length) {
                console.log("Вершины с полустепенью исхода больше полустепени захода:", vertices.join(", "));
            } else {
                console.log("Таких вершин нет.");
            }
        } else {
            console.log("Ошибка: Эта задача применима только для ориентированных графов, поскольку в ориентированном графе у рёбер есть направление.");
        }
    } catch (error) {
        console.log(`Ошибка при выполнении задания 1: ${error.message}`);
    }
    // 9. Задание 2 (Вычисление степеней для всех вершин)
    try {
        graph.calculateDegree();
        console.log("Степени всех вершин успешно вычислены.");
    } catch (error) {
        console.log(`Ошибка при вычислении степеней: ${error.message}`);
    }

    try {
        // 10. Задание 3 (Обращение графа для ориентированных графов)
        if ((graph.constructor.name === "DirectedUnweightedGraph") || (graph.constructor.name === "DirectedWeightedGraph")) {
            const reversedGraph = graph.reverseGraph();
            console.log("Структура обращённого графа:");
            console.log(reversedGraph.adjacencyList);
        } else {
            console.log("Ошибка: Эта задача применима только для ориентированных графов.");
        }
    } catch (error) {
        console.log(`Ошибка при выполнении задания 3: ${error.message}`);
    }
    
  

    console.log("\n=======================================");
    console.log("          Тестирование завершено       ");
    console.log("=======================================\n");
}

function printGraphType(graph) {
    const graphTypeMap = {
        "UndirectedUnweightedGraph": "Неориентированный невзвешенный граф",
        "UndirectedWeightedGraph": "Неориентированный взвешенный граф",
        "DirectedUnweightedGraph": "Ориентированный невзвешенный граф",
        "DirectedWeightedGraph": "Ориентированный взвешенный граф"
    };

    const graphType = graphTypeMap[graph.constructor.name] || "Неизвестный тип графа";

    console.log(`\nТекущий граф: ${graphType}`);
}

//-----------------------------ошибки-----------------------------
const testFiles = [
    'Неправильнаяструктура.txt',
    'Неправильныйформат.txt',
    'Нетсоседей.txt',
    'Некорректноезначениеузла.txt',
    'Дублирующиесяребра.txt',
//    'Отрицательныеребра.txt', нужно уточнить
    'Неправильныйвес.txt',
    'Несуществующийграф.txt',

];

// Запуск тестов по кнопке
function testBrokenGraphs(showMainMenu) {
  // Массив промисов для загрузки файлов
  const filePromises = testFiles.map((fileName, index) => {
    return loadGraphFromFile(fileName)
        .then(() => {
            console.log(`${index + 1}. Файл "${fileName}" загружен успешно.`);
        })
        .catch(error => {
            console.log(`${index + 1}. Ошибка при загрузке файла: "${fileName}"`);
            console.log(`   Причина: ${error.message}`);
            if (error.details) {
                console.log(`   Детали: ${error.details}`);
            }
            console.log("---------------------------------------\n");
        });
});

// Ожидаем завершения всех промисов, а затем возвращаемся в меню
Promise.all(filePromises)
    .then(() => {
        showMainMenu(); // Возвращаемся в меню после завершения тестов
    })
    .catch(error => {
        console.log("Произошла ошибка при тестировании файлов: ", error);
        showMainMenu(); // Возвращаемся в меню, даже если произошла ошибка
    });
}
// ---------------------------------------------------------------------------------------------------------------

module.exports = { saveGraphToFile, loadGraphFromFile, testgraph, printGraphType, testFiles, testBrokenGraphs };