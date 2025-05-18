package com.example.finance.service;

import com.example.finance.exception.AccountNotFoundException;
import com.example.finance.model.Account;
import com.example.finance.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AccountService {
    
    private final AccountRepository accountRepository;
    
    @Autowired
    public AccountService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }
    
    @Transactional(readOnly = true)
    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public Account getAccountById(Long accountId) {
        return accountRepository.findById(accountId)
                .orElseThrow(() -> new AccountNotFoundException("Account not found with ID: " + accountId));
    }
    
    @Transactional(readOnly = true)
    public List<Account> getAccountsByCustomerId(Long customerId) {
        return accountRepository.findByCustomerId(customerId);
    }
    
    @Transactional
    public Account createAccount(Long customerId, String accountType, BigDecimal initialBalance) {
        Account account = new Account();
        account.setCustomerId(customerId);
        account.setAccountType(accountType);
        account.setBalance(initialBalance);
        account.setCreatedAt(LocalDateTime.now());
        account.setStatus("ACTIVE");
        
        return accountRepository.save(account);
    }
    
    @Transactional
    public void updateAccountBalance(Long accountId, BigDecimal newBalance) {
        Account account = getAccountById(accountId);
        account.setBalance(newBalance);
        accountRepository.save(account);
    }
    
    @Transactional
    public Account updateAccount(Long accountId, Account accountDetails) {
        Account existingAccount = getAccountById(accountId);
        
        // Only update fields that are allowed to be changed
        if (accountDetails.getStatus() != null) {
            existingAccount.setStatus(accountDetails.getStatus());
        }
        
        return accountRepository.save(existingAccount);
    }
}
