const express =require('express');
const app=express();

const bodyparser=require('body-parser');
const exhbs=require('express-handlebars');
const dbo=require('./db');
const staffModel=require('./model/staffSchema')
app.use(bodyparser.urlencoded({ extended: true }));

dbo.getDatabase();

app.engine('hbs',exhbs.engine({layoutsDir:'views/',
    defaultLayout:'main',
    extname:'hbs',
    runtimeOptions:{
        allowProtoMethodsByDefault:true,
        allowProtoPropertiesByDefault:true
}}));
app.set('view engine','hbs');
app.set('views','views');

app.get('/',async(req,res) =>{
    try{

        const staffs=await staffModel.find({});

        let message='';
        let edit_id;
        let edit_staff;

        if(req.query.edit_id){
            edit_id=req.query.edit_id;
            edit_staff=await staffModel.findOne({_id:edit_id});
        }
        if(req.query.delete_id){
            await staffModel.deleteOne({_id:req.query.delete_id});
            return res.redirect('/?status=3');
        }

        switch(req.query.status){
            case '1':
                message='Inserted successfully';
                break;
            case '2':
                message='Updated successfully';
                break;
            case '3':
                message='Deleted successfully';
                break;
            default:
                break;
        }

        res.render('main',{message,staffs,edit_id,edit_staff});
    }catch(err){
        console.log("Error:",err);
    }
})
        
app.post('/store-staff',async(req,res)=>{
    try{
        const staff= new staffModel({Name:req.body.Name,Subject:req.body.Subject});
        staff.save();
        return res.redirect('/?status=1');
    }catch(err){
        console.log("Error:",err);
    }
})

app.post('/update-staff/:edit_id',async(req,res)=>{
    try{
        const edit_id=req.params.edit_id;
        await staffModel.updateOne({_id:edit_id},{$set:{Name:req.body.Name,Subject:req.body.Subject}});
        return res.redirect('/?status=2');
    }catch(err){
        console.log("Error:",err);
    }
})

app.listen(8000,()=>{console.log("Listening to port 8000");

})