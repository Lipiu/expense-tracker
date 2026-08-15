package com.liviu.expensetracker.dto;

import java.util.List;

public record ExpenseListDto(
    Long id,
    String title,
    String description,
    List<ExpenseDto> expenses
) { }
