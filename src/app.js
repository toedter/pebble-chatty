/**
 * This little Pebble app accesses the Chatty RESTful web service,
 * see https://github.com/toedter/chatty
 *
 * Copyright (c) 2014 Kai Toedter
 * All rights reserved.
 * Licensed under MIT License, see http://toedter.mit-license.org/
*/

var UI = require('ui');
var ajax = require('ajax');

var mainMenu = new UI.Menu({
    sections: [{
        title: 'Chatty',
        items: [{
            title: 'Messages'
        }, {
            title: 'Users'
        }, {
            title: 'Version'
        }]
    }]
});

mainMenu.show();

mainMenu.on('select', function (e) {
    switch (e.itemIndex) {
        case 0:
            showMessages();
            break;
        case 1:
            showUsers();
            break;
        default:
            showBuildInfo();
    }
});

function showBuildInfo() {
    ajax(
        {
            url: 'http://chatty-toedter.gigantic.io/api/buildinfo',
            type: 'json'
        },
        function (data) {
            var menu = new UI.Menu({
                sections: [{
                    title: 'Build Info',
                    items: [{
                        title: 'Version',
                        subtitle: data.version
                    }, {
                        title: 'Timestamp',
                        subtitle: data.timeStamp
                    }]
                }]
            });
            menu.show();
        },
        function (error) {
            console.log('error getting Chatty buildinfo');
        }
    );
}

function showMessages() {
    ajax(
        {
            url: 'http://chatty-toedter.gigantic.io/api/messages?projection=excerpt',
            type: 'json'
        },
        function (data) {
            var messages = data._embedded['chatty:messages'];
            var myItems = [];

            for (var i = 0; i < messages.length; i++) {
                myItems[i] = {};
                myItems[i].title = messages[i].author.id;
                myItems[i].subtitle = messages[i].text;
            }

            var menu = new UI.Menu({
                title: 'Chat Messages',
                sections: [{
                    items: myItems
                }]
            });
            menu.show();
        },
        function (error) {
            console.log('error getting Chatty messages');
        }
    );
}

function showUsers() {
    ajax(
        {
            url: 'http://chatty-toedter.gigantic.io/api/users',
            type: 'json'
        },
        function (data) {
            var users = data._embedded['chatty:users'];
            var myItems = [];

            for (var i = 0; i < users.length; i++) {
                myItems[i] = {};
                myItems[i].title = users[i].fullName;
                myItems[i].subtitle = users[i].email;
            }

            var menu = new UI.Menu({
                title: 'Users',
                sections: [{
                    items: myItems
                }]
            });
            menu.show();
        },
        function (error) {
            console.log('error getting Chatty users');
        }
    );
}

