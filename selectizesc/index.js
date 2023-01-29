jQuery(function (){
  // $.fn.selectize.defaults.set('debug', true)
  $('#selz_sel').selectize({debug: true})
  $('#submit_btn').on('click',(e)=>{
    let res = 'Submit btn clicked '
    let selz_val = $('#selz_sel').val()
    res += `selz_val: ${selz_val}, typeof_selz_val: ` + typeof(selz_val)
    $('#res').text(res)
  })
})
