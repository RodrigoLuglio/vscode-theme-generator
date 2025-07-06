import { isHexColor } from '@/lib/utils/colorUtils'
import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'

interface ColorInputProps {
  color: string
  onValidColorInput: (color: string) => void
}

const ColorInput: React.FC<ColorInputProps> = ({
  color,
  onValidColorInput,
}) => {
  const [value, setValue] = useState(color)

  useEffect(() => {
    setValue(color)
  }, [color])

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    setValue(value)
    if (isHexColor(value)) onValidColorInput(e.target.value)
  }

  return <Input type="text" value={value} onChange={handleInput} />
}

export default ColorInput
