package com.liviu.expensetracker.repository;

import com.liviu.expensetracker.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByExpenseListId(Long expenseListId);
    List<Expense> findByExpenseListIdAndId(Long expenseListId, Long expenseId);
}
