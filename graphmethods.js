class Graph {
  constructor() {this.adjacencyList = {};}
  
  // Конструктор-копия
  constructorCopy(originalGraph) {this.adjacencyList = JSON.parse(JSON.stringify(originalGraph.adjacencyList));}

  addVertex(vertex) {
    if (this.adjacencyList[vertex]) { 
        throw new Error(`Вершина "${vertex}" уже существует!`);
    }
    this.adjacencyList[vertex] = [];
  }
    
  deleteVertex(vertex) {
    // Проверяем, существует ли вершина
    if (!this.adjacencyList[vertex]) {
      console.log(`Вершина ${vertex} не существует.`);
      return;
    }

    // Удаляем все рёбра, инцидентные данной вершине, из других списков
    for (let key in this.adjacencyList) {
      this.adjacencyList[key] = this.adjacencyList[key].filter(
        neighbor => neighbor.node !== vertex
      );
    }

    // Удаляем саму вершину
    delete this.adjacencyList[vertex];

    console.log(`Вершина ${vertex} и все её рёбра удалены.`);
  }

  toEdgeList() {
    const edges = [];
    const visited = new Set(); // Для предотвращения дублирования рёбер

    for (let vertex in this.adjacencyList) {
      for (let neighbor of this.adjacencyList[vertex]) {
        const edge = { from: vertex, to: neighbor.node, weight: neighbor.weight };

        // Для неориентированного графа избегаем дублирования
        const edgeKey = [vertex, neighbor.node].sort().join("-");
        if (!visited.has(edgeKey)) {
          edges.push(edge);
          visited.add(edgeKey);
        }
      }
    }

    return edges;
  }

  printGraph() {
    console.log("Список смежности:");
    for (let vertex in this.adjacencyList) { console.log(`${vertex} -> ${this.adjacencyList[vertex].map(n => n.node).join(", ")}`); }

    console.log("\nСписок рёбер:");
    const edges = this.toEdgeList(); // Используем метод toEdgeList для получения списка рёбер
    edges.forEach(edge => {
        if (edge.weight !== undefined) { console.log(`${edge.from} - ${edge.to} (вес: ${edge.weight})`); } 
        else { console.log(`${edge.from} - ${edge.to}`);}
     });
  }

  //определитель типа графа
  determineGraphType() {
    let isDirected = false;          // Флаг для проверки ориентированности
    let isWeighted = false;          // Флаг для взвешенности графа
    let hasUnweightedEdge = false;   // Флаг для наличия рёбер без веса

    // Проходим по всем вершинам и их рёбрам
    for (let vertex in this.adjacencyList) {
        for (let edge of this.adjacencyList[vertex]) {
            // Проверяем на взвешенность
            if (edge.weight !== undefined) {
                isWeighted = true; // Есть взвешенное ребро
            } else {
                hasUnweightedEdge = true; // Есть невзвешенное ребро
            }

            // Проверяем на ориентированность
            if (!this.adjacencyList[edge.node]?.some(e => e.node === vertex)) {
                isDirected = true; // Если обратного ребра нет, то граф ориентированный
            }
        }
    }

    // Проверка на смешанность графа (одновременно взвешенные и невзвешенные рёбра)
    if (isWeighted && hasUnweightedEdge) {
        console.log("Граф смешанный, не поддерживается в данной версии приложения.");
        return null; // Возвращаем null для смешанных графов
    }

    // Возвращаем тип графа
    if (isDirected && isWeighted) return "DirectedWeightedGraph";
    if (isDirected && !isWeighted) return "DirectedUnweightedGraph";
    if (!isDirected && isWeighted) return "UndirectedWeightedGraph";
    if (!isDirected && !isWeighted) return "UndirectedUnweightedGraph";
  }

  //полустепени. второе задание
  findVerticesWithHigherOutDegree() {
    const inDegrees = {}; 
    const result = [];

    // Инициализация входящих степеней
    for (const vertex in this.adjacencyList) {
        inDegrees[vertex] = 0;
    }

    // Подсчёт входящих степеней
    for (const vertex in this.adjacencyList) {
        for (const edge of this.adjacencyList[vertex]) {
            inDegrees[edge.node] = (inDegrees[edge.node] || 0) + 1;
        }
    }

    // Сравнение исходящих и входящих степеней
    for (const vertex in this.adjacencyList) {
        const outDegree = this.adjacencyList[vertex]?.length || 0;
        const inDegree = inDegrees[vertex];
        console.log(`Вершина: ${vertex}, Исходящие рёбра: ${outDegree}, Входящие рёбра: ${inDegree}`);
        if (outDegree > inDegree) {
            result.push(vertex);
        }
    }

    return result;
  }

  //степени. третье задание
  calculateDegree() {
    const degrees = {};
    const inDegrees = {};

    // Инициализация
    for (const vertex in this.adjacencyList) {
        inDegrees[vertex] = 0;
    }

    // Подсчёт входящих степеней
    for (const vertex in this.adjacencyList) {
        for (const edge of this.adjacencyList[vertex]) {
            inDegrees[edge.node] = (inDegrees[edge.node] || 0) + 1;
        }
    }

    const graphType = this.determineGraphType(); // Определяем тип графа один раз

    // Подсчёт степеней
    for (const vertex in this.adjacencyList) {
        const outDegree = this.adjacencyList[vertex]?.length || 0;
        const inDegree = inDegrees[vertex];
        degrees[vertex] = (graphType.includes("Directed")) ? (inDegree + outDegree) : (inDegree + outDegree) / 2;

        console.log(`Вершина: ${vertex}, Степень: ${degrees[vertex]}`);
    }

    return degrees;
  }

  //реверсграф. четвертое задание
  reverseGraph() {
    const reversedGraph = new this.constructor(); 

    // Добавляем все вершины
    for (const vertex in this.adjacencyList) {
        reversedGraph.adjacencyList[vertex] = [];
    }

    // Определяем метод добавления рёбер
    const isWeighted = this.constructor.name === "DirectedWeightedGraph";
    const addEdge = isWeighted 
        ? (u, v, weight) => reversedGraph.addDirectedEdge(v, u, weight)
        : (u, v) => reversedGraph.addDirectedEdgeNonWeight(v, u);

    // Инвертируем рёбра
    for (const vertex in this.adjacencyList) {
        for (const edge of this.adjacencyList[vertex]) {
            isWeighted ? addEdge(vertex, edge.node, edge.weight) : addEdge(vertex, edge.node);
        }
    }
    return reversedGraph;
  }

  //поиск к узлу. Шестое задание
  findVerticesWithPathTo(targetVertex) {
    if (!this.adjacencyList[targetVertex]) {
        console.log(`Вершина "${targetVertex}" отсутствует в графе.`);
        return {};
    }

    // Строим обращённый граф
    const reversedGraph = this.reverseGraph();

    // Обход в глубину с сохранением путей
    const visited = new Set();
    const paths = {}; // Хранение путей к целевой вершине

    const dfs = (vertex, path) => {
        visited.add(vertex);
        paths[vertex] = path.slice(1); // Исключаем саму вершину

      
      for (const neighbor of reversedGraph.adjacencyList[vertex]) {
        if (!visited.has(neighbor.node)) {
            dfs(neighbor.node, [neighbor.node, ...path]); // Передаём новый путь
        }
      }
    }; 
  
   // Запускаем DFS из целевой вершины
   dfs(targetVertex, [targetVertex]);

   // Удаляем целевую вершину из результата
   delete paths[targetVertex];

    // Выводим результат
    console.log(`Вершины и пути, из которых существует путь в "${targetVertex}":`);
    for (const vertex in paths) { console.log(`${vertex} -> ${paths[vertex].join(" -> ")}`); }
    return paths;
}

//путь А-Б. пятое задание. Обход в ширину
  isReachableFrom(vertex) {
    const visited = new Set();
    const queue = [[vertex, [vertex]]]; // Используем очередь вместо стека
    const paths = {}; // Объект для хранения путей

    while (queue.length) {
        const [current, path] = queue.shift(); // Берём из начала очереди

        if (!visited.has(current)) {
            visited.add(current);

            // Добавляем путь только если текущая вершина не совпадает с начальной
            if (current !== vertex) {
                paths[current] = path;
            }

            const neighbors = this.adjacencyList[current] || [];
            for (const neighborObj of neighbors) {
                const neighbor = neighborObj.node;

                // Проверяем на петлю и прерываем выполнение
                if (neighbor === current) {
                    throw new Error(`Обнаружена петля в вершине: ${current}`);
                }

                if (!visited.has(neighbor)) {
                    queue.push([neighbor, [...path, neighbor]]); // Добавляем в конец очереди
                }
            }
        }
    }

    // Выводим все пути
    console.log(`Пути из вершины ${vertex}:`);
    for (const node in paths) {
        console.log(`  ${vertex} -> ${node}: ${paths[node].join(" -> ")}`);
    }

    // Граф имеет корень, если количество посещённых вершин равно количеству всех вершин
    return visited.size === Object.keys(this.adjacencyList).length;
  }
  findRoot() {
    if (!Object.keys(this.adjacencyList).length) {
        console.log("Граф пустой. Корень отсутствует.");
        return null;
    }

    for (const vertex in this.adjacencyList) {
        console.log(`Проверяем вершину ${vertex} на корень...`);
        try {
            if (this.isReachableFrom(vertex)) {
                console.log(`Корень графа: ${vertex}`);
                return vertex;
            }
        } catch (error) {
            console.error(`Ошибка: ${error.message}`);
            return null;
        }
    }

    console.log("Корня в данном графе нет.");
    return null;
  }

}
          





