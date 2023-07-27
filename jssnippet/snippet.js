//01 Scroll to bottom smooth
window.scrollTo({
  top: document.body.scrollHeight,
  left: 0,
  behavior: 'smooth'
})

//02 Using <template>
let item_info_tmpl = $('#template_id').clone()
let item_info_content = $(item_info_tmpl.prop('content'))
$('#wrapper').append(item_info_tmpl.prop('content'))
