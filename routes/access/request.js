const express = require('express');
const router = express.Router();
router.use(express.json());

const dbController = require('../../database/db');
const funcs = require('../../utils/funcs');

const sql = 'SELECT * FROM `projeto` WHERE `projeto`.`identificador` = ? AND `projeto`.`codigo` = ?';

// http://localhost:12005/api/access/request/
// https://joaozucchinalighislandi.com.br/api/access/request/
router.get('/', async function(req, res) {
    const body = !funcs.isEmptyObject(req.body) ? req.body : 
                    !funcs.isEmptyObject(funcs.convertUrlParamsToObject(req)) ? funcs.convertUrlParamsToObject(req) 
                        : false;
    
    if(body.identificador && body.codigo) {
        const values = [body.identificador, body.codigo];

        dbController.getConnection().then((database) => {
            database.query(sql, values, function(err, result, fields){
                if(err != null) {
                    res.status(404).send('Erro ao buscar registro');
                }

                if(Array.isArray(result) && result.length > 0) {
                    res.status(200).send({msg: 'Sucesso', data: result[0]});
                }
            });
        })
        .catch((err) => {
            res.status(404).send("Erro ao carregar o banco");
        });
    }
    else {
        const empty = funcs.returnAbsentProps(body, [ 'identificador', 'codigo' ]);
        res.status(404)
           .send(dbController.messages.errorMessage('Um ou mais campos vazios: (' + empty.join(', ') + ')'))
    }
});

module.exports = router;