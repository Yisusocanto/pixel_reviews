import axiosInstance from "../config/axiosConfig";
import type {AxiosResponse} from "axios"


export const getUserData = async (username: string): Promise<AxiosResponse> => {
    const response = await axiosInstance.get(`/users/${username}`)
    return response
}
