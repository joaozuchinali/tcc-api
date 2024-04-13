const express = require('express');
const router = express.Router();
router.use(express.json());

const dbController = require('../../database/db');
const funcs = require('../../utils/funcs');

const sqlInsert = 'INSERT INTO `usuario` (`nome`,`senha`,`email`,`idstatus`) VALUES (?, ?, ?, 1)';
const sqlReturn = 'SELECT * FROM `usuario` WHERE `usuario`.`idusuario` = ?';
const sqlCheck  = 'SELECT * FROM `usuario` WHERE `usuario`.`email` = ?';

// http://localhost:12005/api/usuarios/create/
// https://joaozucchinalighislandi.com.br/api/usuarios/create/
router.post('/', async function(req, res) {
    const body = req.body;
    
    if(body.nome && body.senha && body.email) {
        const values = [
            body.nome,
            body.senha,
            body.email
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
        database.query(sqlCheck, [values[2]], async function(err, result) {

            if(Array.isArray(result) && result.length) {
                resolve(true);
            }
            resolve(false);
        });
    });
    if(exists) {
        res.status(300).send({msg: 'Usuário já existente', data: {code: 2}, status: "error"});
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