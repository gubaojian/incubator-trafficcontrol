/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

module.exports = angular.module('trafficPortal.private.deliveryServices.new', [])
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('trafficPortal.private.deliveryServices.new', {
                url: '/new?type',
                views: {
                    deliveryServicesContent: {
                        templateUrl: function ($stateParams) {
                            var type = $stateParams.type,
                                template;

                            if (type.indexOf('ANY_MAP') != -1) {
                                template = 'common/modules/form/deliveryService/form.deliveryService.anyMap.tpl.html'
                            } else if (type.indexOf('DNS') != -1) {
                                template = 'common/modules/form/deliveryService/form.deliveryService.DNS.tpl.html'
                            } else if (type.indexOf('HTTP') != -1) {
                                template = 'common/modules/form/deliveryService/form.deliveryService.HTTP.tpl.html'
                            } else if (type.indexOf('STEERING') != -1) {
                                template = 'common/modules/form/deliveryService/form.deliveryService.Steering.tpl.html'
                            } else {

                            }

                            return template;
                        },
                        controller: 'FormNewDeliveryServiceController',
                        resolve: {
                            geoMissLat: function(parameterService) {
                                return parameterService.getParameters({ name: 'default_geo_miss_latitude', configFile: 'global' });
                            },
                            geoMissLong: function(parameterService) {
                                return parameterService.getParameters({ name: 'default_geo_miss_longitude', configFile: 'global' });
                            },
                            deliveryService: function(geoMissLat, geoMissLong) {
                                return {
                                    active: false,
                                    dscp: 0,
                                    geoLimit: 0,
                                    geoProvider: 0,
                                    initialDispersion: 1,
                                    ipv6RoutingEnabled: false,
                                    logsEnabled: false,
                                    missLat: (geoMissLat[0]) ? geoMissLat[0].value : '',
                                    missLong: (geoMissLong[0]) ? geoMissLong[0].value : '',
                                    multiSiteOrigin: false,
                                    protocol: 0,
                                    qstringIgnore: 0,
                                    rangeRequestHandling: 0,
                                    regionalGeoBlocking: false,
                                    signingAlgorithm: null,
                                    routingName: 'cdn'
                                };
                            },
                            type: function($stateParams) {
                                return $stateParams.type;
                            },
                            types: function(typeService) {
                                return typeService.getTypes({ useInTable: 'deliveryservice' });
                            }
                        }
                    }
                }
            })
        ;
        $urlRouterProvider.otherwise('/');
    });