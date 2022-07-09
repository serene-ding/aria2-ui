export function humanizeSpeed(speed: any): string {
  let speedNum: number = Number(speed)
  if (speedNum >= 1000000) {
    let speedInM: string = (speedNum / 1000000).toFixed(2).toString()
    return speedInM + "M"
  } else {
    let speedInM: string = (speedNum / 1000).toFixed(2).toString()
    return speedInM + "K"
  }
}