# План реализации: advers-inc-test

## Стек
- Meteor.js + TypeScript
- MySQL в Docker (пакет `vlasky:mysql` для реактивной подписки, `typeorm` в режиме ActiveRecord для чтения)
- Bootstrap (стандартная тема)

---

## Команды из корня проекта

```bash
pnpm up    # поднять весь стек (mysql + mongo + app) в Docker
pnpm down  # остановить контейнеры
pnpm logs  # логи всех сервисов
pnpm dev   # запустить Meteor локально (альтернатива Docker для app)
```

При первом запуске удалить сломанный volume если есть:
```bash
docker volume rm advers-inc-test_app_node_modules
```

---

## Задачи (приоритет сверху вниз)

### 1. Инициализация проекта ✅
- [x] Создать Meteor-приложение: `meteor create . --typescript`
- [x] Удалить стандартные шаблоны, оставить скелет
- [x] Добавить пакет Meteor: `vlasky:mysql` (v1.4.0)
- [x] Установить npm-зависимости: `typeorm`, `reflect-metadata`, `bootstrap` (v5.3.3)
- [x] Настроить `tsconfig.json` с `experimentalDecorators` + `emitDecoratorMetadata`
- [x] Добавить `$HOME/.meteor` в `PATH` (`~/.zshrc`)
- [x] Настроить `pnpm-workspace.yaml` + скрипты в `package.json`

### 2. Инфраструктура Docker ✅
- [x] `docker-compose.yml` — три сервиса в сети `advers-net`:
  - `mysql` (MySQL 8.0, порт 3306, healthcheck)
  - `mongo` (MongoDB 7, для Meteor)
  - `app` — образ `geoffreybooth/meteor-base:3.4`, код монтируется volume, `meteor run` (без сборки)
- [x] `working_dir: /app` + `METEOR_ALLOW_SUPERUSER=1` на app-сервисе
- [x] `node_modules` в named volume `app_node_modules`, install только при первом старте
- [x] `.meteor/local` кэшируется в named volume `meteor_local`
- [x] `docker/mysql/init.sql` — DDL таблиц + seed-данные:
  - `positions`: officer, manager, operator
  - `customers`: Dino Fabrello, Walter Marangoni, Angelo Ottogialli
  - `translations`: officer→офицер, manager→менеджер, operator→оператор
- [x] TypeORM host в env: `MYSQL_HOST=mysql` (по имени сервиса в Docker-сети)

### 3. TypeORM-сущности (server-side) ✅
- [x] Настроить подключение TypeORM в `server/db.ts` — читать параметры из `process.env` (`MYSQL_HOST`, `MYSQL_PORT`, etc.)
- [x] Создать entity `Position` (`server/entities/Position.ts`) — поля: `id`, `name`
- [x] Создать entity `Customer` (`server/entities/Customer.ts`) — поля: `id`, `fname`, `lname`, `positionId`, relation → Position
- [x] Создать entity `Translation` (`server/entities/Translation.ts`) — поля: `token`, `translation`

### 4. Meteor-публикация (server-side) ✅
- [x] Создать `server/publications.ts`
- [x] Реализовать публикацию `customers-with-positions` через `vlasky:mysql`:
  - SQL-запрос с JOIN customers + positions
  - Возвращать данные в реактивном режиме (LiveQuery)
- [x] Типизировать документы: `CustomerRow { _id: string; id: number; fullName: string; position: string }`

### 5. Meteor-метод для перевода (server-side)
- [ ] Создать `server/methods.ts`
- [ ] Реализовать метод `translate(token: string): string`
  - TypeORM ActiveRecord: `Translation.findOne({ where: { token } })`
  - Вернуть `translation` или исходный `token`, если перевод не найден

### 6. Клиентская подписка и React-компонент
- [ ] Создать `imports/collections.ts` — Meteor-коллекция `CustomersCollection` с типом `CustomerRow`
- [ ] В `client/main.tsx` подписаться на публикацию + импортировать Bootstrap
- [ ] Создать `imports/ui/CustomersTable.tsx`:
  - Bootstrap-таблица: колонки ID, Full name, Position
  - Ячейка position: `<td className="__t">{row.position}</td>`
  - Использовать `useTracker` для реактивного получения данных

### 7. MutationObserver (client-side)
- [ ] Создать `client/observer.ts`
- [ ] После mount компонента запустить `MutationObserver` на контейнере таблицы:
  ```typescript
  observer.observe(container, { childList: true, subtree: true, characterData: true })
  ```
- [ ] В колбэке: найти изменённые `.__t`-элементы, вызвать `Meteor.call('translate', token, cb)`
- [ ] В callback: заменить `element.textContent` переводом
- [ ] Не допустить рекурсию (отключать observer на время записи или проверять атрибут `data-translated`)

### 8. TypeScript — финальная проверка
- [ ] Все типы явные — никаких `any`
- [ ] `tsc --noEmit` проходит без ошибок

---

## Зависимости между задачами

```
1 (init) ──→ 3 (entities) ──→ 4 (pub) ──→ 6 (client) ──→ 7 (observer)
2 (DB)   ──→ 3, 4, 5        → 5 (methods) ↗
```

## Итоговая структура проекта

```
/
├── client/
│   ├── main.tsx         # entrypoint: подписка, import bootstrap, mount App
│   └── observer.ts      # MutationObserver логика
├── server/
│   ├── main.ts          # entrypoint сервера
│   ├── db.ts            # инициализация TypeORM (параметры из process.env)
│   ├── publications.ts  # pub customers-with-positions (vlasky:mysql)
│   ├── methods.ts       # method translate
│   └── entities/
│       ├── Customer.ts
│       ├── Position.ts
│       └── Translation.ts
├── imports/
│   ├── collections.ts   # Meteor-коллекция CustomerRow
│   └── ui/
│       └── CustomersTable.tsx
├── docker/
│   └── mysql/
│       └── init.sql     # DDL + seed
├── docker-compose.yml
├── pnpm-workspace.yaml
├── tsconfig.json
└── package.json
```
