jQuery(document).ready(($) => {
  $('#parse').on('click', () => {
    let fullsql = $('#fullsql').val()
    let parsedsql = fullsql.replace(/@([a-zA-Z_]+)=NULL,/g, '')
    $('#fullsql').text(parsedsql)
    $('#fullsql').val(parsedsql)
  })

  $('#declaresql_btn').on('click', () => {
    let declaresql = $('#declaresql').val()
    //collect all variables
    const var_regex = /(@[a-z_]+)/gm;
    const vars = declaresql.match(var_regex);
    let parsedsql = `SELECT 'asdf', `
    let var_wo_atsign = ''
    vars.forEach(sql_var => {
      var_wo_atsign = sql_var.replace('@', '')
      parsedsql += `${sql_var} AS ${var_wo_atsign}, `
    })
    parsedsql = parsedsql.substr(0, parsedsql.length - 2)//remove trailing comma

    $('#declaresql').text(parsedsql)
    $('#declaresql').val(parsedsql)
  })

  $('#sel_stmt_2_str').on('click', ()=>{
    let sql_w_var = $('#sql_w_var').val()
    let parsedsql = sql_w_var.replace(/@([a-zA-Z_]+)/g, "' + CAST(@$1 AS NVARCHAR(80)) + '")
    $('#sql_w_var').text(parsedsql)
    $('#sql_w_var').val(parsedsql)

  })
})

const paragraph = `DECLARE
    @userkey              int, @sesskey int, @company nvarchar(10), @whsekey int, @companykey int, @whseid nvarchar(30), @pickprofilekey int, @within_hours decimal(25, 13)
    , @org                nvarchar(10), @entkey int, @include_so int, @pickentkey int
    , @filter_cust        int, @filter_ref_code int, @filter_shipmeth int, @custentkey int, @shipmethentkey int
    , @gen_stage_seriesid nvarchar(30), @assign_userkey int, @require_pick_conf int
    , @pickwavekey        int, @so_overship_pct decimal(16, 8)
    , @stmp               nvarchar(30), @max_ord int, @max_lines int
    , @tmp                int, @ord_ship_complete int, @order_like nvarchar(50)
    , @rptgroupkey        int, @rptgroupid nvarchar(30), @utc_offset_min int, @pickroutekey int, @notes nvarchar(1000)`
const regex = /(@[a-z]+)/gm;
const found = paragraph.match(regex);

console.warn(found);
