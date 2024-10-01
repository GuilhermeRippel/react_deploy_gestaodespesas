import { useEffect } from 'react';

function useCalculations(expenses, setTotalExpenses, setAverageAmount, setAverageInstallments, setBiggerAmount, setSmallerAmount, setBiggerInstallment, setExpensesGreaterThan500) {
    useEffect(() => {
        if (expenses.length > 0) {
            const sumOfExpenses = expenses.reduce((acc, expense) => acc + parseFloat(expense.card.amount), 0);
            setTotalExpenses(sumOfExpenses);

            const averageAmount = sumOfExpenses / expenses.length;
            setAverageAmount(averageAmount);

            const averageInstallments = expenses.reduce((acc, expense) => acc + parseFloat(expense.card.installments), 0) / expenses.length;
            setAverageInstallments(averageInstallments);

            const amounts = expenses.map(expense => parseFloat(expense.card.amount));
            setBiggerAmount(Math.max(...amounts));
            setSmallerAmount(Math.min(...amounts));

            const installments = expenses.map(expense => parseFloat(expense.card.installments));
            setBiggerInstallment(Math.max(...installments));

            const greaterThan500 = expenses.filter(expense => parseFloat(expense.card.amount) > 500).length;
            setExpensesGreaterThan500(greaterThan500);
        }
    }, [expenses]);
}

export default useCalculations;
