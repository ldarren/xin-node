let user

module.exports = {
	setup(ctx, cb){
		const storage = ctx.storage
		user = ctx.storage.t('user', storage.hash(), ['username'])
		user().ready.on(err => {
			if (err) return cb(err)
			console.log('user table connected')
			cb()
		})
	},
	set(obj, cb){
		const input = Object.assign({}, obj, { state: 1 })
		user()
			.insert(['username', 'state', 'email', 'phone'])
			.values([input])
			.exec(cb)
	},
	get(username, cb, state = 1){
		user().where({username, state}).exec(cb)
	},
}
