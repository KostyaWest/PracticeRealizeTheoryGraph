class Graph {
    constructor() {
      this.adjacencyList = {};
    }
  
    addVertex(vertex) {
      if (!this.adjacencyList[vertex]) {
        this.adjacencyList[vertex] = [];
      }
    }
  
    addEdge(vertex1, vertex2, weight = null) {
      if (!this.adjacencyList[vertex1] || !this.adjacencyList[vertex2]) {
        console.log("Одна или обе вершины не существуют.");
        return;
      }
  
      // Добавление для неориентированного графа
      this.adjacencyList[vertex1].push({ node: vertex2, weight });
      this.adjacencyList[vertex2].push({ node: vertex1, weight });
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
  
  graph.addEdge("A", "B", 5);
  graph.addEdge("A", "C", 3);
  graph.addEdge("B", "C", 2);
  
  console.log("Список смежности:");
  graph.printGraph();
  
  console.log("Список рёбер:");
  console.log(graph.toEdgeList());
  