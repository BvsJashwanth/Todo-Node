const express=require("express")
const app=express()
const TodoTask = require("./models/TodoTask");
const dotenv = require('dotenv');
dotenv.config();
app.use('/static',express.static('public'))
app.use(express.urlencoded({ extended: true }));
const mongoose = require("mongoose");
//mongoose.set("useFindAndModify", false);
mongoose.connect(process.env.DB_CONNECT).then(sucess=> app.listen(3000)).catch(err=> console.log(err.message));
app.set('view engine','ejs');
app.post('/',async (req, res) => {
    const todoTask = new TodoTask({
    content: req.body.content
    });
    try {
    await todoTask.save();
    res.redirect("/");
    } catch (err) {
    res.redirect("/");
    }
    });
    app.get("/", (req, res) => {
        TodoTask.find({})
            .then(tasks => {
                res.render("todo.ejs", { todoTasks: tasks });
            })
            .catch(err => {
                res.status(500).send(err);
    });
});
app.route("/edit/:id")
    .get((req, res) => {
        const id = req.params.id;
        TodoTask.find({})
            .then(tasks => {
                res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
            })
            .catch(err => {
                res.status(500).send(err);
            });
    })
    .post((req, res) => {
        const id = req.params.id;
        TodoTask.findByIdAndUpdate(id, { content: req.body.content })
            .then(() => {
res.redirect("/");
            })
            .catch(err => {
                res.status(500).send(err);
            });
    });
//DELETE
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndDelete(id)
        .then(() => {
            res.redirect("/");
        })
        .catch(err => {
            res.status(500).send(err);
        });
});