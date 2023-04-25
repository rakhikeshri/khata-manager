export function getUnitDetails(token) {
    return async function(dispatch) {
        const input = {
            method: "get",
            url: getConfig("api").host+getConfig("api").root+"/unit",
            headers: {
                "ph-access-token": token
            },
           
        }

        const response = await xttp(input);

        console.log("Get Unit Data === ", response);

        if(response.code !== 200) {
            alert(response.code+", "+response.error); 
        } 
       
        dispatch({
            type : "GET_UNIT_DETAIL",
            payload: response.data
        });
    }
}
