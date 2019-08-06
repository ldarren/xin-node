let company1, company2
const dummyCB = err => (err ? console.error(err) : null)

function parse(ret){
	return ret.map(row => {
		if (row.env) row.env = JSON.parse(row.env)
		if (row.perm) row.perm = JSON.parse(row.perm)
		return row
	})
}

module.exports = {
	setup(ctx, cb){
		const storage1 = ctx.storage1
		company1 = storage1.t('company', storage1.hash(), ['name'])
		company1().ready.on(err => {
			if (err) return cb(err)
			console.log('company table connected')
			cb()
		})

		const storage2 = ctx.storage2
		company2 = storage2.t('company', storage2.hash(), ['name'])
	},
	set(name, cby, env, perm, cb){
		company2()
			.insert(['name', 'state', 'cby', 'uby', 'env', 'perm'])
			.values([name, 1, cby, cby, JSON.stringify(env), JSON.stringify(perm)])
			.exec(dummyCB)
		company1()
			.insert(['name', 'state', 'cby', 'uby', 'env', 'perm'])
			.values([name, 1, cby, cby, JSON.stringify(env), JSON.stringify(perm)])
			.exec(cb)
	},
	get(name, cb, state = 1){
		company1().where({name, state}).exec((err, ret) => {
			if (err) return cb(err)
			cb(null, parse(ret))
		})
	},
	list(cby, cb, state = 1){
		company1().select().where({cby, state}).exec((err, ret) => {
			if (err) return cb(err)
			cb(null, parse(ret))
		})
	},
	update(id, cby, body, cb){
		company2().update(body).where({id, cby}).exec(dummyCB)
		company1().update(body).where({id, cby}).exec(cb)
	},
	delete(name, cby, cb){
		company2().update({state:0}).where({name, cby}).exec(dummyCB)
		company1().update({state:0}).where({name, cby}).exec(cb)
	}
}
