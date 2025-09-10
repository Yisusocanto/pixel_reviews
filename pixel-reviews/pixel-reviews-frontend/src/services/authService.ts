import axiosInstance from "../config/axiosConfig";

//types
export type SignUpErrorResponse = {
  errors: { [key: string]: string };
};

export type MessageResponse = {
  message: string;
  state: boolean;
};

type AlreadyAuthenticatedResponse = { already_auth: boolean };

type ApiResponse = SignUpErrorResponse | MessageResponse;

//requests functions
export const signUp = async (data: object): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.post<ApiResponse>(
      "/auth/sign_up",
      data
    );
    return response.data;
  } catch (error: any) {
    return error.response.data;
  }
};

export const login = async (data: object): Promise<MessageResponse> => {
  try {
    const response = await axiosInstance.post("/auth/login", data);
    return response.data;
  } catch (error: any) {
    return error.response.data;
  }
};

//makes a request to the backend to see if the user is authenticated or not
export const alreadyAuth = async (): Promise<boolean> => {
  const response = await axiosInstance.get<AlreadyAuthenticatedResponse>(
    "/auth/already_auth"
  );
  if (response.data.already_auth == false) {
    return false;
  } else {
    return true;
  }
};
