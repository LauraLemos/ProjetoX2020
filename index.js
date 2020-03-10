const express = require('express')
var app = express()
var bodyparser = require('body-parser')
var Aluno = require('./model/aluno')

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: false }))
app.set('view engine','ejs')


//ROUTES
//create get (OK)
app.get('/add',function(req,res){
    res.render('adicionar.ejs',{msg:''})
})

//create post (OK)
app.post('/add',function(req,res){
    var aluno = new Aluno({
        nome: req.body.nome,
        endereco: req.body.endereco,
        telefone: req.body.telefone
    })
    aluno.save(function(err){
        if(err){
            res.render("adicionar.ejs",{msg: err})
        }else{
            res.render('adicionar.ejs',{msg: "Adicionado com sucesso!"})
        }
    })
})

//read get (OK)
app.get('/',function(req,res){
    Aluno.find({}).exec(function(err,docs){
        res.render('listar.ejs',{ listAlunos: docs, msg:"" })
    })    
})

//read post
app.post('/',function(req,res){
    Aluno.find({nome:req.body.pesquisa},function(err,docs){
        res.render('listar.ejs',{listAlunos: docs, msg:""})
    })
    
})

//update get/
app.get('/edit/:id',function(req,res){
    Aluno.findById(req.params.id,function(err,docs){
        res.render('editar.ejs',{aluno:docs})
    })
    
})

//update post
app.post('/edit/:id',function(req,res){
    Aluno.findByIdAndUpdate(req.body.id,
        {nome:req.body.nome, 
         endereco:req.body.endereco,
         telefone:req.body.telefone
     },function(err,docs){
        res.redirect('/')
     }
 )
    
})

//delete get
app.get('/del/:id',function(req,res){
    Aluno.findByIdAndDelete(req.params.id,function(err){
        if(err){
            res.redirect('/')
        }else{
            res.redirect('/')
        }
    });
})

app.listen(3000,function(){
    console.log("Estou escutando na porta 3000!!")
})