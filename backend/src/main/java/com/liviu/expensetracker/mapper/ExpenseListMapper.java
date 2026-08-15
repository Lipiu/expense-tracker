package com.liviu.expensetracker.mapper;

import com.liviu.expensetracker.dto.ExpenseListDto;
import com.liviu.expensetracker.model.ExpenseList;

public interface ExpenseListMapper {
    ExpenseList fromDto(ExpenseListDto expenseListDto);
    ExpenseListDto toDto(ExpenseList expenseList);
}
