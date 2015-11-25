/**
 * Created by yang on 2015/11/25.
 */
var LdapClient = require('../index.js');

describe('ldap', function() {
    it('searchOU', function(done) {
        var client = new LdapClient({
            ldapUrl: 'ldap://192.168.1.81:389',
            userDn: 'administrator@ad.yliyun.com',
            password: 'yliyun@123'
        });
        client.searchOU('dc=ad,dc=yliyun,dc=com').then(function(ous) {
            console.log(ous);
            done();
        }).catch(done);
    });
});