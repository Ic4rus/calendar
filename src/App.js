import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import * as Utils from './Utils';
import 'react-calendar/dist/Calendar.css';
import './App.scss';

const daysOfWeek = [
  'Chủ Nhật',
  'Thứ Hai',
  'Thứ Ba',
  'Thứ Tư',
  'Thứ Năm',
  'Thứ Sáu',
  'Thứ Bảy',
];

const heavenlyStems = [
  'Giáp',
  'Ất',
  'Bính',
  'Đinh',
  'Mậu',
  'Kỷ',
  'Canh',
  'Tân',
  'Nhâm',
  'Quý',
];

const earthlyBranches = [
  'Tý',
  'Sửu',
  'Dần',
  'Mão',
  'Thìn',
  'Tỵ',
  'Ngọ',
  'Mùi',
  'Thân',
  'Dậu',
  'Tuất',
  'Hợi',
];

const getLunarDate = (date) => {
  return Utils.convertSolar2Lunar(
    date.getDate(),
    date.getMonth() + 1,
    date.getFullYear(),
    7
  );
};

const getSexagenaryCycleOfDay = (date) => {
  const jd = Utils.jdFromDate(
    date.getDate(),
    date.getMonth() + 1,
    date.getFullYear()
  );

  const i = (jd + 9) % 10;
  const j = (jd + 1) % 12;

  return getSexagenaryCycle(i, j);
};

const getSexagenaryCycleOfMonth = (lunarDate) => {
  const lunarMonth = lunarDate[1];
  const lunarYear = lunarDate[2];

  const i = (lunarYear * 12 + lunarMonth + 3) % 10;
  const j = (lunarMonth % 11) - Math.floor(lunarMonth / 11) + 1;

  return getSexagenaryCycle(i, j) + (lunarDate[3] === 0 ? '' : ' nhuận');
};

const getSexagenaryCycleOfYear = (lunarDate) => {
  const lunarYear = lunarDate[2];

  const i = (lunarYear + 6) % 10;
  const j = (lunarYear + 8) % 12;

  return getSexagenaryCycle(i, j);
};

const getSexagenaryCycle = (i, j) => {
  return heavenlyStems[i] + ' ' + earthlyBranches[j];
};

const App = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedLunarDate, setSelectedLunarDate] = useState(
    getLunarDate(selectedDate)
  );

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedLunarDate(getLunarDate(date));
  };

  const showLunarDate = (date, checkFirstDayOfMonth = false) => {
    const lunarDate = getLunarDate(date);

    var lunarDay = lunarDate[0];

    if (checkFirstDayOfMonth && lunarDay === 1) {
      lunarDay += '/' + lunarDate[1];
    }

    return <p>{lunarDay}</p>;
  };

  return (
    <div
      className='app-container'
      style={{
        backgroundImage: `url('https://bing.com/th?id=OHR.LoftedMadagascar_EN-US9720623596_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp')`,
      }}
    >
      <div className='show-day'>
        <div className='month-year'>{`Tháng ${
          selectedDate.getMonth() + 1
        } - ${selectedDate.getFullYear()}`}</div>
        <div className='date'>
          <div>{`${selectedDate.getDate()}`}</div>
          <div>{`${daysOfWeek[selectedDate.getDay()]}`}</div>
          <div>...</div>
        </div>
        <div className='lunar-date'>
          <div className='title'>
            <div>Ngày</div>
            <div>Tháng</div>
            <div>Năm</div>
          </div>
          <div className='value'>
            <div>
              <div>{selectedLunarDate[0]}</div>
              <div>{getSexagenaryCycleOfDay(selectedDate)}</div>
            </div>
            <div>
              <div>{selectedLunarDate[1]}</div>
              <div>{getSexagenaryCycleOfMonth(selectedLunarDate)}</div>
            </div>
            <div>
              <div>{selectedLunarDate[2]}</div>
              <div>{getSexagenaryCycleOfYear(selectedLunarDate)}</div>
            </div>
          </div>
        </div>
      </div>
      <Calendar
        className='show-month'
        tileContent={({ activeStartDate, date, view }) =>
          view === 'month' ? showLunarDate(date, true) : null
        }
        locale='vi-VN'
        value={selectedDate}
        onChange={handleDateChange}
      />
    </div>
  );
};

export default App;
