
import axios, {AxiosResponse} from 'axios';

const RefreshToken = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: false,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    }
});

export const refreshToken = async (refreshToken: string): Promise<AxiosResponse<any>> => {
    try {
        const params = new URLSearchParams();
        params.append('refresh_token', refreshToken);

        return await RefreshToken.post('/token/refresh', params);
    } catch (error) {
        console.error("Error refreshing token:", error);
        throw error;
    }
}

export default RefreshToken;