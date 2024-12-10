class Graph {
    constructor() {
      this.adjacencyList = {};
    }
  
// <------------------------------------------------------Общие методы--------------------------------------------------------->

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
// <------------------------------------------------------------------------------------------------------------------------------------------------------->
  
// <------------------------------------------------------Неориентированое ребро взвешенного графа--------------------------------------------------------->

    //неориентированное ребро для взвешенного графа
    addUndirectedEdge(vertex1, vertex2, weight = null) {
        if (!this.adjacencyList[vertex1] || !this.adjacencyList[vertex2]) {
          console.log("Одна или обе вершины не существуют.");
          return;
        }
        this.adjacencyList[vertex1].push({ node: vertex2, weight });
        this.adjacencyList[vertex2].push({ node: vertex1, weight });
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
      
        console.log(`Ребро между ${vertex1} и ${vertex2} удалено.`);
    }
      
// <------------------------------------------------------------------------------------------------------------------------------------------------------->

// <--------------------------------------------------------Ориентированое ребро взвешенного графа--------------------------------------------------------->

//добавление
    addDirectedEdge(vertex1, vertex2, weight = null) {
        if (!this.adjacencyList[vertex1]) {
          console.log(`Вершина ${vertex1} не существует.`);
          return;
        }
        this.adjacencyList[vertex1].push({ node: vertex2, weight });
    }
      
    //удаление
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
        
        console.log(`Ребро ${vertex1} -> ${vertex2} удалено.`);
    }
  
// <------------------------------------------------------------------------------------------------------------------------------------------------------->

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
  
  // Пример использования
  const graph = new Graph();
  graph.addVertex("A");
  graph.addVertex("B");
  graph.addVertex("C");
  // graph.addVertex("D");

  
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
    graph.addDirectedEdge("A", "B", 5);
    graph.addDirectedEdge("B", "C", 2);
    graph.addDirectedEdge("C", "A", 7);

    console.log("Список смежности:"); graph.printGraph();
    console.log("Список рёбер:"); console.log(graph.toEdgeList());

//// <------------------------------------------------------------------------------------------------------------------------------------------------------->

//   //Удаление ориент ребро взвешенного графа. Должно быть два ребра 
//     graph.deleteDirectedEdge("A","B");

//// <------------------------------------------------------------------------------------------------------------------------------------------------------->
  
//Удаление узла А. Должно остаться одно ребро

graph.deleteVertex("A");
    
console.log("Список смежности:"); graph.printGraph();
console.log("Список рёбер после удаления:"); console.log(graph.toEdgeList());
  