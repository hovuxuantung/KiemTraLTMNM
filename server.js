const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Hiển thị danh sách đặt chỗ
app.get('/', (req, res) => {
    db.all('SELECT * FROM Bookings', [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.render('index', { bookings: rows });
    });
});

// Trang đặt chỗ mới
app.get('/new', (req, res) => {
    res.render('new-booking');
});

// Thêm đặt chỗ mới
app.post('/new', (req, res) => {
    const { customerName, date, time } = req.body;
    db.run('INSERT INTO Bookings (customerName, date, time) VALUES (?, ?, ?)', [customerName, date, time], (err) => {
        if (err) {
            return console.error(err.message);
        }
        res.redirect('/');
    });
});

// Trang sửa đặt chỗ
app.get('/edit/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM Bookings WHERE id = ?', [id], (err, row) => {
        if (err) {
            throw err;
        }
        res.render('edit-booking', { booking: row });
    });
});

// Cập nhật đặt chỗ
app.post('/edit/:id', (req, res) => {
    const id = req.params.id;
    const { customerName, date, time } = req.body;
    db.run('UPDATE Bookings SET customerName = ?, date = ?, time = ? WHERE id = ?', [customerName, date, time, id], (err) => {
        if (err) {
            return console.error(err.message);
        }
        res.redirect('/');
    });
});

// Hủy đặt chỗ
app.post('/cancel/:id', (req, res) => {
    const id = req.params.id;
    db.run('UPDATE Bookings SET status = ? WHERE id = ?', ['Cancelled', id], (err) => {
        if (err) {
            return console.error(err.message);
        }
        res.redirect('/');
    });
});
// Xóa đặt chỗ
app.post('/delete/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM Bookings WHERE id = ?', [id], (err) => {
        if (err) {
            return console.error(err.message);
        }
        res.redirect('/');
    });
});
// Xóa tất cả đặt chỗ và reset ID 
app.post('/delete-all', (req, res) => {
    db.serialize(() => {
        // Xóa tất cả đặt chỗ
        db.run('DELETE FROM Bookings', (err) => {
            if (err) {
                return console.error(err.message);
            }
            // Reset ID 
            db.run('DELETE FROM sqlite_sequence WHERE name = "Bookings"', (err) => {
                if (err) {
                    return console.error(err.message);
                }
                res.redirect('/');
            });
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
