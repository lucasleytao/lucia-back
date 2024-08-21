// const express = require('express');
// const router = express.Router();
// router.get('/', (req, res) => {
//     res.sendFile(__dirname + '/views/inicio.html');
// });
// router.post('/', (req, res) => {
//     const { username, password } = req.body;
//     if (username === 'Admin' && password === '123456') {
//         res.sendFile(__dirname + '/views/welcome.html');
//     } else {
//         setTimeout(() => {
//             res.redirect('/');
//         }, 5000);
//         res.sendFile(__dirname + '/views/error.html');
//     }
// });