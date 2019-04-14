let group

module.exports = {
	setup(ctx, cb){
		const storage = ctx.storage
		const hash = storage.hash()
		group = ctx.storage.t('group', hash, ['name'])
		return cb()
	},
	save(body, next){
		const name = body.name
		if (!name) return next('missing name')
		group().insert(['name', 'region', 'Bucket', 'IdentityPoolId', 'UserPoolId', 'ClientId']).values([body])
		return next()
	},
	list(output, next){
		group().select().exec((err, res) => {
			if (err) return next(err)
			output.push(...res)
			return next()
		})
	}
}
