package com.liviu.expensetracker.service.impl;

import com.liviu.expensetracker.model.ExpenseList;
import com.liviu.expensetracker.repository.ExpenseListRepository;
import com.liviu.expensetracker.service.ExpenseListService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ExpenseListServiceImpl implements ExpenseListService {
    private final ExpenseListRepository expenseListRepository;

    public ExpenseListServiceImpl(ExpenseListRepository expenseListRepository) {
        this.expenseListRepository = expenseListRepository;
    }

    @Override
    public List<ExpenseList> getExpenseLists() {
        return expenseListRepository.findAll();
    }

    @Override
    public ExpenseList createExpenseList(ExpenseList expenseList) {
        if(expenseList.getId() != null){
            throw new IllegalArgumentException("The task list already has an id");
        }
        if(expenseList.getTitle().isEmpty()){
            throw new IllegalArgumentException("Expense list title cannot be empty");
        }

        LocalDateTime now = LocalDateTime.now();
        return expenseListRepository.save(new ExpenseList(
                null,
                expenseList.getTitle(),
                expenseList.getDescription(),
                null,
                now
        ));
    }

    @Override
    public Optional<ExpenseList> getExpenseListById(Long id) {
        return expenseListRepository.findById(id);
    }

    @Override
    public void deleteExpenseList(Long expenseListId) {
        expenseListRepository.deleteById(expenseListId);
    }
}