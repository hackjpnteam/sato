'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface CartItem {
  listingId: string
  quantity: number
  addedAt: string
  listing: {
    _id: string
    partNumber: string
    manufacturer: string
    unitPriceJPY: number
    condition: string
    stockSource: string
    dateCode?: string
  }
  totalPrice: number
}

interface CartContextType {
  items: CartItem[]
  totalQuantity: number
  totalPrice: number
  loading: boolean
  addToCart: (listingId: string, quantity?: number) => Promise<boolean>
  updateQuantity: (listingId: string, quantity: number) => Promise<boolean>
  removeFromCart: (listingId: string) => Promise<boolean>
  refreshCart: () => Promise<void>
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

interface CartProviderProps {
  children: ReactNode
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([])
  const [totalQuantity, setTotalQuantity] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const [loading, setLoading] = useState(false)

  // カート情報を取得
  const refreshCart = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/cart')
      
      if (response.ok) {
        const data = await response.json()
        setItems(data.items || [])
        setTotalQuantity(data.totalQuantity || 0)
        setTotalPrice(data.totalPrice || 0)
      } else if (response.status === 401) {
        // ログインしていない場合はカートをクリア
        setItems([])
        setTotalQuantity(0)
        setTotalPrice(0)
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error)
    } finally {
      setLoading(false)
    }
  }

  // カートに商品を追加
  const addToCart = async (listingId: string, quantity: number = 1): Promise<boolean> => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId, quantity })
      })

      if (response.ok) {
        await refreshCart()
        return true
      } else {
        const error = await response.json()
        console.error('Add to cart error:', error.error)
        return false
      }
    } catch (error) {
      console.error('Add to cart error:', error)
      return false
    }
  }

  // カート内商品の数量を更新
  const updateQuantity = async (listingId: string, quantity: number): Promise<boolean> => {
    try {
      const response = await fetch(`/api/cart/${listingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity })
      })

      if (response.ok) {
        await refreshCart()
        return true
      } else {
        const error = await response.json()
        console.error('Update quantity error:', error.error)
        return false
      }
    } catch (error) {
      console.error('Update quantity error:', error)
      return false
    }
  }

  // カートから商品を削除
  const removeFromCart = async (listingId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/cart/${listingId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await refreshCart()
        return true
      } else {
        const error = await response.json()
        console.error('Remove from cart error:', error.error)
        return false
      }
    } catch (error) {
      console.error('Remove from cart error:', error)
      return false
    }
  }

  // カートをクリア（ログアウト時など）
  const clearCart = () => {
    setItems([])
    setTotalQuantity(0)
    setTotalPrice(0)
  }

  // 初回読み込み時にカート情報を取得
  useEffect(() => {
    refreshCart()
  }, [])

  const contextValue: CartContextType = {
    items,
    totalQuantity,
    totalPrice,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    refreshCart,
    clearCart
  }

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  )
}