var vkApi = (function () {
    'use strict';

    var clientId = 6712188;
    function auth() {
        var authRequest = 'https://oauth.vk.com/authorize?client_id=' + clientId
            + '&display=page&redirect_uri=https://oauth.vk.com/blank.html&scope=friends&response_type=token&v=5.52';

        fetch(authRequest)
            .then(function (response) {
                return response.json();
            })
            .then(function (json) {
                console.log(json); 
            })
            .catch(alert)
    }
}());