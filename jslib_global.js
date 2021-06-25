exports.ax_get = ax_get
exports.sup_get = sup_get
exports.sleep = sleep
const AXIOS_CONF = {timeout: 3000}
const axios = require('axios')
const superagent = require('superagent')
const valid_url = require('valid-url')

function pluckRecursive(input, prop, collect){
  collect = collect || [];

  if (_.isArray(input)) {
    _.forEach(input, function (value, key){
      pluckRecursive(value, prop, collect);
    });
  } else if (_.isObject(input)) {
    _.forEach(input, function (value, key){
      if (key === prop) {
        collect.push(value);
      } else {
        pluckRecursive(value, prop, collect);
      }
    });
  }

  return collect;
}

/**
 * Return street addr and City / State ZIP Country
 * e.g. var full_address = '18101 Von Karman Ave, Irvine, CA 92612, USA'; full_address_to_addr_city(full_address) = 1801, CA 92
 * @param full_address e.g. 18101 Von Karman Ave, Irvine, CA 92612, USA
 * @return array [street city , state zip Country]
 */
function full_address_to_addr_city(full_address){
  var result = [];
  // var full_address = '18101 Von Karman Ave, Irvine, CA 92612, USA';
  var re = /, [A-Z]{2}\s\d+,/ig;
  var match = re.exec(full_address);
  if (typeof match !== 'object' || ! match.hasOwnProperty('index')) {
    return [full_address, ''];
  } else {
    return [full_address.slice(0, match.index), full_address.slice(match.index + 1)];
  }
}

/**
 * Returns non-empty string, e.g. not null, not ''
 * @param str
 * @returns {boolean}
 */
function is_nonempty_str(str){
  return (typeof str !== "undefined") &&
    (typeof str.valueOf() === "string") && (str.length > 0);
}


/**
 * Join array with glue string. Ignore null values and empty strings
 * @param array
 * @param glue default to ', '
 */
function join_ignore_null(array, glue){
  var res = '';
  if (typeof glue === 'undefined') {
    glue = ', ';
  }
  array.forEach(function (v, i){
    if (typeof v === 'undefined' || v === null || v === '' || v === false) {
      return;
    }
    if (res === '') {
      res = v;
    } else {
      res += glue + v;
    }
  });
  return res;
}

/**
 * Plain javascript isNumeric
 **/
function isNumeric(n){
  var parsed_string_match_original = false;
  var parsed = parseFloat(n);
  var parsed_string = parsed.toString();//100.5
  //check if parsed_string == n; //here n is 100.50 preg must discard trailing zero after dot
  var parsed_string_int_decimal = parsed_string.split('.');
  if (n === null) {
    return false;
  }
  var n_int_decimal = n.toString().split('.');
  if (parsed_string_int_decimal.length !== n_int_decimal.length) {
    return false;
  }
  if (n_int_decimal[0] !== parsed_string_int_decimal[0]) {
    return false;
  }
  if (parsed_string_int_decimal.length === 2) {
    //remove trailing zero from decimal
    var parsed_decimal = parsed_string_int_decimal[1].replace(/([1-9]+)0+/gi, '$1');
    var n_decimal = n_int_decimal[1].replace(/([1-9]+)0+/gi, '$1');
    if (n_decimal !== parsed_decimal) {
      return false;
    }
  }

  return ! isNaN(parsed) && isFinite(parsed);
}

/**
 * Convert jQuery's serializeArray() array into assoc array
 * Also merge input of the same name into array, e.g. union_memberships = Agent & union_memberships = Other
 * becomes union_memberships = [Agent, Other]
 * Also parse money value
 * @param arr
 * @returns assoc array, e.g. {'name': 'John', 'age': 22, 'array': ['a','b'] }
 */
