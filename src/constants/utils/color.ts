const getOKLCHColor = (themeMode: string, system: string): string => {
  switch (themeMode) {
    case 'light':
      return 'oklch(100% 0 0)'
    case 'dark':
      return 'oklch(16% 0 255)'
    case 'cupcake':
      return 'oklch(97% 0.02 20)'
    case 'bumblebee':
      return 'oklch(100% 0.03 90)'
    case 'emerald':
      return 'oklch(100% 0 0)'
    case 'corporate':
      return 'oklch(98% 0.01 220)'
    case 'synthwave':
      return 'oklch(28% 0.2 290)'
    case 'retro':
      return 'oklch(92% 0.03 85)'
    case 'cyberpunk':
      return 'oklch(94% 0.12 100)'
    case 'valentine':
      return 'oklch(97% 0.05 345)'
    case 'halloween':
      return 'oklch(14% 0 0)'
    case 'garden':
      return 'oklch(95% 0.03 150)'
    case 'forest':
      return 'oklch(10% 0.01 180)'
    case 'aqua':
      return 'oklch(50% 0.3 250)'
    case 'lofi':
      return 'oklch(100% 0 0)'
    case 'pastel':
      return 'oklch(98% 0.02 30)'
    case 'fantasy':
      return 'oklch(100% 0 0)'
    case 'wireframe':
      return 'oklch(100% 0 0)'
    case 'black':
      return 'oklch(0% 0 0)'
    case 'luxury':
      return 'oklch(5% 0.01 300)'
    case 'dracula':
      return 'oklch(20% 0.05 280)'
    case 'cmyk':
      return 'oklch(100% 0 0)'
    case 'autumn':
      return 'oklch(94% 0.03 40)'
    case 'business':
      return 'oklch(13% 0 0)'
    case 'acid':
      return 'oklch(97% 0.05 130)'
    case 'lemonade':
      return 'oklch(98% 0.02 95)'
    case 'night':
      return 'oklch(7% 0.02 270)'
    case 'coffee':
      return 'oklch(12% 0.01 30)'
    case 'winter':
      return 'oklch(100% 0 0)'
    case 'dim':
      return 'oklch(18% 0.02 250)'
    case 'nord':
      return 'oklch(94% 0.01 220)'
    case 'sunset':
      return 'oklch(8% 0.05 20)'
    default:
      return system === 'dark' ? 'oklch(16% 0 255)' : 'oklch(100% 0 0)'
  }
}

export { getOKLCHColor }
