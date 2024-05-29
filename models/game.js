import mongoose , { Schema } from "mongoose";

const gameSchema = new Schema(
    {
        url: {
            type: String,
            require: true,
        },
        result: {
            type: String,
            require: true,
        },
        // aiclick: {
        //     type: Number,
        //     require: false,
        //     default: 0
        // },
        // humanclick: {
        //     type: Number,
        //     require: false,
        //     default: 0
        // },
    },
    {timestamps: true}
)

const Game = mongoose.models.Game || mongoose.model("Game", gameSchema);
export default Game;