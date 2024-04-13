const express = require('express');
const router = express.Router();
router.use(express.json());

const dbController = require('../../database/db');
const funcs = require('../../utils/funcs');

const sqlInsert = 'INSERT INTO `equipeuso` (`idcredencial`,`idequipe`,`idusuario`) VALUES (?, ?, ?)';
const sqlReturn = 'SELECT * FROM `equipeuso` WHERE `equipeuso`.`idequipeuso` = ?';
const sqlCheck  = 'SELECT * FROM `equipeuso` WHERE ' + 
                  '`equipeuso`.`idcredencial` = ? AND `equipeuso`.`idequipe` = ? AND `equipeuso`.`idusuario` = ?';

// http://localhost:12005/api/equipeuso/create/
// https://joaozucchinalighislandi.com.br/api/equipeuso/create/
router.post('/', async function(req, res) {
    const body = req.body;
    
    if(body.idcredencial && body.idequipe && body.idusuario) {
        const values = [
            body.idcredencial,
            body.idequipe,
            body.idusuario
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
        const empty = funcs.returnAbsentProps(body, [ 'codigo', 'nome', 'idequipe' ]);
        res.status(300).send({
            msg: 'Um ou mais campos vazios: (' + empty.join(', ') + ')',
            status: "error"
        });
    }
});

async function dbQuery(req, res, database, values) {
    const exists = await new Promise((resolve, reject) => {
        database.query(sqlCheck, values, async function(err, result) {

            if(Array.isArray(result) && result.length) {
                resolve(true);
            }
            resolve(false);
        });
    });
    if(exists) {
        res.status(300).send({msg: 'Liberação já existente', data: {code: 2}, status: "error"});
        return;
    }


    // Cria o registro
    database.query(sqlInsert, values, async function(err, result){
        if(err || result.affectedRows != 1) {
            console.log(err);
            res.status(300).send({msg: 'Erro ao gerar o registro', data: {sqlMessage: err.sqlMessage, sql: err.sql}, status: "error"});
            return;
        } else {

            const registro = await dbController.getCreatedRegister(database, sqlReturn, result.insertId)

            res.status(200).send({
                msg: 'Sucesso ao gerar registro',
                data: registro != false ? 
                    {
                        ...registro, 
                        type: 'full'
                    } : {
                        id: result.insertId,
                        type: 'fract'
                    },
                status: "success"
            });
        }
    });
}

module.exports = router;