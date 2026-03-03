const { getAllFilePathsWithExtension, readFile } = require("./fileSystem");
const { readLine } = require("./console");

const files = getFiles();

console.log("Please, write your command!");
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), "js");
    return filePaths.map((path) => readFile(path));
}

function getAllTodos(fileInfo) {
    let result = [];
    for (const file of fileInfo) {
        const fileTodos = getTodosFromFile(file);
        if (fileTodos) {
            result = result.concat(fileTodos);
        }
    }
    return result;
}

function getTodosFromFile(fileInfo) {
    let result = [];
    for (const string of fileInfo.split("\n")) {
        if (string === null || string === undefined) {
            continue;
        }
        const regExp = /\/\/ TODO .*/;
        const match = string.match(regExp);
        if (match && match.length >= 1) {
            result.push(match[0]);
        }
    }
    return result;
}

function getUser(username) {
    let total = getEntries()[0];
    let result = [];
    for (const entry of total) {
        if (entry[1].toLowerCase() === username.toLowerCase()) {
            result.push(entry[0]);
        }
    }
    return result;
}

function getEntries() {
    let total = [];
    let nameless = [];
    const re = /\/\/ TODO ([ \w]+);( ){0,1}?([-\d]+);( ){0,1}(.+)/;
    let todos = getAllTodos(files);
    for (const string of todos) {
        let result = string.match(re);
        if (result === null || result === undefined) {
            nameless.push(string);
        } else {
            total.push(result);
        }
    }
    return [total, nameless];
}

function sortBy(command) {
    switch (command) {
        case "importance": {
            break;
        }
        case "user": {
            return sortByUser();
        }
        case "date": {
            return sortByDate();
        }
    }
}

function sortByUser() {
    let result = [];
    let [allEntries, allNameless] = getEntries();
    let allNames = new Map();
    for (const entry of allEntries) {
        let name = entry[1].toLowerCase();
        if (!allNames.has(name)) {
            allNames.set(name, []);
        }
        let value = allNames.get(name);
        value.push(entry[0]);
        allNames.set(name, value);
    }

    for (let name of allNames.keys()) {
        for (let comment of allNames.get(name)) {
            result.push(comment);
        }
    }
    result = result.concat(allNameless);
    return result;
}

function sortByDate() {
    let result = [];
    let [allEntries, allNamelessDateless] = getEntries();

    let allDatesMap = new Map();

    for (const entry of allEntries) {
        const date = entry[3];
        const re = /(\d+)-(\d+)-(\d+)/;
        const [year, month, day] = date.match(re).map((el) => Number(el));
        const correctDate = new Date(year, month - 1, day);
        if (!allDatesMap.has(correctDate)) {
            allDatesMap.set(correctDate, []);
        }
        let value = allDatesMap.get(correctDate);
        value.push(entry[0]);
        allDatesMap.set(correctDate, value);
    }

    let Keys = Array(allDatesMap.keys());
    let sortedKeys = Keys.sort((a, b) => b - a);
    for (key of sortedKeys){
        for (value of allDatesMap[key]){
            result.push(value);
        }
    }
    return result.concat(allNamelessDateless);
    const sortedEntries = [...myMap.entries()].sort(([keyA], [keyB]) => {
    // Numeric comparison: a - b for ascending order
    return keyA - keyB;
});
}

function processCommand(command) {
    switch (command.split(" ")[0]) {
        case "exit":
            process.exit(0);
            break;
        case "show": {
            console.log(getAllTodos(files));
            console.log("showing");
            break;
        }
        case "important": {
            let strings = getAllTodos(files);
            for (let string of strings) {
                if (string.includes("!")) {
                    console.log(string);
                }
            }
            break;
        }
        case "user": {
            let userName = command.split(" ")[1];
            console.log(getUser(userName));
            break;
        }
        case "sort": {
            console.log(sortBy(command.split(" ")[1]));
            break;
        }
        default:
            console.log("wrong command");
            break;
    }
}

// TODO you can do it!
