import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './App.scss';

var today = new Date();
var lastWeek = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate() - 7
);

const App = () => {
  const [value, onChange] = useState(new Date());
  return (
    <div className='app-container'>
      <div className='show-day'>123</div>
      <Calendar
        className='show-month'
        tileContent={({ activeStartDate, date, view }) =>
          view === 'month' ? <p>1</p> : null
        }
        locale='vi-VN'
        onChange={onChange}
        value={value}
      />
    </div>
  );
};

export default App;
