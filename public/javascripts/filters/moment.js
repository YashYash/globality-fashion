// Simple moment filter, used to parse dates in the html
app.constant('moment', moment);
app.filter('moment', function() {
  return function(dateString, format, calendar) {
    if (format === 'calendar') {
      return moment(dateString).calendar();
    } else {
      return moment(dateString).format(format);
    }
  };
});