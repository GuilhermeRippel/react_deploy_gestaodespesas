import { useState, useEffect, useCallback } from "react"
import { useNavigate } from 'react-router-dom'
import api from '../../services/api.js'
import { NumericFormat } from "react-number-format"
import MonthButton from '../../components/monthButton.jsx'
import MenuButton from "../../components/menuButton.jsx"
import trashButton from '../../assets/trashButton.svg'
import StatisticsCard from "../../components/statisticsCard.jsx"

function Main() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userName, setUserName] = useState('');
    const [amountValue, setAmountValue] = useState('');
    const [dateValue, setDateValue] = useState('');
    const [installmentValue, setInstallmentValue] = useState(1);
    const [descValue, setDescValue] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [averageAmount, setAverageAmount] = useState(0);
    const [averageInstallments, setAverageInstallments] = useState(0)
    const [currentView, setCurrentView] = useState('expenses');
    const [biggerAmount, setBiggerAmount] = useState(0)
    const [smallerAmount, setSmallerAmount] = useState(0)
    const [expensesGreaterThan500, setExpensesGreaterThan500] = useState([]);
    const [biggerInstallment, setBiggerInstallment] = useState(0)

    // Função para calcular a média dos valores dos cards
    const calculateAverageAmount = () => {
        if (expenses.length > 0) {
            const total = expenses.reduce((acc, expense) => acc + parseFloat(expense.card.amount), 0);
            const average = total / expenses.length;
            setAverageAmount(average);
        } else {
            setAverageAmount(0);
        }
    };

    const calculateAverageInstallment = () => {
        if (expenses.length > 0) {
            const total = expenses.reduce((acc, expense) => acc + parseFloat(expense.card.installments), 0);
            const average = total / expenses.length
            setAverageInstallments(average)
        } else {
            setAverageInstallments(0)
        }
    }

    const calculateBiggerInstallment = () => {
        if (expenses.length > 0) {
            const numberInstallment = expenses
                .map(expense => {
                    return expense.card ? Number(expense.card.installments) : 0;
                });

            if (numberInstallment.length > 0) {
                const biggerInstallment = Math.max(...numberInstallment);
                setBiggerInstallment(biggerInstallment)
            }
        } else {
            setBiggerInstallment(0)
        }
    }

    const calculateBiggerAmount = () => {
        if (expenses.length > 0) {
            // Extrair os valores de amount dos objetos card
            const numberAmount = expenses
                .map(expense => {
                    // Verificar se card e amount estão presentes
                    return expense.card ? Number(expense.card.amount) : 0;
                });

            if (numberAmount.length > 0) {
                // Encontrar o maior valor de amount
                const biggerAmount = Math.max(...numberAmount);
                setBiggerAmount(biggerAmount)
            }
        } else {
            setBiggerAmount(0)
        }
    }

    const calculateSmallerAmount = () => {
        if (expenses.length > 0) {
            // Extrair os valores de amount dos objetos card
            const numberAmount = expenses
                .map(expense => {
                    // Verificar se card e amount estão presentes
                    return expense.card ? Number(expense.card.amount) : 0;
                });

            if (numberAmount.length > 0) {
                // Encontrar o maior valor de amount
                const smallerAmount = Math.min(...numberAmount);
                setSmallerAmount(smallerAmount)
            }
        } else {
            setSmallerAmount(0)
        }
    };

    const filterExpensesGreaterThan500 = () => {
        // Filtrar as despesas maiores que 500
        const count = expenses.filter(expense => {
            // Verificar se card e amount estão presentes e são números válidos
            const amount = parseFloat(expense.card?.amount || 'NaN');
            return !isNaN(amount) && amount > 500;
        }).length;

        // Definir o estado com a contagem
        setExpensesGreaterThan500(count);
    };

    // Função para formatar a data
    const formatDate = useCallback((date) => {

        if (typeof date === 'string') {
            date = new Date(date);
        }

        // Verifica se o valor é uma instância válida de Date
        if (!(date instanceof Date) || isNaN(date.getTime())) {
            return 'Data inválida';
        }

        // Ajusta a data para o horário local removendo o impacto do fuso horário
        const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);

        // Formata a data no padrão DD/MM/YYYY
        const day = String(localDate.getDate()).padStart(2, '0');
        const month = String(localDate.getMonth() + 1).padStart(2, '0');
        const year = localDate.getFullYear();

        return `${day}/${month}/${year}`;
    }, []);


    const formatDateWithoutYear = (date) => {
        if (typeof date === 'string') {
            date = new Date(date);
        }

        if (!(date instanceof Date) || isNaN(date.getTime())) {
            return 'Data inválida';
        }

        const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
        const day = String(localDate.getDate()).padStart(2, '0');
        const month = String(localDate.getMonth() + 1).padStart(2, '0');

        return `${day}/${month}`;
    };


    // Atualiza currentDate com base no ano e mês atual
    useEffect(() => {
        const date = new Date(currentYear, currentMonth - 1, 1);
        setCurrentDate(formatDate(date));
    }, [currentYear, currentMonth, formatDate]);

    // Função para buscar despesas
    const getExpenses = async (month, year) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            // Construindo a data sem considerar fuso horário
            const startOfMonth = new Date(year, month - 1, 1).toISOString().split('T')[0]; // YYYY-MM-DD
            const startOfNextMonth = new Date(year, month, 1).toISOString().split('T')[0]; // YYYY-MM-DD

            console.log("Frontend - Enviando despesas entre:", startOfMonth, "e", startOfNextMonth);
            const response = await api.get('/card/listarCard', {
                params: { month, year },
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Dados retornados da API:', response.data.expenses);
            setExpenses(response.data.expenses);
        } catch (err) {
            setError(err);
            console.error('Erro ao buscar despesas:', err);
        } finally {
            setLoading(false);
        }
    };


    // Busca o nome do usuário
    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error("Token não encontrado");
                }
                const response = await api.get(`user/getUsuario`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserName(response.data.user.name);
            } catch (err) {
                console.error('Erro ao buscar o nome do usuário:', err);
            }
        };
        fetchUserName();
    }, []);

    // Manipuladores de eventos para o mês
    const handlePreviousMonth = () => {
        setCurrentMonth(prevMonth => {
            if (prevMonth === 1) {
                setCurrentYear(currentYear - 1);
                return 12;
            } else {
                return prevMonth - 1;
            }
        });
    };

    const handleNextMonth = () => {
        setCurrentMonth(prevMonth => {
            if (prevMonth === 12) {
                setCurrentYear(currentYear + 1);
                return 1;
            } else {
                return prevMonth + 1;
            }
        });
    };

    // Atualiza despesas ao mudar mês/ano
    useEffect(() => {
        getExpenses(currentMonth, currentYear);
    }, [currentMonth, currentYear]);


    useEffect(() => {
        if (expenses.length > 0) {
            const sumOfExpenses = expenses.reduce((acc, expense) => {
                return acc + parseFloat(expense.card.amount);
            }, 0);
            setTotalExpenses(sumOfExpenses);
            console.log(`A soma total dos valores dos cards é: ${sumOfExpenses}`);
        } else {
            setTotalExpenses(0);
        }
    }, [expenses]);

    useEffect(() => {
        calculateAverageAmount();
        calculateSmallerAmount()
        calculateAverageInstallment()
        calculateBiggerAmount()
        calculateBiggerInstallment()
        filterExpensesGreaterThan500()
    }, [totalExpenses, expenses]);

    // Funções para atualizar estados
    const getDate = (e) => {
        const dateInput = e.target.value;
        setDateValue(dateInput);
    };
    const getInstallment = (e) => setInstallmentValue(e.target.value);
    const getDesc = (e) => setDescValue(e.target.value);

    // Função para deletar um card
    const deleteCard = async (cardId) => {
        try {
            const token = localStorage.getItem('token');
            await api.delete(`/card/deletarCard/${cardId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            getExpenses(currentMonth, currentYear);
        } catch (err) {
            console.error("Erro ao deletar card", err);
        }
    };

    // Função para adicionar um card
    const addCard = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            const response = await api.post('/card/criarCard', {
                amount: amountValue,
                date: dateValue,
                installments: installmentValue,
                description: descValue
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 201) {
                getExpenses(currentMonth, currentYear);
            } else {
                console.error('Erro ao criar card', response.data.message);
                console.log(typeof (response.amount))
            }
            setIsModalOpen(!isModalOpen);
        } catch (err) {
            console.error('Erro ao enviar os dados para o servidor', err);
        }
    };

    const formatCurrency = (value) => {
        return Number(value).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2
        });
    };

    // Função para alternar o modal
    const toggleModal = () => setIsModalOpen(!isModalOpen);

    // Função para logout
    const navigate = useNavigate();
    const logout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // Renderização do componente
    if (loading) return <p>Carregando...</p>;
    if (error) return <p>Erro ao carregar os cards: {error.message}</p>;

    return (
        <div className="w-screen h-screen bg-neutral-800 flex flex-row">
            <section className="h-full w-1/5 xl:w-1/6 bg-gray-900 flex flex-col justify-between p-4 rounded-lg shadow-lg">
                <div className="text-white font-bold text-2xl bg-gray-800 p-4 rounded-md shadow-md">
                    Bem-vindo {userName}
                </div>
                <nav className="mt-6">
                    <ul className="w-full h-full text-white text-center flex flex-col space-y-4">
                        <MenuButton onClick={() => setCurrentView('expenses')}>Despesas</MenuButton>
                        <MenuButton onClick={() => setCurrentView('statistics')}>Estatísticas</MenuButton>
                    </ul>
                </nav>
                <div className="w-full h-20 mt-6 text-white">
                    <button onClick={logout} className="w-full h-full bg-gradient-to-r from-red-500 to-pink-600 rounded-lg font-bold text-xl shadow-lg transform transition-transform duration-300 hover:scale-105">
                        Logout
                    </button>
                </div>
            </section>
            <main className="w-full h-full p-4 bg-gradient-to-b from-gray-800 to-gray-900">
                {currentView === 'expenses' ? (
                    <section className="w-full h-full p-6 flex flex-col space-y-6 bg-gray-800 rounded-lg shadow-lg">
                        <div className="w-full h-16 flex justify-between items-center bg-gray-900 rounded-md p-4 shadow-md">
                            <MonthButton onClick={handlePreviousMonth}>Mês Anterior</MonthButton>
                            <p className="text-lg font-semibold text-gray-300">
                                Data: {currentDate}
                            </p>
                            <MonthButton onClick={handleNextMonth}>Próximo Mês</MonthButton>
                        </div>
                        <div className="h-full bg-gray-900 bg-opacity-95 mt-3 p-3 rounded-lg shadow-inner text-white font-bold overflow-y-auto">
                            {expenses.length > 0 ? (
                                expenses.map(expense => (
                                    <div key={expense.card.id} className="w-full h-auto bg-gradient-to-r from-gray-800 to-gray-800 rounded-md px-4 py-2 flex flex-col shadow-md mb-4">
                                        <div className="flex justify-between mb-2">
                                            <div className="text-green-700"><strong className="text-white">Valor:</strong> {formatCurrency(expense.card.amount)}</div>
                                            <div className="text-yellow-300"><strong className="text-white">Parcelas:</strong> {expense.card.installments}</div>
                                            <div className="text-red-500"><strong className="text-white">Data de pagamento da fatura:</strong> {formatDateWithoutYear(expense.card.date)}</div>
                                            <button onClick={() => deleteCard(expense.card.id)} className="hover:scale-105"><img src={trashButton} alt="Botão de lixeira para deletar card" /></button>
                                        </div>
                                        <div>
                                            <div className="text-gray-300 text-xs">Descrição: {expense.card.description}</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center">Nenhuma despesa encontrada para este mês.</p>
                            )}
                        </div>
                        <div className="w-full bg-gradient-to-r from-gray-900 to-gray-900 h-16 flex justify-start items-center px-10 rounded-md">
                            <p className="text-white font-bold text-xl">Valor total de despesas: <span className="text-red-600">{formatCurrency(totalExpenses)}</span></p>
                        </div>
                        <button onClick={toggleModal} className="h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg font-bold text-white py-2 px-8 shadow-lg transform transition-transform duration-300 hover:shadow-xl text-center">
                            Adicionar novo card
                        </button>
                    </section>
                ) : (
                    <section className="w-full h-full p-8 flex flex-col items-center justify-center space-y-8 bg-gray-800 rounded-lg shadow-lg">
                        <div className="w-full bg-gray-900 h-16 flex items-center justify-center rounded-md shadow-md">
                            <h2 className="text-white text-3xl font-extrabold tracking-wide">Suas Estatísticas/Médias</h2>
                        </div>
                        <div className="w-full h-full bg-gray-900 bg-opacity-95 mt-4 p-8 rounded-lg shadow-inner text-white font-semibold flex flex-col justify-center items-center gap-36">
                            <div className="w-full flex justify-around items-center">
                                <StatisticsCard>Média despesas/mês: {formatCurrency(averageAmount)}</StatisticsCard>
                                <StatisticsCard>Despesas maiores que 500: {expensesGreaterThan500}</StatisticsCard>
                                <StatisticsCard>Média Parcelas/mês: {averageInstallments}</StatisticsCard>
                            </div>
                            <div className="w-full flex justify-around items-center">
                                <StatisticsCard>Maior despesa: {formatCurrency(biggerAmount)}</StatisticsCard>
                                <StatisticsCard>Menor despesa: {formatCurrency(smallerAmount)}</StatisticsCard>
                                <StatisticsCard>Maior parcela: {biggerInstallment}</StatisticsCard>
                            </div>
                        </div>
                    </section>

                )}
            </main>


            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="w-2/4 bg-white p-6 rounded-md border-4 border-gray-700">
                        <h2 className="text-2xl font-bold mb-4 text-center">Adicionar Despesa</h2>
                        <form>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Valor da Despesa</label>
                                <NumericFormat
                                    value={amountValue}
                                    onValueChange={(values) => setAmountValue(values.value)}
                                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    thousandSeparator={'.'}
                                    decimalSeparator={','}
                                    prefix={'R$ '}
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                    placeholder="R$ 0000,00"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Número de Parcelas</label>
                                <select value={installmentValue} onChange={getInstallment} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                    {[...Array(24)].map((_, index) => (
                                        <option key={index + 1} value={index + 1}>{index + 1}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Data de Vencimento</label>
                                <input onChange={getDate} type="date" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Descrição</label>
                                <textarea onChange={getDesc} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
                            </div>
                            <div className="flex justify-end">
                                <button onClick={toggleModal} type="button" className="mr-4 py-2 px-4 bg-gray-300 rounded-md hover:bg-gray-400">Cancelar</button>
                                <button onClick={addCard} className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">Adicionar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Main