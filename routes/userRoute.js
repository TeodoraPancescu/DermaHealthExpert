const express = require('express');
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const Doctor = require('../models/doctorModel');
const Appointment = require("../models/appointmentModel")
const Category = require("../models/categoryModel")
const moment = require("moment");
const Disease = require('../models/diseaseModel');
const Review = require('../models/reviewsModel');
const Location = require('../models/locationModel');
const { v4: uuidv4 } = require('uuid');
const stripe = require('stripe')('sk_test_51NKodjC3q6Bx6qttuFrONoFybnkgrD0S2d61qQ2wjIklsloGgtVkf4Byd5RscIM2ID9wLNyGm64W9JR3mKXqGyed00HWj598BO');

router.post("/register", async (req, res) => {
  try {
    const { nume, prenume, CNP, email, parola } = req.body;

    // Verifică dacă CNP-ul are exact 13 caractere
    if (CNP.length !== 13) {
      return res.status(400).json({
        success: false,
        message: "CNP-ul trebuie să aibă exact 13 caractere!",
      });
    }

    // Verifică dacă adresa de email are formatul corect
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Adresa de email nu are un format valid!",
      });
    }

    // Verifică dacă adresa de email există deja în baza de date
    const userExistent = await User.findOne({ email });
    if (userExistent) {
      return res.status(200).send({
        message: "Adresa de email există deja în baza de date!",
        success: false,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const parolaDescifrata = await bcrypt.hash(parola, salt);
    req.body.parola = parolaDescifrata;

    const userNou = new User({
      nume,
      prenume,
      CNP,
      email,
      parola: parolaDescifrata,
    });

    await userNou.save();

    res
      .status(200)
      .send({ message: "Contul a fost creat cu succes!", success: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Eroare la crearea contului!", success: false, error });
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "Email-ul nu a fost găsit în baza de date!", success: false });
    }
    const aceeasiParola = await bcrypt.compare(req.body.parola, user.parola);
    if (!aceeasiParola) {
      return res
        .status(200)
        .send({ message: "Parola este incorecta", success: false });
    }
    else {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d"
      })
      res
        .status(200)
        .send({ message: "Te-ai autentificat cu succes!", success: true, data: token })
    }

  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Eroare la autentificat!", success: false, error })
  }
});

router.post('/get-user-info-by-id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId })
    user.parola = undefined;
    user.parola = undefined;
    if (!user) {
      return res.status(200).send({ message: "Utilizator inexistent", success: false });
    } else {
      res.status(200).send({
        success: true,
        data: user
      });
    }
  } catch (error) {
    res.status(500).send({ message: "Eroare la preluarea informatiilor despre utilizator", success: false, error });

  }
});


router.post("/aplica-cont-doctor", authMiddleware, async (req, res) => {
  try {
    const { emailDoctor, numarTelefon, imagineDoctor, selectedCategory, cvDoctor } = req.body;
    console.log(cvDoctor)
    // const { emailDoctor, numarTelefon, imagineDoctor, selectedCategory} = req.body;

    if (!imagineDoctor) {
      return res.status(400).send({ success: false, message: 'Nu s-a încărcat nicio imagine' });
    }

    if (!cvDoctor) {
      return res.status(400).send({ success: false, message: 'Nu s-a încărcat niciun CV' });
    }

    // Validare email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailDoctor)) {
      return res.status(400).send({ success: false, message: 'Introduceți o adresă de email validă!' });
    }

    // Validare număr de telefon
    const phoneNumberDigits = numarTelefon.replace(/\D/g, '');
    if (phoneNumberDigits.length !== 10) {
      return res.status(400).send({ success: false, message: 'Numărul de telefon trebuie să conțină exact 10 cifre!' });
    }

    const doctorNou = new Doctor({ ...req.body, status: 'pending', imagineDoctor: imagineDoctor, category: selectedCategory, cvDoctor: cvDoctor });
    // const doctorNou = new Doctor({ ...req.body, status: 'pending', imagineDoctor: imagineDoctor, category: selectedCategory });
    await doctorNou.save();
    const adminUser = await User.findOne({ esteAdmin: true });

    const unseenNot = adminUser.unseenNot;
    unseenNot.push({
      type: 'cerere-noua-adaugare-medic',
      message: `${doctorNou.numeDoctor} ${doctorNou.prenumeDoctor} a aplicat pentru cont de doctor`,
      data: {
        doctorId: doctorNou._id,
        name: doctorNou.numeDoctor + ' ' + doctorNou.prenumeDoctor
      },
      onClickPath: '/admin/doctorsList'
    });

    await User.findByIdAndUpdate(adminUser._id, { unseenNot });

    res.status(200).send({
      success: true,
      message: "S-a aplicat cu succes pentru contul de doctor",
      doctor: doctorNou
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Eroare la crearea contului de doctor!", success: false, error });
  }
});

router.post("/marcheaza-notificari-citite", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    const unseenNot = user.unseenNot;
    const seenNot = user.seenNot;
    seenNot.push(...unseenNot);
    user.unseenNot = [];
    user.seenNot = seenNot;
    const updatedUser = await user.save();
    updatedUser.parola = undefined;
    res.status(200).send({
      success: true,
      message: "Toate notificările marcate ca citite",
      data: updatedUser,
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Eroare la marcarea ca citit a notificărilor!", success: false, error });
  }
});

router.post("/sterge-notificari", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    user.seenNot = [];
    user.unseenNot = [];
    const updatedUser = await user.save();
    updatedUser.parola = undefined;
    res.status(200).send({
      success: true,
      message: "Toate notificările șterse",
      data: updatedUser,
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Eroare la ștergerea notificărilor!", success: false, error });
  }
});

router.get("/get-all-approved-doctors", authMiddleware, async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: "aprobat" }).populate("category");
    res.status(200).send({ message: "Lista doctorilor transmisă cu succes", success: true, data: doctors })

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Eroare la transmiterea listei doctorilor", success: false, error });
  }
});

