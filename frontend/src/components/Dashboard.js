import React from 'react'
import "../App.css"

class Dashboard extends React.Component {
    render() {
        return (
            <div className="background" style={{paddingTop:"50px"}}>
                <h1>Welcome to your dashboard!</h1>  
                <div className="container" style={{paddingTop:"20px",paddingLeft:"70px"}}>
                <h4>Current activity:</h4>
                <h5>Jobs Posted:</h5>
                <h6>3 Jobs pending acceptance</h6>
                <h6>2 Jobs ongoing</h6>
                <h5>Jobs Accepted:</h5>
                <h6>0 Jobs accepted</h6>
                </div>
            </div>
        )
    }
}

export default Dashboard
