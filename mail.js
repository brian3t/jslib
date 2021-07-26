const API_ROOT = '//usv/wapi/i.php'

jQuery(document).ready(($) => {
  $('#mail_btn').on('click', async (btn) => {
    btn = btn.target
    $(btn).prop('disabled', true)
    console.log(`btn click`, btn)
    try {
      let mail_res = $.get(API_ROOT, {to: 'to'})
      console.log(`Mail API response: `, mail_res)
    } catch (e) {
      console.error(`Error calling mail API `, e)
    }
  })
})
