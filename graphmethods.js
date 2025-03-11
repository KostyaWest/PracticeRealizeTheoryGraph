class Graph {
  constructor() {this.adjacencyList = {};}

  // Граф хранится как adjacencyList
  
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

  // -----------------------------------------------------------------
  //полустепени. второе задание

  // Теоретическая информация:
  // Полустепени считаются только для ориентированых графов
  // Полустепень исхода (Out-degree) - кол-во ребер выходящих из вершины
  // Полустепень захода (In-degree) - кол-во ребер входящих в вершину
  // Моя функция выполняет поиск вершин Out-degree > In-degree

  findVerticesWithHigherOutDegree() {
    const inDegrees = {}; //хранение входящих ребер
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

  // -----------------------------------------------------------------
  //степени. третье задание

  // Теоретическая информация:
  // Степень вершины графа — это количество рёбер, связанных с этой вершиной.
  // В неориент графе Степень вершины - кол-во соседей (сколько ребер соединяется с вершиной)
  // В ориент графе (выше) есть полустепени захода и исхода. Их сумма будет степенью
  
  calculateDegree() {
    // const степени
    // const кол-во входяших ребер для каждой вершины
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
    // Граф ориентированый ->  in-degree + out, 
    // иначе -> сумма in-degree+out/2 т.к. ребро учитывается дважды (для каждой вершины инцидентного ребра)
    for (const vertex in this.adjacencyList) {
        const outDegree = this.adjacencyList[vertex]?.length || 0;
        const inDegree = inDegrees[vertex];
        degrees[vertex] = (graphType.includes("Directed")) ? (inDegree + outDegree) : (inDegree + outDegree) / 2;

        console.log(`Вершина: ${vertex}, Степень: ${degrees[vertex]}`);
    }

    return degrees;
  }

  // -----------------------------------------------------------------
  //реверсграф. четвертое задание
  
  // Теоретическая информация:
  // Reversegraph - граф наоборот. Было A -> B, стало B -> A. 
  // Работает только для орт графа, т.к. в неориентированом графе реверс граф такой же как и обычный
  
  reverseGraph() {
    const reversedGraph = new this.constructor(); // Создается пустой граф того же класса что и исходный

    // Добавляем все вершины
    for (const vertex in this.adjacencyList) {      // Перебирает все вершины vertex и 
        reversedGraph.adjacencyList[vertex] = [];   // создаёт для них пустые списки смежности 
    }                                               // в reversedGraph

    // Определяем метод добавления рёбер
    const isWeighted = this.constructor.name === "DirectedWeightedGraph"; // Проверка на вес

    const addEdge = isWeighted                      // Метод добавления ребер в зависимости от типа графа
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

  // -----------------------------------------------------------------
  //поиск к узлу. Шестое задание

  // Теоретическая информация:
  // Нахождение всех вершин и путей из которых можно попасть в узел 
  // Работает только для орт графа, т.к. в неориентированом графе реверс граф такой же как и обычный
  
  // dfs - обход в глубину алгоритм
  // Выбираем первую вершину и посещаем как посещенную
  // Выбираем смежную вершину к посещенной, проходим в глубь. Отмечаем её посещенной

  // Посещаем вершину и посещаем соседа (обход в глубь) (рекурсия)
  // помечаем (опционально), что посетили вершину и прошли её
  // Если уперлись и соседей нет, то окрашиваем вершину/иной способ взаимодействия/ и возвращаемся обратно

  findVerticesWithPathTo(targetVertex) { // Существует ли вершина?
    if (!this.adjacencyList[targetVertex]) {
        console.log(`Вершина "${targetVertex}" отсутствует в графе.`);
        return {};
    }

    // Строим обращённый граф
    const reversedGraph = this.reverseGraph();

    // Обход в глубину с сохранением путей
    const visited = new Set();            // Мн-во посещенных вершин (от зацикливания)
    const paths = {};                     // Хранение путей к целевой вершине

    const dfs = (vertex, path) => {
        visited.add(vertex);
        paths[vertex] = path.slice(1);    // Исключаем саму вершину

      
      for (const neighbor of reversedGraph.adjacencyList[vertex]) {
        if (!visited.has(neighbor.node)) {
            dfs(neighbor.node, [neighbor.node, ...path]); // Передаём новый путь
        }
      }
    }; //рекурсивно обходит соседние вершины реверсграфа. Удаляет саму вершину что бы убрать дубликат

   // Запускаем DFS из целевой вершины
   dfs(targetVertex, [targetVertex]);

   // Удаляем целевую вершину из результата
   delete paths[targetVertex];

    // Выводим результат
    console.log(`Вершины и пути, из которых существует путь в "${targetVertex}":`);
    for (const vertex in paths) { console.log(`${vertex} -> ${paths[vertex].join(" -> ")}`); }
    return paths;
  }

  // -----------------------------------------------------------------
  //путь А-Б. пятое задание. Обход в ширину

  // Теоретическая информация:
  // Этот метод ищет пути ко всем вершинам, достижимым из vertex, 
  // используя обход в ширину (BFS).
  // Только для ацикличного ортграфа
  // Нужно найти такую вершину u, из которой можно добраться до всех остальных
  
  // bfs - обход в ширину алгоритм, описан явно
  // Всем вершинам графа присваивается значение не посещённой. Выбирается первая вершина и помечается как посещённая и заносится в очередь.
  // Посещается первая вершина из очереди (если она не помечена как посещённая). Все её соседние вершины заносятся в очередь. После этого она удаляется из очереди.
  // Повторяется шаг 2 до тех пор, пока очередь не станет пустой.
  
  isReachableFrom(vertex) {
    const visited = new Set();
    const queue = [[vertex, [vertex]]]; // Очередь BFS [Текущая вершина, путь к ней]
    const paths = {}; // Объект для хранения путей

    // Основной цикл BFS
    while (queue.length) {
        const [current, path] = queue.shift(); // Берём из начала очереди

        if (!visited.has(current)) { // Если вершина не посещена, то добавляется в множество visited 
            visited.add(current);

            // Если вершина не является начальной, добавляется путь к этой вершине в объект paths
            if (current !== vertex) {
                paths[current] = path;
            }

            // Обход соседей
            const neighbors = this.adjacencyList[current] || []; // Соседи берутся из списка смежности
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

  // Этот метод ищет корень графа.
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

  // -----------------------------------------------------------------
  // Седьмое задание. Алгоритм Краскала (НВГ)

  // Теоретическая информация:
  // Минимальное оставное дерево - дерево графа имеющее минимальный возможный вес и объединяющее все вершины
  // Алгоритм:
  // Сортируем рёбра по весу, добавляем самое легкое в оставное дерево
  // Последовательно добавляем рёбра в минимальное остовное дерево (MST), проверяя, не образуют ли они цикл (для этого используется структура данных Union-Find).
  // Продолжаем, пока не получим  V -1 ребер (V - число вершин)

  // Структура Union - Find
  // Find (Поиск): Определяет, к какому множеству принадлежит элемент.
  // Помогает проверить, образуют ли два элемента цикл
  // Union (Объединение): Объединяет два множества в одно.
  // Это делается, когда два элемента принадлежат разным множествам, и нужно объединить их в одно множество.
  // Каждый элемент хранит ссылку на роодителя и сам является предком
  // При объединии двух множеств, один из корней становится родителем другого. Чтобы сохранить структуру сбалансированной и ускорить операции, используют ранги (или глубину деревьев).
  kruskalMST() {
    let mstGraph = new Graph();
    mstGraph.constructorCopy(this);
    mstGraph.adjacencyList = {}; // Очищаем рёбра

    let edges = this.toEdgeList().sort((a, b) => a.weight - b.weight);

    let dsu = new DSU();
    for (let vertex in this.adjacencyList) {
        mstGraph.addVertex(vertex);
        dsu.addElement(vertex);
    }

    for (let { from, to, weight } of edges) {
        if (dsu.find(from) !== dsu.find(to)) {
            dsu.union(from, to);
            mstGraph.adjacencyList[from].push({ node: to, weight });
            mstGraph.adjacencyList[to].push({ node: from, weight });
        }
    }
    return mstGraph;
  }
}

// DSU (Find-Union) для обработки компонент
class DSU {
    constructor() {
        this.parent = new Map();
        this.rank = new Map();
    }

    find(v) {
        if (this.parent.get(v) !== v) {
            this.parent.set(v, this.find(this.parent.get(v)));
        }
        return this.parent.get(v);
    }

    union(u, v) {
        let rootU = this.find(u);
        let rootV = this.find(v);
        if (rootU !== rootV) {
            let rankU = this.rank.get(rootU) || 0;
            let rankV = this.rank.get(rootV) || 0;
            if (rankU > rankV) {
                this.parent.set(rootV, rootU);
            } else if (rankU < rankV) {
                this.parent.set(rootU, rootV);
            } else {
                this.parent.set(rootV, rootU);
                this.rank.set(rootU, rankU + 1);
            }
        }
    }

    addElement(v) {
        if (!this.parent.has(v)) {
            this.parent.set(v, v);
            this.rank.set(v, 0);
        }
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
  
  // Добавить проверку на ребро
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
export default { GraphFactory, Graph };