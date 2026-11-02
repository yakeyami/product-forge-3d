import {
  PART_IDS,
  PART_LABELS,
  useConfigurator,
  type MaterialPreset,
} from '../store/configurator'

const SWATCHES = ['#2b6cf6', '#f4f4f5', '#111827', '#e11d48', '#f59e0b', '#10b981']

const MATERIAL_OPTIONS: { id: MaterialPreset; label: string }[] = [
  { id: 'matte', label: '哑光' },
  { id: 'glossy', label: '亮面' },
  { id: 'metal', label: '金属' },
]

export function ConfigPanel() {
  const activePart = useConfigurator((state) => state.activePart)
  const colors = useConfigurator((state) => state.colors)
  const materials = useConfigurator((state) => state.materials)
  const setActivePart = useConfigurator((state) => state.setActivePart)
  const setPartColor = useConfigurator((state) => state.setPartColor)
  const setPartMaterial = useConfigurator((state) => state.setPartMaterial)
  const reset = useConfigurator((state) => state.reset)

  return (
    <aside className="pointer-events-auto absolute inset-x-4 bottom-4 z-10 rounded-2xl border border-white/10 bg-black/50 p-4 backdrop-blur-md md:inset-x-auto md:right-8 md:bottom-8 md:w-80">
      <div className="flex items-center justify-between">
        <p className="text-[10px] tracking-[0.25em] text-neutral-400 uppercase">
          Configure
        </p>
        <button
          type="button"
          onClick={reset}
          className="rounded-md px-2 py-1 text-[11px] text-neutral-400 transition hover:bg-white/10 hover:text-white"
        >
          重置
        </button>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {PART_IDS.map((part) => {
          const active = part === activePart
          return (
            <button
              key={part}
              type="button"
              aria-pressed={active}
              onClick={() => setActivePart(part)}
              className={`flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-xs transition ${
                active
                  ? 'border-sky-400 bg-white/10 text-white'
                  : 'border-white/10 bg-white/[0.03] text-neutral-400 hover:border-white/25'
              }`}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: colors[part] }}
              />
              {PART_LABELS[part]}
            </button>
          )
        })}
      </div>

      <p className="mt-4 text-[10px] tracking-wider text-neutral-500 uppercase">
        颜色
      </p>
      <div className="mt-2 flex gap-2">
        {SWATCHES.map((color) => (
          <button
            key={color}
            type="button"
            aria-label={`选择颜色 ${color}`}
            onClick={() => setPartColor(activePart, color)}
            className={`h-7 w-7 rounded-full border transition ${
              colors[activePart] === color
                ? 'border-white ring-2 ring-white/30'
                : 'border-white/20 hover:scale-110'
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      <p className="mt-4 text-[10px] tracking-wider text-neutral-500 uppercase">
        材质
      </p>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {MATERIAL_OPTIONS.map((option) => {
          const active = materials[activePart] === option.id
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={active}
              onClick={() => setPartMaterial(activePart, option.id)}
              className={`rounded-lg border px-2 py-2 text-xs transition ${
                active
                  ? 'border-sky-400 bg-white/10 text-white'
                  : 'border-white/10 bg-white/[0.03] text-neutral-400 hover:border-white/25'
              }`}
            >
              {option.label}
            </button>
          )
        })}
      </div>

      <p className="mt-4 text-[10px] text-neutral-600">
        模型素材：Sneakers by Poly by Google · CC BY 3.0
      </p>
    </aside>
  )
}
