/* Namespaces are just normal javaScript objects */

var personGenerator = (function() {
  var loadingIcon = {
    show: function() {
      var source = $('#loading').html();
      var template = Handlebars.compile(source);
      // no context
      var html  = template();

      $(html).prependTo('.people-container').fadeIn();
    },
    hide: function() {
      $('.loader').remove();
    }
  };

  // constructor inside of a namespace object
  function Person(data) {
    // this pertains to any new instance
    this.info = {
      name: {
        first: data.name.first,
        last:  data.name.last
      },
      image: data.picture.large,
      details: {
        city: data.location.city,
        state: data.location.state,
        email: data.email,
        cell: data.cell
      }
    };
    this.createTemplate = function() {
      var source = $('#person').html();
      var template = Handlebars.compile(source);
      var context = this.info;
      var html  = template(context);

      $(html).prependTo('.people-container').fadeIn();
    };
    this.createTemplate();
  }

  // ajax call to get one person
  function makePerson() {
    loadingIcon.show();
    $.ajax({
      url: 'https://randomuser.me/api/',
      dataType: 'json',
      success: function(rawData) {
        loadingIcon.hide();
        var newPerson = new Person(rawData.results[0]);
        console.log(newPerson);
      }
    });
  }

  function init() {
    Handlebars.registerHelper('get-full-name', function(nameObj) {
      return nameObj.first + ' ' + nameObj.last;
    });
    $('.container').on('click', '.person-button', function() {
      makePerson(); // ajax call
    });
  }
  init();
})();
