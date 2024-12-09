class Graph {
    constructor() {
      this.adjacencyList = {};
    }
  
    addVertex(vertex) {
      if (!this.adjacencyList[vertex]) {
        this.adjacencyList[vertex] = [];
      }
    }
    
    //неориентированное ребро для взвешенного графа
    addUndirectedEdge(vertex1, vertex2, weight = null) {
        if (!this.adjacencyList[vertex1] || !this.adjacencyList[vertex2]) {
          console.log("Одна или обе вершины не существуют.");
          return;
        }
        this.adjacencyList[vertex1].push({ node: vertex2, weight });
        this.adjacencyList[vertex2].push({ node: vertex1, weight });
      }
    
      //ориентированное ребро для взвешенного графа
      addDirectedEdge(vertex1, vertex2, weight = null) {
        if (!this.adjacencyList[vertex1]) {
          console.log(`Вершина ${vertex1} не существует.`);
          return;
        }
        this.adjacencyList[vertex1].push({ node: vertex2, weight });
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
  
  // Пример использования
  const graph = new Graph();
  graph.addVertex("A");
  graph.addVertex("B");
  graph.addVertex("C");
  
  //неориент ребро. Должно быть четыре ребра (а-б, б-а с весом 5; б-с, с-а с весом 2)
//   graph.addUndirectedEdge("A", "B", 5);
//   graph.addUndirectedEdge("B", "C", 2);

  //ориент ребро взвешенного графа. Должно быть три ребра 
    graph.addDirectedEdge("A", "B", 5);
    graph.addDirectedEdge("B", "C", 2);
    graph.addDirectedEdge("C", "A", 7);

  
  console.log("Список смежности:");
  graph.printGraph();
  
  console.log("Список рёбер:");
  console.log(graph.toEdgeList());
  