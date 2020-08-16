if (!Object.entries) {
    Object.entries = function (obj) {
        var ownProps = Object.keys(obj),
            i = ownProps.length,
            resArray = new Array(i); // preallocate the Array

        while (i--)
            resArray[i] = [ownProps[i], obj[ownProps[i]]];
        return resArray;
    };
}

class HttpClient {

    constructor() {
    }

    get(path, options = {}) {
        assignDefaultsIfAbsent(options, {
            headers: {},
            params: {},
            responseType: 'json'
        });
        return httpMethod('GET', path, null, options);
    }

    put(path, body, options = {}) {
        assignDefaultsIfAbsent(options, {
            headers:  {'Content-Type': 'application/json'},
            params: {},
            responseType: 'json'
        });
        return httpMethod('PUT', path, body, options);
    }

    post(path, body, options = {}) {
        assignDefaultsIfAbsent(options, {
            headers:  {'Content-Type': 'application/json'},
            params: {},
            responseType: 'json'
        });
        return httpMethod('POST', path, body, options);
    }

    delete(path, options = {}) {
        assignDefaultsIfAbsent(options, {
            headers: {},
            params: {},
            responseType: 'json'
        });
        return httpMethod('DELETE', path, null, options);
    }
}

function assignDefaultsIfAbsent(options, defaultOptions) {
    Object.keys(defaultOptions).filter(key => !(key in options)).forEach(key => options[key] = defaultOptions[key]);
}

function httpMethod(method, path, body, options = {}) {
    return new Promise(((resolve, reject) => {
        const http = new XMLHttpRequest();
        http.onreadystatechange = () => {
            if (http.readyState === 4) {
                let mapper = x => x;
                if (options.responseType === 'json') {
                    mapper = s => JSON.parse(s);
                }
                if (200 <= http.status && http.status < 400) {
                    resolve(mapper(http.response));
                } else if (400 <= http.status && http.status < 600) {
                    reject({
                        response: mapper(http.response),
                        status: http.status,
                        statusText: http.statusText
                    });
                }
            }
        };
        const paramString = Object.entries(options.params).map(entry => {
            if (typeof entry[1] == 'object') {
                return entry[1].map(val => `${entry[0]}=${val}`).join('&');
            }
            return `${entry[0]}=${entry[1]}`;
        }).join('&');
        if (paramString) {
            path = `${path}?${paramString}`;
        }
        http.open(method, path, true);
        Object.entries(options.headers).forEach((entry) => http.setRequestHeader(entry[0], entry[1]));
        if (body && options.headers['Content-Type'] && options.headers['Content-Type'].includes('application/json')) {
            body = JSON.stringify(body);
        }
        http.send(body);
    }));
}
