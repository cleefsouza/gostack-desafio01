const express = require('express');

const server = express();

server.use(express.json());

const projects = [];
var qtdReq = 0;

server.use((req, res, next)=> {
    console.time('Req');

    qtdReq++;

    console.log(`Url: ${req.url} | Method: ${req.method}`);
    console.log(`Total requests: ${qtdReq}`);

    next();

    console.timeEnd('Req');
});

function checkIdUrl(req, res, next) {
    const project = projects[req.params.id];

    if (!project) {
        return res.status(400).json({ error: "Project does not exists" });
    }

    return next();
}

function checkIdInProject(req, res, next) {
    const { id } = req.body;

    const idExist = projects.find(proj => {
        return proj.id === id;
    });

    if (idExist) {
        return res.status(400).json({ error: "This project ID already exists" });
    }

    return next();
}

server.post('/projects', checkIdInProject, (req, res) =>{
    const project = req.body;

    if (!project.tasks) {
        project.tasks = [];
    }

    projects.push(project);

    return res.json(project);
});

server.get('/projects', (req, res) =>{
    return res.json(projects);
});

server.put('/projects/:id', checkIdUrl, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    projects[id].title = title;

    return res.json(projects[id]);
});

server.delete('/projects/:id', checkIdUrl, (req, res) => {
    const { id } = req.params;
    projects.splice(id, 1);

    return res.send();
});

server.post('/projects/:id/tasks', checkIdUrl, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    projects[id].tasks.push(title);

    return res.json({ "task" : projects[id].tasks })
});

server.listen(3000);