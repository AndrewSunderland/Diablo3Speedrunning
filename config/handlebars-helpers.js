const tableNameToPathName = {
    "Acts":"acts",
    "Players":"players",
    "Classes":"classes",
    "Act_Runs": "act-runs",
    "Platforms": "platforms"
};

function truncate(date) {
    let d = date.toString().split(' ');
    return d[0] + " " + d[1] + " " + d[2] + " " + d[3];
}

function capitalize(s) {
    return s[0].toUpperCase() + s.slice(1);
}

function addIfPlatform(str) {
    if (str === 'platform') {
        str += ' (may be omitted)'
    } else if (str === 'time') {
        str += ' (Format := \'HH:MM:SS\')'
    } else if (str === 'player') {
        str += ' name'
    }
    return str;
}

module.exports = {
    removeLastChar: s => s ? s.substring(0, s.length - (s === 'Classes' ? 2 : 1)) : s,
    tableToPath: tableName => tableNameToPathName[tableName],
    stripIdSuffex: s => s.endsWith('Id') ? s.substring(0, s.length - 2) : s,
    hiddenifId: s => s !== 'id' ? "text" : "hidden",
    removeTime: date => truncate(date),
    formatKey: s => {
        let str = s.endsWith('Id') ? s.substring(0, s.length - 2) : s;
        return capitalize(addIfPlatform(str));
    },
    setType: s => {
        if (s === 'date') {
            return s;
        }
        return 'text';
    }
}
