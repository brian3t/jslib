/**
 * Library with utils such as creating a modal
 * 9/7/23 Created
 * Most utils depend on jQuery
 */

/**
 * Create a modal
 * @param framework default Bootstrap5 for now
 */
function cr_modal(framework = 'bs') {
  const modal_id = Math.floor(Math.random() * 65535);
  let modal_tmpl = $('<div></div>')
  modal_tmpl.html = `
<div id="${modal_id}" class="modal fade" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="modalLabel">Modal title</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              ...
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div></div>`
  // let modal_inst = new bootstrap.Modal(modal_tmpl[0], {})
  $('body').append(modal_tmpl.html)
  $(`#${modal_id}`).modal('show')
}
