function zadaniya(graph) {
    printGraphType(graph);
    console.log(`\nТекущий граф: ${graphType}`);
    console.log("Выберите действие с графом:");
    console.log("1. Задание 2, номер 8. Вывести те вершины, у которых полустепень исхода больше полустепени захода. Только для ориентированых графов");
    console.log("2. Задание 3 номер номер 3. Для каждой вершины графа вывести её степень. Любой граф");
    console.log("3. Вернуться в редактор графа");
    console.log("4. Завершить редактирование");

    rl.question("Выберите действие: ", (choice) => {
        switch (choice) {
                case "1":
                    if ((graph.constructor.name === "DirectedUnweightedGraph") || (graph.constructor.name === "DirectedWeightedGraph")) {
                        const vertices = graph.findVerticesWithHigherOutDegree();
                        console.log();
                        if (vertices.length) { console.log("Вершины с полустепенью исхода больше полустепени захода:", vertices.join(", "));} 
                        else { console.log("Таких вершин нет."); }
                        zadaniya(graph); 
                    } 
                    else if ((graph.constructor.name === "UndirectedUnweightedGraph") || (graph.constructor.name === "UndirectedWeightedGraph")) {
                        console.log();
                        console.log("Ошибка: Эта задача применима только для ориентированных графов, поскольку в ориентированном графе у ребер нет направления.");
                        zadaniya(graph);
                    }
                    break;
                case"2":
                    graph.calculateVertexDegrees();
                    zadaniya(graph);
                    break;
                case "3":
                    console.log("Возвращаемся в редактор графа...");
                    editGraphMenu(graph);
                    break;
                case "4":
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
