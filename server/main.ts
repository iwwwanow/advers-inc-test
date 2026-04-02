import { Meteor } from 'meteor/meteor';
import { initDb } from './db';
import './publications';

Meteor.startup(async () => {
  await initDb();
});
