import resend from "../config/resend";
import { EMAIL_SENDER, NODE_ENV } from "../constants/env";

type Mail={
    to:string;
    subject:string;
    text:string;
    html:string;
}
const getFromEmail =():string=> NODE_ENV === "development"?"Development@resend.dev":EMAIL_SENDER;
const getToEmail = (recipiant:string) :string => NODE_ENV === "development"?"delivered@resend.dev":recipiant;
export const sendMail = async ({to,subject,text,html}:Mail)=>resend.emails.send({
    from:getFromEmail(),
    to:getToEmail(to),
    subject,text,html
})