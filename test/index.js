const pJWT = require('pico-jwt')
const { jwk2pem } = require('pem-jwk')
const jwks = require('../cfg/jwks.jasa.json')
const jwts = require('./jwts.json')

const pems = jwks.keys.reduce((acc, jwk) => {
	acc[jwk.kid] = jwk2pem(jwk)
	return acc
}, {})

function verify(token){
	const header = pJWT.prototype.header(token)
console.log('>>>0', header)
	if (!header) return false
	const pem = pems[header.kid]
console.log('>>>1', pem)
	if (!pem) return false

	const jwt = new pJWT('RS256', null, pem)
console.log('>>>2', jwt.verify(token))
	return jwt.verify(token)
}

if (verify(jwts.id)){
	console.log(pJWT.prototype.payload(jwts.id))
}

if (verify(jwts.access)){
	console.log(pJWT.prototype.payload(jwts.access))
}
