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

function inTimeFormat(s) {
    let pattern = new RegExp('([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])');
    return s.match(pattern) !== null;
}

function validateForm(formId) {
    return new Promise((resolve, reject) => {
        const form = document.getElementById(formId);
        const elements = form.querySelectorAll('input');
        elements.forEach(element => {
            let fName = element.name;
            let fValue = element.value;
            if (fName !== 'platform' && fValue === '') {
                reject(fName + " cannot be left blank.");
            } else if (fName === 'time' && !inTimeFormat(fValue)) {
                 reject(fName + " must be in format 'HH:MM:SS'.");
            }
        });
        resolve();
    });
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

const httpClient = new HttpClient();

function createRecord(type, formId) {
    let item = formToObj(formId);
    let arr = Object.entries(item);
    return httpClient.post("/api/" + type, item);
}

function updateRecord(type, formId) {
    let item = formToObj(formId);
    return httpClient.put("/api/" + type + "/" + item.id, item);
}

function filterByRecord(type, name) {
    return httpClient.get("/api/" + type + "/" + name, {responseType: 'text'});
}

function deleteRecord(type, id) {
    return httpClient.delete("/api/" + type + "/" + id, {responseType: 'text'});
}

function formToObj(formId) {
    const obj = {};
    const form = document.getElementById(formId);
    const elements = form.querySelectorAll('input');
    elements.forEach(element => {
        if (element.name) {
            if (element.type === "checkbox") {
                obj[element.name] = element.checked;
            } else {
                obj[element.name] = element.value;
            }
        }
    });
    return obj;
}

function getNewLocation(formId) {
    let object = formToObj(formId);
    let keys = Object.entries(object).map(entry => entry[0] + '=' + entry[1]);
    let url= window.location.pathname;
    let separator = (url.indexOf("?")===-1)?"?":"&";
    return url + separator + keys.join('&');
}

function populateForm(formId, obj) {
    const form = document.getElementById(formId);
    const elements = form.querySelectorAll('input');
    elements.forEach(element => {
        if (element.name in obj) {
            element.value = obj[element.name];
        }
    });
}

function nonEmpty(formId) {

}



