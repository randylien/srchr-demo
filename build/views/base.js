define(["use!backbone","use!underscore","jquery"],function(a,b,c){var d={},e=a.View.extend({template:"<div></div>",initialize:function(a){b.bindAll(this,"bindTo","unbind"),a&&b.keys(a).forEach(b.bind(function(b){this[b]=a[b]},this)),this.bindings=[],this.prepare()},prepare:function(){},render:function(){d[this.template]||(d[this.template]=b.template(this.template));var a=d[this.template],c=this.model?this.model.toJSON():this;return this.$el.html(a(c)),this.trigger("render"),this.postRender(),this},postRender:function(){},placeAt:function(a,b){var d={first:"prepend",last:"append",only:"html"}[b]||"append";return c(a)[d](this.$el),this},bindTo:function(a,b,c){a.bind(b,c,this);var d={evt:b,fn:c,model:a};return this.bindings.push(d),d},unbind:function(){b.each(this.bindings,function(a){a.model.off(a.evt,a.fn)})},destroy:function(){this.unbind(),this.remove()}});return e.extend(a.Events),e})