import React from 'react';
import './spinner.css';

const spinner = (props) => {
  return (<div className={`loader ${props ? 'white' : ''}`}>Loading...</div>);
};

export default spinner;
