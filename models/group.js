let group

function parse(ret){
	return ret.map(row => {
		if (row.env) row.env = JSON.parse(row.env)
		if (row.perm) row.perm = JSON.parse(row.perm)
		return row
	})
}

module.exports = {
	setup(ctx, cb){
		const storage = ctx.storage
		group = ctx.storage.t('group', storage.hash(), ['name'])
		group().ready.on(err => {
			if (err) return cb(err)
			console.log('group table connected')
			cb()
		})
	},
	set(name, cby, env, perm, cb){
		group()
			.insert(['name', 'state', 'cby', 'uby', 'env', 'perm'])
			.values([name, 1, cby, cby, JSON.stringify(env), JSON.stringify(perm)])
			.exec(cb)
	},
	get(name, cb, state = 1){
		group().where({name, state}).exec((err, ret) => {
			if (err) return cb(err)
			cb(null, parse(ret))
		})
	},
	list(cby, cb, state = 1){
		group().select().where({cby, state}).exec((err, ret) => {
			if (err) return cb(err)
			cb(null, parse(ret))
		})
	},
	update(name, cby, body, cb){
		group().update(body).where({name, cby}).exec(cb)
	},
	delete(name, cby, cb){
		group().update({state:0}).where({name, cby}).exec(cb)
	}
}
