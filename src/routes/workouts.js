import express from "express";
import {WorkoutsModel} from "../models/Workouts.js";
import {UserModel} from "../models/Users.js";
import { verifyToken } from "./users.js";
import logger from "../../logs.js";
const router = express.Router();



router.get("/",async(req,res) => {
    try {
        const response = await WorkoutsModel.find({});
        //logger
        logger.info("all workouts returned");
        res.json(response);
    } catch (error) {
        res.json(error);
    }
});
//create a new workout
router.post("/",verifyToken,async(req,res) => {
    const workout = new WorkoutsModel(req.body);
    console.log(workout);
    try {
        //logger
        logger.info('new workout added');
        const response = await workout.save();
        res.json(response);
    } catch (error) {
        res.status(500).json(error);
    }
});
//get a particular workout
router.get("/get-workout/:workoutID" ,async(req,res) => {
try {
    const workout = await WorkoutsModel.findById(req.params.workoutID);
    //logger
    logger.info('Workout returned:' ,req.params.workoutID);
    // console.log(workout);
    res.json(workout);
} catch (err) {
    res.json(err);
}
});
//save a workout
router.put("/",verifyToken,async(req,res) => {
    try {
    const workout = await WorkoutsModel.findById(req.body.workoutID)
    const user = await UserModel.findById(req.body.userID)
    
        user.savedWorkouts.push(workout);
        //logger
        logger.info(`workout (${workout._id}) saved for user: `, user._id)
        await user.save();
        res.status(201).json({savedWorkouts: user.savedWorkouts});
    } catch (error) {
        res.status(400).json(error);
    }
});
//Delete a saved workout
router.delete("/",async(req,res) => {
    const workoutID = req.body.workoutID;
    const userID = req.body.userID;

    try {
        const user=await UserModel.findById(userID);
        const index= user.savedWorkouts.indexOf(workoutID);
        if(index>-1){
            user.savedWorkouts.splice(index,1);
            await user.save();
            const savedWorkouts = await WorkoutsModel.find({
                _id:{$in : user.savedWorkouts},
            });
            //logger
            logger.info('Workout deleted from the saved ')
            res.status(200).json({savedWorkouts});  
        }
        else{
            res.status(404).json({message : "workout not found"});
        }
    } catch (err) {
        res.status(500).json(err);
        
    }
})
//get id of saved workout
router.get("/savedWorkouts/ids/:userID" ,async(req,res) => {
    try {
        const user = await UserModel.findById(req.params.userID);
        //logger
        logger.info('Returned Saved Workout for user');
        res.json({savedWorkouts: user?.savedWorkouts});
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});
//Get Saved Workout
router.get("/savedWorkouts/:userID" ,async(req,res) => {
    try {
        const user = await UserModel.findById(req.params.userID);
        const savedWorkouts = await WorkoutsModel.find({
            _id:{$in: user.savedWorkouts},
        });
        console.log(savedWorkouts);
        //logger
        logger.info('Returned Saved Workout for user');
        res.status(201).json({savedWorkouts});
        
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

//comment on workout
router.put("/comment",verifyToken,async(req,res) => {
    const workout = await WorkoutsModel.findById(req.body.workoutID);
    const userObj = await UserModel.findById(req.body.userID);
    const comment = {
        user : userObj,
        comment: req.body.comment,
    };
    try {
        workout.comments.push(comment);
        await workout.save();
        //logger
        logger.info('Comment added for the Workout');
        res.status(201).json({workout : workout});
    } catch (err) {
        res.status(500).json(err);
    }

});
//rate a workout
router.put("/rate",verifyToken,async (req,res) =>{
const workout = await WorkoutsModel.findById(req.body.workoutID);
const userObj = await UserModel.findById(req.body.userID);
const rating ={
    user: userObj,
    rating: req.body.rating,
};
try {
    workout.ratings.push(rating);
    await workout.save();
    //logger
    logger.info('Rated the Workout');
    res.status(201).json({workout: workout});
} catch (err) {
    res.status(500).json(err)
}
});


export {router as workoutsRouter};