import { ref, computed } from 'vue'

// 创建一个简单的倒计时工具
// 参数 seconds: 初始秒数，返回 { seconds, timeText, start, stop }
export function createCountdown(initialSeconds = 900) {
  const seconds = ref(initialSeconds)
  let timer = null

  const timeText = computed(() => {
    const s = Math.max(0, seconds.value)
    const mm = Math.floor(s / 60)
    const ss = s % 60
    return `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`
  })

  function tick() {
    if (seconds.value <= 0) {
      stop()
      return
    }
    seconds.value -= 1
  }

  function start() {
    stop()
    timer = setInterval(tick, 1000)
  }

  function stop() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  return { seconds, timeText, start, stop }
}

// 格式化秒为 mm:ss
export function formatSeconds(sec = 0) {
  const s = Math.max(0, Math.floor(sec))
  const mm = Math.floor(s / 60)
  const ss = s % 60
  return `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`
}

export default { createCountdown, formatSeconds }
