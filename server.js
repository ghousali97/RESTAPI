const express = require('express');
const port = process.env.PORT || 3000
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const articleSchema = mongoose.Schema({
    url: String,
    title: String,
    content: String
});

const Article = mongoose.model('article', articleSchema);



app.listen(port, function () {
    console.log("Listening on port: " + port);
})

app.get("/articles", function (req, res) {
    Article.find({}).then(function (articles) {
        res.send(articles);
    }).catch(function (err) {
        console.log(err);
        res.send(err);
    });
});

app.get("/articles/:articleTitle", function (req, res) {
    var requestedTitle = _.kebabCase(_.lowerCase(req.params.articleTitle));
    Article.findOne({ url: requestedTitle }).then(function (article) {
        if (article) {
            res.send(article);
        } else {
            res.status(404).send({ "error": "No matching article found!" });
        }

    }).catch(function (err) {
        console.log(err);
        res.send(err);
    });
});
app.put("/articles/:articleTitle", function (req, res) {
    var requestedTitle = _.kebabCase(_.lowerCase(req.params.articleTitle));
    var title = req.body.title;
    var content = req.body.content;

    Article.replaceOne({ url: requestedTitle }, { url: requestedTitle, title: title, content: content }).then(function (queryResult) {
        if (queryResult.matchedCount === 0) {
            res.status(404).send({ "error": "No matching article found!" });
        }
        else {
            res.status(200).send({ "message": "update successful!" });
        }



    }).catch(function (err) {
        console.log(err);
        res.send(err);
    });
});

app.patch("/articles/:articleTitle", function (req, res) {
    var requestedTitle = _.kebabCase(_.lowerCase(req.params.articleTitle));
    var title = req.body.title;
    var content = req.body.content;

    Article.updateOne({ url: requestedTitle }, { $set: { url: requestedTitle, title: title, content: content } }).then(function (queryResult) {
        if (queryResult.matchedCount === 0) {
            res.status(404).send({ "error": "No matching article found!" });
        }
        else {
            res.status(200).send({ "message": "update successful!" });
        }



    }).catch(function (err) {
        console.log(err);
        res.send(err);
    });
});
app.delete("/articles/:articleTitle", function (req, res) {
    var requestedTitle = _.kebabCase(_.lowerCase(req.params.articleTitle));
    Article.deleteOne({ url: requestedTitle }).then(function (queryResult) {
        if (queryResult.deletedCount === 0) {
            res.status(404).send({ "error": "No matching article found!" });
        }
        else {
            res.status(200).send({ "message": "delete successful!" });
        }


    }).catch(function (err) {
        console.log(err);
        res.send(err);
    });
});
app.post("/articles", function (req, res) {

    var title = req.body.title;
    var url = _.kebabCase(_.lowerCase(title));
    var content = req.body.content;

    var newArticle = new Article({
        url: url,
        title: title,
        content: content
    });
    newArticle.save().then(function (articles) {
        res.send(newArticle);
    }).catch(function (err) {
        console.log(err);
        res.send(err);
    });

});


app.delete('/articles', function (req, res) {
    Article.deleteMany({}).then(function () {

        res.send("Success!");
    }).catch(function (err) {
        console.log(err);
        res.send(err);
    });
});
