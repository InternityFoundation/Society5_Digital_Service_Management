var express = require('express');
const multer = require('multer');
const uuidv4 = require('uuid/v4');
var router = express.Router();
const middleware = require('../lib/middleware/index');
const digitalIdentityCtrl = require('../controllers/digital/identity');

const checkSessionExist = (req, res, next) => {
    if (req.isAuthenticated()) {
        if (req.user || req.session) {
            res.redirect('/dashboard');
        } else {
            res.redirect('/login');
        }
    } else {
        next();
    }
};

const fileFilter = function (req, file, cb) {
    if (file) {
        cb(null, true);
    } else {
        cb(new Error('Only XML file allowed!'));
    }
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/file/');
    },
    filename: function (req, file, cb) {
        cb(null, [uuidv4(), file.originalname.split('.')[1]].join('.'));
    }
});

const upload = multer({
    fileFilter: fileFilter,
    storage: storage
});

/**
Add digital identity
 */
router.post('/identity', upload.single('file'), (req, res) => {
    digitalIdentityCtrl.addDigitalIdentity(req).then((result) => {
        res.json({
            status: 'success',
            message: 'Added record successfully',
            data: result
        })
    }).catch((err) => {
        res.json({
            status: 'failure',
            message: err.message,
            data: err
        });
    })
})

/**
 * Get digital identity
 */
router.get('/identity', (req, res) => {
    digitalIdentityCtrl.getDigitalIdentity(req.user).then((result) => {
        res.json({
            status: 'success',
            message: 'Get Identity record successfully',
            data: result,
        })
    }).catch((err) => {
        res.json({
            status: 'failure',
            message: err.message,
            data: err
        });
    });
});

/**
Add digital document
 */
router.put('/identityVerification', (req, res) => {
    digitalIdentityCtrl.verifyDigitalIdentity(req).then((result) => {
        res.json({
            status: 'success',
            message: 'Added record successfully',
            data: result
        })
    }).catch((err) => {
        res.json({
            status: 'failure',
            message: err.message,
            data: err
        });
    })
})

/**
Add digital document
 */
router.post('/document', upload.single('file'), (req, res) => {
    digitalIdentityCtrl.addDigitalDocument(req).then((result) => {
        res.json({
            status: 'success',
            message: 'Added record successfully',
            data: result
        })
    }).catch((err) => {
        res.json({
            status: 'failure',
            message: err.message,
            data: err
        });
    })
})

/**
 * Get digital document
 */
router.get('/document', (req, res) => {
    digitalIdentityCtrl.getDigitalDocument(req.user).then((result) => {
        res.json({
            status: 'success',
            message: 'Get Digital Document record successfully',
            data: result,
        })
    }).catch((err) => {
        res.json({
            status: 'failure',
            message: err.message,
            data: err
        });
    })
})

module.exports = router;