const express = require('express');
const router = express.Router();
router.use(express.json());

const dbController = require('../../database/db');
const funcs = require('../../utils/funcs');

const sqlInsert = 'INSERT INTO `equipe` (`nome`,`idstatus`) VALUES (?, ?);'
const sqlReturn = 'SELECT * FROM `equipe` WHERE `equipe`.`idequipe` = ?';

// http://localhost:12005/api/equipes/create/
// https://joaozucchinalighislandi.com.br/api/equipes/create/
router.post('/', async function(req, res) {
    const body = req.body;
    
    if(body.nome) {
        const values = [
            body.nome,
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
        const empty = funcs.returnAbsentProps(body, [ 'nome' ]);
        res.status(300).send({
            msg: 'Um ou mais campos vazios: (' + empty.join(', ') + ')',
            status: "error"
        });
    }
});

async function dbQuery(req, res, database, values) {
    // Cria o registro da equipe
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