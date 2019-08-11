# xin-node
Kloud Konsole Xin service api server

## setup
after cloning the project do a

```
npm ci
```

to install the dependencies

xin service has following main dependencies
- mysql database
- AWS cognito service

## setup config
xin-node is powered by [pico-api](https://github.com/ldarren/pico-api), and hence they shared the same configuration format.

create a configuration file as below, and save it to `cfg/xin.json`
```json
{
    "app":{
		"signalTTL": 60000,
		"master": true,
		"apis": [
			"api/index.json"
		],
		"models": [
			"models/index.js"
		]
    },
    "mods":{
        "webServer":{
            "mod":"web",
            "allowOrigin":"*",
            "sep":["&"],
            "uploadWL":[],
            "port":8888
        },
        "storage1":{
            "mod":"picos-mod-mysql",
			"master": {
				"host": "{MAIN_DB_DOMAIN}",
				"port": {MAIN_DB_PORT},
				"user": "{MAIN_DB_USER}",
				"password": "{MAIN_DB_PASS}",
				"database": "{MAIN_DB_NAME}",
				"acquireTimeout": 120000,
				"waitForConnections": true,
				"connectionLimit": 2,
				"queueLimit": 99
			}
		},
		"storage2":{
            "mod":"picos-mod-mysql",
			"master": {
				"host": "{SEC_DB_DOMAIN}",
				"port": {SEC_DB_PORT},
				"user": "{SEC_DB_USER}",
				"password": "{SEC_DB_PASS}",
				"database": "{SEC_DB_NAME}",
				"acquireTimeout": 120000,
				"waitForConnections": true,
				"connectionLimit": 2,
				"queueLimit": 99
			}
		}
    }
}
```

### setup sql database
update `cfg/xin.json` with your database configuration, after that execute `cfg/table.sql` to main and secondary databases
```sql
mysql -u{username} -p < cfg/table.sql
```

after that, update `cfg/app.kloudkonsole.env.json` with the cognito setting then run:
```
npm run migrate
```
to populate required data to the main and secondary databases

### setup cognito
download jwks setting from AWS cognito, with following url, replace the string in `{}`
```
wget https://cognito-idp.{region}.amazonaws.com/{userPoolId}/.well-known/jwks.json
```

keep the jwks.json in `cfg/` and add the path in `xin.dev.json`
