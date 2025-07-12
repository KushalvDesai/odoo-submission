'use client';

import React from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

// Simple health check query - this should work even without authentication
const HEALTH_CHECK = gql`
  query {
    __typename
  }
`;

const ConnectionTest = () => {
  const { data, loading, error } = useQuery(HEALTH_CHECK);

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-semibold mb-2">Backend Connection Status</h3>
      {loading && <p className="text-yellow-600">Testing connection...</p>}
      {error && (
        <div className="text-red-600">
          <p>❌ Connection failed</p>
          <p className="text-sm">{error.message}</p>
          <p className="text-sm mt-1">
            Make sure the backend is running on http://localhost:3000
          </p>
        </div>
      )}
      {data && !error && (
        <p className="text-green-600">✅ Backend connected successfully!</p>
      )}
    </div>
  );
};

export default ConnectionTest;
