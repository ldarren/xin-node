let group

module.exports = {
	setup(ctx, cb){
		const storage = ctx.storage
		group = ctx.storage.t('group', storage.hash(), ['name', 'state', 'cby', 'uby', 'cat', 'uat'])
		group().ready.on(err => {
			if (err) return cb(err)
			console.log('group table connected')
			cb()
		})
	},
	save(name, cby, env, perm, cb){
		group()
			.insert(['name', 'cby', 'env', 'perm'])
			.values([name, cby, JSON.stringify(env), JSON.stringify(perm)])
			.exec(cb)
	},
	get(name, cb, state = 1){
		group().where({name, state}).exec(cb)
	},
	list(cby, cb, state = 1){
		group().select().where({cby, state}).exec((err, ret) => {
			if (err) return cb(err)
			const arr = ret.map(row => {
				if (row.env) row.env = JSON.parse(row.env)	
				if (row.perm) row.perm = JSON.parse(row.perm)
				return row
			})
			cb(null, arr)
		})
	}
}
