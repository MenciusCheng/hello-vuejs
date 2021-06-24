
(function () {
  let todoListText = localStorage.getItem('todoListText')
  if (!!todoListText) {
    document.getElementById("todoList").value = todoListText
  }
 
  window.setInterval(function () {
    let t = document.getElementById('startTimestamp').value
    if (!!t) {
      let now = new Date().getTime()

      let secondDiff = Math.round((now - t) / 1000)
      // let second = secondDiff % 60
      let minute = Math.round(secondDiff / 60)
      if (minute > 0) {
        document.getElementById('duration').value = minute + "分"
      } else {
        document.getElementById('duration').value = ""
      }
    }
  }, 500)
})()

function start() {
  let t = new Date()

  document.getElementById('startTimestamp').value = t.getTime()

  let s = t.toTimeString().substring(0, 5)
  document.getElementById('startTime').value = s
}

function onTodoListChange() {
  let text = document.getElementById("todoList").value
  localStorage.setItem('todoListText', text)
}