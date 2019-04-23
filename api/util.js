const pObj = require('pico-common').export('pico/obj')

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
		const route = routes[req.method]
		if (!route) next(this.error(404, `${req.method} ${this.api} is not valid`))
		next(null, route)
	},
	validate(spec){
		return (body, next) => {
			const found = pObj.validate(spec, body)
			if (!found) return next()
			return next(`invalid params [${found}]`)
		}
	},
	output(body, next){
		this.setOutput(body)
		return next()
	},
	extractParams(output, next){
		Object.assign(output, this.params)
		return next()
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
	}
}
