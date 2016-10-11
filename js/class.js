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

  function updateCount() {
    var count = $('.person-container').length;
    var message = count === 1 ? count + ' Person Created' : count + ' People Created';
    $('.people-count').text(message);
  }

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

  function updateSettings(customSettings) {
    if (typeof customSettings === 'object') {
      settings = customSettings;
    } else {
      console.log('Settings provided were in an incorrect form');
    }
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
        updateCount();
      }
    });
  }
  function deletePerson() {
    console.log('delete');
  }

  var selectedPeople = {
    toggleDeleteButton: function() {
      $('.delete-button').fadeToggle();
    },
    deleteRecords: function() {
      $('.person-container.active').remove();
      this.toggleDeleteButton();
      updateCount();
    }
  };

  function init() {
    Handlebars.registerHelper('get-full-name', function(nameObj) {
      return nameObj.first + ' ' + nameObj.last;
    });

    // $('.container').on('click', '.person-button', function() {
    //   makePerson(); // ajax call
    // });

    $('.people-container').on('click', '.person-container', function() {
      console.log('selected');
      var lastCount = $('.person-container.active').length;
      $(this).toggleClass('active');
      var currentCount = $('.person-container.active').length;

      if (lastCount === 0 || (lastCount === 1 && currentCount === 0)) {
        selectedPeople.toggleDeleteButton();
      }
    });

    $('.container').on('click', '.delete-button', function() {
      selectedPeople.deleteRecords();
    });
  }
  return {
    run: init,
    create: makePerson,
    customSettings: updateSettings
  };

  // init();
})();


// revealing module pattern
personGenerator.run();
personGenerator.customSettings({
  nationality: 'fr',
  gender: 'male'
});

$('.container').on('click', '.person-button', function() {
  personGenerator.create();
});
