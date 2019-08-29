

function add(x) {
  var n = 0;
  return function addY(y) {
    n += 1;
    console.log(n + " times")
    return x + y;
  }
}

var add5 = add(5);

console.log(add5(20));

