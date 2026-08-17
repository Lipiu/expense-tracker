package com.liviu.expensetracker.controller;

import com.liviu.expensetracker.dto.ExpenseDto;
import com.liviu.expensetracker.mapper.ExpenseMapper;
import com.liviu.expensetracker.model.Expense;
import com.liviu.expensetracker.service.ExpenseService;
import jakarta.transaction.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

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
        return expenseService.listExpenses(expenseListId)
                .stream()
                .map(expenseMapper::toDto)
                .toList();
    }

    @GetMapping(path = "/{expense_id}")
    public Optional<ExpenseDto> getExpense(
            @PathVariable("expense_list_id") Long expenseListId,
            @PathVariable("expense_id") Long expenseId
    ){
        return expenseService.getExpense(expenseListId, expenseId).map(expenseMapper::toDto);
    }

    @PostMapping
    public ExpenseDto createExpense(@PathVariable("expense_list_id") Long expenseListId, @RequestBody ExpenseDto expenseDto){
        Expense createdExpense = expenseService.createExpense(expenseListId, expenseMapper.fromDto(expenseDto));
        return expenseMapper.toDto(createdExpense);
    }

    @PutMapping(path = "/{expense_id}")
    public ExpenseDto updateExpense(
            @PathVariable("expense_list_id") Long expenseListId,
            @PathVariable("expense_id") Long expenseId,
            @RequestBody ExpenseDto expenseDto
    ){
        Expense updatedExpense = expenseService.updateExpense(
                expenseListId,
                expenseId,
                expenseMapper.fromDto(expenseDto)
        );

        return expenseMapper.toDto(updatedExpense);
    }

    @PatchMapping(path = "/{expense_id}/paid")
    public ExpenseDto setPaidStatus(
            @PathVariable("expense_list_id") Long expenseListId,
            @PathVariable("expense_id") Long expenseId,
            @RequestBody Map<String, Boolean> body
    ){
        boolean isPaid = Boolean.TRUE.equals(body.get("paid"));
        Expense updatedExpense = expenseService.setPaidStatus(expenseListId, expenseId, isPaid);
        return expenseMapper.toDto(updatedExpense);
    }

    @Transactional
    @DeleteMapping(path = "/{expense_id}")
    public void deleteExpense(
            @PathVariable("expense_list_id") Long expenseListId,
            @PathVariable("expense_id") Long expenseId
    ){
        expenseService.deleteExpense(expenseListId, expenseId);
    }
}
