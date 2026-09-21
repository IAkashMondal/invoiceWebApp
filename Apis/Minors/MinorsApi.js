import axiosClient from "../axiosClient";
/**
 * ✅ Fetches all owner details.
 * @returns {Promise} - Axios response.
 */
const GetOwnersDeatils = () => axiosClient.get(`/miner-deatils`);
export{
    GetOwnersDeatils
}