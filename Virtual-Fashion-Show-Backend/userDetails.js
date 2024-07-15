const mongoose=require("mongoose");
const userDetailsSchema= new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
    }
);

mongoose.model("UserInfo",userDetailsSchema);