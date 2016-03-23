var FaceblockClass = function() {

	var _this = this;
	var counter = 0;
	var countedValue = [];

	this.toggleValue = function(callback) {
		chrome.storage.sync.get('switcher', function(keys) {  
        	callback(keys.switcher);
    	});
	}

	this.throttle = function(func, ms) {
		  var isThrottled = false,
		    savedArgs,
		    savedThis;
		  function wrapper() {
		    if (isThrottled) { // (2)
		      savedArgs = arguments;
		      savedThis = this;
		      return;
		    }
		    func.apply(this, arguments); // (1)
		    isThrottled = true;
		    setTimeout(function() {
		      isThrottled = false; // (3)
		      if (savedArgs) {
		        wrapper.apply(savedThis, savedArgs);
		        savedArgs = savedThis = null;
		      }
		    }, ms);
		  }
		  return wrapper;
	};	

	// Clean on DOM Change
	this.FBObserver = new WebKitMutationObserver(_this.throttle(function() {
		    _this.cleanFeed();
			// console.log('Observer works');				
	}, 3000));

	this.FBObserverTarget = document.querySelector('._5pcb');

	this.startObserver = function() {
		_this.FBObserver.observe(_this.FBObserverTarget, {childList: true, subtree: false, attributes: false, characterData: false});
	};

	this.stopObserver = function(callback) {
		_this.FBObserver.disconnect();
	}

	this.getAllElementsWithAttribute = function(attribute, value) {
		  var matchingElements = [];
		  var allElements = document.querySelectorAll('div');
		  for (var i = 0, n = allElements.length; i < n; i++) {
		    if (allElements[i].getAttribute(attribute) === value) {
		      // Element exists with attribute. Add to array.
		      matchingElements.push(allElements[i]);
		    }
		  }
		  return matchingElements;
	};

	this.getPosts = function() {
		var posts = _this.getAllElementsWithAttribute("data-testid", "fbfeed_story");
		if (posts.length === 0) {
			posts = document.querySelectorAll('._5jmm');
			if (posts.length === 0) {
				posts = 0;
				return posts;
			}
			return posts;
		}
		return posts;
	};

	this.removePosts = function(keyword, callback) {
		_this.counter = 0;
		var fbPosts = _this.getPosts();
		for (i = 0; i < fbPosts.length; i++) {
			if (fbPosts[i].innerHTML.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
				fbPosts[i].remove();
				_this.counter++;
			}
		}
		callback(_this.counter);					
	};	
				
	this.cleanFeed = function(callback) {
		chrome.storage.sync.get("todo", function (keys){ 
			if (keys.todo != null) {
					for (var l = 0; l < keys.todo.length; l++) {
							_this.removePosts(keys.todo[l]['content'], function(counter) {
								if (counter > 0) {	
									todocopy = keys.todo;

									// Set counter
									todocopy[l]['counter'] += counter;

									// Set hinted
									todocopy[l]['hinted'] = true; 

									//for debugging
									removeName = todocopy[l]['content'];
									hinted = todocopy[l]['hinted'];

									// Save counter and hinted
									chrome.storage.sync.set({ todo: todocopy });

									// Remove hinted
									removeHinted(todocopy,l);

									function removeHinted(array,l) {
				                        setTimeout(function() {
				                        	var hintedarr = array;
				                        	hintedarr[l]['hinted'] = false;
				                            chrome.storage.sync.set({ todo: hintedarr });							                   
				                        }, 1000);
				                    }

								}
							});
					}	
			}		
		});
	};

	this.toggleProgram = function() {
		this.falseAllHinted();
		this.toggleValue(function(value) {
			(value) ? _this.programOn() : _this.programOff();
		});
		
	};

	this.programOn = function() {
		console.log('Faceblock is on');
		_this.cleanFeed();
		_this.startObserver();		
	};

	this.programOff = function() {
		console.log('Faceblock is off');
		_this.stopObserver();		
	};

	this.falseAllHinted = function() {
		chrome.storage.sync.get("todo", function (keys){ 
			todocopy = keys.todo;
			for (i = 0; i < todocopy.length; i++) {
				todocopy[i]['hinted'] = false;
			}
			chrome.storage.sync.set({ todo: todocopy });
		});
	}

}


var Faceblock = new FaceblockClass();	
Faceblock.toggleProgram();


chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
	switch(message.type) {
		case "clean":
			Faceblock.toggleProgram();
		break;
	}
});

chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
	switch(message.type) {
		case "switcher-toggle":
			Faceblock.toggleProgram();
		break;
	}
});

