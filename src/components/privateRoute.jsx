import { Navigate } from "react-router-dom";
import PropTypes from 'prop-types'

function PrivateRoute({element}){
    const token = localStorage.getItem('token')

    return token ? element : <Navigate to='/login'/>
}

PrivateRoute.propTypes = {
    element: PropTypes.element.isRequired,
}

export default PrivateRoute