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