//фабрика графов
class GraphFactory {
  // Создание нового пустого графа
  static createGraph(graphType) {
      switch (graphType) {
          case "DirectedWeightedGraph":
              return new DirectedWeightedGraph();
          case "DirectedUnweightedGraph":
              return new DirectedUnweightedGraph();
          case "UndirectedWeightedGraph":
              return new UndirectedWeightedGraph();
          case "UndirectedUnweightedGraph":
              return new UndirectedUnweightedGraph();
          default:
              throw new Error("Неизвестный тип графа!");
      }
  }

  // Создание графа из данных
  static createGraphFromData(adjacencyList) {
      const tempGraph = new Graph();
      tempGraph.adjacencyList = adjacencyList;

      const graphType = tempGraph.determineGraphType();

      switch (graphType) {
          case "DirectedWeightedGraph":
              return Object.assign(new DirectedWeightedGraph(), tempGraph);
          case "DirectedUnweightedGraph":
              return Object.assign(new DirectedUnweightedGraph(), tempGraph);
          case "UndirectedWeightedGraph":
              return Object.assign(new UndirectedWeightedGraph(), tempGraph);
          case "UndirectedUnweightedGraph":
              return Object.assign(new UndirectedUnweightedGraph(), tempGraph);
          default:
              throw new Error("Неизвестный тип графа!");
      }
  }
}

