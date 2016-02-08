var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-73434776-1']);
_gaq.push(['_trackPageview']);

function trackButton(e) {
	_gaq.push(['_trackEvent', e.target.id, 'clicked']);
};

var buttons = document.querySelectorAll('a');
for (var i = 0; i < buttons.length; i++) {
	buttons[i].addEventListener('click', trackButtonClick);
}

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();


