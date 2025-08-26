// GENERATED: 半導体在庫売買サイト（Claude Rule適用）

// 半導体部品のカテゴリー別プレースホルダー画像URLを生成
export function generatePlaceholderImage(partNumber: string, manufacturer?: string): string {
  // 部品番号から部品のタイプを推測
  const partType = inferPartType(partNumber)
  
  // まず実際の部品画像を試す
  const realImage = getRealPartImage(partNumber, partType)
  if (realImage) {
    return realImage
  }
  
  // 実際の画像がない場合はSVGプレースホルダーを生成
  return generateSVGPlaceholder(partNumber, manufacturer || 'Unknown', partType)
}

function getRealPartImage(partNumber: string, partType: string): string | null {
  // 実際の半導体部品画像のマッピング
  const partImages: { [key: string]: string } = {
    // ESP32シリーズ - WiFi/Bluetooth モジュール
    'ESP32-WROOM-32': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center',
    'ESP32': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center',
    
    // STM32シリーズ - マイクロコントローラー
    'STM32F401RET6': 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=400&h=300&fit=crop&crop=center',
    'STM32': 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=400&h=300&fit=crop&crop=center',
    
    // ロジックIC - 74シリーズ
    'SN74LVC14APWR': 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop&crop=center',
    '74HC': 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop&crop=center',
    'SN74': 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop&crop=center',
  }
  
  // 完全一致を最初に試す
  if (partImages[partNumber]) {
    return partImages[partNumber]
  }
  
  // 部分一致を試す
  for (const [key, imageUrl] of Object.entries(partImages)) {
    if (partNumber.includes(key) || key.includes(partNumber.substring(0, 6))) {
      return imageUrl
    }
  }
  
  // 部品タイプ別の汎用画像 - 電子部品/半導体関連
  const typeImages: { [key: string]: string } = {
    microcontroller: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=400&h=300&fit=crop&crop=center', // マイクロコントローラーボード
    logic: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop&crop=center', // IC チップ
    opamp: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop&crop=center', // オペアンプIC
    transistor: 'https://images.unsplash.com/photo-1622737133809-d95047b9e673?w=400&h=300&fit=crop&crop=center', // トランジスタ
    capacitor: 'https://images.unsplash.com/photo-1581091870621-53b2e6b96c86?w=400&h=300&fit=crop&crop=center', // コンデンサ
    resistor: 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=400&h=300&fit=crop&crop=center', // 抵抗
    diode: 'https://images.unsplash.com/photo-1581091334651-ddf26d9a09d0?w=400&h=300&fit=crop&crop=center', // ダイオード
    crystal: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&crop=center', // 水晶振動子
    connector: 'https://images.unsplash.com/photo-1564324224577-7fd0cd08f04f?w=400&h=300&fit=crop&crop=center', // コネクタ
    generic: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center' // 汎用電子部品
  }
  
  return typeImages[partType] || typeImages.generic
}

function inferPartType(partNumber: string): string {
  const pn = partNumber.toLowerCase()
  
  if (pn.includes('stm32') || pn.includes('atmega') || pn.includes('pic') || pn.includes('esp32')) {
    return 'microcontroller'
  }
  if (pn.includes('lm') && (pn.includes('358') || pn.includes('741') || pn.includes('324'))) {
    return 'opamp'
  }
  if (pn.includes('74') || pn.includes('4000') || pn.includes('cd40')) {
    return 'logic'
  }
  if (pn.includes('1n') || pn.includes('2n') || pn.includes('bc') || pn.includes('2sk')) {
    return 'transistor'
  }
  if (pn.includes('capacitor') || pn.includes('ceramic') || pn.includes('tant')) {
    return 'capacitor'
  }
  if (pn.includes('resistor') || pn.includes('ohm')) {
    return 'resistor'
  }
  if (pn.includes('led') || pn.includes('diode')) {
    return 'diode'
  }
  if (pn.includes('crystal') || pn.includes('osc') || pn.includes('xtal')) {
    return 'crystal'
  }
  if (pn.includes('conn') || pn.includes('header') || pn.includes('socket')) {
    return 'connector'
  }
  
  return 'generic'
}

