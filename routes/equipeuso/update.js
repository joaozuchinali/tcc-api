const express = require('express');
const router = express.Router();
router.use(express.json());

const dbController = require('../../database/db');
const funcs = require('../../utils/funcs');

const sqlUpdate = 'UPDATE `equipeuso` SET `idcredencial` = ? WHERE `equipeuso`.`idequipeuso` = ?';
const sqlReturn = 'SELECT * FROM `equipeuso` WHERE `equipeuso`.`idequipeuso` = ?';

// http://localhost:12005/api/equipeuso/update/
// https://joaozucchinalighislandi.com.br/api/equipeuso/update/
router.put('/', async function(req, res) {
    const body = req.body;
    
    if(body.idcredencial && body.idequipeuso) {
        const values = [
            body.idcredencial,
            body.idequipeuso
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
        const empty = funcs.returnAbsentProps(body, [ 'idcredencial' ]);
        res.status(300).send({
            msg: 'Um ou mais campos vazios: (' + empty.join(', ') + ')',
            status: "error"
        });
    }
});

async function dbQuery(req, res, database, values) {
    // Atualiza o registro do projeto
    database.query(sqlUpdate, values, async function(err, result){
        if(err || result.affectedRows != 1) {
            console.log(err);
            res.status(300).send({msg: 'Erro ao atualizar o registro', data: {sqlMessage: err ? err.sqlMessage : '', sql: err ? err.sql : ''}, status: "error"});
            return;
        } else {
            const registro = await dbController.getCreatedRegister(database, sqlReturn, values[1])

            res.status(200).send({
                msg: 'Sucesso ao atualizar registro',
                data: registro != false ? 
                    {
                        ...registro, 
                        type: 'full'
                    } : {
                        id: values[0],
                        type: 'fract'
                    },
                status: "success"
            });
        }
    });
}

module.exports = router;