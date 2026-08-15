package com.liviu.expensetracker.controller;

import com.liviu.expensetracker.dto.ExpenseListDto;
import com.liviu.expensetracker.mapper.ExpenseListMapper;
import com.liviu.expensetracker.model.ExpenseList;
import com.liviu.expensetracker.service.ExpenseListService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path = "/expense-lists")
public class ExpenseListController {

    private final ExpenseListService expenseListService;
    private final ExpenseListMapper expenseListMapper;

    public ExpenseListController(ExpenseListService expenseListService, ExpenseListMapper expenseListMapper) {
        this.expenseListService = expenseListService;
        this.expenseListMapper = expenseListMapper;
    }

    @GetMapping
    public List<ExpenseListDto> getExpenseLists(){
        return expenseListService.getExpenseLists()
                .stream()
                .map(expenseListMapper::toDto)
                .toList();
    }

    @PostMapping
    public ExpenseListDto createExpenseList(@RequestBody ExpenseListDto expenseListDto){
        ExpenseList createdExpenseList = expenseListService.createExpenseList(expenseListMapper.fromDto(expenseListDto));

        return expenseListMapper.toDto(createdExpenseList);
    }

    @GetMapping(path = "/{expense_list_id}")
    public Optional<ExpenseListDto> getExpenseListById(@PathVariable("expense_list_id") Long expenseListId){
        return expenseListService.getExpenseListById(expenseListId).map(expenseListMapper::toDto);
    }

    @DeleteMapping(path = "/{expense_list_id}")
    public void deleteExpenseList(@PathVariable("expense_list_id") Long expenseListId){
        expenseListService.deleteExpenseList(expenseListId);
    }
}
