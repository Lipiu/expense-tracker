package com.liviu.expensetracker.mapper.impl;

import com.liviu.expensetracker.dto.ExpenseDto;
import com.liviu.expensetracker.mapper.ExpenseMapper;
import com.liviu.expensetracker.model.Expense;
import org.springframework.stereotype.Component;

@Component
public class ExpenseMapperImpl implements ExpenseMapper {
    @Override
    public Expense fromDto(ExpenseDto expenseDto) {
        return new Expense(
                expenseDto.id(),
                expenseDto.expenseName(),
                expenseDto.amount(),
                expenseDto.createdAt(),
                expenseDto.dueDate(),
                null,
                expenseDto.isPaid()
        );
    }

    @Override
    public ExpenseDto toDto(Expense expense) {
        return new ExpenseDto(
                expense.getId(),
                expense.getExpenseName(),
                expense.getAmount(),
                expense.getCreatedAt(),
                expense.getDueDate(),
                expense.isPaid()
        );
    }
}
