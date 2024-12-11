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
    let isDirected = false;
    let isWeighted = false;

    // Проходим по всем вершинам и их рёбрам
    for (let vertex in this.adjacencyList) {
      for (let edge of this.adjacencyList[vertex]) {
        // Проверяем на взвешенность
        if (edge.weight !== undefined) { isWeighted = true; }

        // Проверяем на ориентированность
        if (!this.adjacencyList[edge.node]?.some(e => e.node === vertex)) { isDirected = true; }
      }
    }
    // Возвращаем тип графа
    if (isDirected && isWeighted) return "DirectedWeightedGraph";
    if (isDirected && !isWeighted) return "DirectedUnweightedGraph";
    if (!isDirected && isWeighted) return "UndirectedWeightedGraph";
    if (!isDirected && !isWeighted) return "UndirectedUnweightedGraph";
  }

  // Функция для поиска вершин, у которых полустепень исхода больше полустепени захода
  findVerticesWithHigherOutDegree() {
    const result = [];
    for (const vertex in this.adjacencyList) {
        const outDegree = this.adjacencyList[vertex]?.length || 0;
        
        let inDegree = 0;
        // Проходим по всем вершинам и считаем количество входящих рёбер
        for (const v in this.adjacencyList) {
            inDegree += this.adjacencyList[v].filter(edge => edge.node === vertex).length;
        }

        console.log(`Вершина: ${vertex}, Исходящие рёбра: ${outDegree}, Входящие рёбра: ${inDegree}`);
        
        if (outDegree > inDegree) {
            result.push(vertex);
        }
    }
    return result;
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
    console.log(`Неориентированное невзвешенное ребро между ${vertex1} и ${vertex2} добавлено.`);
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
    console.log(`Неориентированное взвешенное ребро между ${vertex1} и ${vertex2} добавлено.`);
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
    console.log(`Ориентированное невзвешенное ребро между ${vertex1} и ${vertex2} добавлено.`);
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
      `Ориентированное взвешенное ребро между ${vertex1} и ${vertex2} добавлено.`
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