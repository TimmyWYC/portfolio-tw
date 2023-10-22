const express = require("express"); // loads the express package
const { engine } = require("express-handlebars"); // loads handlebars for Express
const sqlite3 = require("sqlite3"); // loads the sqlite3 package
const port = 8080; // defines the port
const app = express(); // creates the Express application
const bodyParser = require('body-parser') // loads the body-parser package
const session = require('express-session') // loads the express-session package
const connectSqlite3 = require('connect-sqlite3')
//const CookieParser = require('cooki-parser')

// defines handlebars engine
app.engine("handlebars", engine());
// defines the view engine to be handlebars
app.set("view engine", "handlebars");
// defines the views directory
app.set("views", "./views");

// define static directory "public" to access css/ and img/
app.use(express.static("public"));

//post Forms
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

// MODEL (DATA)
const db = new sqlite3.Database("projects-jl.db");
const SQLiteStore = connectSqlite3(session);

// session
app.use(session({
  store: new SQLiteStore({db: "session-db.db"}),
  "saveUninitialized": false,
  "resave": false,
  "secret": "secret-is-to-make-it-complicated-to-hack"
}));

// creates table projects at startup
db.run(
  "CREATE TABLE projects (pid INTEGER PRIMARY KEY AUTOINCREMENT, pname TEXT NOT NULL, pyear INTEGER NOT NULL, pdesc TEXT NOT NULL)",
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

// creates table skills at startup
db.run(
  "CREATE TABLE skills (sid INTEGER PRIMARY KEY AUTOINCREMENT, sname TEXT NOT NULL, sdesc TEXT NOT NULL, stype TEXT NOT NULL)",
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
  "CREATE TABLE projectsSkills (psid INTEGER PRIMARY KEY AUTOINCREMENT, pid INTEGER, sid INTEGER, FOREIGN KEY (pid) REFERENCES projects (pid),FOREIGN KEY (sid) REFERENCES skills (sid))",
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

// temp can remove
const humans = [
  { id: "0", name: "Jerome" },
  { id: "1", name: "Mira" },
  { id: "2", name: "Linus" },
  { id: "3", name: "Susanne" },
  { id: "4", name: "Jasmin" },
];

// defines route "/"
app.get("/", function (request, response) {
  console.log("SESSION: ", request.session);
  const model = {
    isLoggedIn: request.session.isLoggedIn,
    name: request.session.name,
    isAdmin: request.session.isAdmin
  }
  response.render("home.handlebars", model);
});

// temp can remove
app.get("/humans", function (request, response) {
  const model = { listHumans: humans }; // defines the model
  // in the next line, you should send the abovedefined
  // model to the page and not an empty object {}...
  response.render("humans.handlebars", model);
});

// temp can remove
app.get("/humans/:id", function (request, response) {
  //get the id on the dynamic route
  const id = request.params.id;
  const model = humans[id]; // defines the model
  // in the next line, you should send the abovedefined
  // model to the page and not an empty object {}...
  response.render("human.handlebars", { name: model.name, id: model.id });
});

// go to projects page
app.get('/projects', function(request, response) {
  db.all("SELECT * FROM projects", function (error, theProjects){
    if (error) {
      const model = {
        hasDatabaseError: true,
        theError: error,
        projects: [],
        isLoggedIn: request.session.isLoggedIn,
        name: request.session.name,
        isAdmin: request.session.isAdmin
      }
      // render the page with the model
      response.render("projects.handlebars", model)
    } else {
      const model = {
        hasDatabaseError: false,
        theError: "",
        projects: theProjects,
        isLoggedIn: request.session.isLoggedIn,
        name: request.session.name,
        isAdmin: request.session.isAdmin
      }
      // render the page with the model
      response.render("projects.handlebars", model)
    }
  })
});

// sends the form fo a new project
app.get('/projects/new', (request, response) => {
  if (request.session.isLoggedIn==true && request.session.isAdmin==true){
    const model = {
      isLoggedIn:request.session.isLoggedIn,
      name: request.session.name,
      isAdmin: request.session.isAdmin,
    }
    response.render("newproject.handlebars", model)
  } else {
    response.render("login.handlebars", model)
  }
});

// go to creat new project page
app.post('/projects/new', (request, response) => {
  const newp = [
    request.body.projname, request.body.projyear, request.body.projdesc,
  ]
  if (request.session.isLoggedIn==true && request.session.isAdmin==true) {
    db.run("INSERT INTO PROJECTS (pname, pyear, pdesc) VALUES (?, ?, ?)", newp, (error) => {
      if (error) {
        console.log("ERROR: ", error)
      } else {
        console.log("Line added into the projects table!")
      }
      response.redirect('/projects')
    })
  } else {
    response.redirect('/login')
  }
});

// go to project with id page
app.get("/projects/:id", function (request, response) {
  const pid = request.params.id;

  db.get("SELECT * FROM projects WHERE pid = ?", [pid], (error, project) => {
    if (error) {
      // Project not found
      const model = {
        hasDatabaseError: true,
        theError: error,
        isLoggedIn: request.session.isLoggedIn,
        name: request.session.name,
        isAdmin: request.session.isAdmin
      };
      response.render("project.handlebars", model);
    } else {
      // Project found, pass it to the template
      const model = {
        project: project,
        isLoggedIn: request.session.isLoggedIn,
        name: request.session.name,
        isAdmin: request.session.isAdmin
      };
      response.render("project.handlebars", model);
    }
  });
});

// go to about page
app.get('/about', (request, response) => {
  const model = {
    isLoggedIn: request.session.isLoggedIn,
    name: request.session.name,
    isAdmin: request.session.isAdmin
  }
  response.render("about.handlebars", model);
});

// go to contact page
app.get('/contact', (request, response) => {
  const model = {
    isLoggedIn: request.session.isLoggedIn,
    name: request.session.name,
    isAdmin: request.session.isAdmin
  }
  response.render("contact.handlebars", model);
});

// go to login page
app.get('/login', (request, response) => {
  const model = {
    isLoggedIn: request.session.isLoggedIn,
    name: request.session.name,
    isAdmin: request.session.isAdmin
  }
  response.render('login.handlebars', model);
});

// login to the website
app.post('/login', (request, response) => {
  const un = request.body.un;
  const pw = request.body.pw;

  console.log("Un: ", un);
  console.log("Pw: ", pw);

  //Remark: you can add variables (as many as you want) to the session by: req.session.myVariableName = “my value”

  if (un=="timmy" && pw=="123") {
    console.log("timmy logged in")
    request.session.isAdmin = true;
    request.session.isLoggedIn = true;
    request.session.name = "Timmy";
    response.redirect('/')
  } else {
    console.log("wrong Usernaem and/or Password")
    request.session.isAdmin = false;
    request.session.isLoggedIn = false;
    request.session.name = "";
    response.redirect('/login')
  }

});

// logut from the web site
app.get('/logout', (request, response) => {
  request.session.isAdmin = false;
  request.session.isLoggedIn = false;
  request.session.name = "";
  console.log("logout");
  response.redirect('/');
  });

  // delete a project
app.get('/projects/delete/:id', (request, response) => {
  const id = request.params.id;
  if (request.session.isLoggedIn==true && request.session.isAdmin==true){
    db.run("DELETE FROM projects WHERE pid=?", [id], function(error, theProjects) {
      if(error){
        const model = {dbError: true, theError: error,
        isLoggedIn:request.session.isLoggedIn,
        name: request.session.name,
        isAdmin: request.session.isAdmin,
      }
      response.render("home.handlebars", model)
      } else {
        const model = {dbError: true, theError: error,
          isLoggedIn:request.session.isLoggedIn,
          name: request.session.name,
          isAdmin: request.session.isAdmin,
        }
        response.render("home.handlebars", model)
      }
    })
  } else {
    response.redirect('/login')
  }
});

//get project with id to modify
app.get('/projects/update/:id', (request, response) => {
  const id = request.params.id;
  db.get("SELECT * FROM projects WHERE pid = ?", [id], function (error, theProject) {
    if (error) {
      console.log("ERROR: ", error)
      const model = { dbError: true, theError: error,
        project: {},
        isLoggedIn: request.session.isLoggedIn,
        name: request.session.name,
        isAdmin: request.session.isAdmin,
      }
      response.render("modifyproject.handlebars", model)
    } else {
      const model = { dbError: false, theError: "",
        project: theProject,
        isLoggedIn: request.session.isLoggedIn,
        name: request.session.name,
        isAdmin: request.session.isAdmin,
      }
      response.render("modifyproject.handlebars", model)
    }
  })
});

//modify update project id that got modify
app.post('/projects/update/:id', (request, response) => {
  const id = request.params.id;
  const newp = [
    request.body.projname, request.body.projyear, request.body.projdesc, id
  ]
  if (request.session.isLoggedIn==true && request.session.isAdmin==true){
    db.run("UPDATE projects SET pname=?, pyear=?, pdesc=? WHERE pid=?", newp, (error) => {
      if (error) {
        console.log("ERROR: ", error)
      } else {
        console.log("Project tpdated!")
      }
      response.redirect('/projects')
    })
  } else {
    response.redirect('/lgoin')
  }
})


// defines the final default route 404 NOT FOUND
app.use(function (req, res) {
  res.status(404).render("404.handlebars");
});

// runs the app and listens to the port
app.listen(port, () => {
  console.log(`Server running and listening on port ${port}...`);
});
