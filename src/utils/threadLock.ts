// 线程锁
let isLock = false
const lockList: Array<any> = []

type UnlockFunction = () => void
export async function lock(): Promise<UnlockFunction> {
  function unlock() {
    const waitFunc = lockList.shift()
    if (waitFunc) {
      waitFunc.resolve(unlock)
    }
    else {
      isLock = false
    }
  }
  if (isLock) {
    return new Promise((resolve, reject) => {
      lockList.push({ resolve, reject })
    })
  }
  else {
    isLock = true
    return unlock
  }
}
