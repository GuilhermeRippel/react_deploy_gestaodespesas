import { Link, useNavigate } from "react-router-dom"
import api from '../../services/api.js'
import { useRef } from "react"



function Cadastro(){
    const navigate = useNavigate()
    const nameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()

    async function handleSubmit(event){
        event.preventDefault()

        try{
            await api.post('/user/cadastro', {
                name: nameRef.current.value,
                email: emailRef.current.value,
                password: passwordRef.current.value
            })
            navigate('/login')
        }
        catch(err){
            alert("Erro ao cadastrar o usuário", err)
        }
    }

    return(
        <div className="flex flex-row">
            <div className='w-full h-screen bg-gradient-to-b from-gray-800 to-gray-900 flex justify-center items-center flex-co font-poppins font-bold'>
                <div className="absolute top-0 left-0 w-full bg-gradient-to-r from-blue-500 to-indigo-600 flex justify-center items-center h-24 shadow-lg">
                    <h1 className="text-white text-lg sm:text-2xl">$ Bem-vindo à sua Gestão de Despesas $</h1>
                </div>
                <div className=" w-full max-w-xs md:max-w-lg lg:max-w-lg xl:max-w-xl bg-gray-800 rounded-md flex flex-col items-center p-10 gap-6 shadow-lg mb-20">
                    <h2 className="text-lg sm:text-2xl md:text-3xl text-white">Faça seu Cadastro</h2>
                    <form className="flex flex-col gap-4 w-full sm:w-3/3 md:w-2/3">
                        <input ref={nameRef} type="text" placeholder="Nome" className="w-full px-3 py-1.5 rounded-xl font-poppins font-normal border border-gray-300 focus:outline-none"/>
                        <input ref={emailRef} type="email" placeholder="Email" className="w-full px-3 py-1.5 rounded-xl font-poppins font-normal border border-gray-300 focus:outline-none"/>
                        <input ref={passwordRef} type="password" placeholder="Senha" className="w-full px-3 py-1.5 rounded-xl font-poppins font-normal border border-gray-300 focus:outline-none"/>
                        <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-md py-2 shadow-md hover:scale-105 transition-transform duration-200" onClick={handleSubmit}>Cadastrar-se</button>
                    </form>
                        <Link to={"/login"} className="text-blue-400 hover:underline text-sm sm:text-md md:text-xl">Já possui uma conta? Faça login</Link>
                </div>
            </div>
        </div>
    )
}

export default Cadastro