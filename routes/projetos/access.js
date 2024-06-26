const express = require('express');
const router = express.Router();
router.use(express.json());

const dbController = require('../../database/db');
const funcs = require('../../utils/funcs');

const sqlGet = 'SELECT * FROM `projeto` WHERE `projeto`.`identificador` = ? AND `projeto`.`codigo` = ? AND `projeto`.`idstatus` = 1';

// http://localhost:12005/api/projetos/access/
// https://joaozucchinalighislandi.com.br/projetos/access/
router.post('/', async function(req, res) {
    console.log('getter');
    const body = req.body;

    if(body.identificador && body.codigo) {
        const values = [
            body.identificador, 
            body.codigo
        ];

        dbController.getConnection()
        .then((database) => {
            // Realiza as requisições no banco
            dbQuery(req, res, database, values);
        })
        .catch(async (err) => {
            res.status(300).send("Erro ao carregar o banco");
            await dbController.closeConnetion();
        });
    }
    else {
        const empty = funcs.returnAbsentProps(body, [ 'identificador', 'codigo' ]);
        res.status(300).send({
            msg: 'Um ou mais campos vazios: (' + empty.join(', ') + ')',
            status: "error"
        });
    }
});

async function dbQuery(req, res, database, values) {

    database.query(sqlGet, values, async function(err, result, fields) {
        if(err) {
            console.log(err);
            
            res.status(300).send({msg: 'Erro ao buscar registro', data: {sqlMessage: err.sqlMessage, sql: err.sql}});
            return;
        }

        if(Array.isArray(result) && result.length > 0) {
            res.status(200).send({msg: 'Sucesso', data: result[0], status: "success"});
        } else {
            res.status(300).send({msg: 'Nenhum projeto encontrado', status: "error"})
        }
    });
}

module.exports = router;