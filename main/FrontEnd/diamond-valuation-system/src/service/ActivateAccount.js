import Http from "../utils/Http.js";
export const activateAccount = async (code) => {
    try {
        const res = await Http.httpRequest.get("api/account/activate",{}, {
            params: {
                code
            }
        });
        return res.data;
    } catch (error) {
        return {
            errCode: error.response ? error.response.status : 'NETWORK_ERROR',
            errMsg: error.message,
        };
    }
};