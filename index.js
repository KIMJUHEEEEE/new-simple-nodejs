const express    = require('express');
const mysql      = require('mysql');
const dbconfig   = require('./config/database.js');
const connection = mysql.createConnection(dbconfig);
const bodyParser = require('body-parser');

const app = express();

app.set('port', process.env.PORT || 8000);
app.use(bodyParser.json());

app.use(express.urlencoded({extended : false}));

app.get('/', (req, res) => {
    var ip = req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
            (req.connection.socket ? req.connection.socket.remoteAddress : null);
    console.log(ip);
    res.send('Hello, World! : ' + ip + "," + new Date());
});



app.get('/clubs', (req, res) => {
    connection.query('SELECT * from TravelClub', (error, rows) => {
        if (error) throw error;
        console.log('Travel info is: ', rows);
        res.send(rows);
    });
});



app.get('/all_club', (req, res) => {
    connection.query('SELECT * from TravelClub', (error, rows) => {
      if (error) throw error;
      console.log('Travel info is: ', rows);
      res.send(rows);
    });
});




app.post('/insert_userInfo/', (req, res) => {
    var id_ = req.body.id_;
    var password_ = req.body.password_;
    var name = req.body.name;
    var gender = req.body.gender;
    var contact = req.body.contact;
    var area = req.body.area;
  
    connection.query("INSERT INTO CommunityMember (id_,password_,name,gender,contact,area) VALUES(?,?,?,?,?,?)",
                  [id_,password_,name,gender,contact,area], (error, resutls, fields) => {
      if (error) throw error; });        

    let sql = "UPDATE CommunityMember SET membership = JSON_ARRAY() WHERE id_='"+req.body.id_+"'";
    let query = connection.query(sql, (err, results) => {
        if(err) throw err;  
          res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
        });
});   




app.get('/select_all', (req, res) => {
  connection.query('SELECT * from CommunityMember', (error, rows) => {
    if (error) throw error;
    console.log('User info is: ', rows);
    res.send(rows);
  });
});




app.get('/login/:id_', (req, res) => {
  var sql = 'SELECT * FROM CommunityMember WHERE id_=' + req.params.id_;
  
  connection.query(sql, (error, rows) => {
    if (error) throw error;
    console.log('User detail info is: ', rows);
    res.send(rows);
  });
});


app.get('/get_ownership/:id_', (req, res) => {
  var sql = 'SELECT leader FROM CommunityMember WHERE id_=' + req.params.id_;
  
  connection.query(sql, (error, rows) => {
    if (error) throw error;
    console.log('User detail info is: ', rows);
    res.send(rows);
  });
});


app.get('/get_id/:id_', (req, res) => {
  var sql = 'SELECT * FROM CommunityMember WHERE id_=' + req.params.id_;
  
  connection.query(sql, (error, rows) => {
    if (error) throw error;
    console.log('User detail info is: ', rows);
    res.send(rows);
  });
});


app.get('/get_userName/:id_', (req, res) => {
  var sql = 'SELECT name FROM CommunityMember WHERE id_=' + req.params.id_;
  
  connection.query(sql, (error, rows) => {
    if (error) throw error;
    console.log('User detail info is: ', rows);
    res.send(rows);
  });
});


app.get('/get_clubName/:id_', (req, res) => {
  var sql = 'SELECT leader FROM CommunityMember WHERE id_=' + req.params.id_;
  
  connection.query(sql, (error, rows) => {
    if (error) throw error;
    console.log('User detail info is: ', rows);
    res.send(rows);
  });
});


app.get('/get_Areas/:area_', (req, res) => {
  var sql = 'SELECT * FROM TravelClub WHERE area=' + req.params.area_;
  
  connection.query(sql, (error, rows) => {
    if (error) throw error;
    console.log('The club detail info is: ', rows);
    res.send(rows);
  });
});


app.get('/get_clubs/:clubName_', (req, res) => {
  var sql = "SELECT * FROM TravelClub WHERE clubName LIKE '%"+req.params.clubName_+"%'";
  
  connection.query(sql, (error, rows) => {
    if (error) throw error;
    console.log('The club detail info is: ', rows);
    res.send(rows);
  });
});


app.get('/get_Content/:id_', (req, res) => {
  var sql = "SELECT content FROM TravelClub WHERE owner="+ req.params.id_;
  
  connection.query(sql, (error, rows) => {
    if (error) throw error;
    console.log('The club detail info is: ', rows);
    res.send(rows);
  });
});

app.post('/add_user/:id_', (req, res) => {
    let data = {id_: req.body.id_, password_: req.body.password_};
    let sql = "INSERT INTO CommunityMember SET ?";
    let query = connection.query(sql, data,(err, rows) => {
      if(err) throw err;
        res.send(rows);
     res.json({ok:"true"});
  });
  });  


