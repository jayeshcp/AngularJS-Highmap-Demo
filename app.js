(function() {
  'use strict';

  var app = angular.module('app', []);

  app.controller('mainCtrl', function($scope, DB) {
    $scope.mydata = DB.getStatesData();
  });

  app.directive('myMap', function(DB) {
    return {
      restrict: 'EA',
      template: '<div class="chart"></div>',
      replace: true,
      scope: {
        mydata: '=',
        title: '='
      },
      link: function(scope, elem, attrs) {
        var data = {
          core: Highcharts.geojson(Highcharts.maps['countries/us/us-all']),
          mydata: scope.mydata
        };

        var small = $('#container').width() < 400;

        // Set drilldown pointers
        $.each(data.core, function(i) {
          this.drilldown = this.properties['hc-key'];
        });

        var mapConfig = {
          chart: {
            events: {
              drilldown: function(e) {

                if (!e.seriesOptions) {
                  var chart = this,
                    mapKey = 'countries/us/' + e.point.drilldown + '-all',
                    // Handle error, the timeout is cleared on success
                    fail = setTimeout(function() {
                      if (!Highcharts.maps[mapKey]) {
                        chart.showLoading('<i class="icon-frown"></i> Failed loading ' + e.point.name);

                        fail = setTimeout(function() {
                          chart.hideLoading();
                        }, 1000);
                      }
                    }, 3000);

                  // Show the spinner
                  chart.showLoading('<i class="icon-spinner icon-spin icon-3x"></i>');
                  
                  // Load the drilldown map
                  $.getScript('https://code.highcharts.com/mapdata/' + mapKey + '.js', function() {

                    data.core = Highcharts.geojson(Highcharts.maps[mapKey]);
                    data.mydata = DB.getCountyData(e.point.drilldown);

                    // Hide loading and add series
                    chart.hideLoading();
                    clearTimeout(fail);
                    chart.addSeriesAsDrilldown(e.point, {
                      name: e.point.name,
                      mapData: data.core,
                      data: data.mydata,
                      joinBy: ['hc-key', 'code'],
                      dataLabels: {
                        enabled: true,
                        //format: '{point.name}'
                        formatter: function() {
                          console.log(this);
                          if (this.point.value !== null) {
                            return this.point.name;
                          } else {
                            return null;
                          }
                        }
                      }
                    });
                  });
                }

                this.setTitle(null, {
                  text: e.point.name
                });
              },
              drillup: function() {
                this.setTitle(null, {
                  text: 'USA'
                });
              }
            }
          },

          title: {
            text: scope.title,
            style: {
            	color: '#bf360c'
            }
          },

          subtitle: {
            text: 'USA',
            floating: true,
            align: 'right',
            y: 50,
            style: {
              fontSize: '16px',
              color: '#78909c'
            }
          },

          legend: small ? {} : {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
          },

          colorAxis: {
            min: 0,
            minColor: '#fbe9e7',
            maxColor: '#dd2c00'
          },

          mapNavigation: {
            enabled: false,
            buttonOptions: {
              verticalAlign: 'bottom'
            }
          },

          plotOptions: {
            map: {
              states: {
                hover: {
                  color: '#EEDD66'
                }
              }
            }
          },

          series: [{
            //data : data,
            mapData: data.core,
            data: data.mydata,
            joinBy: ['hc-key', 'code'],
            name: 'USA',
            dataLabels: {
              enabled: true,
              format: '{point.properties.postal-code}'
            }
          }],
          
          tooltip: {
							backgroundColor: {
                    linearGradient: [0, 0, 0, 60],
                    stops: [
                        [0, '#FFFFFF'],
                        [1, '#E0E0E0']
                    ]
                },
                borderWidth: 1,
                borderColor: '#AAA',
                borderRadius: 10,
                headerFormat: '<span style="font-size:10px">{series.name}</span><br/>',
                pointFormat: '<span style="font-size:16px">{point.name}: {point.value}</span><br/>',
                footerFormat: ''
            },
          
          drilldown: {
            //series: drilldownSeries,
            activeDataLabelStyle: {
              color: '#FFFFFF',
              textDecoration: 'none',
              textShadow: '0 0 3px #000000'
            },
            drillUpButton: {
              relativeTo: 'spacingBox',
              position: {
                x: 0,
                y: 60
              }
            }
          }
        };

        // Instanciate the map
        $(elem).highcharts('Map', mapConfig);
      }
    };
  });

  app.factory('DB', function($http) {
    var statesData = [{
      'code': 'us-ma',
      value: 20
    }, {
      'code': 'us-ny',
      value: 30
    }, {
      'code': 'us-tx',
      value: 13
    }];

    var countiesData = {
      'us-ny': [{
        'code': 'us-ny-063',
        value: 20
      }, {
        'code': 'us-ny-1192929391923',
        value: 20
      }],
      'us-ma': [{
        'code': 'us-ma-001',
        value: 20
      }, ]
    };

    return {
      getStatesData: function() {
        return statesData
      },
      getCountyData: function(state) {
        return countiesData[state]
      }
    }
  })
})();
