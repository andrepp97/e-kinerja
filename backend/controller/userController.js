var fs = require('fs');
const crypto = require('crypto')
const { sqlDB } = require('../db')
const { uploader } = require('../helper/uploader')
const { createJWTToken } = require('../helper/jwt')
const secret = 'ekinerja'

const d = new Date()
const year = d.getFullYear()
const month = d.getMonth() + 1
const date = d.getDate()
const daysInMonth = new Date(year, month, 0).getDate()

module.exports = {
    userLogin: (req, res) => {
        sqlDB.getConnection((err, conn) => {
            if (err) res.status(500).send(err)

            let { username, password } = req.body;
            password = crypto.createHmac('sha256', secret).update(password).digest('hex')

            let query = `SELECT username FROM users WHERE username = '${username}'`

            conn.query(query, (err, results) => {
                if (err) return res.status(500).send(err)
                if (results.length === 0) return res.status(404).send('Username Not Found')

                let query2 = `SELECT *
                              FROM users
                              WHERE username = '${username}' AND password = '${password}'`

                conn.query(query2, (err2, results2) => {
                    conn.release()

                    if (err2) return res.status(500).send(err2)
                    if (results2.length === 0) return res.status(403).send('Wrong Password')
                    if (results2.length && results2[0].status === 'inactive') return res.status(403).send('User Inactive')
                    if (results2.length && results2[0].id != 1 && results2[0].id != 2) {
                        let selectAbsen = `SELECT created_date FROM attendances WHERE user_id = ${results2[0].id} AND substr(created_date, 6, 2) = ${month}`
                        conn.query(selectAbsen, (err, res) => {
                            if (res.length === 0) {
                                let queryAbsen = "INSERT INTO attendances (user_id, clock_in, clock_out, created_date) VALUES ?"
                                let arrayAbsen = []

                                for (let i = 0; i < daysInMonth; i++) {
                                    arrayAbsen.push([results2[0].id, '00:00:00', '00:00:00', `${year}-${month}-${i + 1}`])
                                }

                                conn.query(queryAbsen, [arrayAbsen], (err3) => {
                                    if (err3) console.log(err3)
                                    return
                                })
                                return
                            }
                        })
                    }

                    let token = createJWTToken({ ...results2[0] }, { expiresIn: '24h' })
                    res.status(200).send({ ...results2[0], token })
                })
            })
        })
    },

    userClockIn: (req, res) => {
        sqlDB.getConnection((err, conn) => {
            if (err) res.status(500).send(err)

            const { user_id, clock_in } = req.body
            let query = `SELECT clock_in FROM attendances WHERE created_date = curdate() AND user_id = ${user_id}`
            conn.query(query, (err, results) => {
                if (err) res.status(500).send(err)
                if (results[0].clock_in !== '00:00:00') {
                    res.status(400).send('You already clocked in today')
                    return
                }

                let query2 = `UPDATE attendances
                              SET clock_in = '${clock_in}'
                              WHERE user_id = ${user_id} AND created_date = curdate()`

                conn.query(query2, req.body, (err2, results2) => {
                    conn.release()

                    if (err2) return res.status(500).send(err2)

                    res.status(200).send(results2)
                })
            })
        })
    },

    userClockOut: (req, res) => {
        sqlDB.getConnection((err, conn) => {
            if (err) res.status(500).send(err)

            const { user_id, clock_out } = req.body
            let query = `SELECT * FROM attendances WHERE created_date = curdate() AND user_id = ${user_id}`
            conn.query(query, (err, results) => {
                if (err) return res.status(500).send(err)

                let query2 = ''

                if (results.length > 0) {
                    query2 = `UPDATE attendances
                          SET clock_out = '${clock_out}'
                          WHERE user_id = ${user_id}
                          AND created_date = curdate()`
                    if (results[0].clock_out != '00:00:00') {
                        res.status(400).send('You already clocked out today')
                        return
                    }
                } else {
                    return res.status(400).send("You haven't clocked in today")
                }

                conn.query(query2, (err, results) => {
                    conn.release()

                    if (err) return res.status(500).send(err)

                    res.status(200).send(results)
                })
            })
        })
    },

    getAttendanceList: (req, res) => {
        let query = `SELECT *, if(clock_in <> '00:00:00' AND clock_out <> '00:00:00', timediff(clock_out, clock_in), '---') as 'total'
                     FROM attendances
                     WHERE substring(created_date, 6, 2) = ${req.body.month}
                     AND year(created_date) = year(now())
                     AND user_id = ${req.body.id}
                     ORDER BY created_date ASC`

        sqlDB.query(query, (err, results) => {
            if (err) return res.status(500).send(err)

            res.status(200).send(results)
        })
    },

    getRecentTask: (req, res) => {
        let query = `SELECT *
                     FROM assignments
                     WHERE user_id = ${req.query.id}
                     ORDER BY created_date DESC
                     LIMIT 3`

        sqlDB.query(query, (err, results) => {
            if (err) return res.status(500).send(err)

            res.status(200).send(results)
        })
    },

    getRecentAttendance: (req, res) => {
        let query = `SELECT *
                     FROM attendances
                     WHERE user_id = ${req.query.id}
                     ORDER BY created_date DESC
                     LIMIT 3`

        sqlDB.query(query, (err, results) => {
            if (err) return res.status(500).send(err)

            res.status(200).send(results)
        })
    },

    updateDuration: (req, res) => {
        let query = `UPDATE assignments SET duration = ${req.body.duration} WHERE id = ${req.body.id}`

        sqlDB.query(query, (err, results) => {
            if (err) return res.status(500).send(err)

            res.status(200).send(results)
        })
    },

    uploadAttachment: (req, res) => {
        const path = '/attachment'
        const upload = uploader(path, 'ATT_').single('file')

        upload(req, res, (err) => {
            if (err) return res.status(500).send(err)

            const file = req.file
            let imgPath = path + '/' + file.filename

            let query = `UPDATE assignments
                         SET attachment = '${imgPath}'
                         WHERE id = ${req.body.id}`
            sqlDB.query(query, (err, results) => {
                if (err) {
                    fs.unlinkSync(`./public${imgPath}`)
                    return res.status(500).send(err)
                }

                res.status(200).send('Attachment Uploaded')
            })
        })
    },
}