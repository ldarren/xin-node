const pObj = require('pico-common').export('pico/obj')
const pStr = require('pico-common').export('pico/str')
const ACAH = 'Access-Control-Allow-Headers'
const acrh = 'access-control-request-headers'
const ACAM = 'Access-Control-Allow-Methods'
const ALL_METHODS = 'GET,PUT,POST,DELETE,PATCH,OPTIONS'

module.exports = {
	setup(ctx, cb){
		//ctx.sigslot.signalAt('* * * * * *', 'sayNow')
		cb()
	},
	logReq(req, log, next){
		log.id = pStr.rand()
		log.now = Date.now()
		console.log(JSON.stringify({
			i: log.id,
			t: log.now,
			a: req.method,
			u: req.url,
			h: req.rawHeaders
		}))

		next()
	},
	logRes(res, log, output, next){
		console.log(JSON.stringify({
			i: log.id,
			e: Date.now() - log.now,
			s: res.statusCode,
			m: res.statusMessage,
			o: output
		}))
		
		next()
	},
	filterMethod(req, res, next){
		switch(req.method){
		case 'OPTIONS':
		case 'HEAD':
			res.setHeader(ACAH, req.headers[acrh])
			res.setHeader(ACAM, ALL_METHODS)
			return next(null, this.sigslot.abort())
		}
		next()
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
		console.log(JSON.stringify(msg)); return next()
	},
	sayNow(next){
		console.log(Date.now())
		next()
	}
}
