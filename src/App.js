import React, { useState } from 'react';
import Calendar from 'react-calendar';
import * as Utils from './Utils';
import * as Constants from './Constants';
import 'react-calendar/dist/Calendar.css';
import './App.scss';

const getLunarDate = (date) => {
  return Utils.convertSolar2Lunar(
    date.getDate(),
    date.getMonth() + 1,
    date.getFullYear(),
    7
  );
};

const getSolarLongitude = (date) => {
  const jd = Utils.jdAtVST(
    date.getDate(),
    date.getMonth() + 1,
    date.getFullYear(),
    date.getHours(),
    date.getMinutes()
  );

  const sl = Utils.solarLongitude(jd);

  return sl;
};

const getSolarTerm = (date) => {
  const sl = Math.floor(getSolarLongitude(date) / 15);

  return Constants.solarTerms[sl];
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
  const heavenlyStem = Constants.heavenlyStems[i];
  const earthlyBranch = Constants.earthlyBranches[j];

  return `${heavenlyStem[0]} ${earthlyBranch[0]} (${heavenlyStem[1]} ${earthlyBranch[1]})`;
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

  const showTime = (date) => {
    const jd = Utils.jdFromDate(
      date.getDate(),
      date.getMonth() + 1,
      date.getFullYear()
    );

    var hsDay = (jd + 9) % 10;

    var hsFirstHour = (hsDay % 5) * 2;

    const time = [
      {
        number: '00:00',
        hs: Constants.heavenlyStems[hsFirstHour],
        eb: Constants.earthlyBranches[0],
      },
    ];

    for (let i = 1; i <= 23; i = i + 2) {
      const number = i < 10 ? `0${i}:00` : `${i}:00`;
      const heavenlyStem =
        Constants.heavenlyStems[(++hsFirstHour % 10) - (i === 23 ? 2 : 0)];
      const earthlyBranch =
        Constants.earthlyBranches[(Math.floor(i / 2) + 1) % 12];

      time.push({
        number: number,
        hs: heavenlyStem,
        eb: earthlyBranch,
      });
    }

    return time;
  };

  return (
    <div
      className='app-container'
      style={{
        backgroundImage: `url('https://bing.com/th?id=OHR.LoftedMadagascar_EN-US9720623596_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp')`,
        backgroundSize: 'cover',
      }}
    >
      <div className='show-hour'>
        {showTime(selectedDate).map((time) => (
          <div>
            <div>{time.number}</div>
            <div>{`${time.hs[0]} ${time.eb[0]} (${time.hs[1]} ${time.eb[1]})`}</div>
          </div>
        ))}
      </div>
      <div className='show-day'>
        <div className='month-year'>{`Tháng ${
          selectedDate.getMonth() + 1
        } - ${selectedDate.getFullYear()}`}</div>
        <div className='date'>
          <div>{selectedDate.getDate()}</div>
          <div>{Constants.daysOfWeek[selectedDate.getDay()]}</div>
          <div>{getSolarTerm(selectedDate)}</div>
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
