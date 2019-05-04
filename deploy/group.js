const pico = require('pico-common/bin/pico-cli')
const pMysql = require('picos-mod-mysql')
const group = require('../models/group.js')

const appConfig = { path: '', env: 'pro' }
const { mods } = require('../cfg/' + process.env.XIN_CFG)

const xinKey = 'xin.com'
const xinEnv = require('../cfg/app.xin.env.json')
const xinPerm = [1, 0]

pMysql.create(appConfig, mods.storage, (err, cli) => {
	if (err) return cb(err)
	group.setup({storage: cli}, () => {
		group.get(xinKey, (err, ret) => {
			if (err) return console.error(err)
			console.log(ret)
			if (ret.length) return console.log('done')
			group.set(xinKey, 0, xinEnv, xinPerm, err => {
				if (err) return console.error(err)
				console.log('done')
			})
		})
	})
})
