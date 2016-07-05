

// A method for wrapping an object in a private scope and returning an accessor
// object which only has methods which are defined by name in the prototype.public array
Object.prototype.protect || (Object.prototype.protect = function(){
  var obj = this;
  var proto = obj.__proto__;
  var publicMethods = proto.public || [];
  var p = {};
  for(fn in proto){
    if(publicMethods.indexOf(fn) >= 0){
      p[fn] = (function(p,f,o){
        return function(){ return p[f].bind(o).apply(o, arguments); };
      })(proto, fn, obj);
    }
  }
  return p;
});

/*
// Example:

// class
function A(){ this.foo = 'foo'; }

// public method
A.prototype.bar = function(o){
  this.foo += o || '';
  return this.foo;
};

//private method
A.prototype.baz = function(){ return 'baz'; };

// list the public methods on A
A.prototype.public = ['bar'];

var a = new A();

var b = a.protect();

b.bar('2'); // 'foo2'

a.foo; // 'foo2'

b.foo; // undefined

b.baz(); // TypeError: b.baz is not a function
*/