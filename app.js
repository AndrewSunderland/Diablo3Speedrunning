const express = require('express');
let bodyParser = require("body-parser");
const expressHandlebars = require('express-handlebars');
const app = express();
const port = 4570;
app.use(bodyParser.json());

if (!Object.entries) {
    Object.entries = function (obj) {
        var ownProps = Object.keys(obj),
            i = ownProps.length,
            resArray = new Array(i); // preallocate the Array

        while (i--)
            resArray[i] = [ownProps[i], obj[ownProps[i]]];
        return resArray;
    };
}

const apiNameToTableName = {
    "acts":"Acts",
    "players":"Players",
    "classes":"Classes",
    "act-runs":"Act_Runs",
    "platforms":"Platforms"};

const fieldToColumn = {
    "id":"Acts",
    "name":"name",
    "playerId":"player_id",
    "actId":"act_id",
    "time":"time",
    "classId":"class_id",
    "platformId":"platform_id",
    "date":"date"
};

const feildToActRunsJoinedCol = {
    "player":"pl.name",
    "act":"act.name",
    "time":"ar.time",
    "class":"cls.name",
    "platform":"pform.name",
    "date":"ar.date"
};

//let session = require('express-session');
// app.engine('handlebars', hbars({ defaultLayout: 'main' }));
app.engine('handlebars', expressHandlebars({
    helpers: require('./config/handlebars-helpers')
}));

app.set('view engine', 'handlebars');

app.use('/static', express.static('public'));

let mysql = require('mysql');
let pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs340_bechtelg',
    password        : 'Snoopenheimer88',
    database        : 'cs340_bechtelg'
});


function insertIfAbsent(tableName, item, res) {
    return new Promise((resolve, reject) => {
        if (item.name !== '') {
            let sql = "INSERT IGNORE INTO " + tableName + " (" +
                Object.keys(item).map(field => fieldToColumn[field]).join(", ") + ")"
                + " VALUES " + "(" + Object.keys(item).map(k => '?') + ")";
            let values = Object.keys(item).map(k => item[k]);
            pool.query(sql, values,
                (err, rows, fields) => {
                    if (err) {
                        reject(err);
                    }
                });
        }
        resolve();
    });
}

app.get('/', function (req, res, next) {
    res.status(200).render('homepage');
});

function actToInt(act) {
    let n = 100;
    if (act === 'I') {
        n = 1;
    }else if (act === 'II') {
        n = 2;
    } else if (act === 'III') {
        n = 3;
    } else if (act === 'IV') {
        n = 4;
    } else if (act === 'V') {
        n = 5;
    }
    return n;
}

app.get('/:type', function (req, res, next) {
    let tableName = apiNameToTableName[req.params.type];
    if (tableName) {
        let sql;
        let pageName;
        let conditions = [];
        if (tableName !== 'Act_Runs') {
            pageName = 'display-records';
            sql = 'SELECT * FROM ' + tableName;
            conditions = Object.entries(req.query)
                .filter(entry => entry[1] !== '')
                .map((entry) => `${fieldToColumn[entry[0]]} = '${entry[1]}'`);
        } else {
            pageName = 'display-act-runs';
            sql = 'SELECT ar.id AS "id", pl.name AS "player",' +
                ' act.name AS "act", ar.time as "time", cls.name AS "class",' +
                ' pform.name AS "platform", ar.date AS "date"' +
                ' FROM Act_Runs ar INNER JOIN Players pl ON pl.id = ar.player_id' +
                ' INNER JOIN Acts act ON act.id = ar.act_id' +
                ' INNER JOIN Classes cls ON cls.id = ar.class_id' +
                ' LEFT JOIN Platforms pform on pform.id = ar.platform_id';
            conditions = Object.entries(req.query)
                //.map((entry) => `${fieldToColumn[entry[0]]} = '${entry[1]}'`);
                .filter(entry => entry[1] !== '')
                .map((entry) => `${feildToActRunsJoinedCol[entry[0]]} = '${entry[1]}'`);
        }
        if (conditions.length > 0) {
            sql += ' WHERE ' + conditions.join(' AND ');
        }
        pool.query(sql, (err, rows, fields) => {
            if (err) {
                console.log(err);
                res.sendStatus(500);
            } else {
                if (tableName === 'Act_Runs') {
                    rows.sort((run1, run2)=>{
                        if (run1.act === run2.act) {
                            return 0;
                        }
                        return actToInt(run1.act) - actToInt(run2.act);
                    });
                    rows.sort((run1, run2) => {
                        if (run1.time === run2.time) {
                            return 0;
                        }
                        return run1.time - run2.time;
                    });
                }
                res.status(200).render(pageName, {tableType: tableName, rows: rows});
            }
        });
    } else {
        res.sendStatus(404);
    }
});



