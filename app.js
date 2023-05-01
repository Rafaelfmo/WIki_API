//Fazer o require das dependencias
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

//Inicializando o express
const app = express();

//Configurando o app
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//Conectando ao banco de dados
mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
});

//Criando o schema
const articleSchema = {
  title: String,
  content: String,
};

//Criando o model
const Article = mongoose.model("articles", articleSchema);

//Http requests para todos os artigos
app.get("/articles", function (req, res) {
  Article.find()
    .then((articles) => {
      res.send(articles);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.post("/articles", (req, res) => {
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content,
  });

  newArticle
    .save()
    .then(() => {
      res.send("Successfully added a new article");
    })
    .catch((err) => {
      res.send(err);
    });
});

app.delete("/articles", (req, res) => {
  Article.deleteMany()
    .then(() => {
      res.send("Successfully deleted all articles");
    })
    .catch((err) => {
      res.send(err);
    });
});

//Http requests para um artigo especifico
app.get("/articles/:articleTitle", (req, res) => {
  Article.findOne({ title: req.params.articleTitle })
    .then((article) => {
      res.send(article);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.put("/articles/:articleTitle", (req, res) => {
  Article.updateOne(
    { title: req.params.articleTitle },
    { title: req.body.title, content: req.body.content }
  )
    .then(() => {
      res.send("Successfully updated article");
    })
    .catch((err) => {
      res.send(err);
    });
});

app.patch("/articles/:articleTitle", (req, res) => {
  Article.updateOne({ title: req.params.articleTitle }, { $set: req.body })
    .then(() => {
      res.send("Successfully updated article");
    })
    .catch((err) => {
      res.send(err);
    });
});

app.delete("/articles/:articleTitle", (req, res) => {
  Article.deleteOne({ title: req.params.articleTitle })
    .then(() => {
      res.send("Successfully deleted article");
    })
    .catch((err) => {
      res.send(err);
    });
});

//Iniciando o servidor na porta 3000
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
