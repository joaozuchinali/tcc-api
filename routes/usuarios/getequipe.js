const express = require('express');
const router = express.Router();
router.use(express.json());

const dbController = require('../../database/db');
const funcs = require('../../utils/funcs');

const sqlGet = 'SELECT `usuario`.* FROM `usuario` ' + 
               'INNER JOIN `equipeuso` ON `equipeuso`.`idusuario` = `usuario`.`idusuario` ' + 
               'WHERE `usuario`.`idstatus` = ? AND `equipeuso`.`idequipe` = ?';

// http://localhost:12005/api/usuarios/getequipe/
// https://joaozucchinalighislandi.com.br/api/usuarios/getequipe/
router.post('/', async function(req, res) {
    const body = req.body;
    
    if(body.idstatus && body.idequipe) {
        const values = [
            body.idstatus,
            body.idequipe
        ];

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
        const empty = funcs.returnAbsentProps(body, [ 'idstatus', 'idequipe' ]);
        res.status(300).send({
            msg: 'Um ou mais campos vazios: (' + empty.join(', ') + ')',
            status: "error"
        });
    }
});

async function dbQuery(req, res, database, values) {
    // Atualiza o registro do projeto
    database.query(sqlGet, values, async function(err, result) {
        if(err) {
            res.status(300).send({msg: 'Erro ao buscar o registro', data: {sqlMessage: err.sqlMessage, sql: err.sql}, status: "error"});
        } else {
            res.status(200).send({
                msg: 'Sucesso ao buscar registros',
                data: result,
                status: "success"
            });
        }
    });
}

module.exports = router;