Some useful JS / HTML / CSS stuff:

- Boostrap Checkbox - pure CSS
- Pluck recursive
- bslite.scss: Bootstrap Lite - useful css snippets for non-bootstrap frameworks such as ratchet / F7

Require:
- moment
- moment-timezone

### node-sass
node-sass $FileName$ ../$FileNameWithoutExtension$.css --source-map true

### knexjs sqlite3
Sometimes we want to enable debugging - to see what's sent to X3, what's their raw response. To achieve this, use knexjs with sqlite.
Knex will depend on:
- `./subdir/knexfile.js`
- `./subdir/migrations/migration_files_here.js`

To install:
- `npm i -g knex`
  This makes sure we can run knex command everywhere
- cd into `./subdir`, then run

`knex migrate:latest`

knex will read configs from `knexfile.js`, and spin up a sqlite3 db for us, which is a file located at `./proj.sqlite3`
