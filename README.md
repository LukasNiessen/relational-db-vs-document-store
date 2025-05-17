# Relational vs Document-Oriented Database for Software Architecture

What I go through in here is:

1. Super quick refresher of what these two are
2. Key differences
3. Strengths and weaknesses
4. System design examples (+ Spring Java code)
5. Brief history

In the examples, I choose a relational DB in the first, and a document-oriented DB in the other. The focus is on _why_ did I make that choice. I also provide some example code for both.

In the strengths and weaknesses part, I discuss both what _used to be one_ and how it looks nowadays.

## Super short summary

The two most common types of DBs are:

- **Relational database (RDB)**: PostgreSQL, MySQL, MSQL, Oracle DB, ...
- **Document-oriented database (document store):** MongoDB, DynamoDB, Cassandra, CouchDB...

### RDB

The key idea is: **fit the data into a big table**. The columns are _properties_ and the rows are the _values_. By doing this, we have our data in a very structured way. So we have much power for querying the data (using SQL). That is, we can do all sorts of filters, joints etc. The way we arrange them into the table is called the _database schema_.

#### Example table

```
+----+---------+---------------------+-----+
| ID | Name    | Email               | Age |
+----+---------+---------------------+-----+
| 1  | Alice   | alice@example.com   | 30  |
| 2  | Bob     | bob@example.com     | 25  |
| 3  | Charlie | charlie@example.com | 28  |
+----+---------+---------------------+-----+
```

A database can have many tables.

### Document stores

The key idea is: **just store that data as it is**. So suppose we have an object. We just convert it to a JSON and store it as it is. We call this data a _document_. It can be JSON, BSON (binary JSON) and XML too.

#### Example document

```JSON
{
  "user_id": 123,
  "name": "Alice",
  "email": "alice@example.com",
  "orders": [
    {"id": 1, "item": "Book", "price": 12.99},
    {"id": 2, "item": "Pen", "price": 1.50}
  ]
}
```

Each document is saved under a unique ID. This ID can sometimes be a path, for example in Google Cloud Firestore.

Many documents _'in the same bucket'_ is called a _collection_. We can have many collections.

## Differences

#### Schema

- RDBs have a fixed schema. Every row is the same _schema_.
- Document stores don't have schemas. Each document can have a different _schema_.

#### Data Structure

- RDBs break data into normalized tables with relationships through foreign keys
- Document stores nest related data directly within documents as embedded objects or arrays

#### Query Language

- RDBs use SQL, a standardized declarative language
- Document stores typically have their own query APIs
  - Nowadays, the common document stores support SQL-like queries too

#### Scaling Approach

- RDBs traditionally scale vertically (bigger/better machines)
  - Nowadays, the most common RDBs offer horizontal scaling as well (eg. PostgeSQL)
- Document stores are designed for horizontal scaling (more machines) from the ground up

#### Transaction Support

ACID = availability, consistency, isolation, durability

- RDBs have mature ACID transaction support
- Document stores traditionally sacrificed ACID guarantees in favor of performance and availability
  - The most common document stores nowadays support ACID though (eg. MongoDB)

## Strengths, weaknesses

### Relational Databases

I want to repeat a few things here again that have changed. As noted, nowadays, most document stores support SQL and ACID. Likewise, most RDBs nowadays support horizontal scaling.

However, let's look at ACID for example. While document stores support it, it's much more mature in RDBs. So if your app puts super high relevance on ACID, then probably RDBs are better. But if your app just needs basic ACID, both works well and this shouldn't be the deciding factor.

For this reason, I have put these points, that are supported in both, in **parentheses**.

**Strengths:**

- **Data Integrity**: Strong schema enforcement ensures data consistency
- (**Complex Querying**: Excellent at complex joins and aggregations across multiple tables)
- (**ACID**)

**Weaknesses:**

- **Schema**: While the schema was listed as a strength, it also is a weakness. Changing the schema requires migrations which can be painful
- **Object-Relational Impedance Mismatch**: Translating between application objects and relational tables adds complexity. Hibernate and other Object-relational mapping (ORM) frameworks help though.
- (**Horizontal Scaling**: Supported but sharding is more complex as compared to document stores)
- **Initial Dev Speed**: Setting up schemas etc takes some time

### Document-Oriented Databases

**Strengths:**

- **Schema Flexibility**: Better for heterogeneous data structures
- **Throughput:** Supports high throughput, especially write throughput
- (**Horizontal Scaling**: Horizontal scaling is easier, you can shard document-wise (document 1-1000 on computer A and 1000-2000 on computer B))
- **Performance for Document-Based Access**: Retrieving or updating an entire document is very efficient
- **One-to-Many Relationships**: Superior in this regard. You don't need joins or other operations.
- **Locality**: See below
- **Initial Dev Speed**: Getting started is quicker due to the flexibility

