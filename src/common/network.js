import axios from "axios";

// input
// {
//     method: 'post',
//     url: '/user/12345',
//     data: {
//       firstName: 'Fred',
//       lastName: 'Flintstone'
//     }
// }

// axios.defaults.headers.common['Authorization'] = 

export default async function xhttp(input) {
    try {
        const response = await axios(input);
        return {
            code: response.status,
            data: response.data
        };
    } catch (e) {
        if (e.response.status === 403) {
            return {
                code: e.response.status,
                error: e,   // to be removed later
                data: e.response.data
            };
        }

        return {
            code: 500,
            error: e,
            data: e.response.data
        };
    }
}