

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global.phalconModule = factory());
}(this, (function () {
    'use strict';

    var phalconApi = {
        vkGroups: {
            all: function () {
                return new Promise(resolve => {
                    fetch('/vk-groups/all')
                        .then(function (response) {
                            return response.json();
                        })
                        .then(function (json) {
                            resolve(json);
                        })
                        .catch(error => {
                            console.error(error);
                        })
                });
            },
            create: function (data) {
                return new Promise(resolve => {
                    var xhr = new XMLHttpRequest();
                    xhr.open("POST", '/vk-groups/create', true);
                    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

                    xhr.onload = function (e) {
                        resolve(xhr.status);
                    }
                    xhr.send(JSON.stringify(data));
                });
            },
            insert: function (data) {
                return new Promise(resolve => {
                    var xhr = new XMLHttpRequest();
                    xhr.open("POST", '/vk-groups/insert', true);
                    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

                    xhr.onload = function (e) {
                        resolve(xhr.status);
                    }
                    xhr.send(JSON.stringify(data));
                });
            },
            remove: function (id) {
                return new Promise(resolve => {
                    var xhr = new XMLHttpRequest();
                    xhr.open("POST", '/vk-groups/remove/' + id, true);
                    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

                    xhr.onload = function (e) {
                        resolve(xhr.status);
                    }
                    xhr.send();
                });
            },
            update: function (id, data) {
                return new Promise(resolve => {
                    var xhr = new XMLHttpRequest();
                    xhr.open("POST", '/vk-groups/update/' + id, true);
                    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

                    xhr.onload = function (e) {
                        resolve(xhr);
                    }
                    xhr.send( JSON.stringify(data) );
                });
            }
        },
        users: {
            all: function () {
                return new Promise(resolve => {
                    fetch('/users/all')
                        .then(function (response) {
                            return response.json();
                        })
                        .then(function (json) {
                            resolve(json);
                        })
                        .catch(error => {
                            console.error(error);
                        })
                });
            },
            create: function (data) {
                return new Promise(resolve => {
                    var xhr = new XMLHttpRequest();
                    xhr.open("POST", '/users/create', true);
                    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

                    xhr.onload = function (e) {
                        resolve(xhr.status);
                    }
                    xhr.send(JSON.stringify(data));
                });
            },
            get: function (id) {
                return new Promise(resolve => {
                    fetch('/users/get/' + id)
                        .then(function (response) {
                            return response.json();
                        })
                        .then(function (json) {
                            resolve(json);
                        })
                        .catch(error => {
                            console.error(error);
                        })
                });
            }
        },
        roles: {
            all: function () {
                return new Promise(resolve => {
                    fetch('/roles/all')
                        .then(function (response) {
                            return response.json();
                        })
                        .then(function (json) {
                            resolve(json);
                        })
                        .catch(error => {
                            console.error(error);
                        })
                });
            },
        },
        packages: {
            all: function () {
                return new Promise(resolve => {
                    fetch('/packages/all')
                        .then(function (response) {
                            return response.json();
                        })
                        .then(function (json) {
                            resolve(json);
                        })
                        .catch(error => {
                            console.error(error);
                        })
                });
            },
            create: function (data) {
                console.log('create', data);
                return new Promise(resolve => {
                    var xhr = new XMLHttpRequest();
                    xhr.open("POST", '/packages/create', true);
                    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

                    xhr.onload = function (e) {
                        resolve(xhr.status);
                    }
                    xhr.send(JSON.stringify(data));
                });
            },
        },
        session: {
            get: function() {
                return new Promise(resolve => {
                    fetch('/session/get')
                        .then(function (response) {
                            return response.json();
                        })
                        .then(function (json) {
                            resolve(json);
                        })
                        .catch(error => {
                            console.error(error);
                        })
                });
            },
            start: function(data) {
                return new Promise(resolve => {
                    var xhr = new XMLHttpRequest();
                    xhr.open("POST", '/session/start', true);
                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

                    var body = 'email=' + encodeURIComponent(data.email) +
                    '&password=' + encodeURIComponent(data.password);

                    xhr.onload = function (e) {
                        resolve(xhr.status);
                    }
                    
                    xhr.send(body);
                });
            }
        },
        orders: {
            all: function () {
                return new Promise(resolve => {
                    fetch('/orders/all')
                        .then(function (response) {
                            return response.json();
                        })
                        .then(function (json) {
                            resolve(json);
                        })
                        .catch(error => {
                            console.error(error);
                        })
                });
            },
            get: function () {
                return new Promise(resolve => {
                    fetch('/orders/get')
                        .then(function (response) {
                            return response.json();
                        })
                        .then(function (json) {
                            resolve(json);
                        })
                        .catch(error => {
                            console.error(error);
                        })
                });
            },
            create: function (data) {
                return new Promise(resolve => {
                    var xhr = new XMLHttpRequest();
                    xhr.open("POST", '/orders/create', true);
                    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

                    xhr.onload = function (e) {
                        resolve(xhr.status);
                    }
                    xhr.send(JSON.stringify(data));
                });
            },
            update: function (id, data) {
                return new Promise(resolve => {
                    var xhr = new XMLHttpRequest();
                    xhr.open("POST", '/orders/update/' + id, true);
                    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

                    xhr.onload = function (e) {
                        resolve(xhr);
                    }
                    xhr.send( JSON.stringify(data) );
                });
            }
        },
        status: {
            all: function () {
                return new Promise(resolve => {
                    fetch('/status/all')
                        .then(function (response) {
                            return response.json();
                        })
                        .then(function (json) {
                            resolve(json);
                        })
                        .catch(error => {
                            console.error(error);
                        })
                });
            },
        }
    }

    return phalconApi;

})));