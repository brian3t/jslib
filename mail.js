const API_ROOT = '//usv/wapi/i.php'
const SUBJ = 'Contact Form from CraftBelly'

jQuery(document).ready(($) => {
  $('#mail_btn').on('click', async (btn) => {
    btn = btn.target
    $(btn).prop('disabled', true)
    console.log(`btn click`, btn)
    try {
      const now = (new Date()).toLocaleString()
      const content = $('#cont_inp').val()
      const to = $('#from_email').val()
      const to_name = $('#name_inp').val()
      let mail_res = $.get(API_ROOT, {act: 'mail', subj: `${SUBJ} ${now}`, to, to_name, cont: content})
      console.log(`Mail API response: `, mail_res)
    } catch (e) {
      console.error(`Error calling mail API `, e)
    }
    $(btn).prop('disabled', false)
  })
})
