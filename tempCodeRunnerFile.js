            if (graph.constructor.name === "UndirectedWeightedGraph") {
                    const mst = graph.kruskalMST();
                    console.log("Минимальное остовное дерево (MST):");
                    mst.printGraph();

                    rl.question("\nХотите продолжить работать с прежним графом (1) или сохранить MST и загрузить его как новый граф (2)? Введите 1 или 2: ", (graphChoice) => {
                        if (graphChoice === "1") {
                            console.log("\nПродолжаем работать с исходным графом.");
                            zadaniya(graph);
                        } else if (graphChoice === "2") {
                            rl.question("Введите название файла для сохранения MST: ", (fileName) => {
                                if (!fileName.endsWith(".txt")) { fileName += ".txt"; }
                                
                                saveGraphToFile(mst, fileName); // Сохраняем MST
                                
                                console.log("\nMST сохранён. Теперь загружаем его как новый граф...");
                                
                                setTimeout(() => {
                                    loadGraphFromFile(fileName).then((newGraph) => {
                                        console.log("MST успешно загружен как новый граф!");
                                        zadaniya(newGraph); // Работаем с загруженным графом
                                    }).catch((error) => {
                                        console.error("Ошибка при загрузке MST:", error);
                                        zadaniya(graph); // Если ошибка, остаёмся с текущим графом
                                    });
                                }, 1000);
                            });
                        } else {
                            console.log("Ошибка ввода! Продолжаем работать с исходным графом.");
                            zadaniya(graph);
                        }
                    });
                } else {
                    console.log("Ошибка: Алгоритм Краскала применяется только для неориентированных взвешенных графов.");
                    zadaniya(graph);
                }
                break;