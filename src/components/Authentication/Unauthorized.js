import { useNavigate } from "react-router-dom"

const Unauthorized = () => {

    const navigate = useNavigate();
    const goBack = () => navigate("/user");

    return (
    <div className="bootstrap-wrapper">
        <div className="big-wrapper light">
            <div className="showcase-area">
                <div className="container container-unauthorized">
                    <div className="left">
                        <div className="big-title">
                            <h1 className="big-title"><b> Unauthorized !</b></h1>
                        </div>
                        <p className="text">the access to this page is denied .. </p> 
                        <div className="cta">
                            <a className="boutton" onClick={goBack}>Go Back</a>
                        </div>
                    </div>
                    <div className="right">
                        <img className="person" style={{cursor : "pointer"}}  src="https://i.imgur.com/UhZEgJW.png"/>
                    </div>   
                </div>
            </div>
        </div>
    </div>
    )
}

export default Unauthorized