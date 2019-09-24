// Dependencies
// =============================================================
const axios = require("axios");
const cheerio = require("cheerio");

// Models
// =============================================================
const db = require("../models");

// Routes
// =============================================================
module.exports = function (app) {

    // =============== get unsaved data from mongodb news-collection ===============
    app.get("/", (req, res) => {
        db.New.find({ saved: false })
            .then((dbNew) => {
                let hbsObject = {
                    news: dbNew
                };
                res.render("index", hbsObject);
                // console.log(hbsObject)
                // console.log(hbsObject.news)
            })
    });

    // =============== click clear News button ===============
    app.delete("/clear", (req, res) => {
        db.New.deleteMany({ saved: false })
            .then((cleared) => {
                res.send("sent")
            })
            .catch((err) => {
                console.log(err)
            });
    })

    // =============== click Scrape News button ===============
    app.post("/scrape", (req, res) => {
        db.New.deleteMany({ saved: false })
            .then((cleared) => {

                // After removed, all left news are saved,
                // so loop all news which we still have and push each of titles to titleArray.
                var titleArr = [];
                db.New.find({})
                    .then((dbNew) => {
                        dbNew.forEach((eachNew) => {
                            titleArr.push(eachNew.title);
                        })
                        console.log("==== titleArr:", titleArr)
                    })

                axios.get("http://www.ign.com/")
                    .then((response) => {
                        let $ = cheerio.load(response.data);
                        let result = {};
                        $("article .item-body .item-thumbnail a").each(function (i, element) {
                            result.title = $(this)
                                .children("img")
                                .attr("alt");
                            result.link = $(this)
                                .attr("href");
                            result.img = $(this)
                                .children("img")
                                .attr("data-original");
                            console.log("==== singleTitle:", result.title)

                            // Prevent to create repeated news in mongoDB
                            if (titleArr.indexOf(result.title) === -1) {
                                db.New.create(result)
                                    .then((dbNew) => {
                                        res.send("News created in mongoDB!!")
                                    })
                                    .catch((err) => {
                                        console.log(err)
                                    });
                            }
                        })
                    });
            })
            .catch((err) => {
                console.log(err)
            });
    })

    // =============== click save button to save news ===============
    app.put("/save/:id", (req, res) => {
        db.New.findOneAndUpdate({ _id: req.params.id }, { saved: true })
            .then((dbSave) => {
                res.json(dbSave);
            })
            .catch((err) => {
                res.json(err);
            });
    });

    // ========================================================================
    // ============================== saved page ==============================
    // ========================================================================

    // =============== get saved data from mongodb news-collection as well ===============
    app.get("/saved", (req, res) => {
        db.New.find({ saved: true }).sort({ date: -1 })
            .then((dbSaved) => {
                let hbsObject = {
                    saved: dbSaved
                };
                // console.log(hbsObject)
                res.render("saved", hbsObject);
            })
    });

    // =============== click remove button to un-save news ===============
    app.put("/unsave/:id", (req, res) => {
        db.New.findOneAndUpdate({ _id: req.params.id }, { saved: false })
            .then((dbUnsave) => {
                res.json(dbUnsave);
            })
            .catch((err) => {
                res.json(err);
            });
    });

    // =============== click note button on saved news ===============
    app.get("/note/:id", (req, res) => {
        db.New.findOne({ _id: req.params.id })
            .populate("note")
            .then(function (dbNote) {
                console.log("dbNote:", dbNote)
                // console.log("noteObject.theNews.note.note:", noteObject.theNews.note.note)
                res.json(dbNote);
            })
            .catch((err) => {
                res.json(err);
            });
    });

    app.get("/note2/:id", (req, res) => {
        db.New.findOne({ _id: req.params.id })
            .populate("note")
            .then(function (dbNote) {
                console.log("dbNote:", dbNote)
                // console.log("noteObject.theNews.note.note:", noteObject.theNews.note.note)
                res.json(dbNote);
            })
            .catch((err) => {
                res.json(err);
            });
    });
    // =============== click submit button on pop-up page ===============
    app.post("/post/:id", (req, res) => {
        db.Note.create(req.body)
            .then(function (dbNote) {
                console.log("== dbNote", dbNote)
                return db.New.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote._id } }, { new: true });
            })
            .then(function (dbNew) {
                console.log("=====", dbNew)
                res.json(dbNew);
            })
            .catch((err) => {
                res.json(err);
            })
    });

    // =============== click delete button on each note ===============
    app.delete("/delete/:id", (req, res) => {
        db.Note.findOneAndDelete({ _id: req.params.id })
            // db.New.findOneAndDelete({ _id: req.params.id }, { note: req.params.id })

            .then(function (dbNote) {
                // res.json(dbNote);

                db.New.findOne({ note: req.params.id })
                    .then(function (dbNew) {
                        res.json(dbNew);
                    })
                    .catch((err) => {
                        res.json(err);
                    })
            })
            .catch((err) => {
                res.json(err);
            })
    });
};
