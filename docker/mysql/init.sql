SET NAMES utf8mb4;

GRANT REPLICATION CLIENT, REPLICATION SLAVE ON *.* TO 'advers'@'%';
FLUSH PRIVILEGES;

CREATE TABLE IF NOT EXISTS positions (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS customers (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  fname VARCHAR(255) NOT NULL,
  lname VARCHAR(255) NOT NULL,
  position_id INT UNSIGNED NOT NULL,
  FOREIGN KEY (position_id) REFERENCES positions(id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS translations (
  token VARCHAR(255) PRIMARY KEY,
  translation VARCHAR(255) NOT NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO positions (name) VALUES ('officer'), ('manager'), ('operator');

INSERT INTO customers (fname, lname, position_id) VALUES
  ('Dino',   'Fabrello',   1),
  ('Walter', 'Marangoni',  2),
  ('Angelo', 'Ottogialli', 3);

INSERT INTO translations (token, translation) VALUES
  ('officer',  'офицер'),
  ('manager',  'менеджер'),
  ('operator', 'оператор');
