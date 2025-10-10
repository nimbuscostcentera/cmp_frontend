import BASE_URL from "./ApiBaseUrl";
const AUTH_BASE_URL = "api/v1/myauth";


//AUTH
export const LoginAPI = `${BASE_URL}${AUTH_BASE_URL}/login/`;
export const RegisterAPI = `${BASE_URL}${AUTH_BASE_URL}/register/`;

export const ShowUserAPI = `${BASE_URL}${AUTH_BASE_URL}/showuser/`;
export const EditUserAPI = `${BASE_URL}${AUTH_BASE_URL}/edituser/`;
export const DeleteUserAPI = `${BASE_URL}${AUTH_BASE_URL}/deleteuser/`;

