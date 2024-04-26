const express = require('express');
const router = express.Router();
router.use(express.json());

const dbController = require('../../database/db');
const funcs = require('../../utils/funcs');

const sqlGet = 'SELECT ' + 
                    'equipe.nome as equipe_nome, projetostatus.nome as status_nome, '+ 
                    '(' +
                        'select count(*) from usopesquisados where usopesquisados.idprojeto = proj.idprojeto' +
                    ') as uso_pesquisados, ' +
                    '(' +
                        'select count(*) from registronavegacao as reg1 where reg1.idprojeto = proj.idprojeto' +
                    ') as registros_count, ' +
                    '( ' +
                        'select sum(temp1.tempo) from tempodominio as temp1 where temp1.idprojeto = proj.idprojeto ' +
                    ') as time_navegacao, ' +
                    '(' + 
                        'select count(distinct(reg2.dominio)) from registronavegacao as reg2 where reg2.idprojeto = proj.idprojeto' + 
                    ') as dominios_count ' + 
                'from projeto as proj ' +
                    'inner join equipe on equipe.idequipe = proj.idequipe ' +
                    'inner join projetostatus on projetostatus.idprojetostatus = proj.idstatus ' +
                'where proj.idprojeto = ?';

// http://localhost:12005/api/registros/visaogeral/
// https://joaozucchinalighislandi.com.br/api/registros/visaogeral/
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
                data: (Array.isArray(result) && result.length) ? result[0] : result,
                status: "success"
            });
        }
    });
}

module.exports = router;