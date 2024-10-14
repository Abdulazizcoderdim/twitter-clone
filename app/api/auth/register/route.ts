import User from '@/database/user.model';
import { connectToDatabase } from '@/lib/mongoose';
import { hash } from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);

    const step = searchParams.get('step');

    if (step === '1') {
      const { email } = await req.json();

      const isExistingUser = await User.findOne({ email });

      if (isExistingUser) {
        return NextResponse.json(
          { message: 'Email already exists' },
          { status: 400 }
        );
      }

      return NextResponse.json({ success: true });
    } else if (step === '2') {
      const { name, email, username, password } = await req.json();

      const isExistingUser = await User.findOne({ username });

      if (isExistingUser) {
        return NextResponse.json(
          { message: 'Username already exists' },
          { status: 400 }
        );
      }

      const hashedPassword = await hash(password, 10);

      const user = await User.create({
        name,
        email,
        username,
        password: hashedPassword,
      });

      return NextResponse.json({ success: true, user });
    }
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
