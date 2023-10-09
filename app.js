const express = require("express"); // loads the express package
const { engine } = require("express-handlebars"); // loads handlebars for Express
const port = 8080; // defines the port
const app = express(); // creates the Express application

// defines handlebars engine
app.engine("handlebars", engine());
// defines the view engine to be handlebars
app.set("view engine", "handlebars");
// defines the views directory
app.set("views", "./views");

// define static directory "public" to access css/ and img/
app.use(express.static("public"));

// MODEL (DATA)
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("projects-jl.db");

// creates table projects at startup
db.run(
  "CREATE TABLE projects (pid INTEGER PRIMARY KEY, pname TEXT NOT NULL, pyear INTEGER NOT NULL, pdesc TEXT NOT NULL)",
  (error) => {
    if (error) {
      // test error: display error
      console.log("Error: ", error);
    } else {
      // test error: no error, table has been created
      console.log("---> Table projects created <---");

      const projects = [
        { id: 1, name: "Projects 1", year: 2023, desc: "Projects 1 desc" },
        { id: 2, name: "Projects 2", year: 2022, desc: "Projects 2 desc" },
        { id: 3, name: "Projects 3", year: 2021, desc: "Projects 3 desc" },
        { id: 4, name: "Projects 4", year: 2020, desc: "Projects 4 desc" },
        { id: 5, name: "Projects 5", year: 2019, desc: "Projects 5 desc" },
      ];

      // inserts projects
      projects.forEach((oneProject) => {
        db.run(
          "INSERT INTO projects (pid, pname, pyear, pdesc) VALUES (?, ?, ?, ?)",
          [oneProject.id, oneProject.name, oneProject.year, oneProject.desc],
          (error) => {
            if (error) {
              // test error: display error
              console.log("Error: ", error);
            } else {
              // test error: no error, table has been inserted
              console.log("---> Line added into the projects table <---");
            }
          }
        );
      });
    }
  }
);

// creates skills projects at startup
db.run(
  "CREATE TABLE skills (sid INTEGER PRIMARY KEY, sname TEXT NOT NULL, sdesc TEXT NOT NULL, stype TEXT NOT NULL)",
  (error) => {
    if (error) {
      // tests error: display error
      console.log("ERROR: ", error);
    } else {
      // tests error: no error, the table has been created
      console.log("---> Table skills created <---");
      const skills = [
        {"id":"1", "name": "Html", "type": "Markup Language", "desc": "Structures content, creating the backbone of the web pages"},
        {"id":"2", "name": "Css", "type": "style sheet language", "desc": "Styles web pages"},
        {"id":"3", "name": "Javascript", "type": "Programming language", "desc": "Programming with Javascript on the client side."},
        {"id":"4", "name": "Node", "type": "Programming language", "desc": "Programming with Javascript on the server side."},
        {"id":"5", "name": "Express", "type": "Framework", "desc": "A framework for programming Javascript on the server side."},
      ]

      // inserts skills
      skills.forEach((oneSkill) => {
        db.run(
          "INSERT INTO skills (sid, sname, sdesc, stype) VALUES (?, ?, ?, ?)",
          [oneSkill.id, oneSkill.name, oneSkill.desc, oneSkill.type],
          (error) => {
            if (error) {
              // tests error: display error
              console.log("ERROR: ", error);
            } else {
              // tests error: no error, the table has been inserted
              console.log("---> Line added into the skills table <---");
            }
          }
        );
      });
    }
  }
);

// creates table projectsSkills at startup
db.run(
  "CREATE TABLE projectsSkills (psid INTEGER PRIMARY KEY, pid INTEGER, sid INTEGER, FOREIGN KEY (pid) REFERENCES projects (pid),FOREIGN KEY (sid) REFERENCES skills (sid))",
  (error) => {
    if (error) {
      // tests error: display error
      console.log("ERROR: ", error);
    } else {
      // tests error: no error, the table has been created
      console.log("---> Table projectsSkills created!");
      const projectsSkills = [
        { id: "1", pid: "1", sid: "1" },
        { id: "2", pid: "2", sid: "1" },
        { id: "3", pid: "2", sid: "2" },
        { id: "4", pid: "3", sid: "1" },
        { id: "5", pid: "3", sid: "2" },
        { id: "6", pid: "3", sid: "3" },
        { id: "7", pid: "4", sid: "1" },
        { id: "8", pid: "4", sid: "2" },
        { id: "9", pid: "4", sid: "3" },
        { id: "10", pid: "4", sid: "4" },
      ];
      // inserts projectsSkills
      projectsSkills.forEach((oneProjectSkill) => {
        db.run(
          "INSERT INTO projectsSkills (psid, pid, sid) VALUES (?, ?, ?)",
          [oneProjectSkill.id, oneProjectSkill.pid, oneProjectSkill.sid],
          (error) => {
            if (error) {
              // tests error: display error
              console.log("ERROR: ", error);
            } else {
              // tests error: no error, the table has been inserted
              console.log("---> Line added into the projectsSkills table <---");
            }
          }
        );
      });
    }
  }
);


const humans = [
  { id: "0", name: "Jerome" },
  { id: "1", name: "Mira" },
  { id: "2", name: "Linus" },
  { id: "3", name: "Susanne" },
  { id: "4", name: "Jasmin" },
];

// CONTROLLER (THE BOSS)
// defines route "/"
app.get("/", function (request, response) {
  response.render("home.handlebars");
});



// defines route "/humans"
app.get("/humans", function (request, response) {
  const model = { listHumans: humans }; // defines the model
  // in the next line, you should send the abovedefined
  // model to the page and not an empty object {}...
  response.render("humans.handlebars", model);
});

app.get("/humans/:id", function (request, response) {
  //get the id on the dynamic route
  const id = request.params.id;
  const model = humans[id]; // defines the model
  // in the next line, you should send the abovedefined
  // model to the page and not an empty object {}...
  response.render("human.handlebars", { name: model.name, id: model.id });
});

app.get('/projects', function(request, response) {
  db.all("SELECT * FROM projects", function (error, theProjects){
    if (error) {
      const model = {
        hasDatabaseError: true,
        theError: error,
        projects: []
      }
      // render the page with the model
      response.render("projects.handlebars", model)
    } else {
      const model = {
        hasDatabaseError: false,
        theError: "",
        projects: theProjects
      }
      // render the page with the model
      response.render("projects.handlebars", model)
    }
  })
})

// defines the final default route 404 NOT FOUND
app.use(function (req, res) {
  res.status(404).render("404.handlebars");
});

// runs the app and listens to the port
app.listen(port, () => {
  console.log(`Server running and listening on port ${port}...`);
});
