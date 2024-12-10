class Graph {
    constructor() {this.adjacencyList = {};}
    // Конструктор-копия
    constructorCopy(originalGraph) {this.adjacencyList = JSON.parse(JSON.stringify(originalGraph.adjacencyList));}
  
// <----------------------------------------------------------------------Общие методы---------------------------------------------------------------------->

  addVertex(vertex) {
      if (!this.adjacencyList[vertex]) {
        this.adjacencyList[vertex] = [];
      }
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

  // Метод для преобразования списка смежности в список рёбер
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
    for (let vertex in this.adjacencyList) {
      console.log(`${vertex} -> ${this.adjacencyList[vertex].map(n => n.node).join(", ")}`);
    }
  }
}
  
// <----------------------------------------------------класс для неориентированного невзвешенного графа--------------------------------------------------->

class UndirectedUnweightedGraph extends Graph {
  constructor() { super(); }

  addUndirectedEdgeNonWeight(vertex1, vertex2) {
    if (!this.adjacencyList[vertex1] || !this.adjacencyList[vertex2]) {
      console.log("Одна или обе вершины не существуют.");
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
    if (!this.adjacencyList[vertex1] || !this.adjacencyList[vertex2]) {
      console.log("Одна или обе вершины не существуют.");
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
    if (!this.adjacencyList[vertex1]) {
      console.log(`Вершина ${vertex1} не существует.`);
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
    if (!this.adjacencyList[vertex1]) {
      console.log(`Вершина ${vertex1} не существует.`);
      return;
    }
    this.adjacencyList[vertex1].push({ node: vertex2, weight });
    console.log(`Ориентированное взвешенное ребро между ${vertex1} и ${vertex2} добавлено.`);
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

























































// <-----------------------------------------------------------------проверки----------------------------------------------------------------------->


// <-----------------------------------------------класс для неориентированного невзвешенного графа------------------------------------------------>

const graph = new UndirectedUnweightedGraph();

// Добавляем вершины
graph.addVertex("A");
graph.addVertex("B");
graph.addVertex("C");

// Добавляем рёбра
graph.addUndirectedEdgeNonWeight("A", "B");
graph.addUndirectedEdgeNonWeight("B", "C");

// Выводим граф
graph.printGraph();

/* Результат:
A -> B
B -> A, C
C -> B
*/

// Удаляем ребро
graph.deleteUndirectedEdgeNonWeight("A", "B");

// Повторный вывод
graph.printGraph();

/* Результат:
A ->
B -> C
C -> B
*/

// <--------------------------------------------------------------------------------------------------------------------------------------------------------->

// <--------------------------------------------------------------------Конструктор-копия-------------------------------------------------------------------->

//Пример использования конструктора-копии
// const originalGraph = new Graph();
// originalGraph.addVertex("A");
// originalGraph.addVertex("B");
// originalGraph.addUndirectedEdge("A", "B", 3);

// console.log("Исходный граф:"); originalGraph.printGraph();

// // Создаем копию графа
// const copiedGraph = new Graph();
// copiedGraph.constructorCopy(originalGraph);

// // Вносим изменения в копию
// copiedGraph.addVertex("C");
// copiedGraph.addUndirectedEdge("B", "C", 2);

// console.log("\nКопия графа после изменений:"); copiedGraph.printGraph();

// console.log("\nИсходный граф остаётся неизменным:");  originalGraph.printGraph();
//

// <------------------------------------------------------------------------------------------------------------------------------------------------------->

  
  // Пример использования
  // const graph = new Graph();
  // graph.addVertex("A");
  // graph.addVertex("B");
  // graph.addVertex("C");
  // graph.addVertex("D");

// <--------------------------------------------------------Ориентированое ребро невзвешенного графа--------------------------------------------------------->
 //Добавление неориент ребро взвешенного графа. Должно быть четыре ребра (а-б, б-а; б-с, с-б)

// graph.addUndirectedEdgeNonWeight("A", "B");
// graph.addUndirectedEdgeNonWeight("B", "C");

// console.log("Список смежности:"); graph.printGraph();
// console.log("Список рёбер:"); console.log(graph.toEdgeList());

// //Удаление ориент ребро взвешенного графа. Должно быть два ребра (b->c, c->b)

// graph.deleteUndirectedEdgeNonWeight("C", "B");
  
// <--------------------------------------------------------Ориентированое ребро взвешенного графа--------------------------------------------------------->

 //Добавление неориент ребро взвешенного графа. Должно быть четыре ребра (а-б, б-а с весом 5; б-с, с-б с весом 2)
  // graph.addUndirectedEdge("A", "B", 5);
  // graph.addUndirectedEdge("B", "C", 2);

  // console.log("Список смежности:"); graph.printGraph();
  // console.log("Список рёбер:"); console.log(graph.toEdgeList());
//// <------------------------------------------------------------------------------------------------------------------------------------------------------->

//   //Удаление ориент ребро взвешенного графа. Должно быть два ребра (b->c, c->b с ветом 2)

//    graph.deleteUndirectedEdge("A", "B")
//// <------------------------------------------------------------------------------------------------------------------------------------------------------->

  //Удаление узла А. Должно быть два ребра (b->c, c->b с ветом 2)

  //  graph.deleteVertex("A");
//// <------------------------------------------------------------------------------------------------------------------------------------------------------->


    
  // console.log("Список смежности:"); graph.printGraph();
  // console.log("Список рёбер:"); console.log(graph.toEdgeList());
// <------------------------------------------------------Неориентированое ребро взвешенного графа--------------------------------------------------------->
 
//   //Добавление ориент ребро взвешенного графа. Должно быть три ребра 
    // graph.addDirectedEdge("A", "B", 5);
    // graph.addDirectedEdge("B", "C", 2);
    // graph.addDirectedEdge("C", "A", 7);

    // console.log("Список смежности:"); graph.printGraph();
    // console.log("Список рёбер:"); console.log(graph.toEdgeList());

//// <------------------------------------------------------------------------------------------------------------------------------------------------------->

//   //Удаление ориент ребро взвешенного графа. Должно быть два ребра 
//     graph.deleteDirectedEdge("A","B");

//// <------------------------------------------------------------------------------------------------------------------------------------------------------->
  
////Удаление узла А. Должно остаться одно ребро
// graph.deleteVertex("A");
    
// console.log("Список смежности:"); graph.printGraph();
// console.log("Список рёбер после удаления:"); console.log(graph.toEdgeList());
  