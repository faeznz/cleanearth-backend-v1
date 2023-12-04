const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

mongoose.connect('mongodb+srv://faeznz:faeznz@data.h3xudui.mongodb.net/CleanEarth?retryWrites=true&w=majority')
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
});


const itemSchema = new mongoose.Schema({
    nama: String,
    bank: String,
    nominal: Number,
    no_telepon: String,
    alamat: String
});

const Item = mongoose.model('Item', itemSchema);

const nasabahSchema = new mongoose.Schema({
    nama: String,
    no_telpon: String,
    alamat: String
});

const Nasabah = mongoose.model('Nasabah', nasabahSchema);

const setorSampahSchema = new mongoose.Schema({
    waktu: { type: Date, default: Date.now },
    nama: String,
    jenis_sampah: String,
    jumlah: String,
    nominal: Number
});

const SetorSampah = mongoose.model('SetorSampah', setorSampahSchema);

app.use(express.json());

app.get('/nasabah', async (req, res) => {
    try {
        const nasabah = await Nasabah.find();
        res.json(nasabah);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/nasabah/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const nasabah = await Nasabah.findById(id);
        if (!nasabah) {
            return res.status(404).send('Nasabah not found');
        }
        res.json(nasabah);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post('/nasabah', async (req, res) => {
    const newNasabah = new Nasabah(req.body);
    try {
        await newNasabah.save();
        res.status(201).send(newNasabah);
    } catch (err) {
        res.status(400).send(err);
    }
});

app.put('/nasabah/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const nasabah = await Nasabah.findByIdAndUpdate(id, req.body, { new: true });
        res.send(nasabah);
    } catch (err) {
        res.status(400).send(err);
    }
});

app.delete('/nasabah/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const item = await Item.findByIdAndDelete(id);
        if (!item) {
            res.status(404).send();
        }
        res.send(item);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/setorsampah', async (req, res) => {
    try {
        const setorSampahData = await SetorSampah.find();
        res.json(setorSampahData);
    } catch (err) {
        res.status(500).send(err);
    }
});

const historyTransaksiSchema = new mongoose.Schema({
    waktu: { type: Date, default: Date.now },
    id_transaksi: String,
    jenis_sampah: String,
    jumlah: String,
    nominal: Number,
});
  
const HistoryTransaksi = mongoose.model('HistoryTransaksi', historyTransaksiSchema);

app.get('/historytransaksi', async (req, res) => {
    try {
      const historyTransaksiData = await HistoryTransaksi.find();
      res.json(historyTransaksiData);
    } catch (err) {
      res.status(500).send(err);
    }
  });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
