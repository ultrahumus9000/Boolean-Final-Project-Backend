import { Request, Response } from "express";
import db from "../database";

const { house } = db;

export type Query = {
  city?: string;
  checkIn: string;
  checkOut: string;
  maxGuests: string;
};

type Picture = {
  id: number;
  src: string;
  alt: string;
};

type Review = {
  content: string;
  guestProfile: {
    user: {
      username: string;
      avatar: string;
    };
  };
};

type User = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  role: string;
};

type HouseType = {
  id: number;
  name: string;
  bedrooms: number;
  maxGuests: number;
  facility: string[];
  city: string;
  hostProfile: {
    user: {
      username: string;
      avatar: string;
    };
  };
  price: number;
  pictures: Picture[];
  reviews: Review[];
};

const queryContent = {
  select: {
    id: true,
    name: true,
    bedrooms: true,
    maxGuests: true,
    facility: true,
    city: true,
    hostProfile: {
      select: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    },

    price: true,
    reviews: {
      select: {
        content: true,
        guestProfile: {
          select: {
            user: {
              select: {
                username: true,
                avatar: true,
              },
            },
          },
        },
      },
    },
    pictures: {
      select: {
        id: true,
        src: true,
        alt: true,
      },
    },
  },
};

async function getFilteredHouses(query: Query) {
  let { city, checkIn, checkOut, maxGuests } = query;
  console.log(query);
  try {
    const filteredHouses = await house.findMany({
      where: {
        AND: [
          { maxGuests: { gte: parseInt(maxGuests) } },
          { city: { contains: city, mode: "insensitive" } },
        ],
        NOT: {
          bookings: {
            some: {
              AND: [
                { start: { lte: new Date(checkOut).toISOString() } },
                { end: { gte: new Date(checkIn).toISOString() } },
              ],
            },
          },
        },
      },
      ...queryContent,
    });

    console.log("filteredHouses", filteredHouses);
    return filteredHouses;
  } catch (error) {
    throw new Error();
  }
}

async function modifiedHouses(data: HouseType[]) {
  const firstModifiedData = data.map((house) => {
    let hostUsername = house.hostProfile.user.username;
    let hostAvatarLink = house.hostProfile.user.avatar;

    let filteredReviews = house.reviews.map((review) => {
      const modifedReview = {
        content: review.content,
        guestUsername: review.guestProfile.user.username,
        guestAvatar: review.guestProfile.user.avatar,
      };
      return modifedReview;
    });

    let modifiedHouse = {
      ...house,
      hostProfile: hostUsername,
      hostAvatar: hostAvatarLink,
      reviews: filteredReviews,
    };
    return modifiedHouse;
  });
  return firstModifiedData;
}

export { getFilteredHouses, modifiedHouses };
