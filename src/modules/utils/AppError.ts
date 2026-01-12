import AppErrorCode from "../constants/AppErrorCode";
import { HttpStatusCode } from "../constants/http.status";


class AppError extends Error {
  constructor(
    public statusCode: HttpStatusCode,
    public message: string,
    public errorCode?: AppErrorCode
  ) {
    super(message);
  }
}
export default AppError;