// <----------------------------------------------------класс для неориентированного невзвешенного графа--------------------------------------------------->

class UndirectedUnweightedGraph extends Graph {
  constructor() { super(); }

  addUndirectedEdgeNonWeight(vertex1, vertex2) {
    if (typeof vertex1 !== "string" || typeof vertex2 !== "string") {
      throw new Error("Оба узла должны быть строками!");
    }
    if (!this.adjacencyList[vertex1]) {
      console.log(`Вершина ${vertex1} не существует.`);
      return;
    }

    // Проверка на существование вершины vertex2
    if (!this.adjacencyList[vertex2]) {
      console.log(`Вершина ${vertex2} не существует.`);
      return;
    }

    // Проверка на существование ребра между vertex1 и vertex2 (для предотвращения мультиграфа)
    const existingEdge = this.adjacencyList[vertex1].find(
      (neighbor) => neighbor.node === vertex2
    );

    if (existingEdge) {
      console.log(
        `Ошибка: Ребро из ${vertex1} в ${vertex2} уже существует. Запрещено создание мультиграфа.`
      );
      return;
    }
    this.adjacencyList[vertex1].push({ node: vertex2});
    this.adjacencyList[vertex2].push({ node: vertex1});
    // console.log(`Неориентированное невзвешенное ребро между ${vertex1} и ${vertex2} добавлено.`);
  }

