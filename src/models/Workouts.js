
import mongoose from "mongoose";
 const workoutSchema = new mongoose.Schema({
    name :{type : String,required: true,},
    description :{type :String,required:true,},
    exercises: [{
        exercise:{type : String,required: true,},
        sets:{type : Number,required: true,},
        reps:{type : Number,required: true,},
        weight:{type : Number,required: true,},
        stepsToPerform:{type : String,required: true,},
    }],
    imageUrl:{type : String,required:true},
    userOwner:{type:mongoose.Schema.Types.ObjectID ,ref: "User" ,required:true,},
    ratings : [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
          },
        },
      ],
      comments: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          comment: {
            type: String,
            required: true,
          },
        },
      ],
 });
 export const WorkoutsModel = mongoose.model("Workouts",workoutSchema);