function generateSVGPlaceholder(partNumber: string, manufacturer: string, partType: string): string {
  const colors = getPartTypeColors(partType)
  const icon = getPartTypeIcon(partType)
  
  // SVGを文字列として生成
  const svg = `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:0.3" />
          <stop offset="50%" style="stop-color:${colors.secondary};stop-opacity:0.2" />
          <stop offset="100%" style="stop-color:${colors.accent};stop-opacity:0.4" />
        </linearGradient>
        <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="100%" height="100%" fill="url(#bg-gradient)" />
      <rect width="100%" height="100%" fill="none" stroke="${colors.border}" stroke-width="3" stroke-dasharray="8,4" opacity="0.6" />
      
      <!-- Secondary background pattern -->
      <circle cx="350" cy="50" r="30" fill="${colors.primary}" opacity="0.1" />
      <circle cx="50" cy="250" r="25" fill="${colors.secondary}" opacity="0.1" />
      <rect x="320" y="230" width="60" height="60" rx="8" fill="${colors.accent}" opacity="0.08" />
      
      <!-- Icon with color -->
      <g transform="translate(200, 110)" fill="url(#icon-gradient)" stroke="${colors.primary}" stroke-width="2">
        ${icon}
      </g>
      
      <!-- Part Number (Large and prominent) -->
      <text x="200" y="200" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="${colors.text}">
        ${partNumber.length > 18 ? partNumber.substring(0, 18) + '...' : partNumber}
      </text>
      
      <!-- Manufacturer -->
      <text x="200" y="225" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="${colors.subtext}">
        ${manufacturer}
      </text>
      
      <!-- Part Type -->
      <text x="200" y="250" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="${colors.subtext}" opacity="0.8">
        ${getPartTypeLabel(partType)}
      </text>
      
      <!-- Decorative elements -->
      <rect x="50" y="280" width="300" height="2" rx="1" fill="${colors.primary}" opacity="0.3" />
      <circle cx="60" cy="290" r="2" fill="${colors.primary}" opacity="0.5" />
      <circle cx="340" cy="290" r="2" fill="${colors.secondary}" opacity="0.5" />
    </svg>
  `
  
  // SVGをdata URLに変換（UTF-8対応）
  // 日本語文字に対応するため、URL エンコードを使用
  const encodedSvg = encodeURIComponent(svg)
  return `data:image/svg+xml;charset=utf-8,${encodedSvg}`
}

function getPartTypeColors(partType: string) {
  const colorSchemes = {
    microcontroller: {
      primary: '#3B82F6',
      secondary: '#1D4ED8',
      accent: '#60A5FA',
      border: '#2563EB',
      text: '#1E40AF',
      subtext: '#475569'
    },
    opamp: {
      primary: '#10B981',
      secondary: '#047857',
      accent: '#34D399',
      border: '#059669',
      text: '#065F46',
      subtext: '#475569'
    },
    logic: {
      primary: '#8B5CF6',
      secondary: '#7C3AED',
      accent: '#A78BFA',
      border: '#7C3AED',
      text: '#6D28D9',
      subtext: '#475569'
    },
    transistor: {
      primary: '#F59E0B',
      secondary: '#D97706',
      accent: '#FBBF24',
      border: '#F59E0B',
      text: '#B45309',
      subtext: '#475569'
    },
    capacitor: {
      primary: '#EF4444',
      secondary: '#DC2626',
      accent: '#F87171',
      border: '#EF4444',
      text: '#B91C1C',
      subtext: '#475569'
    },
    resistor: {
      primary: '#6B7280',
      secondary: '#4B5563',
      accent: '#9CA3AF',
      border: '#6B7280',
      text: '#374151',
      subtext: '#475569'
    },
    diode: {
      primary: '#EC4899',
      secondary: '#DB2777',
      accent: '#F472B6',
      border: '#EC4899',
      text: '#BE185D',
      subtext: '#475569'
    },
    crystal: {
      primary: '#06B6D4',
      secondary: '#0891B2',
      accent: '#22D3EE',
      border: '#06B6D4',
      text: '#0E7490',
      subtext: '#475569'
    },
    connector: {
      primary: '#84CC16',
      secondary: '#65A30D',
      accent: '#A3E635',
      border: '#84CC16',
      text: '#4D7C0F',
      subtext: '#475569'
    },
    generic: {
      primary: '#6B7280',
      secondary: '#4B5563',
      accent: '#9CA3AF',
      border: '#6B7280',
      text: '#374151',
      subtext: '#475569'
    }
  }
  
  return colorSchemes[partType as keyof typeof colorSchemes] || colorSchemes.generic
}

