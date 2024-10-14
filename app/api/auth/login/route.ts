import User from '@/database/user.model';
import { compare } from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const isExistingUser = await User.findOne({ email });

    if (!isExistingUser) {
      return NextResponse.json(
        { message: 'Email does not exist' },
        { status: 400 }
      );
    }

    const isPasswordCorrect = await compare(password, isExistingUser.password);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { message: 'Password is incorrect' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, user: isExistingUser });
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
