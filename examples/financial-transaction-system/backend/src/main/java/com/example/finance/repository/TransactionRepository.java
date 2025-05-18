package com.example.finance.repository;

import com.example.finance.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByFromAccountAccountIdOrToAccountAccountId(Long accountId, Long sameAccountId);
    List<Transaction> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
}
