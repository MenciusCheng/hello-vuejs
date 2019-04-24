
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
            if (actions.length > 0 && actions[0].name == this.name) return

            clearInterval(refreshId)
            let t = new Date().getTime()
            if (actions.length > 0) {
                let oldAct = actions[0]
                if (oldAct.name != '空') {
                    let act = Object.assign({}, oldAct, { end: t })
                    actions.splice(0, 1, act)
                } else {
                    actions.splice(0, 1)
                }
                actions.unshift({id: actions.length + 1, name: this.name, start: t, end: t})
            } else {
                actions.unshift({id: 1, name: this.name, start: t, end: t})
            }
            refreshId = setInterval(refresh, 500)
        }
    },
    template: '<button @click="onClick">{{ name }}</button>'
})

let buttons = [
    { id: 1, name: '空' },
    { id: 2, name: '坐' },
    { id: 3, name: '走' }
]

let buttonVm = new Vue({
    el: '#buttonList',
    data: {
        buttons
    }
})

// ==== 当前活动列表

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
            if (this.name != '空') {
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
        }
    },
    template: '<li>{{ showCurrentFlag() }}{{ name }}：{{ duration }}</li>'
})

let actions = [
    // { id: 3, name: '坐', start: 1556113478657, end: 1556113478657 },
    // { id: 2, name: '坐', start: 1556112000000, end: 1556112180000 },
    // { id: 1, name: '走', start: 1556108580000, end: 1556108700000 },
]

let actionVm = new Vue({
    el: '#actionList',
    data: {
        actions
    }
})

// ==== 定时任务

function refresh() {
    if (actionVm.actions.length > 0) {
        let action = actionVm.actions[0]
        if (action.name != '空') {
            let t = new Date().getTime()
            let act = Object.assign({}, action, { end: t })
            actionVm.actions.splice(0, 1, act)
        }
    }    
}

let refreshId = setInterval(refresh, 500)