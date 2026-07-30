const express = require('express');
const router = express.Router();
const { upload } = require('../utils/multer');
const serviceController = require('../controllers/serviceController');

const serviceUpload = upload.fields([
  { name: 'heroImage', maxCount: 1 },
  { name: 'cardImage', maxCount: 1 },
  { name: 'iconImage', maxCount: 1 }
]);

router.post('/', serviceUpload, serviceController.createService);
router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);
router.put('/:id', serviceUpload, serviceController.updateService);
router.delete('/:id', serviceController.deleteService);

module.exports = router;
