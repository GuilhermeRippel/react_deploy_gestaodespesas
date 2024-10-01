import { useNavigate, Link } from 'react-router-dom'
import { useRef } from 'react'
import api from '../../services/api'

function Login(){
    const navigate = useNavigate()
    const emailRef = useRef()
    const passwordRef = useRef()

    async function tryLogin(event) {
        event.preventDefault()

        try {
            const { data } = await api.post('/user/login', {
                email: emailRef.current.value,
                password: passwordRef.current.value
            });
            
            localStorage.setItem('token', data.token);
            
            navigate('/main');
        } catch (err) {
            alert('Falha no login');
            console.error(err);
        }
    }
    return(
        <div className="flex flex-row">
            <div className='w-full h-screen bg-gradient-to-b from-gray-800 to-gray-900 flex justify-center items-center flex-col font-poppins font-bold'>
                <div className=" absolute top-0 left-0 w-full bg-gradient-to-r from-blue-500 to-indigo-600 flex justify-center items-center h-24 shadow-lg">
                    <h1 className="text-white text-md sm:text-2xl ">$ Bem-vindo de volta à sua Gestão de Despesas $</h1>
                </div>
                <div className=" w-full max-w-xs md:max-w-lg lg:max-w-lg xl:max-w-xl bg-gray-800 rounded-md flex flex-col items-center px-10 py-14 gap-9 shadow-lg mb-20">
                    <h2 className="text-2xl sm:text-3xl text-white">Faça seu Login</h2>
                    <form className="flex flex-col gap-5 w-full md:w-2/3">
                        <input ref={emailRef} type="email" placeholder="Email" className="w-full px-3 py-1.5 rounded-xl font-poppins font-normal border border-gray-300 focus:outline-none"/>
                        <input ref={passwordRef} type="password" placeholder="Senha" className="w-full px-3 py-1.5 rounded-xl font-poppins font-normal border border-gray-300 focus:outline-none"/>
                        <button onClick={tryLogin} className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-md py-2 shadow-md hover:scale-105 transition-transform duration-200">Logar</button>
                    </form>
                    <Link to={"/"} className="text-blue-400 hover:underline text-sm sm:text-md md:text-xl">Caso não possua uma conta, cadastre-se!</Link>
                </div>
            </div>
        </div>
    )
}
export default Login