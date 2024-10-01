import PropTypes from 'prop-types'

function StatisticsCard({ children }) {
    return (
        <div className="w-full h-24 flex justify-center items-center">
            <div className="w-64 h-20 bg-gray-800 rounded-xl shadow-lg flex items-center justify-center hover:bg-gray-700 transition-colors duration-300">
                <p className="text-white text-lg font-bold text-center">{children}</p>
            </div>
        </div>
    )
}

StatisticsCard.propTypes = {
    children: PropTypes.node.isRequired
}

export default StatisticsCard