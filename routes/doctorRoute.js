const express = require("express");
const router = express.Router();
const Doctor = require("../models/doctorModel");
const authMiddleware = require("../middlewares/authMiddleware")
const Appointment = require("../models/appointmentModel")
const User = require("../models/userModel")
const moment = require("moment");

router.post('/get-doctor-info-by-user-id', authMiddleware, async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.body.userId })
        res.status(200).send({
            success: true,
            message: "Profilul doctorului actualizate cu succes",
            data: doctor
        });
    } catch (error) {
        res.status(500).send({ message: "Eroare la actualizarea profilului doctorului", success: false, error });
    }
});


router.post('/get-doctor-info-by-id', authMiddleware, async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ _id: req.body.doctorId });
        res.status(200).send({
            success: true,
            message: "Profilul doctorului actualizate cu succes",
            data: doctor
        });
    } catch (error) {
        res.status(500).send({ message: "Eroare la actualizarea profilului doctorului", success: false, error });

    }
});

router.post('/update-doctor-profile', authMiddleware, async (req, res) => {
    try {
        const doctor = await Doctor.findOneAndUpdate(
            { userId: req.body.userId }, req.body, { new: true });
        res.status(200).send({
            success: true,
            message: "Informațiile doctorului preluate cu succes",
            data: doctor
        });
    } catch (error) {
        res.status(500).send({ message: "Eroare la actualizarea profilului doctorului doctor", success: false, error });

    }
});

router.get("/get-appointments-by-doctor-id", authMiddleware, async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.body.userId })
        const appointments = await Appointment.find({ doctorId: doctor._id });
        res.status(200).send({ message: "Lista programărilor transmisă cu succes", success: true, data: appointments })

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Eroare la transmiterea listei programărilor", success: false, error });
    }
});

router.post("/change-appointment-status", authMiddleware, async (req, res) => {
    try {
        const { appointmentId, status } = req.body;
        const appointment = await Appointment.findByIdAndUpdate(appointmentId, {
            status,
        });

        const user = await User.findOne({ _id: appointment.userId });
        if (user && user.unseenNot) {
            const unseenNot = user.unseenNot;
            unseenNot.push({
                type: 'schimbare-status-programare',
                message: `Programarea ta a fost ${status}`,
                onClickPath: '/appointments'
            });
            user.unseenNot = unseenNot; // Assign the updated array back to user.unseenNot
            await user.save();
        }



        res.status(200).send({
            message: "Status-ul programării a fost actualizat cu succes.",
            success: true
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Eroare la actualizarea status-ului programării.", success: false, error });
    }
});

router.post("/get-chart-appointments-by-month", authMiddleware, async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.body.userId });

        const appointments = await Appointment.find({ doctorId: doctor._id });

        const dateFormat = 'YYYY-MM-DD';

        const currentYear = moment().year();

        const numberOfAppointmentsPerMonthArray = [];

        const filteredAppointmentsByYear = appointments.filter(appointment => {
            const appointmentDate = moment(appointment.date, dateFormat);
            const appointmentYear = appointmentDate.year();
            return currentYear === appointmentYear;
        });

        for (let i = 0; i < filteredAppointmentsByYear.length; i++) {
            const date = moment(filteredAppointmentsByYear[i].date, dateFormat);
            const appointmentMonth = date.month(); //0-11
            for (let i = 0; i < 12; i++) {
                if (!numberOfAppointmentsPerMonthArray[i]) {
                    numberOfAppointmentsPerMonthArray[i] = 0;
                }
                if (appointmentMonth === i) {
                    numberOfAppointmentsPerMonthArray[i]++;
                }
            }
        }

        res.status(200).send({ message: "Lista programărilor transmisă cu succes", success: true, data: numberOfAppointmentsPerMonthArray })

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Eroare la transmiterea listei programărilor", success: false, error });
    }
});

router.post("/get-chart-pacients-by-gender", authMiddleware, async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.body.userId });
        const appointments = await Appointment.find({ doctorId: doctor._id });

        const pacientsByGender = {
            "Feminin": 0,
            "Masculin": 0
        };

        for (let i = 0; i < appointments.length; i++) {
            const pacientCNP = appointments[i].userInfo.CNP;
            firstLetterPacientCNP = pacientCNP.substring(0, 1);
            if (firstLetterPacientCNP === '1' || firstLetterPacientCNP === '5' || firstLetterPacientCNP === '7') {
                pacientsByGender['Masculin']++;
            }
            else if (firstLetterPacientCNP === '2' || firstLetterPacientCNP === '6' || firstLetterPacientCNP === '8') {
                pacientsByGender['Feminin']++;
            }
        }

        const chartData = [
            { name: "Feminin", value: pacientsByGender['Feminin'] },
            { name: "Masculin", value: pacientsByGender['Masculin'] },
        ]

        res.status(200).send({ message: "Lista programărilor transmisă cu succes", success: true, data: chartData });

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Eroare la transmiterea listei programărilor", success: false, error });
    }
});

router.post("/get-chart-pacients-by-age-categories", authMiddleware, async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.body.userId });
        const appointments = await Appointment.find({ doctorId: doctor._id });

        const pacientsByAge = {
            "<15 ani": 0,
            "15-25 ani": 0,
            "26-35 ani": 0,
            "36-45 ani": 0,
            "46-55 ani": 0,
            ">55 ani": 0,
        };

        for (let i = 0; i < appointments.length; i++) {
            const pacientCNP = appointments[i].userInfo.CNP;
            let yearPacientCNP = parseInt(pacientCNP.substring(1, 3));
            if (yearPacientCNP >= 0 && yearPacientCNP <= 30) {
                yearPacientCNP = 2000 + yearPacientCNP;
            }
            else {
                yearPacientCNP = 1900 + yearPacientCNP;
            }

            let monthPacientCNP = parseInt(pacientCNP.substring(3, 5));

            let dayPacientCNP = parseInt(pacientCNP.substring(5, 7));

            const dateOfBirth = moment({ year: yearPacientCNP, month: monthPacientCNP - 1, day: dayPacientCNP });

            if (dateOfBirth.isValid()) {
                const age = moment().diff(moment(dateOfBirth), 'years');
                if (age < 15) {
                    pacientsByAge["<15 ani"]++;
                } else if (age >= 15 && age <= 25) {
                    pacientsByAge["15-25 ani"]++;
                } else if (age >= 26 && age <= 35) {
                    pacientsByAge["26-35 ani"]++;
                } else if (age >= 36 && age <= 45) {
                    pacientsByAge["36-45 ani"]++;
                } else if (age >= 46 && age <= 55) {
                    pacientsByAge["46-55 ani"]++;
                } else {
                    pacientsByAge[">55 ani"]++;
                }
            }
        }
        const chartData = [
            { name: "<15 ani", value: pacientsByAge['<15 ani'] },
            { name: "15-25 ani", value: pacientsByAge['15-25 ani'] },
            { name: "26-35 ani", value: pacientsByAge['26-35 ani'] },
            { name: "36-45 ani", value: pacientsByAge['36-45 ani'] },
            { name: "46-55 ani", value: pacientsByAge['46-55 ani'] },
            { name: ">55 ani", value: pacientsByAge['>55 ani'] },
        ]


        res.status(200).send({ message: "Lista programărilor transmisă cu succes", success: true, data: chartData });

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Eroare la transmiterea listei programărilor", success: false, error });
    }
});

module.exports = router;