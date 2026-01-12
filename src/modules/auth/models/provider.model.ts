import mongoose from "mongoose";
import { Providers } from "../../constants/Providers.enum";

export interface ProviderDocument extends mongoose.Document{
    user_id:mongoose.Types.ObjectId;
    provider:Providers;
    provider_id?:string;
    email:string;
}

const ProviderSchema = new mongoose.Schema<ProviderDocument>(
    {
        email:{type:String,unique:true, required:true},
        user_id:{type:mongoose.Schema.Types.ObjectId,unique:true},
        provider:{type:String,required:true},
        provider_id:{type:String,required:true,default:"N/A"},
    },
    {
        timestamps:true,
    }
);


const ProviderModel = mongoose.model<ProviderDocument>("AuthProvider",ProviderSchema);
export default  ProviderModel;
