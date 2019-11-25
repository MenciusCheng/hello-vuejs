(function () {




})();


function getOne() {
  return document.getElementById("one").value;
}

function getTwo() {
  let v = document.getElementById("two").value;

  return v.split('\n').map(it => {
    if (it.startsWith("sql:")) {
      return it.replace("sql:", "");
    }
    return it;
  })
}

function generateResult() {
  let v1 = getOne();
  let v2 = getTwo();

  var result = v1;
  v2.forEach(it => {
    result = result.replace('?', it);
  });

  document.getElementById('result').value = result;
}