const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
.then(()=>console.log('Connected to MongoDb...'))
.catch(err=>console.error('Couldnt connect', err));


const courseSchema = new mongoose.Schema({
  name:String,
  author:String,
  tags:[String],
  date:{type:Date, default:Date.now},
  isPublisched:Boolean  
});

const Course = mongoose.model('Course', courseSchema);



async function createCourse(){
    const course = new Course({
        name:'Angular Course',
        author:'Mosh',
        tags:['angular', 'frontEnd'],
        isPublisched:true
    });
    const result = await course.save();
    console.log(result);
}


async function getCourses(){
    const courses = Course.find({author:'Mosh'})
    .limit(10)
    .sort({name:1})
    .select({name:1});
    console.log(courses);
}

getCourses();

