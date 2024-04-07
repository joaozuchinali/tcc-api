const express = require('express');
const router = express.Router();
router.use(express.json());

const dbController = require('../../database/db');
const funcs = require('../../utils/funcs');

const sqlInsert = 'INSERT INTO `registronavegacao` ' + 
                    '(`acesso`, `dominio`, `anonimo`, `titulo`, `url`, `favicon`, `width`, `height`, `useragent`, `appversion`, `contype`, `idusopesquisados`, `idprojeto`) ' + 
                  'VALUES' + 
                    '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);'

// http://localhost:12005/api/registros/navegacao/
// https://joaozucchinalighislandi.com.br/api/registros/navegacao/
router.post('/', async function(req, res) {
    const body = req.body;
    
    const values = [
        body.acessTime,
        body.domain,
        (body.incognito ? 1 : 0),
        body.title,
        body.url,
        body.favIconUrl,
        body.width,
        body.height,
        body.useragent,
        body.appversion,
        body.contype,
        body.idusopesquisados,
        body.idprojeto
    ];

    if(body.idusopesquisados && body.idprojeto) {

        dbController.getConnection()
        .then((database) => {
            // Realiza as requisições no banco
            dbQuery(req, res, database, values);
        })
        .catch(async (err) => {
            res.status(300).send({ msg: "Erro ao carregar o banco", status: "error" });
            await dbController.closeConnetion();
        });
    }
    else {
        const empty = funcs.returnAbsentProps(body, [ 'idusopesquisados', 'idprojeto' ]);
        res.status(300).send({
            msg: dbController.messages.errorMessage('Um ou mais campos vazios: (' + empty.join(', ') + ')'),
            status: "error"
        });
    }
});

function dbQuery(req, res, database, values) {
    database.query(sqlInsert, values, async function(err, result){
        if(err || result.affectedRows != 1) {
            console.log(err);
    
            res.status(300).send({msg: "Erro ao gerar o registro", data: {sqlMessage: err.sqlMessage, sql: err.sql}, status: "error" });
            return;
        } else {
            res.status(200).send({
                msg: "Sucesso ao gerar registro",
                data: {
                    id: result.insertId
                },
                status: "success"
            });
        }
    });
}

module.exports = router;