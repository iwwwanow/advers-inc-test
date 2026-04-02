import { Meteor } from 'meteor/meteor';
import { Translation } from './entities/Translation';

Meteor.methods({
  async translate(token: string): Promise<string> {
    const row = await Translation.findOne({ where: { token } });
    return row?.translation ?? token;
  },
});