// Add Page
app.get('/add/:type', function (req, res, next) {
    let tableName = apiNameToTableName[req.params.type];
    if (tableName) {
        res.status(200).render('add-record', {tableType: tableName, record: emptyRecord(tableName)});
    } else {
        res.status(404);
    }
});


// Edit Page
app.get('/edit/:type/:id', function (req, res, next) {
    let id = parseInt(req.params.id);
    let tableName = apiNameToTableName[req.params.type];
    if (tableName) {
        pool.query('SELECT * FROM ' + tableName + ' WHERE id=' + id, (err, rows, fields) => {
            if (err) {
                console.log(err);
                res.status(500);
            } else if (rows.length > 0) {
                res.status(200).render('edit-record', {tableType: tableName, record: rows[0]});
            } else {
                res.status(404);
            }
        });
    } else {
        res.status(404);
    }
});


app.post('/api/:type', (req, res) => {
    let tableName = apiNameToTableName[req.params.type];
    let item = req.body;
    delete item.id;
    if (tableName) {
        if (tableName !== 'Act_Runs') {
            insertIfAbsent(tableName, item, res).then(() => {
                let sql = 'SELECT * FROM ' + tableName;
                pool.query(sql, (err, rows, fields) => {
                    if (err) {
                        console.log(err);
                        res.status(500);
                    }
                });
            }).catch(err =>{
                console.log(err);
                res.sendStatus(500);
            });
        } else {
            insertIfAbsent('Players', {name: item.player}).then(() =>
            insertIfAbsent('Acts', {name: item.act})).then(() =>
            insertIfAbsent('Classes', {name: item.class})).then(() =>
            insertIfAbsent('Platforms', {name: item.platform})).then(() => {
                let sql = 'INSERT INTO Act_Runs (id, player_id, act_id, time, class_id, platform_id, date)' +
                    ' VALUES (null, (SELECT id FROM Players WHERE name = \'' + item.player + '\'),' +
                    ' (SELECT id FROM Acts WHERE name = \'' + item.act + '\'),' +
                    ' \'' + item.time + '\', (SELECT id FROM Classes WHERE name = \'' + item.class + '\'),' +
                    ' (SELECT id FROM Platforms WHERE name = \'' + item.platform + '\'), \'' + item.date + '\')';
                pool.query(sql, (err, rows, fields) => {
                    if (err) {
                        console.log(err);
                        res.status(500);
                    }
                });
            }).catch(err =>{
                console.log(err);
                res.sendStatus(500);
            });
        }
    }
    res.send('"OK"');
});

app.put('/api/:type/:id', (req, res) => {
    let id = parseInt(req.params.id);
    let tableName = apiNameToTableName[req.params.type];
    let item = req.body;
    if (tableName) {
        pool.query("UPDATE " + tableName + " SET " +
             "name=?" +
            "WHERE id=" + id,
            [item.name], (err, rows, fields) => {
            if (err) {
                console.log(err);
                res.sendStatus(404);
            }
        });
    }
    res.send('"OK"');
});

// delete
app.delete('/api/:type/:id', (req, res) => {
    let id = parseInt(req.params.id);
    let tableName = apiNameToTableName[req.params.type];
    if (tableName) {
        pool.query('DELETE FROM ' + tableName + ' WHERE id=' + id, (err, rows, fields) => {
            if (err) {
                console.log(err);
                res.status(500).send('"Internal Server Error"');
            }
        });
    }
    res.statusCode = 204;
    res.send();
});

