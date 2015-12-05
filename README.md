# node-ldap
node ldap client

# 安装

```
npm install node-ldap
```

# 使用

已通过Windows Server 2008测试

```javascript

var LdapClient = RedisClient('node-ldap');

var client = new LdapClient({
    ldapUrl: 'ldap://192.168.1.81:389',
    userDn: 'administrator@ad.yliyun.com',
    password: 'yliyun@123'
});


 // 用户认证
client.auth('administrator@ad.yliyun.com', 'yliyun@123').then(function() {
    console.log('success');
}).catch(function(err) {
    console.error(err);    
});

// 搜索部门
client.searchOU('dc=ad,dc=yliyun,dc=com').then(function(ous) {
    console.log(ous);
}).catch(function(err) {
    console.error(err);    
});

// 搜索用户
client.searchUser('dc=ad,dc=yliyun,dc=com').then(function(users) {
    console.log(users);
}).catch(function(err) {
    console.error(err);    
});

// 搜索
client.searchUser({
    base: 'dc=ad,dc=yliyun,dc=com',
    scope: 'sub', // 默认为'one'
    paged: 'true', // 默认为true
    filter: '(objectclass=organizationalUnit)'
}).then(function(rows) {
    console.log(rows);
}).catch(function(err) {
    console.error(err);    
});

// 断开连接
client.disconnect();


```


