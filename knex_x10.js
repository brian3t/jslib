'use strict'
/**
 * Knex.js extension
 *
 */

/**
 * Save a text_row back into the db
 *
 * @param text_row
 * @param id_cols List of id cols used to identify row
 * @param knex Object
 */
async function kx_save_text_row(text_row, id_cols = ['id'], knex){
  let res, where_clause
  //Building a PATCH: put id cols into where clause, and remove it from the payload
  for await (const id_col of id_cols){
    where_clause[id_col] = id_cols[id_col]
    delete text_row[id_col]
  }

  return res
}
