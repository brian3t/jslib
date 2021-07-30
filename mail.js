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
      let mail_res = await $.get(API_ROOT, {act: 'mail', subj: `${SUBJ} ${now}`, to, to_name, cont: content})
      console.log(`Mail API response: `, mail_res)
      if (!mail_res) {
        console.error(`Error calling mail API `, e)
        toastr.error(`Error sending email`)
        return
      }
      if (mail_res.stat && mail_res.stat === 1){
        toastr.success(mail_res.msg)
      }
    } catch (e) {
      console.error(`Error calling mail API `, e)
      toastr.error(`Error sending email`)
    }
    // $(btn).prop('disabled', false)
  })
})
