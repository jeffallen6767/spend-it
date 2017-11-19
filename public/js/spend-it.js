
var
  SpendIt = (function() {
    var 
      loadingEl,
      contentEl,
      modules = {},
      inst = {
        "define": function(name, ctor) {
          modules[name] = ctor(inst);
        },
        "require": function(name) {
          return modules[name];
        },
        "init": function() {
          loadingEl = $('#loading');
          contentEl = $('#content');
          inst.start();
        },
        "start": function() {
          inst.display(
            inst.getData({
              
            })
          );
        },
        "display": function(data) {
          loadingEl.fadeOut("slow", function() {
            contentEl.fadeIn("slow");
          });
          contentEl.empty().append(
            inst.createDom(data)
          );
        },
        "getData": function() {
          var
            data = {};
          return data;
        },
        "createDom": function(data) {
          var 
            dom = [];
          dom.push('<div>Ready...</div>');
          return dom;
        }
      };
    return inst;
  })();
