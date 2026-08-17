package com.liviu.expensetracker.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record ExpenseDto (
    Long id,
    String expenseName,
    double amount,
    LocalDateTime createdAt,
    LocalDate dueDate,
    boolean isPaid
){ }
