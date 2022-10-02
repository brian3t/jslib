import $ from "jquery"
import _ from "lodash"
import ls from 'local-storage'

import moment from "moment"


/*


export function app_confirm(app, header = '', message = '', callback, title){
  let response = null;
  if (app.IS_LOCAL) {
    response = confirm(message);
    callback(response);
  } else {
    if (app.is_notification_active) {
      return true;
    }
    app.is_notification_active = true;
    present_ion_alert({
      header,
      message,
      buttons: [
        'Cancel',
        {
          text: 'Ok', handler: (d) => {
            console.log(`ok clicked`);
            return true
          }
        },
      ],
      onDidDismiss: (e) => {
        console.log('did dismiss. maybe cancel clicked');
        return false
      },
    })
  }
}
*/

/**
 * @constructor
 * @return bool
 */
export function app_alert(app, message, alertCallback = null, title = 'Alert', buttonName = 'OK'){
  if (app.IS_LOCAL) {
    alert(message);
    if (_.isFunction(alertCallback)) {
      alertCallback();
    }
  } else {
    // navigator.notification.alert(message, alertCallback, title, buttonName);
  }
}

/**
 * Dismiss existing toast. Wait for dismiss to finish (300 ms?). Then spawn new toast
 * @param app
 * @param msg
 * @param duration
 * @param timeout
 */
export function app_toast(app, msg, duration = 4000, timeout = 0){
  app.dismiss_toast()
  setTimeout(() => {
    app.present_toast({
      buttons: [{text: 'hide', handler: () => app.dismiss_toast()}],
      duration,
      message: msg,
      position: 'middle',
      // onDidDismiss: () => console.log('toast dismissed'),
      // onWillDismiss: () => console.log('toast will dismiss'),
    })
  }, 300 + timeout)
}

/**
 * Format date and time into readable
 * @param date in utc tz
 * @param time in utc tz, format: HH:mm:ss
 * @param timezone such as 'PST', 'UTC'
 */
export function fm_date_time(date, time, timezone = 'America/Los_Angeles'){
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
}


/**
 * Format time to simple format. e.g. 0630 becomes 630; 0800 becomes 8
 * @param time
 */
export function fm_time_simple(time){
  if (! (time instanceof moment))
    time = moment(time, 'HHmm')
  if (! (time instanceof moment))
    return time
  const hour = parseInt(time.hour())
  let min = time.minute()
  if (min == 0) min = ''
  return `${hour}${min}`
}

/**
 * @param time
 * @returns moment
 */
export function military_time_to_moment(time){
  if (typeof time !== 'string') {
    return false;
  }
  time = time.trim();
  return moment(time, 'hhmma');
}

/**
 * Returns non-empty string, e.g. not null, not ''
 * @param str
 * @returns {boolean}
 */
export function is_nonempty_str(str){
  return (typeof str !== "undefined") && (str !== null) &&
    (typeof str.valueOf() === "string") && (str.length > 0);
}

export function app_confirm(app, message, header = 'Please confirm', callback){
  const alert_e = document.createElement('ion-alert');
  alert_e.header = '[[header]]';
  alert_e.message = '[[message]]'
  alert_e.buttons = [
    {
      text: 'Cancel',
      role: 'cancel',
      cssClass: 'secondary',
      id: 'cancel-button',
      handler: () => {
        console.log('Confirm Cancelled');
      }
    }, {
      text: 'OK',
      id: 'confirm-button',
      handler: () => {
        console.log('Confirm Okay')
      }
    }
  ];

  document.body.appendChild(alert_e);
  alert_e.present();
}


export function format_phone_num(phone_num){
  if (! (typeof phone_num !== 'undefined' && phone_num !== '--' && phone_num !== '')) {
    return false;
  }
  return phone_num.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');

}

export function goto_back(app, history){
  if ($('ion-modal[is-open="true"]').length > 0) return false //if modal is present, refuse navigation
  history.push('/')
  const ls = window.localStorage
  // $('ion-tab-bar').hide()
  $('ion-toolbar').addClass('hidden')
  let remember = ls.getItem('remember')
  remember = (remember != '')
  app.initialize(remember)
}

export function goto_dash(app, history){
  if ($('ion-modal[is-open="true"]').length > 0) return false //if modal is present, refuse navigation
  history.push('/dash')
  const ls = window.localStorage
  $('ion-tab-bar').show()
  $('ion-toolbar').removeClass('hidden')
}

export function goto_home(app, history){
  if ($('ion-modal[is-open="true"]').length > 0) return false //if modal is present, refuse navigation
  history.push('/')
  const ls = window.localStorage
  $('ion-tab-bar').hide()
  $('ion-toolbar').addClass('hidden')
  let remember = ls.getItem('remember')
  remember = (remember != '')
  app.initialize(remember)
}

export function hide_loading(){
  console.log(`todo`)
}

export function isdef(var_name){
  return (typeof window[var_name] != "undefined");
}

export function logout(app){
  const ls = window.localStorage
  ls.setItem('justLoggedIn', 0);
  ls.setItem('commuter_data', '');
  ls.setItem('user', '');
  ls.setItem('username', '')
  ls.setItem('password', '')
  ls.setItem('hashedPassword', '')
  app.user.reset();
  app.user = {}
  $('#start_address').val('').text('');
  $('#end_address').val('').text('');
  if (navigator && navigator.geolocation && navigator.geolocation.getCurrentPosition) navigator.geolocation.getCurrentPosition(app.geolocation.onSuccess, app.geolocation.onError, window.GEOLOCATION_OPTIONS);
}

/*print a LatLng object*/
export function p(latlng){
  if (typeof latlng !== 'object' || ! (latlng instanceof google.maps.LatLng)) {
    console.log(`latlng not a LatLng object`)
    return false
  }
  console.log(`Lat: `, latlng.lat(), `; Lng: `, latlng.lng())
  return true
}

export function Reachability(){
  this.IsNotConnected = function (){
    return false
  };
}

export function show_loading(){
  console.log(`todo show loading`)
}

/**
 * show a toast msg
 * @param msg
 * @param duration
 */
export function show_loading_toast(msg, duration = 1){
  console.log(`todo show loading`)
}

export function showAlert(){
  this.alertController.create({
    header: 'Alert',
    subHeader: 'Subtitle for alert',
    message: 'This is an alert message.',
    buttons: ['OK']
  }).then(res => {

    res.present();

  });

}

export function sleep(sec){
  return new Promise(resolve => setTimeout(resolve, sec * 1000));
}

export async function swal(title, msg, duration){
  return Swal.fire({
    title: title,
    html: msg,
    timer: duration,
    didOpen: () => {
      Swal.showLoading()
    },
    willClose: () => {
    }
  })
}

export function title_case(str){
  return str.replace(/\w+/g, _.capitalize)
}


// reset input when pressing esc



