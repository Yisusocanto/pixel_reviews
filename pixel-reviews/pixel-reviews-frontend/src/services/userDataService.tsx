import axiosInstance from "../config/axiosConfig";
import type {AxiosResponse} from "axios"


export const userProfile = async (username: string): Promise<AxiosResponse> => {
    const response = await axiosInstance.get(`/users/${username}`)
    return response
}
