import mongoose from 'mongoose';        //mongoose ante mongodb inka node js madhya communication jaragadaniki use chese library, schema create cheyadaniki use chestam, model create cheyadaniki use chestam, database connection establish cheyadaniki use chestam

const messageSchema = new mongoose.Schema(    //schema ante blueprint of how the data is stored in mongodb
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required : true,
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text:{
            type : String,
        },
        image: {
            type: String,
        },

    },

    {timestamps: true}
);

const Message = mongoose.model("Message", messageSchema);   //idhe model , schema ni database lo store cheyadaniki use chestam,

export default Message;