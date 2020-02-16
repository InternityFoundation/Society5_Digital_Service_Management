
const sgMail = require('@sendgrid/mail');
const expressHandlebars = require('express-handlebars');
sgMail.setApiKey(process.env.apiKey);
const path = require('path');
const config = require('../config/index');

const hbs = expressHandlebars.create({
	partialsDir: path.join(__dirname, '../views/emailTemplates/'),
	extname: '.hbs',
});
const sendMail = function (mailOptions, callback) {
	sgMail.send(mailOptions, function (error, result) {
		callback(error, result);
	});
};


/**
 * This function creates mail options
 * @param {array} receipientList 
 * @param {string} subject 
 * @param {html} html 
 */
var createMailOptions = function (recipientList, subject, html, sourceEmail) {
	let mailOptions = {
		from: sourceEmail,
		to: recipientList,
		subject,
		html
	};
	return mailOptions;
};

const createTemplate = (templateName, data) => new Promise((resolve, reject) => {
	const templatePath = path.join(__dirname, `../views/emailTemplates/${templateName}.hbs`);
	hbs.render(templatePath, data)
		.then((res) => {
			resolve(res);
		})
		.catch((err) => {
			reject(err);
		});
});

const rtiClaim = (data) => new Promise(
	(resolve, reject) => {
		const host = config.appUrl;
		createTemplate('rtiClaim', {
			name: data.name,
			host,
			filename: data.fileName,
			amount: data.amountDonated,
		}).then((html) => {
			const mailOptions = createMailOptions(data.email, 'RTI claim for disaster relief', html, 'admin@essentiallink.com');
			sendMail(mailOptions, (err, result) => {
				if (err) {
					console.log(`Email failed ${err}`);
					reject(err);
				} else {
					console.log(`Email send ${result}`);
					resolve(result);
				}
			});
		});
	},
);

const donateReceipt = (data) => new Promise(
	(resolve, reject) => {
		createTemplate('donateReceipt', {
			name: data.name,
			amount: data.amount,
			transactionId:data.paymentTxId,
		}).then((html) => {
			const mailOptions = createMailOptions(data.email, 'Donation Receipt for disaster relief', html, 'admin@essentiallink.com');
			sendMail(mailOptions, (err, result) => {
				if (err) {
					reject(err);
				} else {
					resolve(result);
				}
			});
		});
	},
);

module.exports = {
	rtiClaim,
	donateReceipt,
};