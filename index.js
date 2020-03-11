const express = require('express')
var app = express()
var bodyparser = require('body-parser')
var Aluno = require('./model/aluno')
var flash = require('req-flash')
var session = require('express-session')
var cookieParser = require('cookie-parser')

app.use(cookieParser());
app.use(session({
    secret: '123',
    resavee: true,
    saveUninitialized: true
}));
app.use(flash());
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: false }))
app.set('view engine','ejs')


//read get
app.get('/',function(req,res){
    Aluno.find({}).exec(function(err,docs){
        res.render('listar.ejs',{listAlunos:docs,msg:req.flash('msg')})
    })
})

app.post('/',function(req,res){
    Aluno.find(
        {nome:new RegExp(req.body.pesquisa, 'i')},
        function(err, docs){
        res.render('listar.ejs',{listAlunos: docs, msg:""})
    })
})

//create get 
app.get('/add',function(req,res){
    res.render('adicionar.ejs',{msg:''})
})
//create post
app.post('/add',function(req,res){
    var aluno = new Aluno({
        nome: req.body.nome,
        endereco: req.body.endereco,
        telefone: req.body.telefone
    })
    aluno.save(function(err){
        if(err){
            res.render('adicionar.ejs',{msg:err})
        }else{
            res.render('adicionar.ejs',{msg:"Adicionado com sucesso!"})
        }
})
})

//read get
app.get('/edit/:id',function(req,res){
    Aluno.findById(req.params.id, function(err,docs){
        res.render('editar.ejs',{aluno:docs})

    })
})

app.post('/edit/:id',function(req,res){
    Aluno.findByIdAndUpdate(req.body.id,
        {nome:req.body.nome,
        endereco:req.body.endereco,
        telefone:req.body.telefone 
        },
        function(err,docs){
            if(err){
                req.flash('msg','Problema ao alterar!')
                res.redirect("/")
            }else{
                req.flash('msg','Alterado com sucesso!')
                res.redirect("/")
            }
            
        })
    
})

//read post
app.get('/del/:id',function(req,res){
    Aluno.findByIdAndDelete(req.params.id,function(err){
        if(err){
            req.flash('msg','Problema ao excluir!')
            res.redirect("/")
        }else{
            req.flash('msg','Excluído com sucesso!')
            res.redirect("/")
        }

    });
    //res.redirect('/');
})
app.listen(3000,function(){
    console.log("Estou escutando na porta 3000!!")
})