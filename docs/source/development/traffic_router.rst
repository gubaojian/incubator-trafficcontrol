.. 
.. 
.. Licensed under the Apache License, Version 2.0 (the "License");
.. you may not use this file except in compliance with the License.
.. You may obtain a copy of the License at
.. 
..     http://www.apache.org/licenses/LICENSE-2.0
.. 
.. Unless required by applicable law or agreed to in writing, software
.. distributed under the License is distributed on an "AS IS" BASIS,
.. WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
.. See the License for the specific language governing permissions and
.. limitations under the License.
.. 

Traffic Router
**************
Introduction
============
Traffic Router is a Java Tomcat application that routes clients to the closest available cache on the CDN using both HTTP and DNS.  Cache availability is determined by Traffic Monitor; consequently Traffic Router polls Traffic Monitor for its configuration and cache health state information, and uses this data to make routing decisions.  HTTP routing is performed by localizing the client based on the request's source IP address (IPv4 or IPv6), and issues an HTTP 302 redirect to the nearest cache.  HTTP routing utilizes consistent hashing on request URLs to optimize cache performance and request distribution.  DNS routing is performed by localizing clients, resolvers in most cases, requesting ``A`` and ``AAAA`` records for a configurable name such as ``foo.deliveryservice.somecdn.net``. Traffic Router is comprised of seven separate Maven modules:
	
* shared - A reusable utility JAR for defining Delivery Service Certificates
* configuration - A resuable JAR defining the ConfigurationListener interface
* connector - A JAR that overrides Tomcat's standard Http11Protocol Connector class and allows Traffic Router to delay opening listen sockets until it is in a state suitable for routing traffic
* geolocation - Submodule for defining geolocation services
* neustar - A Jar that provides a bean "neustarGeolocationService" that implements the GeolocationService interface defined in the geolocation maven submodule, which can optionally be added to the build of Traffic Router
* core - Services DNS and HTTP requests, performs localization on routing requests, and is deployed as a WAR to a Service (read: connector/listen port) within Tomcat which is separate from api
* build - A simple Maven project which gathers the artifacts from the modules and builds an RPM

Software Requirements
=====================
To work on Traffic Router you need a \*nix (MacOS and Linux are most commonly used) environment that has the following installed:

* Eclipse >= Kepler SR2 (or another Java IDE)
* Maven >= 3.3.1
* JDK >= 8.0

Traffic Router Project Tree Overview
====================================
* ``traffic_control/traffic_traffic_router/`` - base directory for Traffic Router

	* ``connector/`` - Source code for Traffic Router Connector;

		* ``src/main/java`` - Java source directory for Traffic Router Connector

	* ``core/`` - Source code for Traffic Router Core, which is built as its own deployable WAR file and communicates with Traffic Router API using JMX

		* ``src/main`` - Main source directory for Traffic Router Core

			* ``etc/init.d`` - Init script for Tomcat
			* ``conf/`` - Minimum required configuration files
			* ``java/`` - Java source code for Traffic Router Core
			* ``opt/tomcat/conf`` - Contains Tomcat configuration file(s) pulled in during an RPM build
			* ``resources/`` - Resources pulled in during an RPM build
			* ``scripts/`` - Scripts used by the RPM build process
			* ``webapp/`` - Java webapp resources

		* ``src/test`` - Test source directory for Traffic Router Core

			* ``conf/`` - Minimal Configuration files that make it possible to run junit tests
			* ``db/`` - Files downloaded by unit tests
			* ``java/`` - JUnit based unit tests for Traffic Router Core
			* ``resources/`` - Example data files used by junit tests

				* ``var/auto-zones`` - BIND formatted zone files generated by Traffic Router Core during unit testing

Java Formatting Conventions 
===========================
None at this time.  The codebase will eventually be formatted per Java standards.

Installing The Developer Environment
====================================
To install the Traffic Router Developer environment:

1. Clone the traffic_control repository using Git.
2. Change directories into ``traffic_control/traffic_router``.
3. Follow the instructions in "README.DNSSEC" for DNSSEC support.
4. Set the environment variable TRAFFIC_MONITOR_HOSTS to be a semicolon delimited list of Traffic Monitors that can be accessed during integration tests
5. Additional configuration is set using the below files:

  * core/src/test/conf/dns.properties              - copy from core/src/main/conf
  * core/src/test/conf/http.properties             - copy from core/src/main/conf
  * core/src/test/conf/log4j.properties            - copy from core/src/main/conf
  * core/src/test/conf/traffic_monitor.properties  - copy from core/src/main/conf
  * core/src/test/conf/traffic_ops.properties file holds the credentials for accessing Traffic Ops.              - copy from core/src/main/conf
  * Default configuration values now reside in core/src/main/webapp/WEB-INF/applicationContext.xml
  * The above values may be overridden by creating and/or modifying the property files listed in core/src/main/resources/applicationProperties.xml
  * Pre-existing properties files are still honored by Traffic Router. For example traffic_monitor.properties:

	  +-------------------------------------+------------------------------------------------------------------------------------------------------------------+
	  |              Parameter              |                                                      Value                                                       |
	  +=====================================+==================================================================================================================+
	  | ``traffic_monitor.bootstrap.hosts`` | FQDN and port of the Traffic Monitor instance(s), separated by semicolons as necessary (do not include http://). |
	  +-------------------------------------+------------------------------------------------------------------------------------------------------------------+


6. Import the existing git repo into Eclipse:

	a. File -> Import -> Git -> Projects from Git; Next
	b. Existing local repository; Next
	c. Add -> browse to find ``traffic_control``; Open
	d. Select ``traffic_control``; Next
	e. Ensure "Import existing projects" is selected, expand ``traffic_control``, select ``traffic_router``; Next
	f. Ensure ``traffic_router_api``, ``traffic_router_connector``, and ``traffic_router_core`` are checked; Finish (this step can take several minutes to complete)
	g. Ensure ``traffic_router_api``, ``traffic_router_connector``, and ``traffic_router_core`` have been opened by Eclipse after importing

7. From the terminal, run ``mvn clean verify`` from the ``traffic_router`` directory

8. Start the embedded Tomcat instance for Core from within your IDE by following these steps:

	a. In the package explorer, expand ``traffic_router_core``
	b. Expand ``src/test/java``
	c. Expand the package ``com.comcast.cdn.traffic_control.traffic_router.core``
	d. Open and run ``TrafficRouterStart.java``

		..  Note:: If an error is displayed in the Console, run ``mvn clean verify`` from the ``traffic_router`` directory

9. Traffic Router Core should now be running; the Traffic Router API is available at http://localhost:3333, the HTTP routing interface is available on http://localhost:8888 and HTTPS is available on http://localhost:8443.
The DNS server and routing interface is available on localhost:1053 via TCP and UDP.

Manual Testing
==============
Look up the URL for your test 'http' Delivery Service in Traffic Ops and then:

curl -vs -H “Host: <Delivery Service URL>” http://localhost:8888/x

Test Cases
==========
* Unit tests can be executed using Maven by running ``mvn test`` at the root of the ``traffic_router`` project.
* Unit and Integration tests can be executed using Maven by running ``mvn verify`` at the root of the ``traffic_router`` project.

RPM Packaging
=============
Running ``mvn package`` on a Linux based distribution will trigger the build process to create the Traffic Router rpm.

API
===

:ref:`reference-tr-api`

.. toctree:: 
  :hidden:
  :maxdepth: 1

  traffic_router/traffic_router_api
