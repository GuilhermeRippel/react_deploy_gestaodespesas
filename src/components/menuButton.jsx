import PropTypes from 'prop-types'

function MenuButton({onClick, children}){
    return(
        <li onClick={onClick} className="w-full h-12 font-bold flex justify-center items-center bg-gradient-to-r from-blue-500 to-indigo-600 rounded-md shadow-md transition-transform duration-300 hover:scale-105 cursor-pointer">
            {children}
        </li>
    )
}

MenuButton.propTypes = {
    children: PropTypes.node.isRequired
}

MenuButton.propTypes = {
    onClick: PropTypes.func.isRequired
}

export default MenuButton