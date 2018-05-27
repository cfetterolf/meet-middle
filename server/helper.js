const async = require('async');

/*
 * Endpoint to guess an email address
 *  body:
 *    f_name    the contact's first name
 *    l_name    the contact's last name
 *    company   the contact's company
 *    custom    custom email ending (ex gmail.com)
 */
exports.getEmailAddress = (request, response) => {
  const f_name = request.body.f_name;
  const l_name = request.body.l_name;
  const company = request.body.company;
  const custom = request.body.custom;

  let emails = []
  let email = company ? company+'.com' : custom;

  // make gmail all caps to avoid verification issue
  email = (email === 'gmail.com') ? email.toUpperCase() : email;

  // contruct different forms of potential email
  emails.push(f_name+'.'+l_name+'@'+email);
  emails.push(f_name+'_'+l_name+'@'+email);
  emails.push(f_name+l_name+'@'+email);
  emails.push(l_name+'@'+email);
  emails.push(f_name.substring(0,1)+l_name+'@'+email);
  emails.push(f_name.substring(0,1)+'_'+l_name+'@'+email);
  emails.push(f_name+l_name.substring(0,1)+'@'+email);
  emails.push(f_name+'@'+email);

  let validArr = [], tryAgainArr = [], verFailArr = [];

  async.forEach(emails, function(addr, callback) {
    needle('post', 'http://mailtester.com/testmail.php', { email: addr })
    .then(function(response) {

      // the messages to search for
      const html = response.body;
      const noVer = `Server doesn't allow e-mail address verification`;
      const tooSoon = `4.2.1 The user you are trying to contact is receiving mail at a rate that`
      const success = `E-mail address is valid`;

      // Check for 403
      if (html.includes('403 Forbidden')) {
        response.send({
          err: '403 Forbidden'
        });
      }

      if (html.includes(success)) {
        validArr.push(addr.toLowerCase());
      } else if (html.includes(noVer)) {
        verFailArr.push(addr.toLowerCase());
      } else if (html.includes(tooSoon)) {
        tryAgainArr.push(addr.toLowerCase());
      }

      callback();
    }).catch(err => response.send({ err: 'Please try again later' }));
  }, function(err) {
      if (err) {
        response.send({ error: err });
      }
      else {
        response.send({
          valid: validArr,
          verFail: verFailArr,
          tryAgain: tryAgainArr
        })
      }
  });
}

/*
 * Sends an email from USER_EMAIL account to DEST_EMAIL
 *
 *  body:
 *    to:       DEST_EMAIL
 *    from:     USER_EMAIL
 *    name:     USER_NAME
 *    password: USER_PASSWORD
 *    subject:  subject line of email
 *    content:  body of email
 */
exports.sendEmail = (request, response) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: request.body.from,
      pass: request.body.password,
    },
  });

  const mailOptions = {
    from: `"${request.body.name}" <${request.body.from}>`,
    to: request.body.to,
    subject: request.body.subject,
    text: request.body.content,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      response.send({ error: err });
    } else {
      response.send({ info: info });
    }
  });
}
