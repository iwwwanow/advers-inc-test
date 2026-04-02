import { Meteor } from 'meteor/meteor';
import { initDb } from './db';
import './publications';
import './methods';

Meteor.startup(async () => {
  await initDb();
});
