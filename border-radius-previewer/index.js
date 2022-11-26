
/** border-radius setting */
const shape = document.getElementById('shape')
const outputIpt = document.getElementById('output-ipt')
let borderRadius = ''

const borderRadiusMap = {
  "border-top-left-radius": [],
  "border-top-right-radius": [],
  "border-bottom-right-radius": [],
  "border-bottom-left-radius": []
}

for (const key of Object.keys(borderRadiusMap)) {
  const value = getComputedStyle(shape).getPropertyValue(key)
  // console.log(key + ' => ' + value)
  borderRadiusMap[key] = value.split(' ')
  if (borderRadiusMap[key].length === 1) {
    borderRadiusMap[key].push(value)
  }
}
// console.log(borderRadiusMap)

const setBorderRadius = () => {
  borderRadius = borderRadiusMap["border-top-left-radius"][0] + ' '
    + borderRadiusMap["border-top-right-radius"][0] + ' '
    + borderRadiusMap["border-bottom-right-radius"][0] + ' '
    + borderRadiusMap["border-bottom-left-radius"][0]
    + ' / '
    + borderRadiusMap["border-top-left-radius"][1] + ' '
    + borderRadiusMap["border-top-right-radius"][1] + ' '
    + borderRadiusMap["border-bottom-right-radius"][1] + ' '
    + borderRadiusMap["border-bottom-left-radius"][1]

  shape.style.borderRadius = borderRadius

  outputIpt.innerText = borderRadius
}
setBorderRadius()


/** size setting */
const box = document.getElementById('box')
const widthIpt = document.getElementById('width')
const heightIpt = document.getElementById('height')

widthIpt.value = box.offsetWidth.toFixed(0)
heightIpt.value = box.offsetHeight.toFixed(0)

widthIpt.addEventListener('input', e => {
  box.style.width = e.target.value + 'px'
})

heightIpt.addEventListener('input', e => {
  box.style.height = e.target.value + 'px'
})

const handleReset = () => {
  box.style.width = '50vmin'
  box.style.height = '50vmin'
  widthIpt.value = box.offsetWidth.toFixed(0)
  heightIpt.value = box.offsetHeight.toFixed(0)
}


/** handle border-raidus */
const topHandle = document.getElementById('top')
const rightHandle = document.getElementById('right')
const bottomHandle = document.getElementById('bottom')
const leftHandle = document.getElementById('left')

topHandle.style.left = borderRadiusMap["border-top-left-radius"][0]
rightHandle.style.top = borderRadiusMap["border-top-right-radius"][1]
bottomHandle.style.left = borderRadiusMap["border-bottom-left-radius"][0]
leftHandle.style.top = borderRadiusMap["border-top-left-radius"][1]

let movingEl = null

const mousedown = e => {
  movingEl = e.target
  movingEl.classList.add('active')
}

topHandle.addEventListener('mousedown', mousedown)
rightHandle.addEventListener('mousedown', mousedown)
bottomHandle.addEventListener('mousedown', mousedown)
leftHandle.addEventListener('mousedown', mousedown)

document.addEventListener('mousemove', e => {
  if (!movingEl) { return }
  e.preventDefault()

  switch (movingEl) {
    case topHandle: 
    case bottomHandle: 
      const moveLeft = minmax((e.clientX - box.offsetLeft) / box.offsetWidth * 100, 0, 100)
      const left = moveLeft.toFixed(0) + '%'
      // console.log(left)
      movingEl.style.left = left

      if (movingEl == topHandle) {
        borderRadiusMap["border-top-left-radius"][0] = left
        borderRadiusMap["border-top-right-radius"][0] = (100 - moveLeft).toFixed(0) + '%'
      } else {
        borderRadiusMap["border-bottom-right-radius"][0] = (100 - moveLeft).toFixed(0) + '%'
        borderRadiusMap["border-bottom-left-radius"][0] = left
      }

      break
    case rightHandle: 
    case leftHandle: 
      const moveTop = minmax((e.clientY - box.offsetTop) / box.offsetHeight * 100, 0, 100)
      const top = moveTop.toFixed(0) + '%'
      // console.log(top)
      movingEl.style.top = top

      if (movingEl == rightHandle) {
        borderRadiusMap["border-top-right-radius"][1] = top
        borderRadiusMap["border-bottom-right-radius"][1] = (100 - moveTop).toFixed(0) + '%'
      } else {
        borderRadiusMap["border-top-left-radius"][1] = top
        borderRadiusMap["border-bottom-left-radius"][1] = (100 - moveTop).toFixed(0) + '%'
      }

      break
  }

  setBorderRadius()
})

document.addEventListener('mouseup', e => {
  movingEl = null
  topHandle.classList.remove('active')
  rightHandle.classList.remove('active')
  bottomHandle.classList.remove('active')
  leftHandle.classList.remove('active')
})

const minmax = (n, min, max) => {
  return Math.max(Math.min(n, max), min)
}


/** copy */
const copyBtn = document.getElementById('copy')

copyBtn.addEventListener('click', async () => {
  await navigator.clipboard.writeText(outputIpt.innerText)
  showMessageBox()
})

const messageBox = document.getElementById('message-box')
const message = document.getElementById('message')
let timerId = 0

const showMessageBox = (text = 'Copied success! 👌', duration = 2500) => {
  if (timerId) { clearTimeout(timerId) }
  
  message.innerText = text
  message.style.opacity = 1
  message.style.transform = 'translate(-50%, 0)'

  timerId = setTimeout(() => {
    message.style.opacity = 0
    message.style.transform = 'translate(-50%, calc(-3rem - 100%))'
  }, duration)
}