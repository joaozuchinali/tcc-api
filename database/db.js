const mysql = require('mysql2');

// === Conexão ===
const hostName = "127.0.0.1";
const port = 3306;
const userName = "root";
const passwordValue = "1234";
const databaseName = "dbmain";

var connection = mysql.createConnection({
    host: hostName,
    port: port,
    user: userName,
    password: passwordValue,
    database: databaseName,
    maxIdle: 0,
    idleTimeout: 60000,
    enableKeepAlive: true
});
 
const databaseConnection = function () {
    return new Promise((resolve, reject) => {
        if(connection.state === 'connected' || connection.state === 'authenticated') {
            console.log('Conexão já existente');
            return resolve(connection);
        }

        connection.connect(function(err) {
            if (err) {
                console.error('Falha ao conectar.');
                console.log(err);
                resolve(false);
            }
            else {
                console.log('Successo ao conectar');
                resolve(connection);
            }
        });
    });
}

const close = function() {
    return new Promise((resolve, reject) => {
        console.log('Fechando conexão...');
        connection.end(function(err) {
            if (err) {
                console.error('Erro ao fechar conexão com o banco.');
                return resolve(false);
            }
    
            console.log('Conexão encerrado com sucesso.');
            resolve(true);
        });
    })   
}

// === Funções utilitárias === 
// Retorna o registro atual
function getCreatedRegister(database, sqlReturn, insertId) {
    return new Promise((resolve, reject) => {
        database.query(sqlReturn, [insertId], function(err, result) {
            if(Array.isArray(result) && result.length) {
                resolve(result[0]);
            }

            resolve(false);
        });
    });
}

// Conexão
module.exports.getConnection = databaseConnection;
module.exports.closeConnetion = close;

// Funções utilitárias
module.exports.getCreatedRegister = getCreatedRegister;

// Mensagens
module.exports.messages = require('./messages');