require('dotenv').config();

const express = require('express');
const url = require('../models/url');
const router = express.Router();
const URLMODEL = require('../models/url');

router.post('/', getId, validateBody, removeId, async (req, res) => {
  const original_url = res.locals.url,
  id = res.locals.id;

  let host = process.env.HOST || "";
  if (host === 'localhost') {
    host += `:${process.env.PORT}`;
  }
  let shortened_url = `${host}/shorten/${id}`;

  const url_model = new URLMODEL({
    shortened: shortened_url,
    original: original_url,
    url_id: id,
  });

  try {
    await url_model.save();
    res.render('shortened', { shortened_url });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:url_id', async (req, res) => {
  try {
    const urlObj = await URLMODEL.find({ url_id: req.params.url_id });

    if (urlObj.length === 0) return res.status(404).render('not_found', { errType: 'url' });
    
    res.status(301).redirect(urlObj[0].original);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

function getId(req, res, next) {
  const alphanum = '1the2quick3brown4fox5jumped6over7the8lazy9dog0'.split('');
  const IDLEN = 5;

  if (req.body.url_id === '') {
    let generatedId = '', 
    uppCount = Math.floor(Math.random() * IDLEN);

    // generate random charaters from alphanum
    for (let i = 0; i < IDLEN; i++) {
      generatedId += alphanum[Math.floor(Math.random() * alphanum.length)];
    }

    // uppercase random characters
    for (let i = 0; i < uppCount; i++) {
      const uppIndex = Math.floor(Math.random() * IDLEN);
      generatedId = `${generatedId.slice(0,uppIndex)}${generatedId[uppIndex].toUpperCase()}${generatedId.slice(uppIndex+1)}`;
    }

    res.locals.id = generatedId;
    return next();
  }

  res.locals.id = req.body.url_id;
  next();
}

function removeId(req, res, next) {
  URLMODEL.findOneAndDelete({ url_id: res.locals.id }, () => next());
}

// Server-side Validation
function validateBody(req, res, next) {
  const url = req.body.original_url;

  if (req.body.url_id.length > 0) {
    const idRegex = new RegExp('^[a-zA-Z0-9]*$');
    if (req.body.url_id.length !== 5) {
      return res.status(400).json({ error: "Id length must be 5." });
    } else if (!idRegex.test(req.body.url_id)) {
      return res.status(400).json({ error: "Id must only contain alphanumeric characters." });
    }
  }

  if (url === "") {
    return res.status(400).json({ error: "Url is missing." });
  } else if (!url || !validateUrl(url)) {
    return res.status(400).json({ error: "Invalid url." });
  }

  res.locals.url = url;
  next();
}

function validateUrl(urlstr) {
  try {
    let url = new URL(urlstr);
    return url.protocol === 'http:' || url.protocol == 'https:';
  } catch(err) {
    return false;
  }
}


module.exports = router;