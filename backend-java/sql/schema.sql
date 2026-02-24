CREATE DATABASE IF NOT EXISTS online_exam;
USE online_exam;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exams (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  subject VARCHAR(120) NOT NULL,
  duration_minutes INT NOT NULL,
  question_count INT NOT NULL DEFAULT 10,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exam_questions (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  exam_id BIGINT UNSIGNED NOT NULL,
  question_text TEXT NOT NULL,
  option_a VARCHAR(255) NOT NULL,
  option_b VARCHAR(255) NOT NULL,
  option_c VARCHAR(255) NOT NULL,
  option_d VARCHAR(255) NOT NULL,
  correct_option TINYINT UNSIGNED NOT NULL,
  difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
  FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS exam_submissions (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  exam_id BIGINT UNSIGNED NOT NULL,
  score_percent INT NOT NULL,
  score_value INT NOT NULL,
  total_questions INT NOT NULL,
  duration_seconds INT NOT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_submission (user_id, exam_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
);

INSERT INTO exams (id, title, subject, duration_minutes, question_count) VALUES
  (1, 'Data Structures & Algorithms', 'Computer Science', 60, 10),
  (2, 'Database Management Systems', 'Computer Science', 45, 10),
  (3, 'Operating Systems', 'Computer Science', 60, 10),
  (4, 'Computer Networks', 'Computer Science', 50, 10)
ON DUPLICATE KEY UPDATE title = VALUES(title);

INSERT INTO exam_questions (exam_id, question_text, option_a, option_b, option_c, option_d, correct_option, difficulty) VALUES
  (1, 'What is the time complexity of binary search?', 'O(n)', 'O(log n)', 'O(n²)', 'O(1)', 1, 'easy'),
  (1, 'Which structure uses LIFO?', 'Queue', 'Stack', 'Tree', 'Heap', 1, 'easy'),
  (1, 'Which sorting is divide-and-conquer?', 'Merge Sort', 'Bubble Sort', 'Insertion Sort', 'Selection Sort', 0, 'medium'),
  (1, 'In graphs, BFS uses which DS?', 'Stack', 'Queue', 'Array', 'Set', 1, 'easy'),
  (1, 'What is a balanced BST operation average search time?', 'O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 1, 'medium'),
  (1, 'Which is not linear DS?', 'Array', 'Linked List', 'Tree', 'Stack', 2, 'easy'),
  (1, 'Which heap property is true for max heap?', 'Parent <= child', 'Parent >= child', 'Root is min', 'No order', 1, 'medium'),
  (1, 'Dijkstra works with?', 'Negative weights', 'Non-negative weights', 'Unweighted only', 'Directed acyclic only', 1, 'hard'),
  (1, 'Hash table average search?', 'O(n)', 'O(log n)', 'O(1)', 'O(n log n)', 2, 'easy'),
  (1, 'Recursion uses?', 'Heap', 'Queue', 'Stack', 'Graph', 2, 'easy'),

  (2, 'What does SQL stand for?', 'Structured Query Language', 'Simple Query Language', 'Standard Query Language', 'Sequential Query Language', 0, 'easy'),
  (2, 'Normalization helps to?', 'Increase redundancy', 'Remove redundancy', 'Delete tables', 'Duplicate records', 1, 'easy'),
  (2, 'Which key uniquely identifies a row?', 'Foreign key', 'Candidate key', 'Primary key', 'Composite key', 2, 'easy'),
  (2, 'ACID property C means?', 'Consistency', 'Concurrency', 'Cost', 'Constraint', 0, 'medium'),
  (2, 'JOIN to keep all from left table?', 'INNER', 'RIGHT', 'LEFT', 'FULL', 2, 'medium'),
  (2, 'Index primarily improves?', 'Storage', 'Read speed', 'Write speed', 'Security', 1, 'medium'),
  (2, 'Which normal form removes transitive dependency?', '1NF', '2NF', '3NF', 'BCNF', 2, 'hard'),
  (2, 'Transaction rollback occurs on?', 'Commit', 'Failure', 'Save', 'Select', 1, 'easy'),
  (2, 'Default port for MySQL?', '5432', '3306', '27017', '1521', 1, 'easy'),
  (2, 'Which command removes table structure?', 'DELETE', 'TRUNCATE', 'DROP', 'REMOVE', 2, 'easy'),

  (3, 'Main role of operating system?', 'Compile code', 'Manage resources', 'Render graphics', 'Send emails', 1, 'easy'),
  (3, 'Process in waiting state means?', 'Running', 'Blocked', 'Ready', 'Terminated', 1, 'medium'),
  (3, 'Which is not scheduling algorithm?', 'FCFS', 'SJF', 'Round Robin', 'Binary Search', 3, 'easy'),
  (3, 'Virtual memory provides?', 'More registers', 'Larger logical memory', 'More CPU', 'Faster disk', 1, 'medium'),
  (3, 'Deadlock requires?', 'Mutual exclusion', 'Preemption always', 'Infinite memory', 'Single thread', 0, 'hard'),
  (3, 'Thrashing is related to?', 'CPU cache', 'Excessive paging', 'Process creation', 'Network congestion', 1, 'hard'),
  (3, 'System call is?', 'Library function', 'Kernel service request', 'Compiler directive', 'Shell script', 1, 'medium'),
  (3, 'Which memory is fastest?', 'Cache', 'Disk', 'RAM', 'Tape', 0, 'easy'),
  (3, 'Semaphore is used for?', 'Encryption', 'Process synchronization', 'Disk formatting', 'Rendering', 1, 'medium'),
  (3, 'Page replacement algorithm?', 'LRU', 'DFS', 'BFS', 'A*', 0, 'medium'),

  (4, 'Which protocol is used for web browsing?', 'FTP', 'SMTP', 'HTTP', 'SNMP', 2, 'easy'),
  (4, 'OSI layer for routing?', 'Transport', 'Network', 'Data link', 'Session', 1, 'easy'),
  (4, 'TCP is?', 'Connection-oriented', 'Connectionless', 'Application protocol', 'Physical protocol', 0, 'easy'),
  (4, 'IP address version with 128-bit?', 'IPv4', 'IPv6', 'IPv5', 'IPv7', 1, 'easy'),
  (4, 'DNS maps?', 'IP to MAC', 'Domain to IP', 'Port to process', 'URL to packet', 1, 'easy'),
  (4, 'Protocol for secure web?', 'HTTP', 'TLS/HTTPS', 'Telnet', 'FTP', 1, 'medium'),
  (4, 'Subnet mask used for?', 'Encryption', 'Network segmentation', 'Compression', 'Error check', 1, 'medium'),
  (4, 'Switch works mainly at?', 'Layer 1', 'Layer 2', 'Layer 3', 'Layer 7', 1, 'medium'),
  (4, 'Ping uses?', 'TCP', 'UDP', 'ICMP', 'ARP', 2, 'easy'),
  (4, 'NAT helps with?', 'Address translation', 'Clock sync', 'File transfer', 'Routing loops', 0, 'medium');
