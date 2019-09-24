// 生成 [min, max] 区间的一个随机整数
function random(min, max) {
  if (Number.isInteger(min) && Number.isInteger(max) && min <= max) {
    return parseInt(Math.random() * (max - min + 1)) + min
  }
  return 0
}

// 测试随机数方法
function testRadom(min, max, times) {
  let result = {}
  for (let i = 0; i < times; i++) {
    let r = random(min, max)
    if (result[r]) {
      result[r] += 1
    } else {
      result[r] = 1
    }
  }
  return result
}

let app = new Vue({
  el: '#app',
  data: {
    player: {
      hp: 150,
      hpLimit: 150,
      vp: 150,
      vpLimit: 150,
      sp: 150,
      spLimit: 150,
    },
    cards: [],
    lastCard: {},
    helloMessage: ""
  },
  methods: {
    sayHello: function () {
      this.helloMessage = hellos[random(0, hellos.length - 1)]
    },
    drawCard: function () {
      this.player.hp -= 5
      this.player.vp -= 5
      this.player.sp -= 5

      let card = cards[random(0, cards.length - 1)]
      this.cards.push(card)
      this.lastCard = card
    },
    useCard: function (id) {
      let index = this.cards.findIndex((c) => c.id == id)
      if (index > -1) {
        let card = this.cards[index]

        this.player.hp = (this.player.hp + card.hp < this.player.hpLimit) ? this.player.hp + card.hp : this.player.hpLimit
        this.player.vp = (this.player.vp + card.vp < this.player.vpLimit) ? this.player.vp + card.vp : this.player.vpLimit
        this.player.sp = (this.player.sp + card.sp < this.player.spLimit) ? this.player.sp + card.sp : this.player.spLimit

        this.cards.splice(index, 1)
      } else {
        console.error("该卡牌不存在 id=" + id)
      }
    }
  }
})

// 游戏结束
app.$watch('player.hp', function(newVal, oldVal) {
  if (newVal <= 0) {
    console.log("生命值为0，游戏结束")
  }
})