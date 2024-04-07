const express = require('express');
const router = express.Router();
router.use(express.json());

const dbController = require('../../database/db');
const funcs = require('../../utils/funcs');

const sqlInsert = 'INSERT INTO `projeto` (`idprojeto`,`nome`,`identificador`,`codigo`,`idequipe`,`idstatus`) VALUES (?, ?, ?, ?, ?, ?);'

// http://localhost:12005/api/registros/navegacao/
// https://joaozucchinalighislandi.com.br/api/registros/navegacao/
router.post('/', async function(req, res) {
    const body = req.body;
    
    if(body.idusopesquisados && body.idprojeto) {
        const values = [

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
        const empty = funcs.returnAbsentProps(body, [ 'idusopesquisados', 'idprojeto' ]);
        res.status(300).send({
            msg: dbController.messages.errorMessage('Um ou mais campos vazios: (' + empty.join(', ') + ')'),
            status: "error"
        });
    }
});

function dbQuery(req, res, database, values) {
    // Primeiro verificar se já existe um registro para aquele usuário e projeto
    database.query(sqlInput, values, async function(err, result){
        if(err || result.affectedRows != 1) {
            console.log(err);
    
            res.status(300).send({msg: 'Erro ao gerar o registro', data: {sqlMessage: err.sqlMessage, sql: err.sql}, status: "error"});
            return;
        } else {
            res.status(200).send({
                msg: 'Sucesso ao gerar registro',
                data: {
                    id: result.insertId
                },
                status: "success"
            });
        }
    });
}

module.exports = router;