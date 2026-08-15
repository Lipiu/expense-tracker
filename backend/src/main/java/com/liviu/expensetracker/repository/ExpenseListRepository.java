package com.liviu.expensetracker.repository;

import com.liviu.expensetracker.model.ExpenseList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExpenseListRepository extends JpaRepository<ExpenseList, Long> { }
