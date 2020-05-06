const Joi = require('joi');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const app = express();

console.log(`node env: ${process.env.NODE_ENV}`);
console.log(`appEnv: ${app.get('env')}`);


app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('./public'));

if(app.get('env')==='development'){
    app.use(morgan('tiny'));
    console.log('Morgan is enabled...')
}




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
    const {error} = validateCourse(req.body) 
    if(error)
        //400 Bad Request
        return res.status(400).send(result.error.details[0].message);
    
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

//PUT (update)
app.put('/api/courses/:id', (req, res)=>{
    //find course
    //if not existiong 404
    //Validate
    //if invalid, return 400-Bad request

    const course = courses.find(c=>c.id === parseInt(req.params.id));
    if(!course) {
        res.status(404).send('The course wasnt found..');
        return;
    }
    const {error} = validateCourse(req.body) 
        if(error){
            //400 Bad Request
            res.status(400).send(result.error.details[0].message);
        }

course.name = req.body.name;
res.send(course);

});


//HTTP delete request
app.delete('/api/courses/:id', (req, res)=>{
    const course = courses.find(c=>c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The course wasnt found..');

    //Delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
});

app.listen(port, ()=> console.log(`Listening ${port}...`));


function validateCourse(course){
    const schema = {
        name:Joi.string().min(3).required()
        }
        return Joi.validate(course, schema);
}


