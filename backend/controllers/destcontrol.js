const Destination = require("../models/destmodel"); // ✅ use capitalized model name

// Get all destinations
const getAllDestinations = async (req, res, next) => {
    let destinations;

    try {
        destinations = await Destination.find();
    } catch (err) {
        console.log(err);
    }

    // If not found
    if (!destinations) {
        return res.status(404).json({ message: "Destinations are not found" });
    }

    // Display all the details to the user
    return res.status(200).json({ destinations });
};

// Add a new destination
const addDestination = async (req, res, next) => {
    const { destinationName, country, description, category, image } = req.body;

    let newDestination;

    try {
        newDestination = new Destination({
            destinationName,
            country,
            description,
            category,
            image
        });
        await newDestination.save();
    } catch (err) {
        console.log(err);
    }

    // If the destination is not inserted
    if (!newDestination) {
        return res.status(404).json({ message: "Destination not inserted" });
    }

    return res.status(200).json({ destination: newDestination });
};

// Get destination by ID
const getByDestID = async (req, res, next) => {
    const id = req.params.id;

    let dest;

    try {
        dest = await Destination.findById(id);
    } catch (err) {
        console.log(err);
    }

    if (!dest) {
        return res.status(404).json({ message: "Destination not available" });
    }

    return res.status(200).json({ destination: dest });
};


//update user deatils 
const updatedestination=async(req,res,next)=>{
    const id=req.params.id;
    const { destinationName, country, description, category, image } = req.body;

    let dest;
    try{
        dest=await Destination.findByIdAndUpdate(id,{
            destinationName:destinationName,country:country,description:description,category:category,image:image});
            dest= await dest.save();
    }catch(err){
        console.log(err)
    }
      if (!dest) {
        return res.status(404).json({ message: "unable to update" });
    }

    return res.status(200).json({ destination: dest });



}

//delete user
const deletedestination=async(req,res,next)=>{
    const id=req.params.id;

    let dest;
     try{
        dest=await Destination.findByIdAndDelete(id)
            
    }catch(err){
        console.log(err)
    }
    if (!dest) {
        return res.status(404).json({ message: "unable to delete" });
    }

    return res.status(200).json({ destination: dest });



}

// Export functions
exports.getAllDestinations = getAllDestinations;
exports.addDestination = addDestination;
exports.getByDestID = getByDestID;
exports.updatedestination=updatedestination;
exports.deletedestination=deletedestination;