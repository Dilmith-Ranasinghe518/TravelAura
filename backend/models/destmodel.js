const mongoose=require("mongoose");
const schema = mongoose.Schema;

const destSchema=new schema({
    destinationName:{
        type:String,
        required:true,
    },
     country:{
        type:String,
        required:true,
    },
     description:{
        type:String,
        required:true,
    },
     category:{
        type:String,
        required:true,
    },
     image:{
        type:String,
        required:true,
    }

   

});

 module.exports=mongoose.model(
        "destmodel",
        destSchema

    )