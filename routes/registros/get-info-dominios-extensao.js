

const express = require('express');
const router = express.Router();
router.use(express.json());

const dbController = require('../../database/db');
const funcs = require('../../utils/funcs');

const sqlGet = 'select  ' +
               '	regnav.dominio, ' +
               '    count(regnav.dominio) as pesquisas ' +
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
            body.idprojeto, body.idprojeto
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
            let retorno = [];
            if(Array.isArray(result) && result.length > 0) {
                mapExts = {};
                for (const domain of result) {
                    const str = domain['dominio'].split('.');
                    const end = str[str.length - 1];
                    
                    if(!mapExts[end]) {
                        mapExts[end] = 0;
                    }
                    mapExts[end]++;
                }

                for (const key in mapExts) {
                    retorno.push({
                        topo: key,
                        pesquisas: mapExts[key]
                    });
                }
            }

            res.status(200).send({
                msg: 'Sucesso ao buscar registros',
                data: retorno,
                status: "success"
            });
        }
    });
}

module.exports = router;