router.post('/book-appointment', authMiddleware, async (req, res) => {
  try {
    req.body.status = "pending";
    req.body.date = moment(req.body.date).format('YYYY-MM-DD');
    req.body.ora = moment(req.body.ora, "HH:mm:ss").format('HH:mm:ss');
    const newAppointment = new Appointment(req.body);
    await newAppointment.save();

    // Send notifications to the doctor based on their userId
    const user = await User.findOne({ _id: req.body.doctorInfo.userId });
    user.unseenNot.push({
      type: "new-appointment-request",
      message: `Pacientul ${req.body.userInfo.nume} ${req.body.userInfo.prenume} a făcut o nouă cerere de programare`,
      onClickPath: '/doctor/appointments',
    });
    await user.save();

    res.status(200).send({
      message: "Programare făcută cu succes!",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Eroare la crearea programarii",
      success: false,
      error,
    });
  }
});


router.post('/check-booking-availability', authMiddleware, async (req, res) => {
  try {
    const doctorId = req.body.doctorId;
    const ora = req.body.ora + ":00";
    const timeFormat = 'HH:mm:ss';
    const selectedTime = moment(ora, timeFormat);

    const oneHourAfterSelectedTime = moment(ora, timeFormat).add(1, 'hours');

    const appointments = await Appointment.find({
      doctorId,
      date: req.body.date,
    });

    const filteredData = appointments.filter(appointment => {
      const itemTime = appointment.ora;
      const appointmentTime = moment(itemTime, timeFormat);
      const oneHourAfterAppointmentTime = moment(itemTime, timeFormat).add(1, 'hours');
      return (selectedTime.isSameOrAfter(appointmentTime) && selectedTime.isBefore(oneHourAfterAppointmentTime)) ||
        (selectedTime.isBefore(appointmentTime) && !oneHourAfterSelectedTime.isSameOrBefore(appointmentTime))

    });

    if (filteredData.length > 0) {
      return res.status(200).send({
        message: "Doctorul nu este disponibil pentru acea oră!",
        success: false,
      });
    } else {
      return res.status(200).send({
        message: "Doctorul este disponibil pentru acea oră!",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Eroare la verificarea disponibilității programării!",
      success: false,
      error,
    });
  }
});

router.get("/get-appointments-by-user-id", authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.body.userId });
    res.status(200).send({ message: "Lista programărilor transmisă cu succes", success: true, data: appointments })

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Eroare la transmiterea listei programărilor", success: false, error });
  }
});


router.get("/get-categories", authMiddleware, async (req, res) => {
  try {
    const categories = await Category.find().populate('services');
    res.status(200).send({ message: "Lista categoriilor transmisă cu succes", success: true, data: categories })

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Eroare la transmiterea listei categoriilor", success: false, error });
  }
});

