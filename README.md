# advers-inc-test

Meteor.js + TypeScript + MySQL приложение: реактивная таблица клиентов с серверным переводом должностей.

## Запуск

```bash
docker compose up -d
```

Приложение доступно на http://localhost:3000

## Архитектура

```
MySQL (customers + positions)
  → vlasky:mysql реактивная публикация
  → minimongo на клиенте (via DDP/WebSocket)
  → React-компонент (useTracker)
  → DOM: <td class="__t">officer</td>
  → MutationObserver
  → Meteor.call('translate', token)
  → MySQL (translations)
  → DOM update: "офицер"
```

## Тестирование реактивности

Подключиться к MySQL:

```bash
docker exec -it advers-mysql mysql -u advers -padvers advers
```

Команды для изменения данных (изменения появятся в браузере автоматически):

```sql
-- Добавить клиента
INSERT INTO customers (fname, lname, position_id) VALUES ('John', 'Doe', 2);

-- Изменить должность
UPDATE customers SET position_id = 3 WHERE id = 1;

-- Добавить должность с переводом
INSERT INTO positions (name) VALUES ('director');
INSERT INTO translations (token, translation) VALUES ('director', 'директор');

-- Удалить клиента
DELETE FROM customers WHERE id = 4;
```

## Замечание по архитектуре MutationObserver

ТЗ требует использовать MutationObserver для отслеживания DOM-изменений и запрашивать перевод через `Meteor.call` отдельным вызовом на сервер.

С точки зрения архитектуры это избыточно: перевод можно получить одним JOIN-запросом прямо в публикации и отдать клиенту уже готовые данные — без дополнительного round-trip на сервер и без слежки за DOM.

MutationObserver здесь имитирует браузерный плагин-переводчик (по аналогии с Google Translate), который не знает ничего о React или Meteor и работает исключительно на уровне DOM. Это намеренная развязка двух механизмов, продиктованная требованиями задания, а не production-подход.
