const group = require('../models/group')

module.exports = {
	setup(ctx, cb){
		return cb()
	},
	save(user, body, next){
		const name = body.name
		if (!name) return next('missing name')
		group.save(name, user.id, body, [0, 1], (err, ret) => {
			if (err) return next(err)
			this.setOutput({id: ret.insertId})
			return next()
		})
	},
	list(user, output, next){
		group.list(user.id, (err, res) => {
			if (err) return next(err)
			output.push(...res)
			return next()
		})
	}
}
