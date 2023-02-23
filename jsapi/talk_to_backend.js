async function load_from_json_file(){
  if (! C.be) {
    swal(`Error: missing backend config`)
    return false
  }
  let {data: blocks_daynote, info} = await axios.get(`${C.be}fs`)
  try {
    blocks_daynote = JSON.parse(blocks_daynote)
  } catch (e) {
  }
  // noinspection PointlessBooleanExpressionJS
  if (! blocks_daynote || (false == blocks_daynote instanceof Object)) {
    swal('bad json response, not an object')
    return 'bad json'
  }
  let blocks_copy, daynote_copy
  ({blocks_copy, daynote_copy} = blocks_daynote)
  set_blocks(blocks_copy)
  set_day_note(daynote_copy)
}

/**
 * Save json to remote inp/blocks.json, if we have a `be` url in conf
 */
async function save_to_json_file(){
  // noinspection JSIgnoredPromiseFromCall
  if (! C.be) {
    // noinspection JSIgnoredPromiseFromCall
    swal('Error: missing backend config')
    return false
  }
  let blocks_copy = _.cloneDeep(blocks)
  let daynote_copy = _.cloneDeep(day_note)
  // const save_res = await fetch(C.be + 'fs', {method: 'POST', mode: 'no-cors', body: JSON.stringify(blocks_copy)})
  const {data: save_res, info} = await axios({
    method: 'POST',
    url: `${C.be}fs`,
    withCredentials: false,
    data: {blocks_copy, daynote_copy}
  });


  // const {data: save_res, info} = await axios(C.be + 'fs', {method: 'POST', body: JSON.stringify(blocks_copy), mode: 'no-cors'})
  console.table(save_res)
  // noinspection JSIgnoredPromiseFromCall
  swal('Success', 'Saved to json file' + JSON.stringify(save_res), 600)
}
