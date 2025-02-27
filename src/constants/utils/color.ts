const getOKLCHColor = (themeMode: string, system: string): string => {
  switch (themeMode) {
    case 'light':
      return 'oklch(1 0 0 / 0.8)'
    case 'dark':
      return 'oklch(0.25 0.02 252.42 / 0.8)'
    case 'cupcake':
      return 'oklch(0.98 0 0 / 0.8)'
    case 'bumblebee':
      return 'oklch(1 0 0 / 0.8)'
    case 'emerald':
      return 'oklch(1 0 0 / 0.8)'
    case 'corporate':
      return 'oklch(1 0 0 / 0.8)'
    case 'synthwave':
      return 'oklch(0.22 0.08 287.84 / 0.8)'
    case 'retro':
      return 'oklch(0.92 0.03 90.52 / 0.8)'
    case 'cyberpunk':
      return 'oklch(0.95 0.18 104.32 / 0.8)'
    case 'valentine':
      return 'oklch(0.95 0.03 337.06 / 0.8)'
    case 'halloween':
      return 'oklch(0.25 0 0 / 0.8)'
    case 'garden':
      return 'oklch(0.93 0 0 / 0.8)'
    case 'forest':
      return 'oklch(0.19 0.01 0 / 0.8)'
    case 'aqua':
      return 'oklch(0.49 0.13 261.18 / 0.8)'
    case 'lofi':
      return 'oklch(1 0 0 / 0.8)'
    case 'pastel':
      return 'oklch(1 0 0 / 0.8)'
    case 'fantasy':
      return 'oklch(1 0 0 / 0.8)'
    case 'wireframe':
      return 'oklch(1 0 0 / 0.8)'
    case 'black':
      return 'oklch(0 0 0 / 0.8)'
    case 'luxury':
      return 'oklch(0.14 0 0 / 0.8)'
    case 'dracula':
      return 'oklch(0.29 0.02 277.51 / 0.8)'
    case 'cmyk':
      return 'oklch(1 0 0 / 0.8)'
    case 'autumn':
      return 'oklch(0.96 0 0 / 0.8)'
    case 'business':
      return 'oklch(0.24 0 0 / 0.8)'
    case 'acid':
      return 'oklch(0.99 0 0 / 0.8)'
    case 'lemonade':
      return 'oklch(0.99 0.02 123.72 / 0.8)'
    case 'night':
      return 'oklch(0.21 0.04 265.75 / 0.8)'
    case 'coffee':
      return 'oklch(0.22 0.02 329.71 / 0.8)'
    case 'winter':
      return 'oklch(1 0 0 / 0.8)'
    case 'dim':
      return 'oklch(0.31 0.02 264.15 / 0.8)'
    case 'nord':
      return 'oklch(0.95 0.01 0 / 0.8)'
    case 'sunset':
      return 'oklch(0.22 0.02 237.69 / 0.8)'
    default:
      return system === 'dark' ? 'oklch(0.25 0.02 252.42 / 0.8)' : 'oklch(1 0 0 / 0.8)'
  }
}

export { getOKLCHColor }
