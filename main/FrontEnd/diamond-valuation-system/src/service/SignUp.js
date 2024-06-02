import Http from "../utils/Http.js";
export const register = async (username, fullname,phonenumber,password ) => {
    try {
        const res = await Http.httpRequest.post("api/account/save", {
            username,
            fullname,
            phonenumber,
            password,
        });
        return res;
    } catch (error) {
        return {
            errCode: error,
        };
    }
};
