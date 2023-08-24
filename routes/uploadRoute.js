const express = require('express');
const multer = require('multer');
const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Definiția endpoint-ului de încărcare a imaginilor
router.post('/', upload.single('image'), (req, res) => {
  // Accesează informațiile despre imagine din req.file
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nu s-a încărcat nicio imagine' });
    }
    console.log(req)
    const doctorId = req.boby.doctorId;
    console.log(doctorId)

    // Salvare în baza de date sau altă logică aferentă
    // Aici poți utiliza modulul mongoose sau metodele specifice bazei de date pe care o folosești

    // Exemplu de răspuns cu mesaj de succes
    res.status(200).json({ message: 'Imaginea a fost încărcată cu succes' });
  } catch (error) {
    console.log("Upload")
  }


});

module.exports = router;
