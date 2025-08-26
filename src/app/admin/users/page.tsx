// GENERATED: 半導体在庫売買サイト（Claude Rule適用）

'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Search, 
  Filter, 
  Download, 
  Edit, 
  Mail, 
  Phone,
  Building2,
  Calendar,
  Shield,
  AlertCircle,
  Save
} from 'lucide-react'
import { toast } from 'sonner'

type Role = 'admin' | 'operator' | 'seller' | 'buyer'

interface User {
  id: string
  email: string
  name: string
  roles: Role[] // roles統合版対応
  companyName?: string
  contactPerson?: string
  phoneNumber?: string
  taxId?: string
  businessLicense?: string
  emailVerified: Date | null
  createdAt: string
  updatedAt: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editRoles, setEditRoles] = useState<Role[]>([])

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const usersData = await response.json()
        setUsers(usersData)
      } else {
        throw new Error('Failed to fetch users')
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
      toast.error('ユーザー情報の取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchQuery === '' || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.companyName && user.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesRole = roleFilter === 'all' || user.roles.includes(roleFilter as Role)

    return matchesSearch && matchesRole
  })

  const getRoleBadgeColor = (role: Role) => {
    switch (role) {
      case 'admin': return 'destructive'
      case 'operator': return 'secondary'
      case 'seller': return 'default'
      case 'buyer': return 'outline'
      default: return 'outline'
    }
  }

  const getRoleLabel = (role: Role) => {
    switch (role) {
      case 'admin': return '管理者'
      case 'operator': return 'オペレーター'
      case 'seller': return '出品者'
      case 'buyer': return '購入者'
      default: return role
    }
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setEditRoles([...user.roles])
  }

  const handleRoleToggle = (role: Role) => {
    setEditRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role]
    )
  }

  const handleSaveRoles = async () => {
    if (!editingUser) return

    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: editingUser.id,
          roles: editRoles
        })
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setUsers(prev => prev.map(user => 
          user.id === editingUser.id 
            ? { ...user, roles: updatedUser.roles }
            : user
        ))
        toast.success('ユーザーロールを更新しました')
        setEditingUser(null)
      } else {
        throw new Error('Failed to update user roles')
      }
    } catch (error) {
      console.error('Failed to update user roles:', error)
      toast.error('ロールの更新に失敗しました')
    }
  }

  const roleOptions: { value: Role; label: string }[] = [
    { value: 'buyer', label: '購入者' },
    { value: 'seller', label: '出品者' },
    { value: 'operator', label: 'オペレーター' },
    { value: 'admin', label: '管理者' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">ユーザー管理</h1>
          <p className="text-gray-600">登録ユーザーの一覧とロール管理</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          CSVエクスポート
        </Button>
      </div>

      {/* フィルター */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="メール・会社名・担当者名で検索"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="ロールで絞り込み" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべてのロール</SelectItem>
                <SelectItem value="admin">管理者</SelectItem>
                <SelectItem value="operator">オペレーター</SelectItem>
                <SelectItem value="seller">出品者</SelectItem>
                <SelectItem value="buyer">購入者</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              詳細フィルター
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ユーザー一覧 */}
      <Card>
        <CardHeader>
          <CardTitle>
            登録ユーザー一覧 ({filteredUsers.length}件)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p>読み込み中...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium">{user.email}</h3>
                        <div className="flex space-x-1">
                          {user.roles.map((role) => (
                            <Badge key={role} variant={getRoleBadgeColor(role)}>
                              {getRoleLabel(role)}
                            </Badge>
                          ))}
                        </div>
                        {!user.emailVerified && (
                          <Badge variant="secondary">
                            <AlertCircle className="mr-1 h-3 w-3" />
                            メール未認証
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Building2 className="h-4 w-4" />
                          <span>{user.companyName || '未設定'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4" />
                          <span>{user.contactPerson || '未設定'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4" />
                          <span>{user.phoneNumber || '未設定'}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>登録: {new Date(user.createdAt).toLocaleDateString('ja-JP')}</span>
                        </div>
                        {user.taxId && (
                          <div className="flex items-center space-x-1 text-blue-600">
                            <Shield className="h-3 w-3" />
                            <span>法人番号登録済み</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                            <Edit className="h-4 w-4 mr-1" />
                            ロール編集
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>ユーザーロール編集</DialogTitle>
                            <DialogDescription>
                              {editingUser?.email} のロールを設定してください
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm font-medium mb-3">ロール選択</p>
                              <div className="space-y-2">
                                {roleOptions.map((role) => (
                                  <div key={role.value} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={role.value}
                                      checked={editRoles.includes(role.value)}
                                      onCheckedChange={() => handleRoleToggle(role.value)}
                                    />
                                    <label 
                                      htmlFor={role.value} 
                                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                      {role.label}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" onClick={() => setEditingUser(null)}>
                                キャンセル
                              </Button>
                              <Button onClick={handleSaveRoles}>
                                <Save className="h-4 w-4 mr-1" />
                                保存
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredUsers.length === 0 && !loading && (
                <div className="text-center py-8">
                  <p className="text-gray-500">該当するユーザーが見つかりません</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}