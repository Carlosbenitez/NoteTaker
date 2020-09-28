const { notStrictEqual } = require("assert");
const express = require("express")
const path = require("path");
const app = express()
const fs = require("fs");

const PORT = process.env.PORT || 8080;

app.listen(PORT,function(){
    console.log("App listening on PORT: " + PORT);
});
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const notesArray=[]

app.get("/", function(req, res) {

    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/notes", function(req, res){

    res.sendFile(path.join(__dirname, "public/notes.html"))
});

app.post("/api/notes", function(req, res){
    console.log("req: ", req);
    notesArray.push(req.body)
    console.log(req.body)
    res.send("This worked")
    //put notesArray into a string for storage
    var notesString = JSON.stringify(notesArray)
    fs.writeFile("./storage/data.json", notesString, function () {

    });

});

app.get("/api/notes", function(req, res){
    fs.readFile("./storage/data.json", 'utf8', (err, data) => {
        if(err){
            return err;
        }

        console.log("notes: ", data);
        res.json(data)
    });
});

app.delete("/api/notes/:id", function(req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./storage/data.json", "utf8"));
    let noteID = req.params.id;
    let newID = 0;
    console.log(`Deleting note with ID ${noteID}`);
    savedNotes = savedNotes.filter(currNote => {
        return currNote.id != noteID;
    })
    
    for (currNote of savedNotes) {
        currNote.id = newID.toString();
        newID++;
    }

    fs.writeFileSync("./storage/data.json", JSON.stringify(savedNotes));
    res.json(savedNotes);
});