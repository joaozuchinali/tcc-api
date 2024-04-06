module.exports.queryReturn = function(vetor, name, msg = false) {
    if(Array.isArray(vetor) && vetor.length) {
        return JSON.stringify({ 
            status: 1, 
            msg: (msg === false ? "Registros da tabela " + name : msg), 
            data: vetor
        });
    }
    else {
        return JSON.stringify({ 
            status: 0, 
            msg: (msg === false ? "Nenhum registro encontrado para tabela " + name : msg)
        });
    }
}

module.exports.errorMessage = function(msg) {
    return JSON.stringify({
        status: 0, 
        msg: msg
    })
}

module.exports.successMessage = function(msg) {
    return JSON.stringify({
        status: 1, 
        msg: msg
    })
}

module.exports.databaseUnavailable = function() {
    return JSON.stringify({
        status: 0, 
        msg: "Banco de dados não disponível!"
    })
}