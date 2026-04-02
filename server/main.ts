import { Meteor } from 'meteor/meteor';
import { initDb } from './db';

Meteor.startup(async () => {
  await initDb();
});
