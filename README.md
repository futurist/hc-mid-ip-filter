# hc-mid-ip-filter

[honeycomb hc-bee](https://github.com/node-honeycomb/hc-bee) middleware to filter client ip.

### install

```sh
npm i -S hc-mid-ip-filter
```

### usage

In file `config/config_default.js`

```js
{
    ...
    middleware:{
        ipFilter:{
            config: {
                allow: [
                    '22.22.22.22',
                    '22.22.0.0/12',
                    '33.33',
                ],
                deny: [
                    '23.23'
                ]
            }
        }
    }
}

```

The `allow`, `deny` array format please reference [netmask](https://github.com/rs/node-netmask)

