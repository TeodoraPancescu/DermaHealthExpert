const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Doctor = require('../models/doctorModel');
const authMiddleware = require("../middlewares/authMiddleware");
const Category = require("../models/categoryModel")
const Service = require("../models/serviceModel");
const Disease = require('../models/diseaseModel');

router.get("/get-all-doctors", authMiddleware, async (req, res) => {
    try {
        const doctors = await Doctor.find({});
        res.status(200).send({ message: "Lista doctorilor transmisă cu succes", success: true, data: doctors })

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Eroare la transmiterea listei doctorilor", success: false, error });
    }
});

router.get("/get-all-users", authMiddleware, async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).send({ message: "Lista utilizatorilor transmisă cu succes", success: true, data: users })

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Eroare la transmiterea listei de utilizatori", success: false, error });
    }
});

router.post("/change-doctor-account-status", authMiddleware, async (req, res) => {
    try {
        const { doctorId, status } = req.body;
        const doctor = await Doctor.findByIdAndUpdate(doctorId, {
            status,
        });

        const user = await User.findOne({ _id: doctor.userId });
        const unseenNot = user.unseenNot;
        unseenNot.push({
            type: 'cerere-noua-adaugare-medic-schimbata',
            message: `Contul tău de medic a fost  ${status}`,
            onClickPath: '/notificari'
        })
        user.esteDoctor = status === "aprobat";
        await user.save();
        // await User.findByIdAndUpdate(user._id, { unseenNot });

        res.status(200).send({
            message: "Status-ul medicului a fost actualizat cu succes.",
            success: true,
            data: doctor,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Eroare la aplicarea contului de medic", success: false, error });
    }
});

router.post("/add-category", authMiddleware, async (req, res) => {
    try {
        const name = req.body.name;
        const categorieNoua = new Category({ name: name });
        await categorieNoua.save();
        res.status(200).send({
            success: true,
            message: "Noua categorie s-a adaugat cu succes",
            data: categorieNoua
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Eroare la crearea unei noi categorii!", success: false, error });
    }
});


router.post("/add-service", authMiddleware, async (req, res) => {
    try {
        const category = await Category.findById(req.body.categoryId);
        const { name, price } = req.body;
        const service = new Service({
            name,
            price,
            categoryId: category._id,
        });
        await service.save();
        category.services.push(service._id);
        await category.save();

        res.status(200).send({
            success: true,
            message: "Noul serviciu s-a adaugat cu succes",
            data: service
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Eroare la crearea unui nou serviciu!", success: false, error });
    }
});

router.post("/add-disease", authMiddleware, async (req, res) => {
    try {
        const { name, description } = req.body;
        const afectiuneNoua = new Disease({ name, description }); // Include the description field
        await afectiuneNoua.save();
        res.status(200).send({
            success: true,
            message: "Noua afecțiune s-a adaugat cu succes",
            data: afectiuneNoua
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Eroare la adăugarea unei noi afecțiuni!", success: false, error });
    }
});


module.exports = router;