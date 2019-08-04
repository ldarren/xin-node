const pMysql = require('picos-mod-mysql')
const company = require('../models/company.js')

const appConfig = { path: '', env: 'pro' }
const { mods } = require('../cfg/' + process.env.XIN_CFG)

const xinKey = 'xin.com'
const xinEnv = require('../cfg/app.xin.env.json')
const xinPerm = [1, 0]

pMysql.create(appConfig, mods.storage1, (err, storage1) => {
	if (err) return console.error(err)
	pMysql.create(appConfig, mods.storage2, (err, storage2) => {
		if (err) return console.error(err)
		company.setup({storage1, storage2}, () => {
			company.get(xinKey, (err, ret) => {
				if (err) return console.error(err)
				console.log(ret)
				if (ret.length) return console.log('done')
				company.set(xinKey, 0, xinEnv, xinPerm, err => {
					if (err) return console.error(err)
					console.log('done')
				})
			})
		})
	})
})
