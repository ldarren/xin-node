const path = require('path')
const pJWT = require('pico-jwt')
const { jwk2pem } = require('pem-jwk')
const model = require('../models/user')

let jwts

function createJWTs(jwks){
	return jwks.keys.reduce((acc, jwk) => {
		acc[jwk.kid] = new pJWT(jwk.alg, null, jwk2pem(jwk))
		return acc
	}, {})
}

function getTokenPayload(token){
	const header = pJWT.prototype.header(token)
	if (!header) return
	const jwt = jwts[header.kid]
	if (!jwt) return

	if (!jwt.verify(token)) return

	return jwt.payload(token)
}

module.exports = {
	setup(ctx, cb){
		const appCfg = ctx.config.app
		const jwks = require(path.join(appCfg.configPath, appCfg.jwks))
		jwts = createJWTs(jwks)
		cb()
	},
	verify(req, output, next){
		let token = req.headers["Authorization"]
		if (!token || !token.length) return next({code: 403})
		token = token.substr('bearer '.length)

		const payload = getTokenPayload(token)
		if (!payload) return next({code: 403})

		if (config.client_id !== payload.client_id) return next({code: 403})

		Object.assign(output, payload)

		return next()
	},
	setUser(jwt, body, output, next){
		model.get(jwt.username, jwt.client_id, (err, ret) => {
			if (err) return next(err)
			if (ret) {
				Object.assign(output, ret)
				return next()
			}

			const payload = getTokenPayload(body.token)
			if (!payload) return next({code: 403})
			if (payload['cognito:username'] === jwt.username) return next({code: 403})

			const user = {
				username: jwt.username,
				client_id: jwt.client_id,
				email: payload.email,
				email_state: payload.email_verified ? 1 : 0,
				phone: payload.phone_number,
				phone_state: payload.phone_number_verified ? 1 : 0,
			}

			model.set(user, (err, ret) => {
				if (err) return next(err)
				user.id = ret[0];
				Object.assign(output, user)
				return next()
			})
		})
	},
	getUser(jwt, output, next){
		model.get(jwt.username, jwt.client_id, (err, ret) => {
			if (err) return next(err)
			Object.assign(output, ret)
			return next()
		})
	}
}
