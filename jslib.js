const moment = require('moment-timezone');

// moment.tz.add('America/Los_Angeles|PST PDT|80 70|0101|1Lzm0 1zb0 Op0');

const Jslib = {
  /**
   * Format date and time into readable
   * @param date in utc tz
   * @param time in utc tz, format: HH:mm:ss
   * @param timezone such as 'PST', 'UTC'
   */
  fm_date_time(date, time, timezone = 'America/Los_Angeles'){
    let mdate
    if (! date) {
      mdate = moment('now')
    } else {
      mdate = moment(date)
    }
    const mtime = moment(time, 'HH:mm:ss')
    if (! mdate.isValid() || ! mtime.isValid()) return 'N/A'
    let m_datetime = moment.utc(`${date} ${time}`, 'YYYY-MM-DD HH:mm:ss')
    if (! m_datetime.isValid()) return 'N/A'
    m_datetime = m_datetime.tz(timezone)
    return m_datetime.format('ddd MMM D hh:mmA')
  },

  /**
   * Format time to simple format. e.g. 0630 becomes 630; 0800 becomes 8
   * @param time
   */
  fm_time_simple(time){
    if (! (time instanceof moment))
      time = moment(time, 'HHmm')
    if (! (time instanceof moment))
      return time
    const hour = parseInt(time.hour())
    let min = time.minute()
    if (min == 0) min = ''
    return `${hour}${min}`
  },

  sleep(sec){
    return new Promise(resolve => setTimeout(resolve, sec * 1000));
  }
}

export default Jslib
