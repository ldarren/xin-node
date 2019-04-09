const path = require('path')
const pJWT = require('pico-jwt')
const { jwk2pem } = require('pem-jwk')

let jwts

function createJWTs(jwks){
	return jwks.keys.reduce((acc, jwk) => {
		acc[jwk.kid] = new pJWT(jwk.alg, null, jwk2pem(jwk))
		return acc
	}, {})
}

module.exports = {
	setup(ctx, cb){
		const jwks = require(path.join(ctx.config.app.configPath, ctx.config.app.jwks))
		jwts = createJWTs(jwks)
		cb()
	},
	verify(token, payload, next){
		const header = pJWT.prototype.header(token)
		if (!header) return next({code: 400})
		const jwt = jwts[header.kid]
		if (!jwt) return next({code: 400})

		if (!jwt.verify(token)) return next({code: 400})

		Object.assign(payload, jwt.payload(token))

		next()
	}
}