function flat_array_to_assoc(arr){
  if (! _.isArray(arr)) {
    return {};
  }
  var result = {};
  arr.forEach(function (e){
    if (_.isObject(e)) {
      e = _.toArray(e);
      var key = e[0];
      if (e.length === 2) // ["first_name", "John"]
      {
        var val = e[1];
        if (typeof val == 'string') {
          val = val.replace('$', '');
        }
        if (isNumeric(val)) {
          val = Number(val.replace(/[^0-9\.]+/g, ""));
          val = parseFloat(val);
        }
        if (! _.has(result, key)) {
          result[key] = val;
        } else {
          if (_.isString(result[key])) {
            result[key] = new Array(result[key]);
          }
          result[key].push(val);
        }

      }
    }
  });
  return result;
}

/**
 * Split name into first name and last name
 * @param {string} Full name
 * @returns {array} First name, Last name
 */
function nameToFirstLast(name){
  name = name.trim().replace(/\s+/ig, ' ');//remove extra spaces
  var name_parts = name.split(' ');
  var first_name = name_parts.shift();
  return [first_name, name_parts.join(' ')];
}

/**
 * Backbone print options from a collection
 * @param collection_name e.g. venue
 * @param name_column e.g. name
 * @param id_column
 * @returns {string}
 */
function print_option_fr_collection(collection_name, name_column, id_column = 'id'){
  if (typeof name_column === "undefined" || ! name_column) {
    name_column = 'name';
  }
  var result = '<option value=""></option>';
  if (typeof (app.collections[collection_name]) === "undefined") {
    return result;
  }

  _.each(app.collections[collection_name].models, function (a_model){
    result += '<option value = "' + a_model.get(id_column) + '" >' + a_model.get(name_column) + '</option>';
  });
  return result;
}

String.prototype.ucwords = function (){
  return (this + '')
    .replace(/^(.)|\s+(.)|,+(.)/g, function ($1){
      return $1.toUpperCase();
    });
};


/**
 * Turns a date into human-readable format
 * @param date
 */
function readable_date(date){
  if (_.isEmpty(date)) {
    return '';
  }
  let date_obj = null;
  //if it's a time string only
  if (/^\d\d:\d\d(:\d\d)*$/.test(date)) {
    date_obj = moment(`1970-01-01 ${date}`);
  } else {
    date_obj = moment(date);
  }

  let optional_date_format = '';
  if (/\d{4}-\d{2}-\d{2}/.test(date)) {
    optional_date_format = 'ddd, MMM DD';
  }
  let optional_time_format = '';
  if (/.*\d\d:\d\d(:\d\d)*/.test(date)) {
    optional_time_format = 'h:mmA';
  }
  return date_obj.format([optional_date_format, optional_time_format].join(' '));
}

function sleep(sec){
  return new Promise(resolve => setTimeout(resolve, sec * 1000));
}

/**
 * Loop through an array, and execute callback_fn
 * Only return when all executions finish
 * This is a synchronous version of array forEach
 * @param array
 * @param callback_fn
 * @return {Promise<void>}
 */
async function processArray(array, callback_fn){
  // map array to promises
  const promises = array.map(callback_fn)
  // wait until all promises are resolved
  await Promise.all(promises)
  console.log('Looping done!');
}

/**
 * axios get
 * Need: valid-url package, axios package
 * @param url
 * @param conf
 * @param logging
 * @return {Promise<void>}
 */
async function ax_get(url, conf = AXIOS_CONF, logging = true){
  if (! valid_url.isUri(url)) return (new Promise((resolve, reject) => {
      console.warn(`ax_get Bad url: `, url)
      reject(false)
    }
  ))
  console.log(`ax_get Getting url `, url)
  return axios.get(url, conf)
}

/**
 * superagent get
 * Need: valid-url package, superagent package
 * @param url
 * @param conf
 * @param logging
 * @return {Promise<void>}
 */
async function sup_get(url, conf = AXIOS_CONF, logging = true){
  if (! valid_url.isUri(url)) return (new Promise((resolve, reject) => {
      console.warn(`ax_get Bad url: `, url)
      reject(false)
    }
  ))
  console.log(`sup_get Getting url `, url)
  return superagent.get(url, conf)
}
