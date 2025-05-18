package com.example.finance.config;

import com.example.finance.model.Account;
import com.example.finance.service.AccountService;
import com.example.finance.service.TransferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(AccountService accountService, TransferService transferService) {
        return args -> {
            // Create sample accounts
            Account account1 = accountService.createAccount(1001L, "SAVINGS", new BigDecimal("5000.00"));
            Account account2 = accountService.createAccount(1001L, "CHECKING", new BigDecimal("2500.00"));
            Account account3 = accountService.createAccount(1002L, "SAVINGS", new BigDecimal("10000.00"));
            Account account4 = accountService.createAccount(1002L, "CHECKING", new BigDecimal("3000.00"));
            
            // Create sample transactions
            transferService.transferFunds(account1.getAccountId(), account2.getAccountId(), new BigDecimal("500.00"));
            transferService.transferFunds(account3.getAccountId(), account4.getAccountId(), new BigDecimal("1000.00"));
            transferService.transferFunds(account2.getAccountId(), account3.getAccountId(), new BigDecimal("250.00"));
            
            System.out.println("Sample data initialized successfully!");
        };
    }
}
