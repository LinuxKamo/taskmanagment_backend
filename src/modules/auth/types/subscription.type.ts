import { Sub_Plan } from "../constants/plan.enum"
import { PlanFeatures } from "../constants/planpermission.record";

export type Subscription ={
    plan:Sub_Plan;
    price: number;
    permisions : PlanFeatures;
    sub_ends : Date
}