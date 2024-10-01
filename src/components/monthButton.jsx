function monthButton({onClick, children}){
    return(
        <button onClick={onClick} className="h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg font-bold text-white py-2 px-8 shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            {children}
        </button>
    )
}

export default monthButton