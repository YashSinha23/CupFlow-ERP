import { post } from "../../api/apiClient";

export function loginUser(email, password){
    return post('/auth/login', {email, password});
}