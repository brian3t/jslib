( function( root, factory ) {
    // Set up Backbone-relational for the environment. Start with AMD.
    if ( typeof define === 'function' && define.amd ) {
        define( [ 'exports', 'backbone', 'underscore' ], factory );
    }
    // Next for Node.js or CommonJS.
    else if ( typeof exports !== 'undefined' ) {
        factory( exports, require( 'backbone' ), require( 'underscore' ) );
    }
    // Finally, as a browser global. Use `root` here as it references `window`.
    else {
        factory( root, root.Backbone, root._ );
    }
}( this, function( exports, Backbone, _ ){
    "use strict";

    Backbone.RelationalModelX = Backbone.RelationalModel.extend({
        fetch_expand: function(relation, options = {}){
            // let origUrlRoot = this.urlRoot
            let origUrl = this.url
            this.url =function(){
                let res = origUrl.apply(this)
                res += `?expand=${relation}`
                return res
            }
            this.fetch(options)
            this.url = origUrl
            // this.urlRoot = origUrlRoot
        }
    })
}));
