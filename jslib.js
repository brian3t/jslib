import moment from '../../node_modules/moment/moment'

var Jslib = {
  /**
   * Format date and time into readable
   * @param date in utc tz
   * @param time in utc tz
   * @param timezone such as 'PST', 'UTC'
   */
  fm_date_time(date, time, timezone = 'PST'){
    date = moment(date)
    time = moment(time)
    if (!date.isValid() || !time.isValid()) return 'N/A'
  }
}

export default Jslib
