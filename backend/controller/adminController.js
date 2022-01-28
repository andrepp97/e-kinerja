const crypto = require('crypto')
const { sqlDB } = require('../db')
const secret = 'ekinerja'

module.exports = {
    createUser: (req, res) => {
        req.body.role = 2
        req.body.status = 'active'
        req.body.created_date = new Date()

        // Encrypt password
        req.body.password = crypto.createHmac('sha256', secret).update(req.body.password).digest('hex')


        // SELECT duplicate email
        let query = `SELECT * FROM users WHERE username = '${req.body.username}'`
        sqlDB.query(query, (err, results) => {
            if (err) return res.status(500).send(err)

            // Send error jika duplicate
            if (results.length > 0) {
                return res.status(400).send('duplicate')
            }

            // INSERT user jika tidak duplicate
            let query2 = `INSERT INTO users SET ?`
            sqlDB.query(query2, req.body, (err, results) => {
                if (err) return res.status(500).send(err)

                res.status(200).send(results)
            })
        })
    },

    getAllUser: (req, res) => {
        let query = `SELECT * FROM users WHERE role = 2 ORDER BY name`
        sqlDB.query(query, (err, results) => {
            if (err) return res.status(500).send(err)

            res.status(200).send(results)
        })
    },

    toogleBanUser: (req, res) => {
        let query = `UPDATE users SET status = '${req.body.status}' WHERE id = ${req.body.id}`
        sqlDB.query(query, (err, results) => {
            if (err) return res.status(500).send(err)

            res.status(200).send(results)
        })
    },

    createAssignment: (req, res) => {
        let query = `INSERT INTO assignments
                     VALUES (null, ${req.body.user_id}, ${req.body.admin_id}, '${req.body.task_title}', '${req.body.task_desc}', null, 'ongoing', now())`
        sqlDB.query(query, (err, results) => {
            if (err) return res.status(500).send(err)

            res.status(200).send(results)
        })
    },

    getAllAssignment: (req, res) => {
        const where = req.query.role == 2 ? `WHERE user_id = ${req.query.id}` : ''
        const limit = req.query.limit ? `LIMIT ${req.query.limit}` : ''

        let query = `SELECT *, name, a.status as 'task_status', a.id as 'task_id'
                     FROM assignments a
                     JOIN users u ON u.id = a.user_id ${where}
                     ORDER BY a.created_date DESC ${limit}`
        sqlDB.query(query, (err, results) => {
            if (err) return res.status(500).send(err)

            res.status(200).send(results)
        })
    },

    toogleAssignment: (req, res) => {
        let stat = req.body.check == true ? 'done' : 'ongoing'
        let query = `UPDATE assignments SET status = '${stat}' WHERE id = ${req.body.id}`

        sqlDB.query(query, (err, results) => {
            if (err) return res.status(500).send(err)

            res.status(200).send(results)
        })
    },
}