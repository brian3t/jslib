function pluckRecursive(input, prop, collect) {
    collect = collect || [];

    if (_.isArray(input)) {
        _.forEach(input, function (value, key) {
            pluckRecursive(value, prop, collect);
        });
    } else if (_.isObject(input)) {
        _.forEach(input, function (value, key) {
            if (key === prop) {
                collect.push(value);
            } else {
                pluckRecursive(value, prop, collect);
            }
        });
    }

    return collect;
}

/**
 * Return street addr and City / State ZIP Country
 * e.g. var full_address = '18101 Von Karman Ave, Irvine, CA 92612, USA'; full_address_to_addr_city(full_address) = 1801, CA 92
 * @param full_address e.g. 18101 Von Karman Ave, Irvine, CA 92612, USA
 * @return array [street city , state zip Country]
 */
function full_address_to_addr_city(full_address) {
    var result = [];
    // var full_address = '18101 Von Karman Ave, Irvine, CA 92612, USA';
    var re = /, [A-Z]{2}\s\d+,/ig;
    var match = re.exec(full_address);
    if (typeof match !== 'object' || !match.hasOwnProperty('index')) {
        return [full_address, ''];
    }
    else {
        return [full_address.slice(0, match.index), full_address.slice(match.index + 1)];
    }
}

/**
 * Returns non-empty string, e.g. not null, not ''
 * @param str
 * @returns {boolean}
 */
function is_nonempty_str(str) {
    return (typeof str !== "undefined") &&
        (typeof str.valueOf() === "string") && (str.length > 0);
}