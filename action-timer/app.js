
// 是否进行桌面消息提醒
let canAlert = true

let weiButtons = localStorage.getItem('wei-buttons')
// 按钮列表
let buttons = weiButtons ? JSON.parse(weiButtons) : [{ id: 1, name: '停' }, { id: 2, name: '坐' }, { id: 3, name: '走' }]

let weiActions = localStorage.getItem('wei-actions')
// 行动记录列表
let actions = weiActions ? JSON.parse(weiActions) : []
actions.unshift({ id: actions.length + 1, name: '停', start: 0, end: 0 })

// 刷新方法计时器
let refreshId = 0


// ==== 按钮列表

Vue.component('action-button-list', {
    props: {
        buttons: Array
    },
    template: '<div><slot></slot></div>'
})

Vue.component('action-button', {
    props: {
        name: String
    },
    methods: {
        onClick: function (event) {
            // 连续按相同的按钮，不进行计算
            if (actions.length > 0 && actions[0].name == this.name)
                return

            // 停止计时器
            if (refreshId > 0)
                clearInterval(refreshId)

            let t = new Date().getTime()
            if (actions[0].name != '停') {
                actions.splice(0, 1, Object.assign({}, actions[0], { end: t }))
            } else {
                actions.splice(0, 1)
            }
            actions.unshift({ id: actions.length + 1, name: this.name, start: t, end: t })
            storeActions()

            // 开启提醒
            canAlert = true

            // 继续计时器
            refreshId = setInterval(refresh, 500)
        }
    },
    template: '<button @click="onClick">{{ name }}</button>'
})

let buttonVm = new Vue({
    el: '#buttonList',
    data: {
        buttons
    }
})

// ==== 当前行动记录列表

Vue.component('action-ul', {
    props: {
        actions: Array
    },
    methods: {},
    template: '<ul><slot></slot></ul>'
})

Vue.component('action-li', {
    props: {
        index: Number,
        name: String,
        start: Number,
        end: Number
    },
    computed: {
        duration: function () {
            if (this.name != '停') {
                let s = Math.round((this.end - this.start) / 1000)
                let minute = Math.floor(s / 60)
                let second = s % 60
                // console.log("s: " + s + " minute: " + minute + " second: " + second)
                return (minute > 0 ? (minute + ' 分 ') : '') + second + ' 秒'
            } else {
                return ''
            }
        },
        isCurrent: function () {
            return this.index === 0
        }
    },
    methods: {
        showCurrentFlag: function () {
            return this.isCurrent ? '> ' : ''
        },
        showText: function () {
            if (this.name == '停') {
                return '当前无计时'
            } else {
                return (this.isCurrent ? '> ' : '') + this.name + ': ' + this.duration
            }
        }
    },
    template: '<li>{{ showText() }}</li>'
})

let actionVm = new Vue({
    el: '#actionList',
    data: {
        actions
    }
})

// ==== 配置提醒

let configAlertVm = new Vue({
    el: '#configAlert',
    data: function () {
        let minute = localStorage.getItem('wei-minute') ? parseFloat(localStorage.getItem('wei-minute')) : 40
        let alertText = localStorage.getItem('wei-alertText') ? localStorage.getItem('wei-alertText') : '你的脖子僵硬了，起来走走吧！'
        return { minute, alertText }
    },
    computed: {
        second: function () {
            return this.minute * 60
        }
    },
    watch: {
        minute: function (val) {
            localStorage.setItem('wei-minute', val)
        },
        alertText: function (val) {
            localStorage.setItem('wei-alertText', val)
        }
    }
})

// ==== 定时任务

function refresh() {
    if (actionVm.actions.length === 0)
        return

    let action = actionVm.actions[0]
    if (action.name == '坐' && canAlert) {
        let s = Math.round((action.end - action.start) / 1000)
        if (s > configAlertVm.second) {
            notifyMe(configAlertVm.alertText)
            // 关闭提醒
            canAlert = false
        }
    }
    if (action.name != '停') {
        let t = new Date().getTime()
        actionVm.actions.splice(0, 1, Object.assign({}, action, { end: t }))
        storeActions()
    }
}


// 更新行动记录列表
function storeActions() {
    let weiActions = JSON.stringify(actions)
    localStorage.setItem('wei-actions', weiActions)
}

// 重置行动记录列表
function resetActions() {
    clearInterval(refreshId)
    localStorage.removeItem('wei-actions')
    actions.splice(0, actions.length, { id: 1, name: '停', start: 0, end: 0 })
}

// ==== 桌面消息提醒

function notifyMe(text) {
    alert(text)
}

// 非 https 不允许桌面提醒

// function notifyMe(text) {
//     // 先检查浏览器是否支持
//     if (!("Notification" in window)) {
//         return
//     }
//     // 检查用户是否同意接受通知
//     else if (Notification.permission === "granted") {
//         // If it's okay let's create a notification
//         var notification = new Notification(text);
//     }
//     // 否则我们需要向用户获取权限
//     else if (Notification.permission !== 'denied') {
//         Notification.requestPermission(function (permission) {
//             // 如果用户同意，就可以向他们发送通知
//             if (permission === "granted") {
//                 var notification = new Notification(text);
//             }
//         });
//     }
// }

// document.addEventListener('DOMContentLoaded', function () {
//     if (!Notification) {
//         alert('您的浏览器不支持消息提醒');
//         return;
//     }
//     if (Notification.permission !== "granted")
//         Notification.requestPermission();
// })