function getPartTypeIcon(partType: string): string {
  const icons = {
    microcontroller: `
      <rect x="-35" y="-25" width="70" height="50" rx="6" fill="currentColor" stroke="none"/>
      <rect x="-32" y="-22" width="64" height="44" rx="4" fill="white" stroke="none"/>
      <rect x="-28" y="-18" width="56" height="36" rx="3" fill="currentColor" stroke="none" opacity="0.1"/>
      
      <!-- Pins -->
      <rect x="-38" y="-15" width="6" height="3" fill="currentColor"/>
      <rect x="-38" y="-8" width="6" height="3" fill="currentColor"/>
      <rect x="-38" y="-1" width="6" height="3" fill="currentColor"/>
      <rect x="-38" y="6" width="6" height="3" fill="currentColor"/>
      <rect x="-38" y="13" width="6" height="3" fill="currentColor"/>
      
      <rect x="32" y="-15" width="6" height="3" fill="currentColor"/>
      <rect x="32" y="-8" width="6" height="3" fill="currentColor"/>
      <rect x="32" y="-1" width="6" height="3" fill="currentColor"/>
      <rect x="32" y="6" width="6" height="3" fill="currentColor"/>
      <rect x="32" y="13" width="6" height="3" fill="currentColor"/>
      
      <rect x="-20" y="-28" width="3" height="6" fill="currentColor"/>
      <rect x="-13" y="-28" width="3" height="6" fill="currentColor"/>
      <rect x="-6" y="-28" width="3" height="6" fill="currentColor"/>
      <rect x="1" y="-28" width="3" height="6" fill="currentColor"/>
      <rect x="8" y="-28" width="3" height="6" fill="currentColor"/>
      <rect x="15" y="-28" width="3" height="6" fill="currentColor"/>
      
      <rect x="-20" y="22" width="3" height="6" fill="currentColor"/>
      <rect x="-13" y="22" width="3" height="6" fill="currentColor"/>
      <rect x="-6" y="22" width="3" height="6" fill="currentColor"/>
      <rect x="1" y="22" width="3" height="6" fill="currentColor"/>
      <rect x="8" y="22" width="3" height="6" fill="currentColor"/>
      <rect x="15" y="22" width="3" height="6" fill="currentColor"/>
      
      <!-- Label -->
      <text x="0" y="-5" text-anchor="middle" font-family="Arial" font-size="8" fill="currentColor" opacity="0.8">MCU</text>
      <circle cx="-20" cy="8" r="2" fill="currentColor" opacity="0.6"/>
    `,
    opamp: `
      <path d="M -25 -15 L 25 0 L -25 15 Z" fill="none" stroke="currentColor" stroke-width="2"/>
      <text x="-8" y="-5" font-size="12" fill="currentColor">+</text>
      <text x="-8" y="8" font-size="12" fill="currentColor">-</text>
    `,
    logic: `
      <rect x="-25" y="-15" width="50" height="30" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>
      <text x="0" y="5" text-anchor="middle" font-size="10" fill="currentColor">LOGIC</text>
    `,
    transistor: `
      <circle cx="0" cy="0" r="20" fill="none" stroke="currentColor" stroke-width="2"/>
      <line x1="-10" y1="-10" x2="10" y2="-10" stroke="currentColor" stroke-width="2"/>
      <line x1="0" y1="-10" x2="0" y2="10" stroke="currentColor" stroke-width="2"/>
      <line x1="0" y1="10" x2="-10" y2="15" stroke="currentColor" stroke-width="2"/>
      <line x1="0" y1="10" x2="10" y2="15" stroke="currentColor" stroke-width="2"/>
    `,
    capacitor: `
      <line x1="-10" y1="-20" x2="-10" y2="20" stroke="currentColor" stroke-width="3"/>
      <line x1="10" y1="-20" x2="10" y2="20" stroke="currentColor" stroke-width="3"/>
      <line x1="-20" y1="0" x2="-10" y2="0" stroke="currentColor" stroke-width="2"/>
      <line x1="10" y1="0" x2="20" y2="0" stroke="currentColor" stroke-width="2"/>
    `,
    resistor: `
      <path d="M -25 0 L -15 0 L -10 -8 L 0 8 L 10 -8 L 15 0 L 25 0" 
            fill="none" stroke="currentColor" stroke-width="2"/>
    `,
    diode: `
      <path d="M -15 -10 L -15 10 L 15 0 Z" fill="none" stroke="currentColor" stroke-width="2"/>
      <line x1="15" y1="-10" x2="15" y2="10" stroke="currentColor" stroke-width="2"/>
      <line x1="-25" y1="0" x2="-15" y2="0" stroke="currentColor" stroke-width="2"/>
      <line x1="15" y1="0" x2="25" y2="0" stroke="currentColor" stroke-width="2"/>
    `,
    crystal: `
      <rect x="-20" y="-8" width="40" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>
      <line x1="-25" y1="-12" x2="-25" y2="12" stroke="currentColor" stroke-width="2"/>
      <line x1="25" y1="-12" x2="25" y2="12" stroke="currentColor" stroke-width="2"/>
    `,
    connector: `
      <rect x="-20" y="-15" width="40" height="30" rx="3" fill="none" stroke="currentColor" stroke-width="2"/>
      <circle cx="-10" cy="-8" r="2" fill="currentColor"/>
      <circle cx="0" cy="-8" r="2" fill="currentColor"/>
      <circle cx="10" cy="-8" r="2" fill="currentColor"/>
      <circle cx="-10" cy="0" r="2" fill="currentColor"/>
      <circle cx="0" cy="0" r="2" fill="currentColor"/>
      <circle cx="10" cy="0" r="2" fill="currentColor"/>
      <circle cx="-10" cy="8" r="2" fill="currentColor"/>
      <circle cx="0" cy="8" r="2" fill="currentColor"/>
      <circle cx="10" cy="8" r="2" fill="currentColor"/>
    `,
    generic: `
      <rect x="-25" y="-15" width="50" height="30" rx="4" fill="none" stroke="currentColor" stroke-width="2"/>
      <circle cx="-15" cy="-8" r="2" fill="currentColor"/>
      <circle cx="-5" cy="-8" r="2" fill="currentColor"/>
      <circle cx="5" cy="-8" r="2" fill="currentColor"/>
      <circle cx="15" cy="-8" r="2" fill="currentColor"/>
      <circle cx="-15" cy="8" r="2" fill="currentColor"/>
      <circle cx="-5" cy="8" r="2" fill="currentColor"/>
      <circle cx="5" cy="8" r="2" fill="currentColor"/>
      <circle cx="15" cy="8" r="2" fill="currentColor"/>
    `
  }
  
  return icons[partType as keyof typeof icons] || icons.generic
}

function getPartTypeLabel(partType: string): string {
  const labels = {
    microcontroller: 'マイクロコントローラー',
    opamp: 'オペアンプ',
    logic: 'ロジックIC',
    transistor: 'トランジスタ',
    capacitor: 'コンデンサ',
    resistor: '抵抗',
    diode: 'ダイオード',
    crystal: '水晶振動子',
    connector: 'コネクタ',
    generic: '半導体部品'
  }
  
  return labels[partType as keyof typeof labels] || labels.generic
}

// 画像が存在するかチェックする関数
export function checkImageExists(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = url
  })
}