package com.example.finance.controller;

import com.example.finance.model.Transaction;
import com.example.finance.service.TransferService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transfers")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Transfer Controller", description = "APIs for money transfers and transaction history")
public class TransferController {

    private final TransferService transferService;

    @Autowired
    public TransferController(TransferService transferService) {
        this.transferService = transferService;
    }

    @PostMapping
    @Operation(summary = "Transfer funds", description = "Transfers funds from one account to another")
    public ResponseEntity<Transaction> transferFunds(@RequestBody Map<String, Object> request) {
        Long fromAccountId = Long.parseLong(request.get("fromAccountId").toString());
        Long toAccountId = Long.parseLong(request.get("toAccountId").toString());
        BigDecimal amount = new BigDecimal(request.get("amount").toString());
        
        Transaction transaction = transferService.transferFunds(fromAccountId, toAccountId, amount);
        return ResponseEntity.ok(transaction);
    }

    @GetMapping("/account/{accountId}")
    @Operation(summary = "Get transaction history", description = "Retrieves transaction history for a specific account")
    public ResponseEntity<List<Transaction>> getTransactionHistory(@PathVariable Long accountId) {
        List<Transaction> transactions = transferService.getTransactionsByAccountId(accountId);
        return ResponseEntity.ok(transactions);
    }
}
