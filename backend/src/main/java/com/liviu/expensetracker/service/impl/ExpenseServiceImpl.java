package com.liviu.expensetracker.service.impl;

import com.liviu.expensetracker.model.Expense;
import com.liviu.expensetracker.repository.ExpenseRepository;
import com.liviu.expensetracker.service.ExpenseService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseServiceImpl implements ExpenseService {
    private final ExpenseRepository expenseRepository;

    public ExpenseServiceImpl(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    @Override
    public List<Expense> getExpenses(Long expenseListId) {
        return expenseRepository.findByExpenseListId(expenseListId);
    }
}