app.get('/remove_member/:clubName',(req,res) =>{
  var sql = "SELECT owner FROM TravelClub WHERE clubName="+"'"+req.params.clubName+"'";
  connection.query(sql,(error,rows)=>{
  if(error)throw error;
console.log(rows);
res.send(rows);
});
});

app.get('/remove_member/get_membership/:id_',(req,res)=>{
var sql = ("SELECT `membership` FROM CommunityMember WHERE id_="+"'"+req.params.id_+"'");
connection.query(sql,(error,rows)=>{
if(error) throw error;
console.log(rows);
res.send(rows);
});
});

app.put('/remove_member/put_membership/:id_',(req,res)=>{
var membership = req.body.membership;
console.log(req.body.membership);
connection.query('UPDATE CommunityMember SET membership=? WHERE id_='+"'"+req.params.id_+"'",[membership],(error,resutls,fields,rows)=>{
if(error) throw error;

res.json({ok:"true"});
res.send(rows);

});
});

app.put('/remove_member/put_members/:clubName',(req,res)=>{
var members = req.body.members;
console.log(members);
connection.query('UPDATE TravelClub SET members=? WHERE clubName='+"'"+req.params.clubName+"'",[members],(error,resutls,fields,rows)=>{
if(error) throw error;

res.json({ok:"true"});
res.send(rows);
});
});

app.put('/join_club/put_members/:clubName',(req,res)=>{
    var members = req.body.members;
    connection.query('UPDATE TravelClub SET members=? WHERE clubName='+"'"+req.params.clubName+"'",[members],(error,resutls,fields)=>{
    if(error) throw error;
    res.json({ok:"true"});
    });
    });

app.get('/get_clubMember/:clubName',(req,res)=>{
    var sql = ("SELECT `members` FROM TravelClub WHERE clubName ="+"'"+req.params.clubName+"'");
    connection.query(sql,(error,rows)=>{
    if (error) throw error;
    console.log(rows);
    res.send(rows);
    });
});


app.get('/join_club/:clubName',(req,res)=>{
    var sql = "SELECT members FROM TravelClub WHERE clubName ="+req.params.clubName;
    connection.query(sql,(error,rows)=>{
    if (error) throw error;
    console.log(rows);
    res.send(rows);
    });
});

app.put('/join_club/put_membership/:id_',(req,res)=>{
    var membership = req.body.membership;
   
    connection.query('UPDATE CommunityMember SET membership=? WHERE id_='+"'"+req.params.id_+"'",[membership],(error,resutls,fields)=>{if(error) throw error;
    res.json({ok:"true"});
    });
    });


app.get('/get_user/:id_',(req,res)=>{
    var sql = ('SELECT * FROM CommunityMember WHERE id_='+"'"+req.params.id_+"'");
    connection.query(sql,(error,rows)=>{
    if(error) throw error;
    console.log(rows);
    res.send(rows);
});
    });

app.get('/get_members_joined/get_leader/:id_',(req,res)=>{
    var sql = ("SELECT `leader` FROM CommunityMember WHERE id_="+"'"+req.params.id_+"'");
    connection.query(sql,(error,rows)=>{
    if(error) throw error;
    console.log(rows);
    res.send(rows);
    });
    });

    app.get('/get_members_joined/get/:id_',(req,res)=>{
        var sql = ("SELECT * FROM CommunityMember WHERE JSON_SEARCH(`membership`,'one',"+req.params.id_+"'"+ "is not null");
        connection.query(sql,(error,rows)=>{
        if(error) throw error;
        console.log(rows);
        res.send(rows);
        });
        });


app.get('/get_clublist_joined/:id_',(req,res)=>{
    var sql = ("SELECT * FROM TravelClub WHERE JSON_SEARCH(`membership`,'one',"+"'"+req.params.id_+"'"+" is not null");
    connection.query(sql,(error,rows)=>{
    if(error) throw error;
    console.log(rows);
    res.send(rows);
    });
    });


app.get('/get_clubList',(req,res)=>{
    connection.query('SELECT * FROM TravelClub',(error,rows)=>{
    if(error) throw error;
    console.log(rows);
    res.send(rows);
    });
    });

app.get('/delete_club/get_leader_membership/:id_',(req,res)=>{
    var sql = ("SELECT `leader`,`membership` FROM CommunityMember WHERE id_="+"'"+req.params.id_+"'");
    connection.query(sql,(error,rows)=>{
    if(error) throw error;
    console.log(rows);
    res.send(rows);
    });
    });