**Weaknesses:**

- **Complex Relationships**: Many-to-one and many-to-many relationships are difficult and often require denormalization or application-level joins
- **Data Consistency**: More responsibility falls on application code to maintain data integrity
- **Query Optimization**: Less mature optimization engines compared to relational systems
- **Storage Efficiency**: Potential data duplication increases storage requirements
- **Locality**: See below

### Locality

I have listed locality as a strength and a weakness of document stores. Here is what I mean with this.

In document storem, cocuments are typically stored as a single, continuous string, encoded in formats like JSON, XML, or binary variants such as MongoDB's BSON. This structure provides a locality advantage when applications need to access entire documents. Storing related data together minimizes disk seeks, unlike relational databases (RDBs) where data split across multiple tables - this requires multiple index lookups, increasing retrieval time.

However, it's only a benefit when we need (almost) the entire document at once. Document stores typically load the entire document, even if only a small part is accessed. This is inefficient for large documents. Similarly, updates often require rewriting the entire document. So keep these downsides small, make sure your documents are small.

Last note: This Locality isn't exclusive to document stores. For example Google Spanner or Oracle achieve a similar locality in a relational model.

## System Design Example 1: Financial Transaction System

Note that I limit this example to the minimum so the article is not totally bloated. The code is incomplete on purpose.

### Requirements

#### Functional requirements

- Process payments and transfers
- Maintain accurate account balances
- Store audit trails for all operations

#### Non-functional requirements

- Reliability (!!)
- Data consistency (!!)

#### Why Relational is Better Here

We want reliability and data consistency. Though document stores support this too (ACID for example), they are less mature in this regard. The benefits of document stores are not interesting for us, so we go with an RDB.

Note: If we would expand this example and add things like _profiles of sellers_, _ratings_ and more, we might want to add a separate DB where we have different priorities such as availability and high throughput. With two separate DBs we can support different requirements and scale them independently.

### Data Model

```
Accounts:
- account_id (PK = Primary Key)
- customer_id (FK = Foreign Key)
- account_type
- balance
- created_at
- status

Transactions:
- transaction_id (PK)
- from_account_id (FK)
- to_account_id (FK)
- amount
- type
- status
- created_at
- reference_number
```

### Spring Boot Implementation

```java
// Entity classes
@Entity
@Table(name = "accounts")
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long accountId;

    @Column(nullable = false)
    private Long customerId;

    @Column(nullable = false)
    private String accountType;

    @Column(nullable = false)
    private BigDecimal balance;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private String status;

    // Getters and setters
}

@Entity
@Table(name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long transactionId;

    @ManyToOne
    @JoinColumn(name = "from_account_id")
    private Account fromAccount;

    @ManyToOne
    @JoinColumn(name = "to_account_id")
    private Account toAccount;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private String referenceNumber;

    // Getters and setters
}

// Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByFromAccountAccountIdOrToAccountAccountId(Long accountId, Long sameAccountId);
    List<Transaction> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
}

// Service with transaction support
@Service
public class TransferService {
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    @Autowired
    public TransferService(AccountRepository accountRepository, TransactionRepository transactionRepository) {
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }

    @Transactional
    public Transaction transferFunds(Long fromAccountId, Long toAccountId, BigDecimal amount) {
        Account fromAccount = accountRepository.findById(fromAccountId)
                .orElseThrow(() -> new AccountNotFoundException("Source account not found"));

        Account toAccount = accountRepository.findById(toAccountId)
                .orElseThrow(() -> new AccountNotFoundException("Destination account not found"));

        if (fromAccount.getBalance().compareTo(amount) < 0) {
            throw new InsufficientFundsException("Insufficient funds in source account");
        }

        // Update balances
        fromAccount.setBalance(fromAccount.getBalance().subtract(amount));
        toAccount.setBalance(toAccount.getBalance().add(amount));

        accountRepository.save(fromAccount);
        accountRepository.save(toAccount);

        // Create transaction record
        Transaction transaction = new Transaction();
        transaction.setFromAccount(fromAccount);
        transaction.setToAccount(toAccount);
        transaction.setAmount(amount);
        transaction.setType("TRANSFER");
        transaction.setStatus("COMPLETED");
        transaction.setCreatedAt(LocalDateTime.now());
        transaction.setReferenceNumber(generateReferenceNumber());

        return transactionRepository.save(transaction);
    }

    private String generateReferenceNumber() {
        return "TXN" + System.currentTimeMillis();
    }
}
```

## System Design Example 2: Content Management System

Note that I limit this example to the minimum so the article is not totally bloated. The code is incomplete on purpose.

A content management system.

### Requirements

- Store various content types, including articles and products
- Allow adding new content types
- Support comments

### Non-functional requirements

- Performance
- Availability
- Elasticity

### Why Document Store is Better Here

