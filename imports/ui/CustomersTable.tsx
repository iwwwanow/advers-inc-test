import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { CustomersCollection, CustomerRow } from '../collections';

export const CustomersTable: React.FC = () => {
  const customers = useTracker<CustomerRow[]>(() =>
    CustomersCollection.find({}, { sort: { id: 1 } }).fetch()
  );

  return (
    <table className="table table-bordered table-striped">
      <thead className="table-dark">
        <tr>
          <th>ID</th>
          <th>Full name</th>
          <th>Position</th>
        </tr>
      </thead>
      <tbody>
        {customers.map((row) => (
          <tr key={row._id}>
            <td>{row.id}</td>
            <td>{row.fullName}</td>
            <td className="__t">{row.position}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
