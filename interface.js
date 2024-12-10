const readline = require('readline');
const fs = require('fs');
const path = require('path');
const { GraphFactory, Graph } = require('./graphmethods');
const { saveGraphToFile, loadGraphFromFile } = require('./app');

// Создаем интерфейс для ввода с консоли
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


// Приветствие и интерфейс выбора
console.log("Привет!");
console.log("Вы хотите загрузить существующий граф из файла или создать новый?");
console.log("1. Загрузить существующий граф из файла");
console.log("2. Работать в новом");
console.log("3. Завершить программу");

rl.question('Выберите опцию (1/2/3): ', (choice) => {
    switch (choice) {
        case '1':
            loadGraph(); // Загружаем граф из файла
            break;
        case '2':
            console.log("Работаем с новым графом...");
            createNewGraph()
            break;
        case '3':
            console.log("Завершаем программу...");
            rl.close();
            break;
        default:
            console.log("Неверный выбор.");
            rl.close();
            break;
    }
});

// Функция для выбора и загрузки графа
async function loadGraph() {
    rl.question('Введите название файла: ', (fileName) => {
        if (!fileName.endsWith('.txt')) {
            fileName += '.txt';  // Дописываем .txt, если не указано
        }

        // Вызовем loadGraphFromFile с именем файла
        console.log(`функция loadgraph запущена (удалить): ${fileName}`);
        loadGraphFromFile(fileName);  // Передаем только имя файла


        rl.close(); // Закрываем интерфейс после выполнения
    });
}

function createNewGraph() {
    console.log("Выберите тип графа, который хотите создать:");
    console.log("1. Ориентированный взвешенный граф");
    console.log("2. Ориентированный невзвешенный граф");
    console.log("3. Неориентированный взвешенный граф");
    console.log("4. Неориентированный невзвешенный граф");

    rl.question("Введите номер типа графа (1-4): ", (choice) => {
        let graph;
        switch (choice) {
            case "1":
                graph = GraphFactory.createGraph("DirectedWeightedGraph");
                break;
            case "2":
                graph = GraphFactory.createGraph("DirectedUnweightedGraph");
                break;
            case "3":
                graph = GraphFactory.createGraph("UndirectedWeightedGraph");
                break;
            case "4":
                graph = GraphFactory.createGraph("UndirectedUnweightedGraph");
                break;
            default:
                console.log("Неверный выбор.");
                rl.close();
                return;
        }

        console.log("Новый граф успешно создан!");
        editGraphMenu(graph); // Переход в меню редактирования графа
    });
}

function editGraphMenu(graph) {
    console.log("Выберите действие с графом:");
    console.log("1. Добавить вершину");
    console.log("2. Удалить вершину");

    if (graph.constructor.name === "UndirectedUnweightedGraph") {
        console.log("3. Добавить неориентированное невзвешенное ребро");
        console.log("4. Удалить неориентированное невзвешенное ребро");
    } else if (graph.constructor.name === "UndirectedWeightedGraph") {
        console.log("3. Добавить неориентированное взвешенное ребро");
        console.log("4. Удалить неориентированное взвешенное ребро");
    }
    // Добавить проверки для других типов графов

    console.log("5. Печать графа");
    console.log("6. Сохранить граф в файл");
    console.log("7. Завершить редактирование");

    rl.question("Выберите действие: ", (choice) => {
        switch (choice) {
            case "1":
                rl.question("Введите имя вершины: ", (vertex) => {
                    graph.addVertex(vertex);
                    console.log(`Вершина ${vertex} добавлена.`);
                    editGraphMenu(graph); // Возвращаемся в меню
                });
                break;
            case "2":
                rl.question("Введите имя вершины: ", (vertex) => {
                    graph.deleteVertex(vertex);
                    console.log(`Вершина ${vertex} и её ребра удалены.`);
                    editGraphMenu(graph); // Возвращаемся в меню
                });
                break;
            case "3":
                if (graph.constructor.name === "UndirectedUnweightedGraph") {
                    rl.question("Введите вершины через пробел (v1 v2): ", (input) => {
                        const [v1, v2] = input.split(" ");
                        graph.addUndirectedEdgeNonWeight(v1, v2);
                        editGraphMenu(graph);
                    });
                } else if (graph.constructor.name === "UndirectedWeightedGraph") {
                    rl.question("Введите вершины и вес через пробел (v1 v2 вес): ", (input) => {
                        const [v1, v2, weight] = input.split(" ");
                        graph.addUndirectedEdge(v1, v2, parseFloat(weight));
                        editGraphMenu(graph);
                    });
                }
                break;
            case "5":
                graph.printGraph();
                editGraphMenu(graph);
                break;
            case "6":
                graph.saveGraph();
                editGraphMenu(graph);
                break;
            case "7":
                console.log("Выход из редактирования графа.");
                rl.close();
                break;
            default:
                console.log("Неверный выбор.");
                editGraphMenu(graph);
        }
    });
}

async function saveGraph(graph) {
    rl.question('Введите название файла: ', (fileName) => {
        if (!fileName.endsWith('.txt')) {
            fileName += '.txt';  // Дописываем .txt, если не указано
        }

        // Вызовем loadGraphFromFile с именем файла
        console.log(`функция savegraph запущена (удалить): ${fileName}`);
        saveGraphToFile(graph, fileName);// Передаем только имя файла


        rl.close(); // Закрываем интерфейс после выполнения
    });
}