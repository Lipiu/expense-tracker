package com.liviu.expensetracker.repository;

import com.liviu.expensetracker.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByExpenseListId(Long expenseListId);
    Optional<Expense> findByExpenseListIdAndId(Long expenseListId, Long expenseId);
    void deleteByExpenseListIdAndId(Long expenseListId, Long expenseId);
}
