import Http from "../utils/Http.js";
export const adminActiveAccount = async (id) => {
    try {
        const res = await Http.httpRequest.post("admin/restoreAccount",{}, {
            params: {
                id
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