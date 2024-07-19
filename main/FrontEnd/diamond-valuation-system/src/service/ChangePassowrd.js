import Http from "../utils/Http.js";
export const handleResetPassword = async (token, oldPassword, newPassword) => {
    try {
        const res = await Http.httpRequest.post(
            "api/account/reset-password",
            {
                token,
                oldPassword,
                newPassword,
            },
            {
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