function emptyRecord(tableName) {
    if (tableName === 'Act_Runs') {
        return {
            playerId: undefined,
            actId: undefined,
            time: undefined,
            classId: undefined,
            platformId: undefined,
            date: undefined
        };
    }
    return {
        name: undefined
    };
}
//
// app.get("/api/workouts", (req, res) => {
//     //let context = {};
//     let workouts = [];
//     pool.query('SELECT * FROM workouts', (err, rows, fields) => {
//         for (let row of rows) {
//             let date = new Date(row.date);
//             let workout = {
//                 'name': row.name,
//                 'reps': row.reps,
//                 'weight': row.weight,
//                 'date': formatDate(date),
//                 'id': row.id,
//                 'lbs': row.lbs === 1
//             };
//             workouts.push(workout);
//         }
//         res.statusCode = 200;
//         res.setHeader("Content-Type", "application/json");
//         res.send(workouts);
//     });
// });
//
// app.get("/api/workouts/:id", (req, res) => {
//     let id = req.params.id;
//     pool.query('SELECT * FROM workouts WHERE id=' + id, (err, rows, fields) => {
//         if (err || rows.length < 1) {
//             console.log(err);
//             res.send("no such workout");
//         } else {
//             let row = rows[0];
//             let date = new Date(row.date);
//             let existingWorkout = {
//                 'name': row.name,
//                 'reps': row.reps,
//                 'weight': row.weight,
//                 'date': formatDate(date),
//                 'id': row.id,
//                 'lbs': row.lbs === 1
//             };
//             res.statusCode = 200;
//             res.setHeader("Content-Type", "application/json");
//             res.send(existingWorkout);
//         }
//     });
//
// });
//
//
// // pretty sure this adds a workout, then sends it back
// app.post("/api/workouts", (req, res) => {
//     let workout = req.body;
//     pool.query("INSERT INTO workouts " +
//         "(name, reps, weight, date, lbs)" +
//         " VALUES (?, ?, ?, ?, ?)",
//         [workout.name, workout.reps, workout.weight, new Date(workout.date), workout.lbs],
//         (err, result) => {
//             if (err) {
//                 console.log(err);
//                 throw err;
//             }
//             pool.query('SELECT * FROM workouts WHERE id=' + result.insertId, (err, rows, fields) => {
//                 let row = rows[0];
//                 let date = new Date(row.date);
//                 let workout = {
//                     'name': row.name,
//                     'reps': row.reps,
//                     'weight': row.weight,
//                     'date': formatDate(date),
//                     'id': row.id,
//                     'lbs': row.lbs === 1
//                 };
//                 res.statusCode = 200;
//                 res.setHeader("Content-Type", "application/json");
//                 res.send(workout);
//             });
//         }
//     );
// });
//
// //pretty sure this could be called "Change THIS workout", where "THIS" is the workout
// // in the table whose id = req.params.id
// app.put("/api/workouts/:id", (req, res) => {
//     let id = req.params.id;
//     pool.query('SELECT * FROM workouts WHERE id=' + id, (err, rows, fields) => {
//         if (err || rows.length < 1) {
//             console.log(err);
//             res.send("no such workout");
//         } else {
//             let row = rows[0];
//             let date = new Date(row.date);
//             let existingWorkout = {
//                 'name': row.name,
//                 'reps': row.reps,
//                 'weight': row.weight,
//                 'date': formatDate(date),
//                 'id': row.id,
//                 'lbs': row.lbs === 1
//             };
//             let workout = req.body;
//             existingWorkout.name = workout.name;
//             existingWorkout.reps = workout.reps;
//             existingWorkout.weight = workout.weight;
//             existingWorkout.date = workout.date;
//             existingWorkout.id = workout.id;
//             existingWorkout.lbs = workout.lbs;
//
//             pool.query("UPDATE workouts SET " +
//                 "name=?, reps=?, weight=?, date=?, lbs=? " +
//                 "WHERE id=" + existingWorkout.id,
//                 [existingWorkout.name, existingWorkout.reps, existingWorkout.weight,
//                     new Date(existingWorkout.date), existingWorkout.lbs],
//                 (err, result) => {
//                     if (err) {
//                         console.log(err);
//                         throw err;
//                     }
//                     res.statusCode = 200;
//                     res.setHeader("Content-Type", "application/json");
//                     res.send(existingWorkout);
//                 }
//             );
//         }
//     });
//
// });
//
// // delete that workout whose id = req.params.id from the table, if present.
// // else, inform that no such workout is in the table
// app.delete("/api/workouts/:id", (req, res) => {
//     let id = req.params.id;
//     pool.query('DELETE FROM workouts WHERE id=' + id, (err, rows, fields) => {
//         if (err) {
//             console.log(err);
//             res.send("no such workout");
//         } else {
//             res.statusCode = 204;
//             res.send();
//         }
//     });
// });
//
// function resetTable() {
//     pool.query("DROP TABLE IF EXISTS workouts", err => {
//         //replace your connection pool with the your variable containing the connection pool
//         var createString = "CREATE TABLE workouts("+
//             "id INT PRIMARY KEY AUTO_INCREMENT,"+
//             "name VARCHAR(255) NOT NULL,"+
//             "reps INT,"+
//             "weight INT,"+
//             "date DATE,"+
//             "lbs BOOLEAN)";
//         pool.query(createString, err => {
//             if (err) {
//                 throw err;
//             }
//         })
//     });
// }

app.listen(port, function () {
    console.log('Express started on http://localhost:' + port + '; press Ctrl-C to terminate.');
});
