import { RGBA, TextAttributes } from "@opentui/core"
import { For, createMemo, createSignal, onCleanup } from "solid-js"
import { go, logo } from "../logo"

export type LogoShape = {
  left: string[]
  right: string[]
}

const GAP = 1
const COLORS: RGBA[] = [
  RGBA.fromInts(116, 235, 213), RGBA.fromInts(168, 235, 213), RGBA.fromInts(192, 235, 213),
  RGBA.fromInts(213, 235, 192), RGBA.fromInts(235, 213, 168), RGBA.fromInts(235, 192, 168),
  RGBA.fromInts(235, 168, 200), RGBA.fromInts(200, 168, 235), RGBA.fromInts(168, 200, 235),
  RGBA.fromInts(168, 235, 200), RGBA.fromInts(192, 235, 213), RGBA.fromInts(116, 235, 213),
]

function lerpRGBA(a: RGBA, b: RGBA, t: number): RGBA {
  const [ar, ag, ab] = a.toInts()
  const [br, bg, bb] = b.toInts()
  return RGBA.fromInts(
    Math.round(ar + (br - ar) * t),
    Math.round(ag + (bg - ag) * t),
    Math.round(ab + (bb - ab) * t),
  )
}

function charColor(x: number, y: number, shift: number): RGBA {
  const pos = shift + x * 0.7 + y * 1.3
  const idx = pos % COLORS.length
  const lo = Math.floor(idx)
  const hi = (lo + 1) % COLORS.length
  return lerpRGBA(COLORS[lo]!, COLORS[hi]!, idx - lo)
}

export function Logo(_props: { shape?: LogoShape; ink?: RGBA; idle?: boolean } = {}) {
  const ctx = _props.shape ?? logo
  const [tick, setTick] = createSignal(0)

  const timer = setInterval(() => setTick((n) => n + 1), 8)
  onCleanup(() => clearInterval(timer))

  const shift = createMemo(() => tick() * 0.12)

  const renderLine = (line: string, y: number, bold: boolean) =>
    Array.from(line).map((char, x) => (
      <text
        fg={charColor(x, y, shift())}
        attributes={bold ? TextAttributes.BOLD : undefined}
        selectable={false}
      >
        {char}
      </text>
    ))

  return (
    <box flexDirection="column">
      <For each={ctx.left.map((_, i) => i)}>
        {(y) => (
          <box flexDirection="row" gap={1}>
            <box flexDirection="row">{renderLine(ctx.left[y]!, y, false)}</box>
            <box flexDirection="row">{renderLine(ctx.right[y]!, y, true)}</box>
          </box>
        )}
      </For>
    </box>
  )
}

export function GoLogo() {
  return <Logo shape={go} idle />
}
