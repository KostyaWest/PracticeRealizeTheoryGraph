const [start, end, L] = input.split(" ");
                if (!(start in graph.adjacencyList) || !(end in graph.adjacencyList)) {
                    console.log("Ошибка: Одна или обе вершины не найдены!");
                    zadaniya(graph);
                    return;
                }
                if (L < 0) {
                    console.log("Ошибка: Длина пути L не может быть отрицательной!");
                    zadaniya(graph);
                    return;
                }

                let exists = graph.hasPathWithinLimit(start, end, parseInt(L));

                if (exists === false) {
                    console.log("Ошибка: Граф содержит цикл отрицательного веса. Алгоритм не может дать корректный результат.");
                }
                // Проверяем, взвешенный ли граф
                if (!graph.constructor.name.includes("Weighted")) {
                    console.log("Ошибка: Задание применимо только для взвешенных графов.");
                    zadaniya(graph);
                    return;
                }

                // Проверяем, связаны ли вершины (обходом в глубину DFS)
                if (!graph.isConnected(start, end)) {
                    console.log(`Вершины ${start} и ${end} не связаны. Путь невозможен.`);
                    zadaniya(graph);
                    return;
                }
                let result = graph.hasPathWithinLimit(start, end, parseInt(L));

                if (result.exists) {
                    console.log(`Существует путь между ${start} и ${end} длиной ${result.distance}:`);
                    console.log(result.path.join(" -> "));
                } else {
                    console.log(`Нет пути между ${start} и ${end} длиной ≤ ${L}.`);
                }
                zadaniya(graph);