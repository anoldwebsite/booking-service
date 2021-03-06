import React, { Component } from 'react';
import '../css/calendar.css';
import moment from 'moment';

class Week extends Component {
  constructor(props) {
    super(props);

    this.isBetween = this.isBetween.bind(this);
    this.isUnavailable = this.isUnavailable.bind(this);
  }

  isBetween(date) {
    const checkInArray = this.props.checkIn.split('-');
    const checkOutArray = this.props.checkOut.split('-');
    const dateArray = date.split('-');

    // A date is in-between two dates if it is >= the check-in date and <= the check-out date
    // the count variable increments when one of these conditions is met, if the count variable reaches 2 then the date is in-between
    // e.gg this.isBetween(10-24-2019) this.state.checkIn = 10-15-2019 this.state.checkOut = 10-30-2019 [10,24,2019]
    const checkIn = new Date(checkInArray[2], checkInArray[0] - 1, checkInArray[1]);
    const checkOut = new Date(checkOutArray[2], checkOutArray[0] - 1, checkOutArray[1]);
    let between;

    // fix only works for one year, but I assume nobody will book a house for more than a year so...
    if (dateArray[0] - 1 < 12) {
      between = new Date(dateArray[2], dateArray[0] - 1, dateArray[1]);
    } else {
      between = new Date(dateArray[2], dateArray[0] - 13, dateArray[1]);
    }

    if (checkIn <= between && checkOut >= between) {
      return true;
    }

    return false;
  }

  isUnavailable(date) {
    const dateArray = date.split('-');
    let newDate;

    if (dateArray[0] <= 12) {
      newDate = date;
    } else {
      newDate = `${dateArray[0] - 12}-${dateArray[1]}-${dateArray[2]}`;
    }

    for (let i = 0; i < this.props.unavailableDates.length; i++) {
      if (newDate === this.props.unavailableDates[i]) {
        return true;
      }

      continue;
    }
    return false;
  }

  render() {
    const renderDate = (date, i) => {
      if (this.isUnavailable(`${moment().month() + 1 + this.props.incrementMonth}-${date}-${moment().month(moment().month() + this.props.incrementMonth).format('YYYY')}`)) {
        return <td key={i} className="calendar-text-grey">{date}</td>;
      }
      if (date !== '' && this.isBetween(`${moment().month() + 1 + this.props.incrementMonth}-${date}-${moment().month(moment().month() + this.props.incrementMonth).format('YYYY')}`)) {
        return <td onClick={() => { this.props.getDate(date, moment().month() + 1 + this.props.incrementMonth, moment().month(moment().month() + this.props.incrementMonth).format('YYYY'), this.props.calType); }} key={i} className="calendar-text-red">{date}</td>;
      }
      if (moment().date() > date && this.props.incrementMonth === 0) {
        return <td key={i} className="calendar-text-grey">{date}</td>;
      }
      if (moment().date() < date && this.props.incrementMonth === 0) {
        return <td onClick={() => { this.props.getDate(date, moment().month() + 1 + this.props.incrementMonth, moment().month(moment().month() + this.props.incrementMonth).format('YYYY'), this.props.calType); }} key={i} className="calendar-text">{date}</td>;
      }
      if (this.props.incrementMonth < 0) {
        return <td key={i} className="calendar-text-grey">{date}</td>;
      }
      if (date === '') {
        return <td key={i} className="calendar-text">{date}</td>;
      }

      return <td onClick={() => { this.props.getDate(date, moment().month() + 1 + this.props.incrementMonth, moment().month(moment().month() + this.props.incrementMonth).format('YYYY'), this.props.calType); }} key={i} className="calendar-text">{date}</td>;
    };

    return (
      <tr>
        {this.props.dates.map((date, i) => renderDate(date, i))}
      </tr>
    );
  }
}

export default Week;
