const express = require('express');
const router = express.Router();
router.use(express.json());

const dbController = require('../../database/db');
const funcs = require('../../utils/funcs');

const sqlSearch = 'SELECT * FROM `usopesquisados` WHERE `usopesquisados`.`deviceid` = ? AND `usopesquisados`.`idprojeto` = ?';
const sqlInput  = 'INSERT INTO `usopesquisados` (deviceid, idprojeto) VALUES (?, ?)';

// http://localhost:12005/api/usopesquisa/create/
// https://joaozucchinalighislandi.com.br/api/usopesquisa/create/
router.post('/', async function(req, res) {
    const body = req.body;
    
    if(body.deviceid && body.idprojeto) {
        const values = [
            body.deviceid, 
            body.idprojeto
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
        const empty = funcs.returnAbsentProps(body, [ 'deviceid', 'idprojeto' ]);
        res.status(300).send({
            msg: 'Um ou mais campos vazios: (' + empty.join(', ') + ')',
            status: "error"
        });
    }
});

function dbQuery(req, res, database, values) {
    // Primeiro verificar se já existe um registro para aquele usuário e projeto
    database.query(
        sqlSearch, values, 
        async function(err, result, fields){
            if(err) {
                console.log(err);
                
                res.status(300).send({msg: 'Erro ao buscar registro', data: {sqlMessage: err.sqlMessage, sql: err.sql}, status: "error"});
                return;
            }

            if(Array.isArray(result) && result.length > 0) {
                res.status(200).send({msg: 'Sucesso, registro já existente', data: result[0], status: "success"});
            } else {
                // Relação entre usuário pesquisado e projeto ainda não existe
                database.query(sqlInput, values, async function(err, result){
                    if(err || result.affectedRows != 1) {
                        console.log(err);
                
                        res.status(300).send({msg: 'Erro ao gerar o registro', data: {sqlMessage: err.sqlMessage, sql: err.sql}, status: "error"});
                        return;
                    } else {
                        res.status(200).send({
                            msg: 'Sucesso ao gerar registro',
                            data: {
                                idusopesquisados: result.insertId,
                                deviceid: values[0],
                                idprojeto: values[1]
                            },
                            status: "success"
                        });
                    }
                });
            }
        }
    );
}

module.exports = router;