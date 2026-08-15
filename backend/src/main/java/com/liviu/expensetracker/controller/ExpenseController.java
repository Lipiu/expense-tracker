package com.liviu.expensetracker.controller;

import com.liviu.expensetracker.dto.ExpenseDto;
import com.liviu.expensetracker.mapper.ExpenseMapper;
import com.liviu.expensetracker.service.ExpenseService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "/expense-lists/{expense_list_id}/expenses")
public class ExpenseController {
    private final ExpenseService expenseService;
    private final ExpenseMapper expenseMapper;

    public ExpenseController(ExpenseService expenseService, ExpenseMapper expenseMapper) {
        this.expenseService = expenseService;
        this.expenseMapper = expenseMapper;
    }

    @GetMapping
    public List<ExpenseDto> getExpenses(@PathVariable("expense_list_id") Long expenseListId){
        return expenseService.getExpenses(expenseListId)
                .stream()
                .map(expenseMapper::toDto)
                .toList();
    }
}
