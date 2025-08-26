// Zodバリデーションスキーマ定義
import { z } from 'zod'

// ユーザー登録スキーマ
export const RegisterSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上である必要があります'),
  name: z.string().min(1, '名前は必須です').max(80, '名前は80文字以内で入力してください').optional(),
})

// ログインスキーマ
export const LoginSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上である必要があります'),
})

// 出品スキーマ
export const ListingSchema = z.object({
  partNumber: z.string().min(1, '部品番号は必須です'),
  manufacturer: z.string().min(1, 'メーカー名は必須です'),
  quantity: z.number().min(0, '数量は0以上である必要があります'),
  unitPriceJPY: z.number().min(0, '単価は0以上である必要があります'),
  dateCode: z.string().optional(),
  stockSource: z.enum(['authorized', 'open_market']).optional().default('authorized'),
  condition: z.enum(['new', 'used']).optional().default('new'),
  warranty: z.string().nullable().optional(),
  images: z.array(z.string()).optional().default([]),
})

// 注文作成スキーマ
export const OrderCreateSchema = z.object({
  listingId: z.string().min(1, '出品IDは必須です'),
  lotId: z.string().min(1, 'ロットIDは必須です'),
  quantity: z.number().min(1, '注文数量は1以上である必要があります'),
})

// 在庫ロット作成スキーマ
export const InventoryLotSchema = z.object({
  partNumber: z.string().min(1, '部品番号は必須です'),
  manufacturer: z.string().min(1, 'メーカー名は必須です'),
  dateCode: z.string().optional(),
  source: z.enum(['authorized', 'open_market']).default('authorized'),
  condition: z.enum(['new', 'used']).default('new'),
  warranty: z.string().nullable().optional(),
  availableQty: z.number().min(0, '在庫数は0以上である必要があります'),
  location: z.string().optional(),
})

// 出品者登録スキーマ
export const SellerSchema = z.object({
  companyName: z.string().min(1, '会社名は必須です'),
  address: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().url('有効なURLを入力してください').optional().or(z.literal('')),
})

// バリデーション結果の型定義
export type RegisterInput = z.infer<typeof RegisterSchema>
export type LoginInput = z.infer<typeof LoginSchema>
export type ListingInput = z.infer<typeof ListingSchema>
export type OrderCreateInput = z.infer<typeof OrderCreateSchema>
export type InventoryLotInput = z.infer<typeof InventoryLotSchema>
export type SellerInput = z.infer<typeof SellerSchema>