As we have no critical transaction like in the previous example but are only interested in performance, availability and elasticity, document stores are a great choice. Considering that various content types is a requirement, our life is easier with document stores as they are schema-less.

### Data Model

```json
// Article document
{
  "id": "article123",
  "type": "article",
  "title": "Understanding NoSQL",
  "author": {
    "id": "user456",
    "name": "Jane Smith",
    "email": "jane@example.com"
  },
  "content": "Lorem ipsum dolor sit amet...",
  "tags": ["database", "nosql", "tutorial"],
  "published": true,
  "publishedDate": "2025-05-01T10:30:00Z",
  "comments": [
    {
      "id": "comment789",
      "userId": "user101",
      "userName": "Bob Johnson",
      "text": "Great article!",
      "timestamp": "2025-05-02T14:20:00Z",
      "replies": [
        {
          "id": "reply456",
          "userId": "user456",
          "userName": "Jane Smith",
          "text": "Thanks Bob!",
          "timestamp": "2025-05-02T15:45:00Z"
        }
      ]
    }
  ],
  "metadata": {
    "viewCount": 1250,
    "likeCount": 42,
    "featuredImage": "/images/nosql-header.jpg",
    "estimatedReadTime": 8
  }
}

// Product document (completely different structure)
{
  "id": "product789",
  "type": "product",
  "name": "Premium Ergonomic Chair",
  "price": 299.99,
  "categories": ["furniture", "office", "ergonomic"],
  "variants": [
    {
      "color": "black",
      "sku": "EC-BLK-001",
      "inStock": 23
    },
    {
      "color": "gray",
      "sku": "EC-GRY-001",
      "inStock": 14
    }
  ],
  "specifications": {
    "weight": "15kg",
    "dimensions": "65x70x120cm",
    "material": "Mesh and aluminum"
  }
}
```

### Spring Boot Implementation with MongoDB

```java
@Document(collection = "content")
public class ContentItem {
    @Id
    private String id;
    private String type;
    private Map<String, Object> data;

    // Common fields can be explicit
    private boolean published;
    private Date createdAt;
    private Date updatedAt;

    // The rest can be dynamic
    @DBRef(lazy = true)
    private User author;

    private List<Comment> comments;

    // Basic getters and setters
}

// MongoDB Repository
public interface ContentRepository extends MongoRepository<ContentItem, String> {
    List<ContentItem> findByType(String type);
    List<ContentItem> findByTypeAndPublishedTrue(String type);
    List<ContentItem> findByData_TagsContaining(String tag);
}

// Service for content management
@Service
public class ContentService {
    private final ContentRepository contentRepository;

    @Autowired
    public ContentService(ContentRepository contentRepository) {
        this.contentRepository = contentRepository;
    }

    public ContentItem createContent(String type, Map<String, Object> data, User author) {
        ContentItem content = new ContentItem();
        content.setType(type);
        content.setData(data);
        content.setAuthor(author);
        content.setCreatedAt(new Date());
        content.setUpdatedAt(new Date());
        content.setPublished(false);

        return contentRepository.save(content);
    }

    public ContentItem addComment(String contentId, Comment comment) {
        ContentItem content = contentRepository.findById(contentId)
                .orElseThrow(() -> new ContentNotFoundException("Content not found"));

        if (content.getComments() == null) {
            content.setComments(new ArrayList<>());
        }

        content.getComments().add(comment);
        content.setUpdatedAt(new Date());

        return contentRepository.save(content);
    }

    // Easily add new fields without migrations
    public ContentItem addMetadata(String contentId, String key, Object value) {
        ContentItem content = contentRepository.findById(contentId)
                .orElseThrow(() -> new ContentNotFoundException("Content not found"));

        Map<String, Object> data = content.getData();
        if (data == null) {
            data = new HashMap<>();
        }

        // Just update the field, no schema changes needed
        data.put(key, value);
        content.setData(data);

        return contentRepository.save(content);
    }
}
```

## Brief History of RDBs vs NoSQL

RDBs originated from a revolutionizing paper of Edgar Codd in 1970. After a few years, RDBs dominated the world of DBs, mainly for their reliability and consistent structure.

NoSQL emerged around 2009 (the term actually came from a Twitter hashtag for a meetup about non-relational databases) as companies like Google, Amazon, and Facebook developed custom solutions to handle their unprecedented scale. They published papers on their internal database systems, inspiring open-source alternatives like MongoDB, Cassandra, and Couchbase.

The driving forces behind NoSQL adoption were:

- Need for horizontal scalability across many machines
- More flexible data models for rapidly evolving applications
- Performance optimization for specific query patterns
- Lower operational costs for massive datasets

As mentioned already, most of these driving forces are not supported by RDBs as well, so the hard distinctions between RDBs and document stores are blurring.

Most modern databases incorporate features from both.
