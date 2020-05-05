const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const courses = [
    {id:1, name:'course1'},
    {id:2, name:'course2'},
    {id:3, name:'course3'}
]

app.get('/', (req, res)=>{
    res.send('hello World');
});

app.get('/api/courses', (req, res)=>{
    res.send(courses);
});

//POST
app.post('/api/courses', (req, res)=>{
    const schema = {
        name:Joi.string().min(3).required()
    }
    const result = Joi.validate(req.body, schema);
    
    if(result.error){
        //400 Bad Request
        res.status(400).send(result.error.details[0].message);
    }
    const course = {
        id:courses.length+1,
        name:req.body.name
    };
    courses.push(course);
    res.send(course);
});
//PORT
const port = process.env.PORT||3000;

app.get('/api/courses/:id', (req, res)=>{
   const course = courses.find(c=>c.id === parseInt(req.params.id));
   if(!course) res.status(404).send('The course wasnt found..');
   else res.send(course);
});
app.listen(port, ()=> console.log(`Listening ${port}...`));
