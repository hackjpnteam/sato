// GENERATED: 半導体在庫売買サイト（Claude Rule適用）

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { HelpCircle, CreditCard, Package, Shield, Mail } from 'lucide-react'

export default function BuyerFAQPage() {
  const faqs = [
    {
      category: '購入について',
      icon: Package,
      questions: [
        {
          q: '購入するにはアカウント登録が必要ですか？',
          a: 'はい、購入するには無料のアカウント登録が必要です。会社情報と連絡先を登録していただきます。'
        },
        {
          q: '最小購入数量はありますか？',
          a: '最小購入数量は1個からです。ただし、出品者が設定した数量未満の注文はできません。'
        },
        {
          q: '在庫数量は正確ですか？',
          a: '出品者が管理する在庫数量を表示していますが、タイムラグがある場合があります。大量購入の場合は事前に出品者にご確認ください。'
        }
      ]
    },
    {
      category: '決済・料金',
      icon: CreditCard,
      questions: [
        {
          q: '支払い方法は何がありますか？',
          a: 'クレジットカード（Visa、MasterCard、JCB、AMEX）による決済が可能です。銀行振込は現在対応しておりません。'
        },
        {
          q: '手数料はいくらかかりますか？',
          a: '購入手数料として商品代金の8%（最低100円）をいただきます。決済手数料は無料です。'
        },
        {
          q: '領収書は発行できますか？',
          a: 'マイページから領収書のダウンロードが可能です。宛名の変更も対応いたします。'
        }
      ]
    },
    {
      category: '配送・納期',
      icon: Package,
      questions: [
        {
          q: '送料はいくらですか？',
          a: '送料は出品者負担となっており、購入者の追加負担はありません。'
        },
        {
          q: '配送期間はどのくらいですか？',
          a: '通常3-7営業日での配送となりますが、出品者や配送地域により異なります。詳細は各商品ページでご確認ください。'
        },
        {
          q: '海外への発送は可能ですか？',
          a: '現在は国内配送のみ対応しております。海外発送については個別に出品者にお問い合わせください。'
        }
      ]
    },
    {
      category: 'セキュリティ・安全性',
      icon: Shield,
      questions: [
        {
          q: '偽造品の心配はありませんか？',
          a: 'すべての出品は運営が審査し、出品者情報も確認しています。不審な商品を発見された場合はすぐにご報告ください。'
        },
        {
          q: '決済情報は安全ですか？',
          a: 'Stripe決済システムを使用しており、SSL暗号化通信とPCI DSS準拠により安全性を確保しています。'
        },
        {
          q: '個人情報は保護されますか？',
          a: 'プライバシーポリシーに基づき、お客様の個人情報は適切に管理・保護されます。'
        }
      ]
    },
    {
      category: 'トラブル・返品',
      icon: HelpCircle,
      questions: [
        {
          q: '商品に不具合があった場合はどうすればよいですか？',
          a: '商品到着から7日以内に出品者にご連絡ください。解決しない場合は運営（team@hackjpn.com）にお問い合わせください。'
        },
        {
          q: '返品・交換は可能ですか？',
          a: '商品の不具合や仕様違いの場合は返品・交換が可能です。お客様都合による返品は出品者との協議となります。'
        },
        {
          q: '出品者と連絡が取れません',
          a: '48時間以内に回答がない場合は、運営チームにご連絡ください。代理で対応いたします。'
        }
      ]
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">よくある質問（購入者向け）</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          購入に関するよくある質問と回答
        </p>
      </div>

      <div className="space-y-8">
        {faqs.map((category, categoryIndex) => (
          <Card key={categoryIndex}>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <category.icon className="mr-3 h-6 w-6 text-primary" />
                {category.category}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {category.questions.map((faq, faqIndex) => (
                <div key={faqIndex} className="border-l-4 border-blue-200 pl-4">
                  <h3 className="font-semibold mb-2 text-gray-900">
                    Q. {faq.q}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    A. {faq.a}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 問題が解決しない場合 */}
      <Card className="mt-12 bg-blue-50 border-blue-200">
        <CardContent className="p-8 text-center">
          <Mail className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">問題が解決しませんか？</h2>
          <p className="text-gray-600 mb-6">
            上記で解決しない場合は、お気軽にお問い合わせください
          </p>
          <div className="space-y-4">
            <div>
              <p className="font-medium">お問い合わせ先</p>
              <a href="mailto:team@hackjpn.com" className="text-blue-600 hover:underline">
                team@hackjpn.com
              </a>
            </div>
            <div className="space-x-4">
              <Link href="/buyer/guide">
                <Button variant="outline">
                  購入ガイドを見る
                </Button>
              </Link>
              <Link href="/buyer/safety">
                <Button variant="outline">
                  安全な取引について
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}