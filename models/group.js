let group

module.exports = {
	setup(ctx, cb){
		const storage = ctx.storage
		group = ctx.storage.t('user', storage.hash(), ['name', 'state', 'cby', 'uby', 'cat', 'uat'])
		group().ready.on(err => {
			if (err) return cb(err)
			console.log('group table connected')
			cb()
		})
	},
	save(name, env, perm, cb){
		group()
			.insert(['name', 'env', 'perm'])
			.values([name, JSON.stringify(env), JSON.stringify(perm)])
			.exec(cb)
	},
	get(name, cb, state = 1){
		group().where({name, state}).exec(cb)
	},
	list(cby, cb, state = 1){
		group().where({cby, state}).exec(cb)
	}
}
