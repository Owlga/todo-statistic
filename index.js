const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getAllTodos(fileInfo) {
    let result = []
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
    for (const string of fileInfo.split('\n')) {
        if (string === null || string === undefined) {
            continue;
        }
        const regExp = /\/\/ TODO .*/
        const match = string.match(regExp);
        if (match && match.length >= 1) {
            result.push(match[0]);
        }
    }
    return result;
}


function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show': {
            console.log(getAllTodos(files));
            console.log('showing');
            break;
        }
        case 'important': {
            let strings = getAllTodos(files);
            for (let string of strings) {
                if (string.includes('!')) {
                    console.log(string);
                }
            }
            break;
        }
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
