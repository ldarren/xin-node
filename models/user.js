let user

module.exports = {
	setup(ctx, cb){
		const storage = ctx.storage
		user = ctx.storage.t('user', storage.hash(), ['username', 'state'])
		user().ready.on(err => {
			if (err) return cb(err)
			console.log('user table connected')
			cb()
		})
	},
	save(username, email, phone, cb){
		user()
			.insert(['username', 'email', 'phone'])
			.values([username, email, phone])
			.exec(cb)
	},
	get(username, cb, state = 1){
		user().where({username, state}).exec(cb)
	},
}
