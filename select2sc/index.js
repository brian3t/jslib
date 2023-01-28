jQuery(function (){
  $.fn.select2.defaults.set('debug', true)
  $('#sel2_sel').select2({debug: true})
  $('#submit_btn').on('click',(e)=>{
    let res = 'Submit btn clicked '
    let sel2_val = $('#sel2_sel').val()
    res += `sel2_val: ${sel2_val}, typeof_sel2_val: ` + typeof(sel2_val)
    $('#res').text(res)
  })
})
