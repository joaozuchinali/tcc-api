const express = require('express');
const router = express.Router();
router.use(express.json());

const dbController = require('../../database/db');
const funcs = require('../../utils/funcs');

const sqlInsert = 'INSERT INTO `registronavegacao` ' + 
                    '(`acesso`, `dominio`, `anonimo`, `titulo`, `url`, `favicon`, `width`, `height`, `useragent`, `appversion`, `contype`, `idusopesquisados`, `idprojeto`) ' + 
                  'VALUES ';
const sqlGetProjeto = 'SELECT * FROM `projeto` WHERE `projeto`.`identificador` = ?;';

// http://localhost:12005/api/registros/navegacao/
// https://joaozucchinalighislandi.com.br/api/registros/navegacao/
router.post('/', async function(req, res) {
    const body = req.body;
    
    
    if(body.idusopesquisados && body.identificador) {
        const values = [
            ...body.registros
        ];

        dbController.getConnection()
        .then((database) => {
            // Realiza as requisições no banco
            dbQuery(req, res, database, values, {identificador: body.identificador});
        })
        .catch(async (err) => {
            res.status(300).send({ msg: "Erro ao carregar o banco", status: "error" });
            await dbController.closeConnetion();
        });
    }
    else {
        const empty = funcs.returnAbsentProps(body, [ 'idusopesquisados', 'identificador' ]);
        res.status(300).send({
            msg: 'Um ou mais campos vazios: (' + empty.join(', ') + ')',
            status: "error"
        });
    }
});

async function dbQuery(req, res, database, values, infos) {

    const projeto = await new Promise((resolve, reject) => {
        database.query(sqlGetProjeto, [infos.identificador], async function(err, result) {
            if(err) {
                resolve(false)
            } else {
                resolve(result);
            }
        })
    });
    if(projeto == false) {
        res.status(300).send({msg: 'Erro ao buscar o registro', data: {sqlMessage: err.sqlMessage, sql: err.sql}, status: "error"});
        return;
    }
    if(Array.isArray(projeto) && projeto[0].idstatus == 2) {
        res.status(200).send({msg: 'Projeto encontrado porém já está finalizado', data: {id: -1}, status: "success"});
        return;
    }

    // Concatena a string de input da query
    let queryValues  = [];
    let sqlInsertFull = sqlInsert;
    let idProjeto = projeto[0].idprojeto;

    

    for (const record of values) {
        const recordValues = [
            record.acessTime,
            record.dominio,
            (record.incognito ? 1 : 0),
            record.title,
            record.url,
            record.favIconUrl,
            record.width,
            record.height,
            record.useragent,
            record.appversion,
            record.contype,
            record.idusopesquisados,
            idProjeto
        ];

        queryValues = [...queryValues, ...recordValues];

        sqlInsertFull += '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?),';
    }
    sqlInsertFull = sqlInsertFull.slice(0, sqlInsertFull.length - 1) + ';';

    // Executa a query
    database.query(sqlInsertFull, queryValues, async function(err, result){
        if(err || result.affectedRows < 1) {
            console.log(err);
            res.status(300).send({msg: "Erro ao gerar o registro", data: {sqlMessage: err.sqlMessage, sql: err.sql}, status: "error" });
            return;
        } else {
            res.status(200).send({
                msg: "Sucesso ao gerar registro",
                data: {
                    id: 1 /* result.insertId */
                },
                status: "success"
            });
        }
    });
}

module.exports = router;