router.get("/get-disease", authMiddleware, async (req, res) => {
  try {
    const diseases = await Disease.find();
    res.status(200).send({ message: "Lista afecțiunilor transmisă cu succes", success: true, data: diseases });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Eroare la transmiterea listei afecțiunilor", success: false, error });
  }
});

router.post("/get-reviews", authMiddleware, async (req, res) => {
  try {
    const doctorId = req.body.doctorId;
    console.log(doctorId)
    const reviews = await Review.find({ doctorId: doctorId }).populate({
      path: 'userId',
      select: 'nume prenume',
      model: 'users'
    });
    res.status(200).send({ message: "Lista recenziilor transmisă cu succes", success: true, data: reviews });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Eroare la transmiterea listei recenziilor", success: false, error });
  }
});

router.post("/add-reviews", authMiddleware, async (req, res) => {
  try {
    const { description, doctorId, userId, ratingNumber } = req.body;
    console.log(ratingNumber)
    const doctor = await Doctor.findById(doctorId)
    const user = await User.findById(userId)
    const recenzieNoua = new Review({ description, doctorId: doctor._id, userId: user._id, ratingNumber });
    await recenzieNoua.save();

    doctor.reviews.push(recenzieNoua._id);
    await doctor.save();

    user.reviews.push(recenzieNoua._id);
    await user.save();
    res.status(200).send({
      success: true,
      message: "Noua Recenzie s-a adaugat cu succes",
      data: recenzieNoua
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Eroare la adăugarea unei noi recenzii!", success: false, error });
  }
});

router.get('/location', async (req, res) => {
  try {
    const locations = await Location.find();
    res.status(200).send({
      success: true,
      message: "Locatia s-a adaugat cu succes",
      data: locations
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Eroare la trimiterea locației!' });
  }
});

router.post("/make-payment", authMiddleware, async (req, res) => {
  try {
    const { token, amount } = req.body;
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });
    const payment = await stripe.charges.create(
      {
        amount: amount,
        currency: "RON",
        customer: customer.id,
        receipt_email: token.email,
      },
      {
        idempotencyKey: uuidv4(),
      }
    );

    if (payment) {
      res.status(200).send({
        message: "Avans plătit cu succes!",
        data: {
          transactionId: payment.source.id,
        },
        success: true,
      });
    } else {
      res.status(500).send({
        message: "Nu a reușit plata avansului!",
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Nu a reușit plata avansului!",
      success: false,
    });
  }
});

router.delete('/appointments/:appointmentId', authMiddleware, async (req, res) => {
  const appointmentId = req.params.appointmentId;

  try {
    // Caută și șterge programarea cu ID-ul dat
    const deletedAppointment = await Appointment.findByIdAndDelete(appointmentId);

    if (deletedAppointment) {
      res.status(200).json({ message: 'Programarea a fost ștearsă cu succes.' });
    } else {
      res.status(404).json({ message: 'Programarea nu a fost găsită.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'A apărut o eroare în timpul ștergerii programării.' });
  }
});

router.post("/update-user-profile", authMiddleware, async (req, res) => {
  try {
    if (req.body.newPassword && req.body.oldPassword) {
      const oldPassword = req.body.oldPassword;
      const user = await User.findById(req.body._id);
      const isPasswordCorect = await brcypt.compare(
        oldPassword,
        user.password
      );
      if (!isPasswordCorect) {
        throw new Error("The old password is incorrect");
      }
      const newPassword = await brcypt.hash(req.body.newPassword, 15);
      req.body.password = newPassword;
    }
    const updatedUser = await User.findByIdAndUpdate(req.body._id, req.body, {
      new: true,
    }).select("-password");
    res.status(200).json({
      message: "Utilizator modificat cu succes",
      success: true,
      data: updatedUser,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false
    })
  }
}
)

router.get("/get-all-users-doctors", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({ esteDoctor: true, esteAdmin: false });
    res.status(200).send({ message: "Lista userilor doctori transmisă cu succes", success: true, data: users })

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Eroare la transmiterea listei userilor doctori", success: false, error });
  }
});

router.get("/get-all-users-pacients", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({ esteDoctor: false, esteAdmin: false });
    res.status(200).send({ message: "Lista userilor pacienti transmisă cu succes", success: true, data: users })

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Eroare la transmiterea listei userilor pacienti", success: false, error });
  }
});

module.exports = router;