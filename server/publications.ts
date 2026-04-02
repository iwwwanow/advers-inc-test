import { Meteor } from 'meteor/meteor';
import { LiveMysql, LiveMysqlKeySelector } from 'meteor/vlasky:mysql';

const db = new LiveMysql({
  host: process.env.MYSQL_HOST ?? 'localhost',
  port: parseInt(process.env.MYSQL_PORT ?? '3306', 10),
  user: process.env.MYSQL_USER ?? 'root',
  password: process.env.MYSQL_PASSWORD ?? 'root',
  database: process.env.MYSQL_DATABASE ?? 'advers',
  charset: 'utf8mb4',
  serverId: 1,
});

Meteor.publish('customers-with-positions', function () {
  return db.select(
    `SELECT
       CAST(c.id AS CHAR) AS _id,
       c.id               AS id,
       CONCAT(c.fname, ' ', c.lname) AS fullName,
       p.name             AS position
     FROM customers c
     JOIN positions p ON c.position_id = p.id`,
    null,
    LiveMysqlKeySelector.Columns(['_id']),
    [{ table: 'customers' }, { table: 'positions' }]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) as unknown as any;
});
