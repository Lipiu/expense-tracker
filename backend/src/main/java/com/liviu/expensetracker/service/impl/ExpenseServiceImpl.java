package com.liviu.expensetracker.service.impl;

import com.liviu.expensetracker.model.Expense;
import com.liviu.expensetracker.model.ExpenseList;
import com.liviu.expensetracker.repository.ExpenseListRepository;
import com.liviu.expensetracker.repository.ExpenseRepository;
import com.liviu.expensetracker.service.ExpenseService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class ExpenseServiceImpl implements ExpenseService {
    private final ExpenseRepository expenseRepository;
    private final ExpenseListRepository expenseListRepository;

    public ExpenseServiceImpl(ExpenseRepository expenseRepository, ExpenseListRepository expenseListRepository) {
        this.expenseRepository = expenseRepository;
        this.expenseListRepository = expenseListRepository;
    }

    @Override
    public List<Expense> listExpenses(Long expenseListId) {
        return expenseRepository.findByExpenseListId(expenseListId);
    }

    @Override
    public Expense createExpense(Long expenseListId, Expense expense) {
        if(expense.getId() != null){
            throw new IllegalArgumentException("Expense already has an ID.");
        }
        if(expense.getExpenseName() == null || expense.getExpenseName().isEmpty()){
            throw new IllegalArgumentException("Expense must have a title.");
        }

        ExpenseList expenseList = expenseListRepository.findById(expenseListId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid expense list id provided."));

        Expense expenseToSave = new Expense(
            null,
                expense.getExpenseName(),
                expense.getAmount(),
                LocalDateTime.now(),
                expense.getDueDate(),
                expenseList,
                false
            );

        return expenseRepository.save(expenseToSave);
    }

    @Override
    public Optional<Expense> getExpense(Long expenseListId, Long expenseId) {
        return expenseRepository.findByExpenseListIdAndId(expenseListId, expenseId);
    }

    @Override
    public Expense updateExpense(Long expenseListId, Long expenseId, Expense expense) {
        if(expense.getId() == null){
            throw new IllegalArgumentException("Expense must have an ID.");
        }
        if(!Objects.equals(expenseId, expense.getId())){
            throw new IllegalArgumentException("Expense ID's do not match.");
        }

        Expense existingExpense = expenseRepository.findByExpenseListIdAndId(expenseListId, expenseId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));

        existingExpense.setExpenseName(expense.getExpenseName());
        existingExpense.setAmount(expense.getAmount());
        existingExpense.setDueDate(expense.getDueDate());
        return expenseRepository.save(existingExpense);
    }

    @Override
    public Expense setPaidStatus(Long expenseListId, Long expenseId, boolean isPaid) {
        Expense existingExpense = expenseRepository.findByExpenseListIdAndId(expenseListId, expenseId)
                .orElseThrow(() -> new IllegalArgumentException("Expense not found"));
        existingExpense.setPaid(isPaid);
        return expenseRepository.save(existingExpense);
    }

    @Override
    public void deleteExpense(Long expenseListId, Long expenseId) {
        expenseRepository.deleteByExpenseListIdAndId(expenseListId, expenseId);
    }
}
