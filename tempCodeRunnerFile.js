async function saveGraph(graph) {
    rl.question('Введите название файла: ', (fileName) => {
        if (!fileName.endsWith('.txt')) { fileName += '.txt'; }
        saveGraphToFile(graph, fileName); 
        rl.close();
    });
}