jQuery(document).ready(($) => {
  //1/ From an exec statement, rename parameters. `EXEC @sp @init_pick=@p1` becomes `EXEC @sp @init_pick=@init_pick`</h4>
  $('#task_1_btn').on('click', () => {
    let exec_sql = $('#sql').val()
    let parsed_sql = exec_sql.replace(/@([a-zA-Z_]+)=NULL,/g, '')
    /*
DECLARE @b varbinary(128)
SET @b = CONVERT(varbinary(128), CONVERT(varchar(128), '844ED17D-0C1A-4A11-A5A1-076907497AA8'))
SET CONTEXT_INFO @b
declare @p2 nvarchar(30)
set @p2 = N'CPOPKIT'
declare @p3 varchar(6)
set @p3 = '1'
declare @p23 int
declare @p24 nvarchar(500)
exec spumkitutil @init_pick_flag=1, @kitid=@p2 output, @kitver=@p3 output, @itemid=@p4 output, @uomid=@p5 output, @whseid=@p6 output, @qty=@p7 output, @lotno=@p8 output, @serno=@p9 output,
     @contid=@p10 output, @locid=@p11 output, @ref_code=@p12 output, @auto_rec_mf=NULL, @validate_kit=NULL, @void_flag=NULL, @hasopenpicks=@p16 output, @hasopenrecs=@p17 output, @pickrp=@p18 output,
     @recrp=@p19 output, @mfrp=@p20 output, @kitrp=@p21 output, @mfid=@p22 output, @retval=@p23 output, @message=@p24 output
select @p2,
       @p3,
     */
    //for each of the params @p1.. @pn, we find the param name, e.g. @init_pick_flag. If we can find it, replace @p1 with the meaningful name
    let index = 0, matched = false, regex = null
    while (index < 30){
      index++
      regex = new RegExp(/(@p) + index + /, 'g')
      matched = exec_sql.search(regex, )
    }

    $('#sql').text(parsed_sql)
    $('#sql').val(parsed_sql)
  })

  // 2/ parse
  $('#parse').on('click', () => {
    let fullsql = $('#sql').val()
    let parsedsql = fullsql.replace(/@([a-zA-Z_]+)=NULL,/g, '')
    $('#sql').text(parsedsql)
    $('#sql').val(parsedsql)
  })

  // 3/ declare
  $('#sql_btn').on('click', () => {
    let declaresql = $('#sql').val()
    //collect all variables
    const var_regex = /(@[a-z_]+)/gm;
    const vars = declaresql.match(var_regex);
    let parsedsql = `SELECT 'asdf', `
    let var_wo_atsign = ''
    vars.forEach(sql_var => {
      var_wo_atsign = sql_var.replace('@', '')
      parsedsql += `${sql_var} AS ${var_wo_atsign}, `
    })
    parsedsql = parsedsql.substring(0, parsedsql.length - 2)//remove trailing comma

    $('#sql').text(parsedsql)
    $('#sql').val(parsedsql)
  })

  // 4/
  // Beginning replace looks like this: REPLACE(@sql, '@var_1', @var_1)
  // Consecutive replace looks like this: REPLACE(REPLACE(@sql, '@var_1', @var_1), '@var_2', @var_2)
  //                                      REPLACE(REPLACE(REPLACE(@sql, '@var_1', @var_1), '@var_2', @var_2), '@var_3', @var_3)
  $('#gen_replace_btn').on('click', ()=>{
    let res = ''
    let sql_w_var = $('#sql').val()
    let sql_params = sql_w_var.match(/(@([a-zA-Z\_0-9]+))(?=[\),\s])/g) //param should be @init_picks, or @init_picks , or @init_picks)
    sql_params = [...new Set(sql_params)]
    console.info(`sql parms: `, sql_params)
    sql_params.forEach((p, i) => {
      let coalesce_val = p
      coalesce_val = 0
      if (i == 0) {
        if (p.includes('key')) res = `REPLACE(@sql_asdf, '${p}', COALESCE(${p},0))` //if the variable is like @pickkey, then fallback to 0
        else if (p.includes('rp')) res = `REPLACE(@sql_asdf, '${p}', COALESCE(${p},'''00000000-0000-0000-0000-000000000000'''))` //if the variable is like @pickkey, then fallback to 0
        else res = `REPLACE(@sql_asdf, '${p}', COALESCE(${p},'''${p}'''))` //if the variable is VARCHAR, fallback to a string, e.g. '@var_2' . Need ''' because SQL infer ''' as '
        return
      }

      //consecutive replaces:
      if (p.includes('key')) res = 'REPLACE(' + res + `, '${p}', COALESCE(${p},0))`
      else if (p.includes('rp')) res = `REPLACE(@sql_asdf, '${p}', COALESCE(${p},'''00000000-0000-0000-0000-000000000000'''))` //if the variable is like @pickkey, then fallback to 0
      else res = 'REPLACE(' + res + `, '${p}', COALESCE(${p},'''${p}'''))`

    })
    res = 'SET @sql_asdf = ' + res + `\nPRINT CONCAT('@sql_asdf: ', @sql_asdf)\n`
    console.log(`res: `, res)
    $('#sql').text(res)
    $('#sql').val(res)
  })

  // 4b/
  $('#sel_asdf_vars').on('click', ()=>{
    let sql_w_var = $('#sql').val()
    let asdf_stmt = "SELECT 'asdf vars:', "
    let variables = [...sql_w_var.matchAll(/@([a-zA-Z_]+)/g)]
    let temp_variables = []
    for (const variable of variables) {
      temp_variables.push(variable[0]) //only extract variable name
    }
    variables = temp_variables.filter(onlyUnique)
    for (const variable of variables){
      const varname_wo_atsign = variable.replace('@','')
      asdf_stmt += variable + " AS " + varname_wo_atsign + ","
    }
    $('#sql').text(asdf_stmt)
    $('#sql').val(asdf_stmt)

  })

  // 5/
  $('#sel_stmt_2_str').on('click', ()=>{
    let sql_w_var = $('#sql').val()
    let parsedsql = sql_w_var.replace(/@([a-zA-Z_]+)/g, "' + CAST(@$1 AS NVARCHAR(80)) + '")
    $('#sql').text(parsedsql)
    $('#sql').val(parsedsql)

  })
})
function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}

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
