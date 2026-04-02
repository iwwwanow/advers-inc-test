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

## Замечание по архитектуре MutationObserver

ТЗ требует использовать MutationObserver для отслеживания DOM-изменений и запрашивать перевод через `Meteor.call` отдельным вызовом на сервер.

С точки зрения архитектуры это избыточно: перевод можно получить одним JOIN-запросом прямо в публикации и отдать клиенту уже готовые данные — без дополнительного round-trip на сервер и без слежки за DOM.

MutationObserver здесь имитирует браузерный плагин-переводчик (по аналогии с Google Translate), который не знает ничего о React или Meteor и работает исключительно на уровне DOM. Это намеренная развязка двух механизмов, продиктованная требованиями задания, а не production-подход.
