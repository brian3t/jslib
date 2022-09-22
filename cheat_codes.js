/**
 * Cheatcode
 * REQUIRED: swal (sweetalert2)
 * @type {string}
 */

const CHEAT = "mbmb";
let kb_input = "";
document.body.addEventListener('keypress',function(ev){
    kb_input += String.fromCharCode(ev.keyCode);
    console.log(`Keyboard entered: `, kb_input)
    if(kb_input == CHEAT){
      const ls_user = ls('user')
        swal('User info', JSON.stringify({
          commute_type: ls_user.commute_type,
          username: ls_user?.obj.username,
          password: ls_user?.obj.password,
          idCommuter: ls_user?.obj?.commuter_data.idCommuter,
        }).replaceAll('"',''))
        kb_input = "";
    }
});

// reset input when pressing esc
document.body.addEventListener('keyup',function(ev){
    if(ev.keyCode == 27) kb_input = "";
});
