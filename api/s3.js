// Load the SDK for JavaScript
const AWS = require('aws-sdk')
// Create S3 service object
const s3 = new AWS.S3({apiVersion: '2006-03-01'})

/*
const mime = require('emailjs-mime-parser')
const { TextDecoder } = require('text-encoding')

const params = {
	Bucket: 'jasaws-admin-mailbox'
}

s3.listObjects(params, (err, data) => {
	if(err)throw err
	const {Name:Bucket, Contents} = data

	s3.getObject({Bucket, Key: Contents[0].Key}, (err, obj) => {
		if (err) throw err

		const parsed = mime.default(obj.Body.toString('utf-8'))
		console.log('eml', new TextDecoder('utf-8').decode(parsed.childNodes[1].content))
	})
})
*/

module.exports = {
	setup(ctx, cb){
		AWS.config.update({region: 'us-east-1'})
		cb()
	},
	list(output, next){
		const params = {
			Bucket: 'jasaws-admin-mailbox'
		}

		s3.listObjects(params, (err, data) => {
			if (err) return next(err)
			Object.assign(output, data)
			return next()
		})
	},
	read(output, next){
		const params = {
			Bucket: 'jasaws-admin-mailbox',
			Key: this.params.key
		}
		s3.getObject(params, (err, obj) => {
			if (err) return next(err)

			Object.assign(output, obj)
			return next()
		})
	}
}
