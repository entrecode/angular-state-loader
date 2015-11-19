# angular-state-loader
Loading Spinner for UI Router (AngularJS) that is automatically shown while loading a states resolves. Can be restricted to specific state transitions. Including the optional parameters force-show and delay + the possibility to show a custom loader.

##Installation
Install angular-state-loader bower package:

```sh
bower install angular-state-loader --save
```

Add ```angular-state-loader.js``` and ```angular-state-loader.css``` dependencies to your html:

```html
<script src="bower_modules/angular-state-loader.js" type="text/javascript"></script>
<link href="bower_modules/angular-state-loader.css" type="text/css" rel="stylesheet"/>
```
Add Angular module ```ec.stateloader``` as dependency to your app:

```javascript
angular.module('myApp', ['ui.router', 'angular-state-loader'])
/* ... */
```

###(Optional) Material Icon Font

To use the default Loader Template, you need Material Icons which can be included via the google CDN:

```html
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
```
If you do not want to use material icons, always use a custom template like explained below.

##How to include

After Installing, the ```<state-loader>```-directive is available. Without further parameters, the 

###Basic Loader
The Basic Loader with the default templates does not require any addional parameters, just place ```<state-loader></state-loader>``` somewhere in the template where you want to show a loader. This loader wil be displayed on every state change.

###Custom Loader
If you want to have a custom loader (or do not want to use material-icons), just  make sure your ```<state-loader>```-tag is not empty:

```html
<state-loader><h1>LOADING</h1></state-loader>
```

##Additional Properties

###delay
By default, the loader will show up after 100ms of loading time and will stay until all of the state's promises are resolved. This delay can be changed with the ```delay``` property (in ms):

```html
<state-loader delay="10000"><b>Taking longer than expected...</b></state-loader>
```
The above loader will show up if resolving the state's promises is taking longer than 10 seconds. A Value of 0 will instantly show the loader.

###force-show

The property force-show expects a boolean and will show the loader if set to true. Note that the Loader still waits for the specified delay to be shown. This is useful when resolving promises inside the controller and not via the state's resolve. 

Controller Example:

```javascript
$scope.loadData = function() {
	$scope.showLoader = true;
	loadMuffins().then(function(muffins) {
		$scope.showLoader = false;
		$scope.muffins = muffins;
	});
}
$scope.loadData();
```
Template:

```html
<state-loader force-show="showLoader"></state-loader>
<li ng-repeat="muffin in muffins">{{muffin}}</li>
```
This Loader will show up when the loadData Function is invoked. When the Promise is resolved, we can set showLoader to false to hide the loader again.


###from-state

Expects a string. Restricts the loader to be shown only if coming from the given state name.

```html
<state-loader from-state="bakery"></state-loader>
```

###to-state

Expects a string. Restricts the loader to be shown only if going to the given state name.

```html
<state-loader to-state="bakery.muffins"></state-loader>
```

###Full Example

At last, here is a full example of how it can be used fully customized:

```html
<state-loader from-state="bakery" to-state="bakery.muffins" delay="500">
<h3>Loading incredible amount of muffins!</h3>
</state-loader>
```

The above loader will only show if transitioning from state "bakery" to state "bakery.muffins" after 500ms loading time, showing a custom message.

##CSS Classes
The Loader is wrapped in a div with the ```.angular-state-loader``` class which is by default positioned absolute with 100% width and height. By applying ```rotate-right``` to a custom element inside ```<state-loader>```, it will.. guess what?