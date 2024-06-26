const express = require('express');
const router = express.Router();
router.use(express.json());

const dbController = require('../../database/db');
const funcs = require('../../utils/funcs');

const sqlInsert = 'INSERT INTO `projeto` (`identificador`,`codigo`,`nome`,`idequipe`,`idstatus`) VALUES (?, ?, ?, ?, ?);'
const sqlCheck  = 'SELECT * FROM `projeto` WHERE `projeto`.`identificador` = ?';
const sqlReturn = 'SELECT * FROM `projeto` WHERE `projeto`.`idprojeto` = ?';

// http://localhost:12005/api/projetos/create/
// https://joaozucchinalighislandi.com.br/api/projetos/create/
router.post('/', async function(req, res) {
    const body = req.body;
    
    if(body.nome && body.codigo && body.idequipe) {
        const values = [
            null,
            body.codigo,
            body.nome,
            body.idequipe,
            1
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
    let flagId = false;
    let newId = null;

    // Verificar se já existe um projeto com aquele id
    while(!flagId) {
        newId = funcs.getRandomId();

        await new Promise((resolve, reject) => {
            database.query(sqlCheck, [newId], async function(err, result) {
                if(!Array.isArray(result) || !result.length) {
                    flagId = true;
                }

                resolve(true);
            });
        });
    }

    values[0] = newId;

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