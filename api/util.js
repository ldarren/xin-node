const BOOLS = [true, false, 1, 0]

function validate(spec, body){
	return Object.keys(spec).find(k => {
		const s = spec[k]
		const required = !!s.required
		const val = body[k]

		if (!val){
			if (required) return true
			return false
		}

		switch(s.type || s){
		case 'string':
			return !val.charAt
		case 'number':
			return (isNaN(parseFloat(val)) || !isFinite(val))
		case 'boolean':
			return !BOOLS.includes(val)
		case 'object':
			if (!(val instanceof Object) || Array.isArray(val)) return true
			if (!s.spec) return false
			return validate(s.spec, val)
		case 'array':
			if (!(val instanceof Object) || !Array.isArray(val)) return true
			if (!s.spec) return false
			return val.find(i => validate(s.spec, i))
		default: return true
		}
	})
}

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
			const found = validate(spec, body)
			if (!found) return next()
			return next(`invalid params [${found}]`)
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
