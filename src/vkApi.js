(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global.vkModule = factory());
}(this, (function () {
    'use strict';

    var vkApi = {
        clientId: 6712188,
        serviceKey: '8d7a62198d7a62198d7a6219c28d1c096588d7a8d7a6219d6cd55a8fffab6ee67c33985',

        getGroupById: function (id) {
            return new Promise(resolve => {
                var getGroupByIdMethod = 'https://api.vk.com/method/groups.getById?' +
                    'v=5.84&access_token=' + this.serviceKey +
                    '&group_id=' + id;

                fetch(getGroupByIdMethod)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (json) {
                        resolve(json.response[0]);
                    })
                    .catch(alert)
            });
        },

        getWallByGroup: function (id) {
            return new Promise(resolve => {
                var getWallByGroupMethod = 'https://api.vk.com/method/wall.get?' +
                    'v=5.84&access_token=' + this.serviceKey +
                    '&owner_id=-' + id + '&count=100';

                fetch(getWallByGroupMethod)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (json) {
                        resolve(json.response);
                    })
                    .catch(alert);
            });
        },

        getGroupMembers: function (id) {
            return new Promise(resolve => {
                var getGroupMembersMethod = 'https://api.vk.com/method/groups.getMembers?' +
                    'v=5.84&access_token=' + this.serviceKey +
                    '&group_id=' + id;

                fetch(getGroupMembersMethod)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (json) {
                        resolve(json.response);
                    })
                    .catch(alert);
            });
        }
    }

    return vkApi;

})));