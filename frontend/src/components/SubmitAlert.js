import React from 'react'
import { Alert } from 'react-bootstrap'

const SubmitAlert = () => {
    return(
        <Alert variant="success">
            Your Job has been posted! View your jobs at the
            <Alert.Link href='/joblistings'>Job Listings</Alert.Link>
        </Alert>
    )
}

export default SubmitAlert