  deleteUndirectedEdgeNonWeight(vertex1, vertex2) {
      // Проверяем существование вершин
      if (!this.adjacencyList[vertex1]) {
        console.log(`Вершина ${vertex1} не существует.`);
        return;
      }
      if (!this.adjacencyList[vertex2]) {
        console.log(`Вершина ${vertex2} не существует.`);
        return;
      }
    
      // Удаляем vertex2 из списка vertex1
      this.adjacencyList[vertex1] = this.adjacencyList[vertex1].filter(
        neighbor => neighbor.node !== vertex2
      );
    
      // Удаляем vertex1 из списка vertex2
      this.adjacencyList[vertex2] = this.adjacencyList[vertex2].filter(
        neighbor => neighbor.node !== vertex1
      );
    
      console.log(`Неориентированное невзвешенное ребро между ${vertex1} и ${vertex2} удалено.`);
  }
}

// <------------------------------------------------------класс для Неориентированного взвешенного графа------------------------------------------------------>

class UndirectedWeightedGraph extends Graph {
  constructor() { super(); }

  addUndirectedEdge(vertex1, vertex2, weight = 1) {
    if (typeof vertex1 !== "string" || typeof vertex2 !== "string") {
      throw new Error("Оба узла должны быть строками!");
    }
    if (!this.adjacencyList[vertex1]) {
      console.log(`Вершина ${vertex1} не существует.`);
      return;
    }

    // Проверка на существование вершины vertex2
    if (!this.adjacencyList[vertex2]) {
      console.log(`Вершина ${vertex2} не существует.`);
      return;
    }

    // Проверка на существование ребра между vertex1 и vertex2 (для предотвращения мультиграфа)
    const existingEdge = this.adjacencyList[vertex1].find(
      (neighbor) => neighbor.node === vertex2
    );

    if (existingEdge) {
      console.log(
        `Ошибка: Ребро из ${vertex1} в ${vertex2} уже существует. Запрещено создание мультиграфа.`
      );
      return;
    }

    this.adjacencyList[vertex1].push({ node: vertex2, weight });
    this.adjacencyList[vertex2].push({ node: vertex1, weight });
    // console.log(`Неориентированное взвешенное ребро между ${vertex1} и ${vertex2} добавлено.`);
  }

  deleteUndirectedEdge(vertex1, vertex2) {
    // Проверяем существование вершин
    if (!this.adjacencyList[vertex1]) {
      console.log(`Вершина ${vertex1} не существует.`);
      return;
    }
    if (!this.adjacencyList[vertex2]) {
      console.log(`Вершина ${vertex2} не существует.`);
      return;
    }
  
    // Удаляем vertex2 из списка vertex1
    this.adjacencyList[vertex1] = this.adjacencyList[vertex1].filter(
      neighbor => neighbor.node !== vertex2
    );
  
    // Удаляем vertex1 из списка vertex2
    this.adjacencyList[vertex2] = this.adjacencyList[vertex2].filter(
      neighbor => neighbor.node !== vertex1
    );
    console.log(`Неориентированное взвешенное ребро между ${vertex1} и ${vertex2} удалено.`);
  }
}

// <----------------------------------------------------класс для ориентированного невзвешенного графа--------------------------------------------------->

class DirectedUnweightedGraph extends Graph {
  constructor() { super(); }

