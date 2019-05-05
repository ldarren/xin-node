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
	extractToken(req, output, next){
		const token = req.headers['authorization']
		if (!token || !token.length) return next(this.error(403))
		Object.assign(output, {
			accessToken: token.substr('Bearer '.length)
		})
		return next()
	},
	verify(input, output, next){
		const token = input.accessToken
		const payload = getTokenPayload(token)
		if (!payload) return next(this.error(403))

		Object.assign(output, payload)

		return next()
	},
	setUser(jwt, body, output, next){
		if ('xin.com' !== body.company) return (this.error(403))
		Object.assign(output, {
			accessToken: body.accessToken
		})
		model.get(jwt.username, (err, ret) => {
			if (err) return next(this.error(404, err))
			if (ret, ret.length) {
				Object.assign(output, ret[0])
				return next()
			}

			const payload = getTokenPayload(body.idToken)
			if (!payload) return next(this.error(400))
			if (payload['cognito:username'] !== jwt.username) return next(this.error(400))

			const user = {
				username: jwt.username,
				email: payload.email,
				email_state: payload.email_verified ? 1 : 0,
				phone: payload.phone_number,
				phone_state: payload.phone_number_verified ? 1 : 0,
			}

			model.set(user, (err, ret) => {
				if (err) return next(this.error(400, err))
				user.id = ret.insertId
				Object.assign(output, user)
				return next()
			})
		})
	},
	getUser(jwt, output, next){
		model.get(jwt.username, (err, ret) => {
			if (err) return next(this.error(400, err))
			if (!ret || !ret.length) return next()
			Object.assign(output, ret[0])
			return next()
		})
	}
}
