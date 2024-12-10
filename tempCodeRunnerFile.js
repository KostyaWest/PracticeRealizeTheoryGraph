    graph.addDirectedEdge("A", "B", 5);
    graph.addDirectedEdge("B", "C", 2);
    graph.addDirectedEdge("C", "A", 7);

    console.log("Список смежности:"); graph.printGraph();
    console.log("Список рёбер:"); console.log(graph.toEdgeList());
