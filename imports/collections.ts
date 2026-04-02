import { Mongo } from 'meteor/mongo';

export interface CustomerRow {
  _id: string;
  id: number;
  fullName: string;
  position: string;
}

export const CustomersCollection = new Mongo.Collection<CustomerRow>('customers-with-positions');
