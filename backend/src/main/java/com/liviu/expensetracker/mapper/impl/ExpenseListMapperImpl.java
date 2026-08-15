package com.liviu.expensetracker.mapper.impl;

import com.liviu.expensetracker.dto.ExpenseListDto;
import com.liviu.expensetracker.mapper.ExpenseListMapper;
import com.liviu.expensetracker.mapper.ExpenseMapper;
import com.liviu.expensetracker.model.ExpenseList;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class ExpenseListMapperImpl implements ExpenseListMapper {

    private final ExpenseMapper expenseMapper;

    public ExpenseListMapperImpl(ExpenseMapper expenseMapper) {
        this.expenseMapper = expenseMapper;
    }

    @Override
    public ExpenseList fromDto(ExpenseListDto expenseListDto) {
        return new ExpenseList(
                expenseListDto.id(),
                expenseListDto.title(),
                expenseListDto.description(),
                Optional.ofNullable(expenseListDto.expenses())
                        .map(expenses -> expenses.stream()
                                .map(expenseMapper::fromDto)
                                .toList())
                        .orElse(null),
                null
        );
    }

    @Override
    public ExpenseListDto toDto(ExpenseList expenseList) {
        return new ExpenseListDto(
                expenseList.getId(),
                expenseList.getTitle(),
                expenseList.getDescription(),
                Optional.ofNullable(expenseList.getExpenses())
                        .map(expenses -> expenses.stream()
                                .map(expenseMapper::toDto)
                                .toList())
                        .orElse(null)
        );
    }
}