  addDirectedEdgeNonWeight(vertex1, vertex2) {
    if (typeof vertex1 !== "string" || typeof vertex2 !== "string") {
      throw new Error("Оба узла должны быть строками!");
    }
    if (!this.adjacencyList[vertex1]) {
      console.log(`Вершина ${vertex1} не существует.`);
      return;
    }

    // Проверка на существование вершины vertex2
    if (!this.adjacencyList[vertex2]) {
      console.log(`Вершина ${vertex2} не существует.`);
      return;
    }

    // Проверка на существование ребра между vertex1 и vertex2 (для предотвращения мультиграфа)
    const existingEdge = this.adjacencyList[vertex1].find(
      (neighbor) => neighbor.node === vertex2
    );

    if (existingEdge) {
      console.log(
        `Ошибка: Ребро из ${vertex1} в ${vertex2} уже существует. Запрещено создание мультиграфа.`
      );
      return;
    }

    this.adjacencyList[vertex1].push({ node: vertex2});
    // console.log(`Ориентированное невзвешенное ребро между ${vertex1} и ${vertex2} добавлено.`);
  }
  
  deleteDirectedEdgeNonWeight(vertex1, vertex2) {
    // Проверяем существование вершин
    if (!this.adjacencyList[vertex1]) {
      console.log(`Вершина ${vertex1} не существует.`);
      return;
    }
    
    if (!this.adjacencyList[vertex2]) {
      console.log(`Вершина ${vertex2} не существует.`);
      return;
    }
  
    // Удаляем ребро из vertex1 в vertex2
    this.adjacencyList[vertex1] = this.adjacencyList[vertex1].filter(
      neighbor => neighbor.node !== vertex2
    );
    console.log(`Ориентированное невзвешенное ребро ${vertex1} -> ${vertex2} удалено.`);
  }
}

// <-------------------------------------------------------класс для ориентированного взвешенного графа------------------------------------------------------->

class DirectedWeightedGraph extends Graph {
  constructor() { super(); }

  addDirectedEdge(vertex1, vertex2, weight = 1) {
    if (typeof vertex1 !== "string" || typeof vertex2 !== "string") {
      throw new Error("Оба узла должны быть строками!");
    }
    // Проверка на существование вершины vertex1
    if (!this.adjacencyList[vertex1]) {
      console.log(`Вершина ${vertex1} не существует.`);
      return;
    }

    // Проверка на существование вершины vertex2
    if (!this.adjacencyList[vertex2]) {
      console.log(`Вершина ${vertex2} не существует.`);
      return;
    }

    // Проверка на существование ребра между vertex1 и vertex2 (для предотвращения мультиграфа)
    const existingEdge = this.adjacencyList[vertex1].find(
      (neighbor) => neighbor.node === vertex2
    );

    if (existingEdge) {
      console.log(
        `Ошибка: Ребро из ${vertex1} в ${vertex2} уже существует. Запрещено создание мультиграфа.`
      );
      return;
    }

    // Добавление нового ребра
    this.adjacencyList[vertex1].push({ node: vertex2, weight });
    console.log(
      // `Ориентированное взвешенное ребро между ${vertex1} и ${vertex2} добавлено.`
    );
  }
  
  deleteDirectedEdge(vertex1, vertex2) {
    // Проверяем существование вершин
    if (!this.adjacencyList[vertex1]) {
      console.log(`Вершина ${vertex1} не существует.`);
      return;
    }
    
    if (!this.adjacencyList[vertex2]) {
      console.log(`Вершина ${vertex2} не существует.`);
      return;
    }
  
    // Удаляем ребро из vertex1 в vertex2
    this.adjacencyList[vertex1] = this.adjacencyList[vertex1].filter(
      neighbor => neighbor.node !== vertex2
    );
    
    console.log(`Ориентированное взвешенное ребро ${vertex1} -> ${vertex2} удалено.`);
  }
}

// <---------------------------------------------------------------------------------------------------------------------------------------------------------->  

// Экспортируем нужные классы
module.exports = { GraphFactory, Graph };