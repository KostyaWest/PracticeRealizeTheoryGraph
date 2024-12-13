const readline = require('readline');
const fs = require('fs');
const path = require('path');
const { GraphFactory, Graph } = require('./graphmethods');
const { saveGraphToFile, loadGraphFromFile } = require('./app');

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
function testBrokenGraphs() {
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

// Создаем интерфейс для ввода с консоли
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function startApp() {
    showMainMenu();  // Просто вызываем main menu один раз
}

startApp();  // Начинаем приложение

// -------------------------------------------------функции для вызова функций--------------------------------------------------------------

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

async function saveGraph(graph) {
    rl.question('Введите название файла: ', (fileName) => {
        if (!fileName.endsWith('.txt')) { fileName += '.txt'; }
        saveGraphToFile(graph, fileName); 
        rl.close();
    });
}


// ---------------------------------------------------------------------------------------------------------------
// Приветствие и интерфейс выбора
function showMainMenu() {
    console.log("Привет!");
    console.log("Вы хотите загрузить существующий граф из файла или создать новый?");
    console.log("1. Загрузить существующий граф из файла");
    console.log("2. Работать в новом");
    console.log("3. Запустить файлы в которых намеренно сделаны ошибки, для проверки программы")
    console.log("4. Завершиить программу");

    rl.question('Выберите задачу: ', (choice) => {
        switch (choice) {
            case '1':
                loadGraph(); // Загружаем граф из файла
                break;
            case '2':
                console.log("Работаем с новым графом...");
                createNewGraph();
                break;
            case '3':
                console.log("=======================================");
                console.log("        РЕЗУЛЬТАТ ЗАГРУЗКИ ФАЙЛОВ      ");
                console.log("=======================================\n");
                testBrokenGraphs(); // Ждём завершения тестов
                break;
            case '4':
                console.log("Завершаем программу...");
                rl.close();
                break;
            default:
                console.log("Неверный выбор.");
                // Просто повторяем запрос
                showMainMenu();
                break;
        }
    });
}




// Функция для выбора и загрузки графа
async function loadGraph() {
    rl.question('Введите название файла: ', async (fileName) => {
        if (!fileName.endsWith('.txt')) {
            fileName += '.txt'; // Добавляем расширение .txt, если его нет
        }

        try {
            console.log(`Загрузка графа из файла: ${fileName}`);
            const graph = await loadGraphFromFile(fileName); // Ждём выполнения функции

            console.log('Граф успешно загружен!');
            editGraphMenu(graph); // Открываем меню редактирования
        } catch (error) {
            console.error(error.message); // Выводим сообщение об ошибке
            showMainMenu(); // Возвращаемся в главное меню
        }
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

//тотальный тест
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

function editGraphMenu(graph) {
    printGraphType(graph);
    console.log("Выберите действие с графом:");
    console.log("1. Добавить вершину");
    console.log("2. Удалить вершину");

    if (graph.constructor.name === "UndirectedUnweightedGraph") {
        console.log("3. Добавить неориентированное невзвешенное ребро");
        console.log("4. Удалить неориентированное невзвешенное ребро");
    } else if (graph.constructor.name === "UndirectedWeightedGraph") {
        console.log("3. Добавить неориентированное взвешенное ребро");
        console.log("4. Удалить неориентированное взвешенное ребро");
    }else if (graph.constructor.name === "DirectedUnweightedGraph") {
        console.log("3. Добавить ориентированное невзвешенное ребро");
        console.log("4. Удалить ориентированное невзвешенное ребро");
    }else if (graph.constructor.name === "DirectedWeightedGraph") {
        console.log("3. Добавить ориентированное взвешенное ребро");
        console.log("4. Удалить ориентированное взвешенное ребро");
    }
    console.log("5. Печать графа");
    console.log("6. Сохранить граф в файл");
    console.log("7. Перейти к заданиям");
    console.log("8. Провести большое тестирование");
    console.log("9. Завершить редактирование");

    rl.question("Выберите действие: ", (choice) => {
        switch (choice) {
            case "1":
                rl.question("Введите имя вершины: ", (vertex) => {
                    try {
                        graph.addVertex(vertex);
                        console.log(`Вершина "${vertex}" успешно добавлена.`);
                    } catch (error) {
                        console.error(error.message);
                    }
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
                } else if (graph.constructor.name === "DirectedUnweightedGraph") {
                    rl.question("Введите вершины и вес через пробел (v1 v2 вес): ", (input) => {
                        const [v1, v2] = input.split(" ");
                        graph.addDirectedEdgeNonWeight(v1, v2);
                        editGraphMenu(graph);
                    });
                } else if (graph.constructor.name === "DirectedWeightedGraph") {
                    rl.question("Введите вершины и вес через пробел (v1 v2 вес): ", (input) => {
                        const [v1, v2, weight] = input.split(" ");
                        graph.addDirectedEdge(v1, v2, parseFloat(weight));
                        editGraphMenu(graph);
                    });
                }
                case "4":
                if (graph.constructor.name === "UndirectedUnweightedGraph") {
                    rl.question("Введите вершины через пробел (v1 v2): ", (input) => {
                        const [v1, v2] = input.split(" ");
                        graph.deleteUndirectedEdgeNonWeight(v1, v2);
                        editGraphMenu(graph);
                    });
                } else if (graph.constructor.name === "UndirectedWeightedGraph") {
                    rl.question("Введите вершины и вес через пробел (v1 v2 вес): ", (input) => {
                        const [v1, v2, weight] = input.split(" ");
                        graph.deleteUndirectedEdge(v1, v2);
                        editGraphMenu(graph);
                    });
                } else if (graph.constructor.name === "DirectedUnweightedGraph") {
                    rl.question("Введите вершины и вес через пробел (v1 v2): ", (input) => {
                        const [v1, v2] = input.split(" ");
                        graph.deleteDirectedEdgeNonWeight(v1, v2);
                        editGraphMenu(graph);
                    });
                } else if (graph.constructor.name === "DirectedWeightedGraph") {
                    rl.question("Введите вершины и вес через пробел (v1 v2 вес): ", (input) => {
                        const [v1, v2, weight] = input.split(" ");
                        graph.deleteDirectedEdge(v1, v2);
                        editGraphMenu(graph);
                    });
                }
                break;
                case "5":
                    graph.printGraph();
                    editGraphMenu(graph);
                    break;
                case "6":
                    saveGraph(graph);
                    break;
                case "7":
                    console.log("Переходим к заданиям...");
                    zadaniya(graph);
                    break;
                case "8":
                    console.log("Переходим к заданиям...");
                    testgraph(graph);
                    break;
                case "9":
                    console.log("Выход из редактирования графа.");
                    rl.close();
                    break;
                default:
                    console.log("Неверный выбор.");
                    editGraphMenu(graph);
                    break;
        }  
    });
}

function zadaniya(graph) {
    printGraphType(graph);
    console.log("Выберите действие с графом:");
    console.log("1. Задание 2, номер 8. Вывести те вершины, у которых полустепень исхода больше полустепени захода. Только для ориентированых графов");
    console.log("2. Задание 3 номер номер 3. Для каждой вершины графа вывести её степень. Любой граф");
    console.log("3. Задание 4, номер 4. Построить орграф, являющийся обращением данного орграфа (каждая дуга перевёрнута). Только для ориентированых графов");

    console.log("4. Вернуться в редактор графа");
    console.log("5. Завершить редактирование");

    rl.question("Выберите действие: ", (choice) => {
        switch (choice) {
                case "1":
                    if ((graph.constructor.name === "DirectedUnweightedGraph") || (graph.constructor.name === "DirectedWeightedGraph")) {
                        const vertices = graph.findVerticesWithHigherOutDegree();
                        console.log();
                        if (vertices.length) { console.log("Вершины с полустепенью исхода больше полустепени захода:", vertices.join(", "));} 
                        else { console.log("Таких вершин нет."); } 
                    } 
                    else {
                        console.log();
                        console.log("Ошибка: Эта задача применима только для ориентированных графов, поскольку в ориентированном графе у ребер нет направления.");
                    }
                    zadaniya(graph);
                    break;
                case"2":
                    graph.calculateDegree(); // Универсальный вывод степеней
                    zadaniya(graph);
                    break;
                case "3":
                    if ((graph.constructor.name === "DirectedUnweightedGraph") || (graph.constructor.name === "DirectedWeightedGraph")) {
                        const reversedGraph = graph.reverseGraph();
                        console.log("Структура обращённого графа:");
                        console.log(reversedGraph.adjacencyList);
                    } 
                    else {
                        console.log();
                        console.log("Ошибка: Эта задача применима только для ориентированных графов.");
                    }
                    zadaniya(graph);
                    break;
                case "4":
                    console.log("Возвращаемся в редактор графа...");
                    editGraphMenu(graph);
                    break;
                case "5":
                    console.log("Выход из редактирования графа.");
                    rl.close();
                    break;
                default:
                    console.log("Неверный выбор.");
                    zadaniya(graph)
                    break;
        }  
    });
}


