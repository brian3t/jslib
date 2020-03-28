(function (root, factory){
    // Set up Backbone-relational for the environment. Start with AMD.
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'backbone', 'underscore'], factory);
    }
    // Next for Node.js or CommonJS.
    else if (typeof exports !== 'undefined') {
        factory(exports, require('backbone'), require('underscore'));
    }
    // Finally, as a browser global. Use `root` here as it references `window`.
    else {
        factory(root, root.Backbone, root._);
    }
}(this, function (exports, Backbone, _){
    "use strict";

    Backbone.RelationalModelX = Backbone.RelationalModel.extend({
        fetch_expand: function (relation, options = {}){
            // let origUrlRoot = this.urlRoot
            let origUrl = this.url
            this.url = function (){
                let res = origUrl.apply(this)
                res += `?expand=${relation}`
                return res
            }
            this.fetch(options)
            this.url = origUrl
            // this.urlRoot = origUrlRoot
        },
        /**
         * Try to set a model, or find if it's already in a collection
         * @param id
         * @param coll Collection to search from
         * @returns {string}
         */
        set_or_find_coll: function (id = null, coll = {}){
            if (id === null || coll === {}) return 'Need an id and a valid collection'
            if (! (coll instanceof Backbone.Collection)) return 'Need a valid collection'
            let found_model = coll.findWhere({id: parseInt(id)})
            if (found_model instanceof Backbone.Model){
                 return found_model;
            }
            this.set('id', id)
            return this
        }
    })
}));
