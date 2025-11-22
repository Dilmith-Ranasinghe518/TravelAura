const Review = require("../models/ReviewModel");

const getAllReviews = async(req, res, next)=>{
    let Reviews;

    //Get All Reviews
    try{
        reviews = await Review.find();
    }catch (err){
        console.log(err);
    }

    //not FOund
    if(!reviews){
        return res.status(404).json({message:"Review not found"});
    }

    //Display all Reviews
    return res.status(200).json({reviews});
};

    //data insert
    const addReviews = async(req, res, next) =>{
        const {name,destination,rating,comment } = req.body;

        let reviews;

        try{
            reviews = new Review({name,destination,rating,comment});
            await reviews.save();
        }catch (err) {
            console.log(err);
        }

    //not insert reviews
    if(!reviews){
       return res.status(404).send({message:"unable to add reviews"});
    }
    return res.status(200).json({reviews});
    };

exports.getAllReviews = getAllReviews;
exports.addReviews = addReviews;

