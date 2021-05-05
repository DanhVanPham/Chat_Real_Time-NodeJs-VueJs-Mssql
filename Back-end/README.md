# chat-app-back-end

## Project setup
```
npm install
```

#### `npm start` and `npm test`

`npm start` and `npm test` are also lifecycle scripts but are not executed automatically.

```json
{
    "name": "chat-app-back-end",
    "version": "1.0.0",
    "description": "Backend: Nodejs, mssql(Microsoft Sql Server)",
    "main": "server.js",
    "scripts": {
        "start": "nodemon serve.js",
        "test": "echo \"Error: no test specified\" && exit 1"
    },
}
```

Therefore they can be executed simply with:

```console
$ npm test
$ npm start
```

### Customize configuration
See [Configuration Reference](https://www.npmjs.com/package/config).
