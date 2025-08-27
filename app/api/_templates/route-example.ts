import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/mongodb";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

// Next.js 15 対応: 必須設定
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key-for-development';

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

// バリデーションスキーマの例
const RequestSchema = z.object({
  name: z.string().min(1, "名前は必須です"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  age: z.number().min(0, "年齢は0以上である必要があります").optional()
});

// GET メソッドの例
export async function GET(request: Request) {
  try {
    // 認証チェック（必要に応じて）
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: "ログインが必要です" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: "認証に失敗しました" },
        { status: 401 }
      );
    }

    // URL パラメータの取得
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // データベース接続
    const { db } = await connectToDatabase();

    // データ取得の例
    const data = await db.collection("example")
      .find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total: await db.collection("example").countDocuments({})
      }
    });

  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}

// POST メソッドの例
export async function POST(request: Request) {
  try {
    // 認証チェック
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "ログインが必要です" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: "認証に失敗しました" },
        { status: 401 }
      );
    }

    // リクエストボディの取得と検証
    const body = await request.json();
    const validation = RequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { 
          error: "入力データが無効です",
          details: validation.error.issues 
        },
        { status: 400 }
      );
    }

    const { name, email, age } = validation.data;

    // データベース操作
    const { db } = await connectToDatabase();
    
    const result = await db.collection("example").insertOne({
      name,
      email,
      age,
      createdBy: decoded.userId,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json({
      success: true,
      message: "データを作成しました",
      id: result.insertedId.toString()
    }, { status: 201 });

  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}

// PUT/PATCH メソッドの例
export async function PATCH(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "ログインが必要です" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: "認証に失敗しました" },
        { status: 401 }
      );
    }

    // URL パラメータからIDを取得（動的ルートの場合）
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "IDが指定されていません" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validation = RequestSchema.partial().safeParse(body); // 部分更新

    if (!validation.success) {
      return NextResponse.json(
        { 
          error: "入力データが無効です",
          details: validation.error.issues 
        },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    const result = await db.collection("example").updateOne(
      { _id: new ObjectId(id), createdBy: decoded.userId }, // 所有者チェック
      { 
        $set: { 
          ...validation.data,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "データが見つからないか、更新権限がありません" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "データを更新しました"
    });

  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}

// DELETE メソッドの例
export async function DELETE(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "ログインが必要です" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: "認証に失敗しました" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "IDが指定されていません" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // 権限チェック（管理者または所有者）
    const isAdmin = decoded.role === "admin";
    const query = isAdmin 
      ? { _id: new ObjectId(id) }
      : { _id: new ObjectId(id), createdBy: decoded.userId };

    const result = await db.collection("example").deleteOne(query);

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "データが見つからないか、削除権限がありません" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "データを削除しました"
    });

  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}