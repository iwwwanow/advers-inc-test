import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Meteor } from 'meteor/meteor';
import { CustomersTable } from '/imports/ui/CustomersTable';

Meteor.startup(() => {
  Meteor.subscribe('customers-with-positions');

  const container = document.getElementById('react-target');
  const root = createRoot(container!);
  root.render(
    <div className="container mt-4">
      <h1 className="mb-4">Customers</h1>
      <CustomersTable />
    </div>
  );
});
