import React from 'react'
import { Button } from 'react-bootstrap'
import { useAuth0 } from "../../react-auth0-spa"
import axios from 'axios'
import config from '../../auth_config.json'

const AcceptCancelJob = ({sender, jobid}) => {
    const { user, getTokenSilently } = useAuth0();
    const currentjobid = jobid

    function AcceptJob() {
        const deliveryJobId = currentjobid
        const { apiOrigin = `http://localhost:5000/api/one-job/update-status-id/${deliveryJobId}/accepted` } = config;
    
        async function callApi() {
            const token = await getTokenSilently();
            console.log(token)
            await axios.put(`${apiOrigin}`,{}, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
            })
            .then(response => {
                console.log(response.data)
            })
            .catch(error => {
                console.log(error)
            });
        }
        return callApi();  
    }

    const currentUser = user.sub
    
    if (currentUser === sender ) {
        return <Button variant="danger">Cancel Job</Button>
    }
    return <Button onClick={AcceptJob} variant="success" type="submit">Accept Job</Button>
}

export default AcceptCancelJob;