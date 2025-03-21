const mongoose=require('mongoose');


async function getDatabase(){
    await mongoose.connect('mongodb://127.0.0.1:27017/school')
    .then(()=>{
        console.log("Database Connected successfully");
    }).catch(()=>{
        console.log("Database Connecton error");
    });

    
}

module.exports={
    getDatabase
}
