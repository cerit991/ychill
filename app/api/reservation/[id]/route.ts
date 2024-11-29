import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data = await request.json();

    return new Promise((resolve) => {
      const query = `
        UPDATE reservations 
        SET name = COALESCE(?, name),
            email = COALESCE(?, email),
            phone = COALESCE(?, phone),
            date = COALESCE(?, date),
            time = COALESCE(?, time),
            guests = COALESCE(?, guests),
            notes = COALESCE(?, notes),
            status = COALESCE(?, status)
        WHERE id = ?
      `;

      db.run(
        query,
        [
          data.name,
          data.email,
          data.phone,
          data.date,
          data.time,
          data.guests,
          data.notes,
          data.status,
          id
        ],
        function (err) {
          if (err) {
            resolve(
              NextResponse.json({ error: err.message }, { status: 500 })
            );
            return;
          }

          resolve(
            NextResponse.json({
              message: "Rezervasyon güncellendi",
            })
          );
        }
      );
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    return new Promise((resolve) => {
      db.run(
        'DELETE FROM reservations WHERE id = ?',
        [id],
        function (err) {
          if (err) {
            resolve(
              NextResponse.json({ error: err.message }, { status: 500 })
            );
            return;
          }

          resolve(
            NextResponse.json({
              message: "Rezervasyon silindi",
            })
          );
        }
      );
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}