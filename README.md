# hc-mid-ip-filter

[honeycomb hc-bee](https://github.com/node-honeycomb/hc-bee) middleware to filter client ip.

### install

```sh
npm i -S hc-mid-ip-filter
```

### usage

In file `config/config_production.js`

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

For the `allow`, `deny` array format, please see [netmask](https://github.com/rs/node-netmask).

To allow all ips, set `allow` to `['0.0.0.0/0']`.
