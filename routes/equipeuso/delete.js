const express = require('express');
const router = express.Router();
router.use(express.json());

const dbController = require('../../database/db');
const funcs = require('../../utils/funcs');

const sqlUpdate = 'DELETE FROM `equipeuso` WHERE `equipeuso`.`idusuario` = ? AND `equipeuso`.`idequipe` = ?';

// http://localhost:12005/api/equipeuso/delete/
// https://joaozucchinalighislandi.com.br/api/equipeuso/delete/
router.put('/', async function(req, res) {
    const body = req.body;
    
    if(body.idusuario && body.idequipe) {
        const values = [
            body.idusuario,
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
        const empty = funcs.returnAbsentProps(body, [ 'idusuario', 'idequipe' ]);
        res.status(300).send({
            msg: 'Um ou mais campos vazios: (' + empty.join(', ') + ')',
            status: "error"
        });
    }
});

async function dbQuery(req, res, database, values) {
    // Atualiza o registro do projeto
    database.query(sqlUpdate, values, async function(err, result){
        if(err || result.affectedRows < 1) {
            console.log(err);
            res.status(300).send({msg: 'Erro ao deletar o registro', data: {sqlMessage: err ? err.sqlMessage : '', sql: err ? err.sql : ''}, status: "error"});
            return;
        } else {
            res.status(200).send({
                msg: 'Sucesso ao atualizar registro',
                data: {
                    id: -1,
                    type: 'full'
                },
                status: "success"
            });
        }
    });
}

module.exports = router;