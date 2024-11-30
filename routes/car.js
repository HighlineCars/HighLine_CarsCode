const router = require("express").Router();
const User = require("../models/user");
const Car = require("../models/car");
const { authenticateToken } = require("./userAuth");

//add cars --admin
router.post("/add-car", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const user = await User.findById(id);
    if (user.role !== "admin") {
      return res
        .status(400)
        .json({ message: "You don't have access to admin panel" });
    }
    const newcar = new Car({
      name: req.body.name,
      carImage: req.body.carImage,
      importType: req.body.importType,
      carMake: req.body.carMake,
      model: req.body.model,
      mileage: req.body.mileage,
      transmission: req.body.transmission,
      fuel:req.body.fuel,
      engine:req.body.engine,
      year:req.body.year,
      price: req.body.price,
    });
    await newcar.save();
    res
      .status(200)
      .json({ message: "Car added successfully"});
  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: "Internal Server Error", error: error.message });
}
});

//update cars
router.put("/update-car/:carid", authenticateToken, async (req, res) => {
  try {
    const { carid } = req.params; // Use params for the carid
    const updateFields = { ...req.body };

    // Remove `carImage` from the update if it is an empty string
    if (req.body.carImage === "") {
      delete updateFields.carImage;
    }

    await Car.findByIdAndUpdate(carid, updateFields, { new: true });

    return res.status(200).json({ message: "Car Info Updated" });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      details: error.message,
    });
  }
});
//delete car --admin
router.delete("/delete-car/", authenticateToken,async (req, res) =>{
  try {
    const { carid } = req.headers;
    const del = await Car.findByIdAndDelete(carid);
    if (!del) {
      return res.status(404).json({
        message: "Car Not Found",
      });
    }
    else{
      return res.status(200).json({
        message: "Car deleted successfully.",
      });
    }
  } 
  catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      details: error.message,
    });
  }
});


//get all cars
router.get("/get-all-cars", async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    return res.json({
      status: "Success",
      data: cars,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//get recently added cars (upto 3 cars only)
router.get("/get-recent-cars", async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 }).limit(8);
    return res.json({
      status: "Success",
      data: cars,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//get car by id
router.get("/get-car-by-id/:carid", async (req, res) => {
  try {
    const { carid } = req.params;
    const cars = await Car.findById(carid);
    return res.json({
      status: "Success",
      data: cars,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
