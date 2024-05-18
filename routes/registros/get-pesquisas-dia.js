




const express = require('express');
const router = express.Router();
router.use(express.json());

const dbController = require('../../database/db');
const funcs = require('../../utils/funcs');

const sqlGet =  'select ' + 
                "    FROM_UNIXTIME(regnav.acesso/1000,'%Y-%m-%d') as diap, "  +
                '    count(regnav.idregistronavegacao) as pesquisas ' +
                'from ' +
                '	registronavegacao as regnav ' +
                'where ' +
                '    regnav.idprojeto = ? ' +
                'group by ' +
                '	diap ';

// http://localhost:12005/api/registros/pesquisasdia/
// https://joaozucchinalighislandi.com.br/api/registros/pesquisasdia/
router.post('/', async function(req, res) {
    const body = req.body;
    
    if(body.idprojeto) {
        const values = [
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
        const empty = funcs.returnAbsentProps(body, [ 'idprojeto' ]);
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