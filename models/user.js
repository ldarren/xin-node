let user1, user2
const dummyCB = err => console.error(err)

module.exports = {
	setup(ctx, cb){
		const storage1 = ctx.storage1
		user1 = storage1.t('user', storage1.hash(), ['username'])
		user1().ready.on(err => {
			if (err) return cb(err)
			console.log('user table connected')
			cb()
		})

		const storage2 = ctx.storage2
		user2 = storage2.t('user', storage2.hash(), ['username'])
	},
	set(obj, cb){
		const input = Object.assign({}, obj, { state: 1 })
		user2()
			.insert(['username', 'state'])
			.values([input])
			.exec(dummyCB)
		user1()
			.insert(['username', 'state'])
			.values([input])
			.exec(cb)
	},
	get(username, cb, state = 1){
		user1().where({username, state}).exec(cb)
	},
}
