declare module 'meteor/vlasky:mysql' {
  interface MysqlConnection {
    select(
      sql: string,
      triggers: Array<{ table: string }>
    ): Mongo.Cursor<Record<string, unknown>>;
  }

  const MySQL: {
    create(options: {
      host: string;
      port: number;
      user: string;
      password: string;
      database: string;
    }): MysqlConnection;
  };
}
