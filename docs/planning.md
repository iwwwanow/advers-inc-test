# План реализации: advers-inc-test

## Стек
- Meteor.js + TypeScript
- MySQL (пакет `vlasky:mysql` для реактивной подписки, `typeorm` в режиме ActiveRecord для чтения)
- Bootstrap (стандартная тема)

---

## Задачи (приоритет сверху вниз)

### 1. Инициализация проекта
- [ ] Создать Meteor-приложение: `meteor create . --typescript`
- [ ] Удалить стандартные шаблоны (counter, etc.), оставить скелет
- [ ] Добавить пакеты Meteor: `meteor add vlasky:mysql`
- [ ] Установить npm-зависимости: `meteor npm install typeorm reflect-metadata`
- [ ] Подключить Bootstrap: `meteor npm install bootstrap` + импорт в клиентском entrypoint

### 2. База данных MySQL
- [ ] Создать таблицы:
  ```sql
  CREATE TABLE positions (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL
  );

  CREATE TABLE customers (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    fname VARCHAR(255) NOT NULL,
    lname VARCHAR(255) NOT NULL,
    position_id INT UNSIGNED NOT NULL,
    FOREIGN KEY (position_id) REFERENCES positions(id)
  );

  CREATE TABLE translations (
    token VARCHAR(255) PRIMARY KEY,
    translation VARCHAR(255) NOT NULL
  );
  ```
- [ ] Заполнить тестовыми данными (Dino Fabrello / officer, Walter Marangoni / manager, Angelo Ottogialli / operator)
- [ ] Заполнить таблицу translations (officer→перевод, manager→перевод, operator→перевод)

### 3. TypeORM-сущности (server-side)
- [ ] Настроить подключение TypeORM к MySQL в `server/db.ts`
- [ ] Создать entity `Position` (`server/entities/Position.ts`) — поля: `id`, `name`
- [ ] Создать entity `Customer` (`server/entities/Customer.ts`) — поля: `id`, `fname`, `lname`, `positionId`, relation → Position
- [ ] Создать entity `Translation` (`server/entities/Translation.ts`) — поля: `token`, `translation`
- [ ] Включить `experimentalDecorators` и `emitDecoratorMetadata` в `tsconfig.json`

### 4. Meteor-публикация (server-side)
- [ ] Создать `server/publications.ts`
- [ ] Реализовать публикацию `customers-with-positions` через `vlasky:mysql`:
  - SQL-запрос с JOIN customers + positions
  - Возвращать данные в реактивном режиме (LiveQuery)
- [ ] Типизировать возвращаемые документы: интерфейс `CustomerRow { _id: string; id: number; fullName: string; position: string }`

### 5. Meteor-метод для перевода (server-side)
- [ ] Создать `server/methods.ts`
- [ ] Реализовать метод `translate`:
  ```typescript
  'translate'(token: string): string
  ```
  - Использовать TypeORM ActiveRecord: `Translation.findOne({ where: { token } })`
  - Вернуть `translation` или исходный `token`, если перевод не найден

### 6. Клиентская подписка и реактивный шаблон
- [ ] Создать Meteor-коллекцию на клиенте: `CustomersCollection` с типом `CustomerRow`
- [ ] Подписаться на публикацию в `client/main.ts`
- [ ] Создать Blaze-шаблон `client/main.html`:
  - Bootstrap-таблица: колонки ID, Full name, Position
  - Ячейка position: `<td class="__t">{{position}}</td>`
- [ ] Реализовать хелпер шаблона, возвращающий реактивный список из коллекции

### 7. MutationObserver (client-side)
- [ ] Создать `client/observer.ts`
- [ ] После рендера шаблона запустить `MutationObserver` на контейнере таблицы:
  ```typescript
  const observer = new MutationObserver((mutations: MutationRecord[]) => { ... })
  observer.observe(tableContainer, { childList: true, subtree: true, characterData: true })
  ```
- [ ] В колбэке: для каждой мутации найти затронутые элементы с классом `__t`
- [ ] Для каждого такого элемента вызвать `Meteor.call('translate', token, callback)`
- [ ] В колбэке callback: заменить `element.textContent` переводом
- [ ] Не допустить рекурсию (отключать observer на время записи перевода или проверять, что текст уже переведён)

### 8. TypeScript-конфигурация
- [ ] Убедиться, что `tsconfig.json` содержит:
  ```json
  {
    "compilerOptions": {
      "experimentalDecorators": true,
      "emitDecoratorMetadata": true,
      "strict": true
    }
  }
  ```
- [ ] Все типы явные — никаких `any`

---

## Зависимости между задачами

```
1 (init) → 3 (entities) → 4 (pub) → 6 (client)
         → 5 (methods)  → 7 (observer)
2 (DB)   → 4, 5
```

## Итоговая структура проекта

```
/
├── client/
│   ├── main.ts          # entrypoint, подписка, import bootstrap
│   ├── main.html        # Blaze-шаблон с Bootstrap-таблицей
│   └── observer.ts      # MutationObserver логика
├── server/
│   ├── main.ts          # entrypoint сервера
│   ├── db.ts            # инициализация TypeORM
│   ├── publications.ts  # pub customers-with-positions
│   ├── methods.ts       # method translate
│   └── entities/
│       ├── Customer.ts
│       ├── Position.ts
│       └── Translation.ts
├── imports/
│   └── collections.ts   # Meteor-коллекция с типом CustomerRow
├── public/
├── tsconfig.json
└── package.json
```
