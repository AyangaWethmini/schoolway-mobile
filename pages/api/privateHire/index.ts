import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const {
      userId,
      pickupLat,
      pickupLng,
      destinationLat,
      destinationLng,
      departureDate,
      returnDate,
      noOfPassengers,
      notes,
      status,
      vanId,
    } = await request.json();

    if (
      !userId ||
      pickupLat == null ||
      pickupLng == null ||
      destinationLat == null ||
      destinationLng == null ||
      !departureDate ||
      !noOfPassengers ||
      !status ||
      !vanId
    ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Convert status from number to enum string if needed
    let hireStatus = status;
    if (typeof status === 'number') {
      const statusMap = {
        0: 'PENDING',
        1: 'ACCEPTED',
        2: 'REJECTED',
        3: 'CANCELLED',
        4: 'COMPLETED',
      };
      hireStatus = statusMap[status] || 'PENDING';
    }

    // Create the PrivateHire record with selected van
    const hire = await prisma.privateHire.create({
      data: {
        pickupLat,
        pickupLng,
        destinationLat,
        destinationLng,
        departureDate: new Date(departureDate),
        returnDate: returnDate ? new Date(returnDate) : null,
        noOfPassengers,
        fare: null,
        notes,
        status: hireStatus,
        updatedAt: new Date(),
        UserProfile: {
          connect: { id: userId },
        },
        Van: {
          connect: { id: vanId },
        },
      },
    });

    return NextResponse.json({ hire }, { status: 201 });
  } catch (error: any) {
    console.error('Private Hire Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Server error' },
      { status: 500 }
    );
  }
}
