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
    },
    {timestamps: true}
)

const Game = mongoose.models.Game || mongoose.model("Game", gameSchema);
export default Game;