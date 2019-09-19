const express = require('express');
const server = express();

server.use(express.json()); //permitindo ler o json

//ARRAY COM OS PROJETOS
const projetos = [
    {
        'id': "1",
        'titulo': "Primeiro Projeto",
        'tarefas': []
    },
]

let qtdRequisicoes = 0; //variavel 

//FUNÇÃO QUE VERIFICA SE EXISTE O PROJETO
function checkExistProjeto(req, res, next){
    const {id} = req.params; //id da url
    const projeto = projetos.find(p=> p.id === id);

    if(!projeto){
        return res.status(400).json({erro:'Projeto Inexistente'});
    }

    return next();
}

 
//MIDDLWARE GLOBAL
server.use((req,res, next)=>{
    qtdRequisicoes++;
    console.log(`Número de Requisiçôes ${qtdRequisicoes}`); //log da quantidade de requisicoes
    console.log(`Método: ${req.method}; URL: ${req.url}`); //metodo e a url que foi submetida

    return next(); //permite avançar 
})

//RETORNA TODOS OS PROJETOS
server.get('/projetos', (req, res) => {
    return res.json(projetos);
})

//INSERE UM NOVO PROJETO
server.post('/projetos', (req, res) => {
    const {id,titulo} = req.body;
    
    //passo as informaçoes do body para uma constante
    const novoProjeto = {
        id,
        titulo,
        tarefas: []
    }
    
    projetos.push(novoProjeto); //adiciono o novo projeto 

    return res.json(projetos); //exibindo todos os projetos
})

//EDITANDO O TITULO DE UM PROJETO
server.put('/projetos/:id', checkExistProjeto, (req, res) =>{
    const {id} = req.params; //recendo um parametro da URL
    const {titulo} = req.body; //recebendo o titulo do BODY

    const projeto = projetos.find(p => p.id === id); //buscando o id igual ao passado

    projeto.titulo = titulo;

    return res.json(projeto);
})

//DELETANDO UM PROJETO
server.delete('/projetos/:id', checkExistProjeto, (req,res) =>{
    const {id} = req.params; //recebendo o id da URL

    const projetoIndex = projetos.findIndex(p=> p.id === id); //vai retornar o index se for igual ao id

    projetos.splice(projetoIndex, 1); //vai encontrar o index no array e deletar o projeto 

    return res.json(projetos);
})

//INSERINDO UMA TAREFA NO PROJETO
server.post('/projetos/:id/tarefas', checkExistProjeto, (req, res) =>{
    const {id} = req.params; //recebendo o id atraves da URL
    const {tarefa} = req.body; //recebendo a tarefa atraves do BODY

    const projeto = projetos.find(p=> p.id === id); 

    projeto.tarefas.push(tarefa); //inserindo a tarefa 

    return res.json(projetos);
})




server.listen(3000); //porta que vai ficar ouvindo