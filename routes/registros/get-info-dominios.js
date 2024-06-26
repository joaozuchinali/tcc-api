

const express = require('express');
const router = express.Router();
router.use(express.json());

const dbController = require('../../database/db');
const funcs = require('../../utils/funcs');

const sqlGet = 'select  ' +
               '	regnav.dominio, ' +
               '    count(regnav.dominio) as pesquisas, ' +
               '    ( ' +
               '		select sum(temp.tempo) from tempodominio as temp where temp.idprojeto = ? and temp.dominio = regnav.dominio ' +
               '    ) as tempo, ' +
               '    count(distinct(regnav.idusopesquisados)) as usuarios, ' +
               '    ( ' +
               '        select regnav2.favicon from registronavegacao as regnav2 ' +
               "        where regnav2.idprojeto = ? AND regnav2.dominio = regnav.dominio AND regnav2.favicon <> '' " +
               '        limit 1 ' +
               '    ) as favicon ' +
               'from  ' +
               '	registronavegacao as regnav ' +
               'where  ' +
               '	regnav.idprojeto = ?  ' +
               'group by regnav.dominio ';

// http://localhost:12005/api/registros/infosdominio/
// https://joaozucchinalighislandi.com.br/api/registros/infosdominio/
router.post('/', async function(req, res) {
    const body = req.body;
    
    if(body.idprojeto) {
        const values = [
            body.idprojeto, body.idprojeto, body.idprojeto
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