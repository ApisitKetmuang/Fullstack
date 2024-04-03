const express = require('express')
const bodyparser = require('body-parser')
const mysql = require('mysql2/promise')
const cors = require('cors')
const app = express()

app.use(bodyparser.json())
app.use(cors())

const port = 8000

let conn = null

const initMySQL = async () => {
    conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'tutorial'
    })
}

const validateData = (userData) => {
    let errors = []

    if (!userData.firstname) {
        errors.push('กรุณาใส่ชื่อจริง')
    }

    if (!userData.lastname) {
        errors.push('กรุณาใส่นามสกุล')
    }

    if (!userData.age) {
        errors.push('กรุณาใส่อายุ')
    }

    if (!userData.gender) {
        errors.push('กรุณาเลือกพศ')
    }

    if (!userData.interest) {
        errors.push('กรุณาเลือกความสนใจ')
    }

    if (!userData.description) {
        errors.push('กรุณาใส่รายละเอียด')
    }
    
    return errors
}

app.get('/testdb-new', async (req, res) => {
    try {
        const results = await conn.query(
            'SELECT * FROM users')
        res.json(results[0])
    } catch (error) {
        console.error('Error fetching users:', error.message)
        res.status(500).json({ error: 'Error fetching users' })
    } 
})

app.get('/users', async (req, res) => {
    const results = await conn.query('SELECT * FROM users')
    res.json(results[0])       
})

app.post('/users',  async (req, res) => {
    try {
        let user = req.body

        const errors = validateData(user)
        if (errors.length > 0) {
            throw {
                message: 'กรอกข้อมูลไม่ครบ',
                errors: errors
            }
        }
        const results = await conn.query(
            'INSERT INTO users SET ?'
            , user)
        res.json({
            message: 'Insert ok',
            data: results[0]
        })
    } catch (error) {
        const errorMessage =  error.message || 'something wrong'
        const errors = error.errors || []
        console.error('error message,', error.message);
        res.status(500).json({
            message: 'Something wrong',
            errors: errors
        }) 
    }
})

app.get('/users/:id', async (req, res) => {
    try {
        let id = req.params.id
        const results = await conn.query(
            'SELECT * FROM users WHERE id = ?'
            , id)
        if (results[0].length == 0) {
            throw { statsuCode: 404, message: 'Not found' }
        } 
        res.json(results[0][0])
    } catch (error) {
        console.error('error message,', error.message);
        let statsuCode = error.statsuCode || 500
        res.status(statsuCode).json({
            message: 'Something wrong',
            errorMessage: error.message
        })
    }
})

app.put('/users/:id', async (req, res) => {
    try {
        let id = req.params.id
        let updateUser = req.body
        const results = await conn.query(
            'UPDATE users SET ? WHERE id = ?'
            , [updateUser, id])
        res.json({
            message: 'Update ok',
            data: results[0]
        })
    } catch(error) {
        console.error('error message,', error.message);
        res.status(500).json({
            message: 'Something wrong'
        }) 
    }
})

app.delete('/users/:id', async (req, res) => {
    try {
        let id = req.params.id
        const results = await conn.query(
            'DELETE from users WHERE id = ?', id)
        res.json({
            message: 'Delete ok',
            data: results[0]
        })
    } catch(error) {
        console.error('error message,', error.message);
        res.status(500).json({
            message: 'Something wrong'
        }) 
    }
})

app.listen(port, async (req, res) => {
    await initMySQL()
    console.log('http server run at' + port);
})

