import React from 'react';
import { Link } from 'react-router-dom';

export default function NoMatch() {
  return (
    <div>
      <h3>No Match</h3>
      <Link to='/'>Go to Main Page</Link>
    </div>
  )
}
