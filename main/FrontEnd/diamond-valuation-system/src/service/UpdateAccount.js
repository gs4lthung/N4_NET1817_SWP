import Http from "../utils/Http.js";
export const updateAccount = async (token,id,fullname,phone,address) => {
    try {
        const res = await Http.httpRequest.put(
            "api/account/update",
            {
                fullname,
                phone,
                address
            },
            {
                params: {
                    id
                },
                headers: {
                    Authorization: "Bearer " + token,
                },
            }
        );
        return res.data;
    } catch (error) {
        return {
            errCode: error.response.data,
        };
    }
};
