const group = require('../models/group')

module.exports = {
	setup(ctx, cb){
		return cb()
	},
	set(user, body, next){
		const name = body.name
		if (!name) return next('missing name')
		group.set(name, user.id, body, [0, 1], (err, ret) => {
			if (err) return next(err)
			this.setOutput({id: ret.insertId})
			return next()
		})
	},
	get(grp, next){
		group.get(grp.name, (err, ret) => {
			if (err) return next(err)
			if (!ret || !ret.length) return next('not found')
			Object.assign(grp, ret[0])
			return next()
		})
	},
	list(user, output, next){
		group.list(user.id, (err, ret) => {
			if (err) return next(err)
			output.push(...ret)
			return next()
		})
	}
}