app.get('/delete_club/get_members/:clubName',(req,res)=>{
    var sql = ("SELECT `members` FROM TravelClub WHERE clubName="+"'"+req.params.clubName+"'");
    connection.query(sql,(error,rows)=>{
    if(error) throw error;
    console.log(rows);
    res.send(rows);
    });
    });
app.get('/delete_club/delete/:clubName',(req,res) =>{
  var sql = "DELETE FROM TravelClub WHERE clubName="+"'"+req.params.clubName+"'";
    connection.query(sql,(error,results,fields,rows)=>{
  if (error) throw error;
    console.log(rows);
    res.send(rows);
  });
  });

  app.get('/delete_club/put_leader/:id_',(req,res)=>{
    connection.query("UPDATE CommunityMember SET `leader`=NULL WHERE id_="+"'"+req.params.id_+"'",(error,resutls,fields,rows)=>{
    if(error) throw error;
    res.json({ok:"true"});
    res.send(rows);
    });
    });

app.put('/delete_club/put_membership/:id_',(req,res)=>{
    var members = req.body.members;
    connection.query("UPDATE CommunityMember SET `membership`=? WHERE id_="+"'"+req.params.id_+"'",[members],(error,resutls,fields,rows)=>{

    if(error) throw error;
    res.json({ok:"true"});
    res.send(rows);
    });
});

app.put('/update_user/:id_',(req,res)=>{
    var area = req.body.area;
    var contact = req.body.contact;
    var gender = req.body.gender;
    connection.query("UPDATE CommunityMember SET contact=?,gender=?,area=?  WHERE id_="+"'"+req.params.id_+"'",[contact,gender,area],(error,resutls,fields,rows)=>{
    if(error) throw error;
    res.json({ok:"true"});
    res.send(rows);
    });
    });

   
app.get('/update_club/get_leader/:id_',(req,res)=>{
    var sql = "SELECT `leader` FROM CommunityMember WHERE id_="+"'"+req.params.id_+"'";
    connection.query(sql,(error,rows)=>{
    if(error) throw error;
    console.log(rows);
    res.send(rows);
    });
    });

app.put('/update_club/put_area_content/:id_',(req,res)=>{
    var area = req.body.area;
    var content = req.body.content;
    connection.query("UPDATE TravelClub SET `area`=?, `content`=? WHERE owner="+"'"+req.params.id_+"'",[area,content],(error,resutls,fields,rows)=>{
        if(error) throw error;
        res.json({ok:"true"});
    res.send(rows);    
    });
    });

app.get('/add_club/get_leader/:id_',(req,res)=>{
    var sql = "SELECT `leader` FROM CommunityMember WHERE id_="+"'"+req.params.id_+"'";
    connection.query(sql,(error,rows)=>{
    if(error) throw error;
    console.log(rows);
    res.send(rows);
    });
    });

app.post('/add_club/post_clubName_owner_area_content', (req, res) => {
    var clubName = req.body.clubName;
    var owner = req.body.owner;
    var area = req.body.area;
    var content = req. body.content;
    connection.query("INSERT INTO TravelClub (clubName,owner,area,content) VALUES(?,?,?,?)",
    [clubName,owner,area,content], (error, resutls, fields,rows) => {
if (error) throw error;
      res.json({ok:"true"});
	res.send(rows)
    });
  });

  app.put('/add_club/put_leader/:id_',(req,res)=>{
    var leader=req.body.leader;
    connection.query("UPDATE CommunityMember SET `leader`=? WHERE id_="+"'"+req.params.id_+"'",[leader],(error,resutls,fields,rows)=>{

    if(error) throw error;
    res.json({ok:"true"});
    res.send(rows);
    });
    });

app.put('/add_club/put_membership/:id_',(req,res)=>{
        var membership=req.body.membership;
        connection.query("UPDATE CommunityMember SET `membership`=? WHERE id_="+"'"+req.params.id_+"'",[membership],(error,resutls,fields,rows)=>{
        if(error) throw error;
        res.json({ok:"true"});
    res.send(rows);
        });
        });

app.put('/add_club/put_members/:id_',(req,res)=>{
        var members=req.body.members;
        connection.query("UPDATE TravelClub SET `members`=? WHERE clubName="+"'"+req.params.id_+"'",[members],(error,resutls,fields,rows)=>{
        if(error) throw error;
        res.json({ok:"true"});
        res.send(rows);
        });
        });
  
app.post('/add_user', (req, res) => {
        var id_=req.body.id_;
        var password_=req.body.password_;
        connection.query("INSERT INTO CommunityMember (id_,password_) VALUES(?,?)",
                      [id_,password_], (error, resutls, fields) => {
          if (error) throw error;
          res.json({ok:"true"});
         res.send(resutls);
        });
      });


app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});
