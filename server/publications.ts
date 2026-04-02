import { Meteor } from 'meteor/meteor';
import { MySQL } from 'meteor/vlasky:mysql';

const db = MySQL.create({
  host: process.env.MYSQL_HOST ?? 'localhost',
  port: parseInt(process.env.MYSQL_PORT ?? '3306', 10),
  user: process.env.MYSQL_USER ?? 'root',
  password: process.env.MYSQL_PASSWORD ?? 'root',
  database: process.env.MYSQL_DATABASE ?? 'advers',
});

Meteor.publish('customers-with-positions', function () {
  return db.select(
    `SELECT
       c.id        AS _id,
       c.id        AS id,
       CONCAT(c.fname, ' ', c.lname) AS fullName,
       p.name      AS position
     FROM customers c
     JOIN positions p ON c.position_id = p.id`,
    [{ table: 'customers' }, { table: 'positions' }]
  );
});
