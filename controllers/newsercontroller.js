// Imports
// ******************************************************************************

let axios = require('axios'); // HTTP Request
let cheerio = require('cheerio'); // Web Scrapper
let mongoose = require('mongoose'); // MongoDB ORM
let db = require("../models"); // Require all models

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/wiredDB");

// Exports
module.exports = (app) => {

  // ******************************************************************************
  // GET Routes
  // ******************************************************************************

 // Default route (/), scrape the Wired Magazine website
 // ******************************************************************************
  app.get("/", (req, res) =>  {
    
    axios.get("https://www.wired.com/most-popular/").then((response) => {
      // load cheerio and save it to $ 
      const $ = cheerio.load(response.data);

      let articles = [];

      // li with class arhive-item-component and build object to render:
      $("li.archive-item-component").each(function(i, element) {
        // Add the text, href, summary, author & read time of every article, and save them as properties of the result object
        articles.push({
          headline: $(element)
            .children("div")
            .children("a")
            .children("h2")
            .text(),
          link: "https://www.wired.com" + $(element)
            .children("a")
            .attr("href"),
          summary: $(element)
            .children("div")
            .children("a")
            .children("p")
            .text(),
          imageURL: $(element)
            .children("a")
            .children("div")
            .children("div")
            .children("div")
            .children("div")
            .children("img")
            .attr("src"),
          articleDate: $(element)
            .children("div")
            .children("div")
            .children("time")
            .text()
        })
      });
      // Successfully scraped, render the articles
      res.render("index", {articles:articles})
    });
  });


  //(/articles) Retrieve saved articles from db - Link to button /articles
  // ******************************************************************************
  app.get("/articles", function(req,res){
    db.Article.find({}).sort({articleDate:-1}) //
    .then(function(dbArticle) {

      // Send them back to the client
      res.render("index", {articles:dbArticle});
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
  });

  // (/notes/id) - Get all the notes for a specific article
  // ******************************************************************************
  app.get("/notes/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one
    db.Note.find({ article: req.params.id })
      //populate all of the notes associated with it
      .populate("article")
      .then(function(dbNotes) {
        //Send it back to the client
        console.log(`all notes: ${dbNotes}`)
        res.json(dbNotes)
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });


  // ******************************************************************************
  // POST Routes
  // ******************************************************************************

  // (/saveArticle) - Route for saving an Article
  // ******************************************************************************
  app.post("/saveArticle", (req,res) => {
    db.Article.find({headline:req.body.headline})
    .then(function(dbArticle) {
      // If article is not already saved, then add it to the db
      if (dbArticle.length ===0){
        db.Article.create(req.body)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
          res.send("status 200")
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          return res.json(err);
        })
      }
      // Article already saved in db
      else {
        console.log("Article already in db")
      }
    })
  })

  // (/note) Route for saving an Article's Note
  // ******************************************************************************
  app.post("/note", function(req, res) {
    // Create new and pass req.body to the entry
    db.Note.create(req.body)
      .then(function(dbNote) {
        res.json(dbNote);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // ******************************************************************************
  // DELETE Routes
  // ******************************************************************************

  // (article/:id) Delete article from db
  // ******************************************************************************
  app.delete("/article/:id", function(req,res) {
    // Delete article from path req.params.id
    db.Article.deleteOne({"_id":req.params.id})   
    .then(function(response){
      console.log("article deleted")
      // Delete all associated notes to the article req.params.id
      db.Note.deleteMany({"article":req.params.id})   
      .then (function(response){
        console.log("notes deleted")
        res.end()
      })
    })
  })

  // Delete note from db
   // ******************************************************************************
  app.delete("/note/:id", function(req,res) {
      // Delete note from article req.params.id
    db.Note.deleteOne({"_id":req.params.id})  
    .then(function(response){
      console.log("note deleted")
      res.end()
    })
  })

} 
// End of Module Export