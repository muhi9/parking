"use strict";
// Class definition

var KSummernote = function () {    
    // Private functions
    var note = function () {
        $('.summernote').summernote({
            height: 250,
            toolbar: [
                ['style', ['bold', 'italic', 'underline', 'clear']],
                ['font', ['strikethrough', 'superscript', 'subscript']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']]
            ]
        });
    }

    return {
        // public functions
        init: function() {
            note(); 
        }
    };
}();

// Initialization
jQuery(document).ready(function() {
    KSummernote.init();
});