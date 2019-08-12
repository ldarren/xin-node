const company = require('../models/company')

module.exports = {
	setup(ctx, cb){
		return cb()
	},
	set(user, body, output, next){
		company.set(body.name, user.id, body, [0, 1], (err, ret) => {
			if (err) return next(err)
			Object.assign(output, {id: ret.insertId, name:body.name})
			return next()
		})
	},
	get(com, next){
		company.get(com.name, (err, ret) => {
			if (err) return next(err)
			if (!ret || !ret.length) return next(this.error(400, 'not found'))
			Object.assign(com, ret[0])
			return next()
		})
	},
	list(user, output, next){
		company.list(user.id, (err, ret) => {
			if (err) return next(this.error(400, err))
			output.push(...ret)
			return next()
		})
	},
	update(user, com, body, output, next){
		company.update(com.id, user.id, {env: JSON.stringify(body)}, (err, ret) => {
			if (err) return next(err)
			Object.assign(output, ret)
			return next()
		})
	},
	delete(user, com, output, next){
		company.delete(com.name, user.id, (err, ret) => {
			if (err) return next(err)
			Object.assign(output, ret)
			return next()
		})
	}
}
