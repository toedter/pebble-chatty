/**
 * This little Pebble app accesses the Chatty RESTful web service,
 * see https://github.com/toedter/chatty
 *
 * Copyright (c) 2016 Kai Toedter
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
    ajax(
        {
            url: 'https://chatty42.herokuapp.com/api',
            type: 'json'
        },
        function (data) {
            switch (e.itemIndex) {
                case 0:
                    showMessages(data._links['chatty:messages'].href.replace(/{.*}/g, ''));
                    break;
                case 1:
                    showUsers(data._links['chatty:users'].href.replace(/{.*}/g, ''));
                    break;
                default:
                    showBuildInfo(data._links['chatty:buildinfo'].href);
            }
        },
        function (error) {
            showError('cannot get Chatty API');
        }
    );
});

function showBuildInfo(uri) {
    ajax(
        {
            url: uri,
            type: 'json'
        },
        function (data) {
            var menu = new UI.Menu({
                backgroundColor: 'white',
                textColor: 'black',
                highlightBackgroundColor: 'green',
                highlightTextColor: 'black',
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
            showError('cannot get build info');
        }
    );
}

function showMessages(uri) {
    ajax(
        {
            url: uri + '?projection=excerpt',
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
                backgroundColor: 'white',
                textColor: 'red',
                highlightBackgroundColor: 'red',
                highlightTextColor: 'yellow',
                sections: [{
                    title: 'Chat Messages',
                    items: myItems
                }]
            });
            menu.show();
        },
        function (error) {
            showError('cannot get messages');
        }
    );
}

function showUsers(uri) {
    ajax(
        {
            url: uri,
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
                backgroundColor: 'white',
                textColor: 'blue',
                highlightBackgroundColor: 'blue',
                highlightTextColor: 'yellow',
                sections: [{
                    title: 'Users',
                    items: myItems
                }]
            });
            menu.show();
        },
        function (error) {
            showError('cannot get users');
        }
    );
}

function showError(text) {
    var errorCard = new UI.Card({
        title:'Error',
        body:text
    });
    errorCard.show();
}

