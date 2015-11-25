/**
 * Created by yang on 2015/11/18.
 */
var Promise = require('bluebird');
var ldapjs = require('ldapjs');

module.exports = LdapClient;

function LdapClient(options) {
    this._client = ldapjs.createClient({
        url: options.ldapUrl,
        bindDN: options.userDn,
        bindCredentials: options.password,
        reconnect: true
    });
}

LdapClient.prototype.disconnect = function() {
    if (this._client) {
        this._client.destroy();
    }
};

LdapClient.prototype.searchOU = function(base) {
    var options = {
        base: base,
        filter: '(objectclass=organizationalUnit)'
    };
    return this.search(options).then(function(rows) {
        return rows.map(function(r) {
            return _parseOU(r);
        });
    });
};

LdapClient.prototype.searchUser = function(base) {
    var options = {
        base: base,
        filter: '(&(objectclass=user)(!(objectclass=computer)))'
    };
    return this.search(options).then(function(rows) {
        return rows.map(function(r) {
            return _parseUser(r);
        });
    });
};

LdapClient.prototype.auth = function(dn, pwd) {
    var _that = this;
    return new Promise(function(resolve, reject) {
        _that._client.bind(dn, pwd, function(err) {
            if (err) {
                reject(err);
                return;
            }
            _that._client.unbind();
            resolve();
        });
    });
};

LdapClient.prototype.search = function(options) {
    var _that = this;
    return new Promise(function(resolve, reject) {
        var rows = [];
        var opt = {
            scope: options.scope || 'one',
            paged: options.paged || true,
            filter: options.filter
        };
        _that._client.search(options.base, opt, function(err, res){
            if (err) {
                reject(err);
            }
            res.on('searchEntry', function(entry) {
                rows.push(entry.object);
            });
            res.on('error', function(err) {
                reject(err);
            });
            res.on('end', function(result) {
                resolve(rows);
            });
        });
    });
};

function _parseOU(entry) {
    var ou = {
        ldapDn: entry.dn,
        deptName: entry.displayName
    };
    if (!ou.deptName) {
        ou.deptName = entry.name;
    }
    if (!ou.deptName) {
        ou.deptName = entry.ou;
    }
    return ou;
}

function _parseUser(entry) {
    var user = {
        //dn: entry.dn,
        ldapDn: entry.userPrincipalName,
        userName: entry.sAMAccountName,
        realName: entry.displayName,
        mail: entry.userPrincipalName
    };
    if (!user.realName) {
        user.realName = entry.name;
    }
    if (!user.realName) {
        user.realName = entry.cn;
    }
    return user;
}