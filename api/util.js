module.exports = {
	setup(ctx, cb){
		//ctx.sigslot.signalAt('* * * * * *', 'sayNow')
		cb()
	},
	route(req, next){
		switch(req.method){
		case 'POST': return next()
		case 'GET': this.setOutput(this.time)
		// fall through
		default: return next(null, this.sigslot.abort())
		}
	},
	branch(req, routes, next){
	console.log('>>>', routes)
		const route = routes[req.method]
		if (!route) next(this.error(404, `${req.method} ${this.api} is not valid`))
		next(null, route)
	},
	help(next){
		next(this.error(404, `api ${this.api} is not supported yet`))
	},
	say(msg, next){
		console.log(msg); return next()
	},
	sayNow(next){
		console.log(Date.now())
		next()
	},
	output(body, next){
		console.log('###', body)
		this.setOutput(body)
		return next()
	}
}
