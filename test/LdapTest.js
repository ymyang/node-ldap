/**
 * Created by yang on 2015/11/25.
 */
var LdapClient = require('../index.js');

describe('ldap', function() {
    it('searchOU', function(done) {
        var client = new LdapClient({
            ldapUrl: 'ldap://192.168.0.30:389',
            userDn: 'administrator@yliyun.com',
            password: 'yliyun@123'
        });
        client.searchOU('dc=yliyun,dc=com').then(function(ous) {
            console.log(ous);
            done();
        }).catch(done);
    });

    it.only('auth', function(done) {
        var client = new LdapClient({
            ldapUrl: 'ldap://192.168.0.30:389',
            userDn: 'administrator@yliyun.com',
            password: 'yliyun@123'
        });
        client.auth('yang@yliyun.com', 'yliyun@123').then(function() {
            console.log('auth ok');
            done();
        }).catch(function(err) {
            console.log(JSON.stringify(err));
            console.error(err);
            done();
        });
    });
});