SpendIt.define("utils", function(ctx) {
  var
    inst = {
      "rand": function(min, max) {
        var
          dif = max - min,
          rnd = Math.floor(
            Math.random() * dif
          );
        return rnd + min;
      },
      "choose": function(vals) {
        var
          len = vals.length,
          idx = Math.floor(
            Math.random() * len
          ),
          choice = vals[idx];
        return choice;
      },
      "pick": function(vals) {
        var
          len = vals.length,
          idx = Math.floor(
            Math.random() * len
          ),
          choice = vals.splice(idx, 1);
        return choice.pop();
      }
    };
  return inst;
});
