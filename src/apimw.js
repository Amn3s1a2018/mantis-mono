import polka from 'polka'
import send from '@polka/send-type'
import env from 'dotenv'
// import bodyParser from 'body-parser'
import mysql from 'mysql'
// import cookieParser from 'cookie-parser'
const app=polka();
env.config()

app.my_id='456'

const db = mysql.createConnection ({
  host: process.env.DBSERVER,
  user: process.env.DBUSER,
  password: process.env.DBPASS,
  database: process.env.DBNAME,
  charset: 'utf8_general_ci'
});


const db_query = (q,p) => {
  return new Promise( (resolve,reject) => {
    db.query(q, p, (e,r) => {
      if (e) { reject(e) }
      resolve(r)
    })
  })
}

app.get('/e/bugs/:id', async (req,res) => {
  const { id } = req.params
  const { tp, uid } = req.query
  let oneid= id.search(/^[0-9]*$/)>-1;
  let query = `SELECT a.id, a.status, a.summary, p.name as project, from_unixtime(a.last_updated,'%Y-%m-%d %h:%i') as updated, c.name as category
    FROM mantis_bug_table a JOIN mantis_category_table c ON c.id=a.category_id
    JOIN mantis_project_table p ON p.id=a.project_id
    ${ tp == 'monitored' ? "JOIN mantis_bug_monitor_table m ON m.bug_id=a.id AND m.user_id= "+db.escape(uid) : ""}
    WHERE p.enabled=1
    ${ oneid ? "AND a.id="+id : id=='q' ? "" : "AND find_in_set(a.id, "+db.escape(id)+" )>0" }
    ${ tp == 'assigned' ? "AND a.handler_id = " +db.escape(uid)+" AND ( a.status in (10, 30, 40, 50) )" : "" }
    ${ tp == 'unassigned' ? "AND a.handler_id = 0 AND ( a.status in (10, 30, 40, 50) )" : "" }
    ${ tp == 'recent' ? "AND a.last_updated > (unix_timestamp(now())-60*60*24*30) " : "" }
    ORDER BY a.last_updated DESC, a.date_submitted DESC
    `
  db_query(query, null)
  .then(result => {
    send(res, 200, result)
  })
  .catch(err =>{
    console.log(err)
    res.redirect('/');
  })
})

app.get('/e/bug/:id/notes', async (req,res) => {
  const { id } = req.params
  const query = `SELECT a.id, b.note, a.time_tracking,
    u.username, u.enabled as user_enabled
    FROM mantis_bugnote_table a
    JOIN mantis_bugnote_text_table b ON b.id=a.bugnote_text_id
    JOIN mantis_user_table u ON u.id=a.reporter_id
    WHERE a.bug_id=${ db.escape(id) } ORDER BY a.id DESC `;
  db_query(query)
  .then( result => {
    send(res, 200, result)
  }).catch(err={
    if (err) {
      console.log(err)
      res.redirect('/')
      res.redirect('/')
    }
  })
})


export default app;
