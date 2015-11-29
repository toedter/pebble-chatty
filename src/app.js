/**
 * This are just quick tests to get experience with Pebble.js
 */

var UI = require('ui');
var ajax = require('ajax');

// Create a Card with title and subtitle
var card = new UI.Card({
  title:'Chatty',
  subtitle:'Press right buttons...'
});

// Display the Card
card.show();

card.on('click', 'up', function(e) {
  ajax(
    {
      url: 'http://chatty-toedter.gigantic.io/api/buildinfo',
      type: 'json'
    },
    function(data) {
      var version = data.version;
      var timestamp = data.timeStamp;
      var menu = new UI.Menu({
        sections: [{
          items: [{
            title: 'Version',
            subtitle: version
          }, {
            title: 'Timestamp',
            subtitle: timestamp
          }]
        }]
      });
      menu.show(); 
    },
    function(error) {
      card.body('error getting Chatty buildinfo');
    }
  );
});

card.on('click', 'select', function(e) {
  ajax(
    {
      url: 'http://chatty-toedter.gigantic.io/api/messages?projection=excerpt',
      type: 'json'
    },
    function(data) {
      var messages = data._embedded['chatty:messages'];
      var myItems = [];
      
      for (var i = 0; i < messages.length; i++) {
        myItems[i] = {};
        myItems[i].title = messages[i].author.id;
        myItems[i].subtitle = messages[i].text;
      }   
      
      var menu = new UI.Menu({
        sections: [{
          items: myItems
        }]
      });
      menu.show(); 
    },
    function(error) {
      card.body('error getting Chatty messages');
    }
  );
});

card.on('click', 'down', function(e) {
  ajax(
    {
      url: 'http://chatty-toedter.gigantic.io/api/users',
      type: 'json'
    },
    function(data) {
      var users = data._embedded['chatty:users'];
      var myItems = [];
      
      for (var i = 0; i < users.length; i++) {
        myItems[i] = {};
        myItems[i].title = users[i].fullName;
        myItems[i].subtitle = users[i].email;
      }   
      
      var menu = new UI.Menu({
        sections: [{
          items: myItems
        }]
      });
      menu.show(); 
    },
    function(error) {
      card.body('error getting Chatty users');
    }
  );
});

