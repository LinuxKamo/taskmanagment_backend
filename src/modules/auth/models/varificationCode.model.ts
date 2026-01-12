import mongoose from "mongoose";
import VerifcationCodeType from "../../constants/VaricicationCodeTypes";

export interface VerificationCodeDocument extends mongoose.Document{
    userId: mongoose.Types.ObjectId;
    type:VerifcationCodeType;
    expireAt:Date;
    createAt:Date;
}

const VerificationCodeSchema= new mongoose.Schema<VerificationCodeDocument>({
    userId:{required:true,unique:true,type:mongoose.Schema.Types.ObjectId,ref:"User",index:true},
    type:{type:String,required:true},
    createAt:{type:Date,required:true,default:Date.now},
    expireAt:{type:Date,required:true}
});
 
const VerificationModel = mongoose.model<VerificationCodeDocument>("VerificationCode",VerificationCodeSchema,"verification_code");

export default VerificationModel