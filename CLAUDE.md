# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Meteor.js + TypeScript + MySQL web application that displays an employee/client table with reactive pub/sub data binding, DOM mutation tracking, and server-side translation.

## Commands

```bash
# Install dependencies
meteor npm install

# Start development server
meteor run

# Run with specific settings
meteor run --settings settings.json
```

## Technology Stack

- **Framework:** Meteor.js
- **Language:** TypeScript (with concrete types — no `any`)
- **Database:** MySQL via `vlasky:mysql` package (https://packosphere.com/vlasky/mysql)
- **ORM:** TypeORM (ActiveRecord pattern)
- **UI:** Bootstrap

## Architecture

### Data Flow

```
MySQL (customers + positions tables)
  → Meteor server-side publication
  → Client reactive subscription
  → DOM table render (elements with class __t)
  → MutationObserver detects DOM changes
  → Meteor.call() to server for translation lookup
  → translations table query → DOM update
```

### Database Schema

**customers:** `id`, `fname`, `lname`, `position_id` (FK → positions)

**positions:** `id`, `name`

**translations:** `token`, `translation`

### Key Patterns

- **Pub/sub:** Server publishes customer+position data; client subscribes reactively
- **MutationObserver:** Watches elements with class `__t` for DOM changes, triggers translation lookups
- **Translation:** Elements with `__t` class have their text content replaced with translated values fetched via `Meteor.call`

## Project Specification

The full requirements spec is in `.claude/test.pdf` (written in Russian).
