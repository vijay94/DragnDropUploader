/*
Copyright 2017 Vijay s
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE
*/
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

  // The base Class implementation (does nothing)
  this.Class = function(){};

  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;

    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;

    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;

            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];

            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);
            this._super = tmp;

            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }

    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }

    // Populate our constructed prototype object
    Class.prototype = prototype;

    // Enforce the constructor to be what we expect
    Class.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee;

    return Class;
  };
})();

var Dragn = Class.extend({
  options:{

  },
  init: function(option){
    $.extend( this.options, option );
    this.create();
  },

  create : function () {

  }
});

$.fn.Dragn = function(option){
    new Dragn(this,option);
};


var drop = $(".drop-down-files");
drop.on('dragenter', function (e) {
  $(this).parents(".drop").css({
    "border": "4px dashed #09f",
    "background": "rgba(0, 153, 255, .05)"
  });
  $(this).siblings(".cont").css({
    "color": "#09f"
  });
}).on('dragleave dragend mouseout drop', function (e) {
  $(this).parents(".drop").css({
    "border": "3px dashed #DADFE3",
    "background": "#fff"
  });
  $(this).siblings(".cont").css({
    "color": "#8E99A5"
  });
});

function getImageData(element) {
  var result = [];
  $(element).children().each(function () {
    var data = "title:"+$(this).find('img').attr('title')+":"+$(this).find('img').attr('data');
    result.push(data);
  });
  return result.join(":,");
}

function validate() {
  if($('.list[data-type="xml"]').html()==''){
    makeErrorToast("Please select XML Files");
    return false;
  }
  if($("#projectname").val()==''){
    makeErrorToast("Please enter project name");
    return false;
  }
  if($("#description").val()==''){
    makeErrorToast("Please describe your project");
    return false;
  }
  return true;
}

$('.drop-down-files').change(function (evt) {
  var files = evt.target.files;
  if(files.length>0){
    for (var i = 0, f; f = files[i]; i++) {
      if (f.type.match('image.*') && f.type.match($(this).attr('data-accept'))) {
        var reader = new FileReader();
        var self = this;
        reader.onload = (function(theFile) {
          return function(e) {
            var span = "<span>"+ ['<img class="thumb" src="', e.target.result,
                              '" title="', escape(theFile.name),'" data="',e.target.result, '"/>'].join('')+"</span>";
            $(self).siblings('.list').append(span);
          };
        })(f);
        reader.readAsDataURL(f);
      }

      if (f.type.match('text/xml') && f.type.match($(this).attr('data-accept'))) {
        var data=''
        var reader = new FileReader();
        var self = this;
        reader.onload = (function(theFile) {
          return function(e) {
            var span = "<span>"+ ['<img class="thumb" src="','{{ URL::asset('images/xml.png') }}',
                              '" title="', escape(theFile.name),'" data="',e.target.result, '"/>'].join('')+"</span>";
            $(self).siblings('.list').append(span);
          };
        })(f);
        reader.readAsDataURL(f);
      }
    }
  }
  $(this).val('');
});
